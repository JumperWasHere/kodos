import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { isStripeConfigured, stripe, STRIPE_PRICES } from '@/lib/stripe/config'
import { connectDB } from '@/lib/db/connect'
import { User } from '@/lib/db/models'
import { z } from 'zod'

const CheckoutSchema = z.object({
  plan: z.enum(['monthly', 'annual', 'family']),
})

export async function POST(req: NextRequest) {
  try {
    if (!isStripeConfigured) {
      return NextResponse.json({ error: 'Payments are not configured' }, { status: 503 })
    }

    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = CheckoutSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const { plan } = parsed.data
    const priceId = STRIPE_PRICES[plan]

    if (!priceId) {
      return NextResponse.json({ error: 'Price not configured for this plan' }, { status: 500 })
    }

    await connectDB()
    const user = await User.findById(session.user.id).lean() as any
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const appUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: user.email,
      metadata: { userId: session.user.id, plan },
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/parent/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/parent/subscription?cancelled=true`,
      subscription_data: {
        metadata: { userId: session.user.id, plan },
        trial_period_days: plan === 'monthly' ? 7 : undefined,
      },
    })

    return NextResponse.json({ success: true, url: checkoutSession.url })
  } catch (error) {
    console.error('[Stripe Checkout]', error)
    return NextResponse.json({ success: false, error: 'Failed to create checkout session' }, { status: 500 })
  }
}
