import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { isStripeConfigured, stripe } from '@/lib/stripe/config'
import { connectDB } from '@/lib/db/connect'
import { Subscription, Student } from '@/lib/db/models'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  if (!isStripeConfigured) {
    return NextResponse.json({ error: 'Payments are not configured' }, { status: 503 })
  }

  const body = await req.text()
  const sig = (await headers()).get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing webhook signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('[Stripe Webhook] Signature verification failed', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  await connectDB()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const plan = session.metadata?.plan ?? 'monthly'

        if (!userId || !session.subscription) break

        const sub = await stripe.subscriptions.retrieve(session.subscription as string)

        await Subscription.findOneAndUpdate(
          { userId },
          {
            userId,
            plan,
            status: 'active',
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            stripePriceId: sub.items.data[0]?.price.id,
            currentPeriodStart: new Date((sub.current_period_start ?? 0) * 1000),
            currentPeriodEnd: new Date((sub.current_period_end ?? 0) * 1000),
            cancelAtPeriodEnd: sub.cancel_at_period_end,
            maxChildren: plan === 'family' ? 5 : 1,
            amount: sub.items.data[0]?.price?.unit_amount ?? 0,
            currency: sub.currency,
            interval: sub.items.data[0]?.plan?.interval,
          },
          { upsert: true, new: true }
        )

        // Update all student profiles under this user
        await Student.updateMany({ userId }, { $set: { isPremium: true } })
        break
      }

      case 'customer.subscription.deleted':
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.userId
        if (!userId) break

        const status = sub.status === 'active' ? 'active' : sub.status === 'trialing' ? 'trialing' : 'cancelled'
        const isPremium = status === 'active' || status === 'trialing'

        await Subscription.findOneAndUpdate(
          { stripeSubscriptionId: sub.id },
          {
            status,
            cancelAtPeriodEnd: sub.cancel_at_period_end,
            currentPeriodEnd: new Date((sub.current_period_end ?? 0) * 1000),
          }
        )

        await Student.updateMany({ userId }, { $set: { isPremium } })
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        if (invoice.subscription) {
          await Subscription.findOneAndUpdate(
            { stripeSubscriptionId: invoice.subscription },
            { status: 'past_due' }
          )
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[Stripe Webhook] Handler error', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

export const config = { api: { bodyParser: false } }
