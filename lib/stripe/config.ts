import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
})

export const STRIPE_PRICES: Record<string, string> = {
  monthly: process.env.STRIPE_PRICE_MONTHLY ?? '',
  annual: process.env.STRIPE_PRICE_ANNUAL ?? '',
  family: process.env.STRIPE_PRICE_FAMILY ?? '',
}

export const PLAN_LIMITS: Record<string, number> = {
  free: 0,
  monthly: 1,
  annual: 1,
  family: 5,
}
