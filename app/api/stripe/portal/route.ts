import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { stripe } from '@/lib/stripe/config'
import { connectDB } from '@/lib/db/connect'
import { Subscription } from '@/lib/db/models'

// POST /api/stripe/portal — Redirect to Stripe billing portal
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const sub = await Subscription.findOne({ userId: session.user.id }).lean() as any

    if (!sub?.stripeCustomerId) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 })
    }

    const appUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: `${appUrl}/parent/subscription`,
    })

    return NextResponse.json({ success: true, url: portalSession.url })
  } catch (error) {
    console.error('[Stripe Portal]', error)
    return NextResponse.json({ success: false, error: 'Failed to create portal session' }, { status: 500 })
  }
}
