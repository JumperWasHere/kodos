'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check, Crown, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const PLANS = [
  {
    id: 'monthly' as const,
    name: 'Monthly',
    price: 'RM 19.90',
    period: '/month',
    perks: ['All premium subjects', 'Unlimited lessons & quizzes', '7-day free trial'],
    highlight: false,
  },
  {
    id: 'annual' as const,
    name: 'Annual',
    price: 'RM 199',
    period: '/year',
    perks: ['All premium subjects', 'Unlimited lessons & quizzes', '2 months free', 'Priority support'],
    highlight: true,
  },
  {
    id: 'family' as const,
    name: 'Family',
    price: 'RM 299',
    period: '/year',
    perks: ['Everything in Annual', 'Up to 4 children', 'Family progress reports'],
    highlight: false,
  },
]

function SubscriptionContent() {
  const searchParams = useSearchParams()
  const success = searchParams.get('success') === 'true'
  const cancelled = searchParams.get('cancelled') === 'true'
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const handleCheckout = async (plan: 'monthly' | 'annual' | 'family') => {
    setLoadingPlan(plan)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const payload = await res.json()
      if (!res.ok || !payload.url) {
        toast.error(payload.error ?? 'Could not start checkout. Please try again.')
        return
      }
      window.location.href = payload.url
    } catch {
      toast.error('Could not start checkout. Please try again.')
    } finally {
      setLoadingPlan(null)
    }
  }

  const handlePortal = async () => {
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const payload = await res.json()
      if (!res.ok || !payload.url) {
        toast.error(payload.error ?? 'Could not open the billing portal.')
        return
      }
      window.location.href = payload.url
    } catch {
      toast.error('Could not open the billing portal.')
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold mb-1">Subscription 👑</h1>
        <p className="text-muted-foreground">Unlock every subject, quiz, and game for your children</p>
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-green-50 border border-green-200 p-4 text-green-800 font-semibold"
        >
          🎉 Payment successful! Premium content is being unlocked for your family. It may take a
          minute to appear — sign out and back in if you don&apos;t see it.
        </motion.div>
      )}
      {cancelled && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-amber-800 font-semibold">
          Checkout was cancelled. No payment was taken.
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              'card-kid p-6 flex flex-col',
              plan.highlight && 'border-2 border-purple-400 relative'
            )}
          >
            {plan.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                Most Popular
              </span>
            )}
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-5 h-5 text-yellow-500" />
              <h2 className="font-display font-bold text-lg">{plan.name}</h2>
            </div>
            <div className="mb-4">
              <span className="font-display text-3xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground text-sm">{plan.period}</span>
            </div>
            <ul className="space-y-2 mb-6 flex-1">
              {plan.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  {perk}
                </li>
              ))}
            </ul>
            <Button
              onClick={() => handleCheckout(plan.id)}
              disabled={loadingPlan !== null}
              variant={plan.highlight ? 'default' : 'outline'}
              className="w-full"
            >
              {loadingPlan === plan.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Choose Plan'}
            </Button>
          </div>
        ))}
      </div>

      <div className="card-kid p-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="font-bold">Already subscribed?</p>
          <p className="text-sm text-muted-foreground">Update payment details or cancel anytime.</p>
        </div>
        <Button variant="outline" onClick={handlePortal}>Manage Billing</Button>
      </div>
    </div>
  )
}

export default function SubscriptionPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <SubscriptionContent />
    </Suspense>
  )
}
