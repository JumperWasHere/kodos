import { Schema, model, models, Document } from 'mongoose'
import type { SubscriptionPlan, SubscriptionStatus } from '@/types'

export interface ISubscriptionDocument extends Document {
  userId: Schema.Types.ObjectId
  plan: SubscriptionPlan
  status: SubscriptionStatus
  stripeCustomerId: string
  stripeSubscriptionId?: string
  stripePriceId?: string
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  trialEnd?: Date
  maxChildren?: number
  childrenIds?: Schema.Types.ObjectId[]
  amount: number
  currency: string
  interval?: 'month' | 'year'
  cancelledAt?: Date
  createdAt: Date
  updatedAt: Date
}

const SubscriptionSchema = new Schema<ISubscriptionDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    plan: {
      type: String,
      enum: ['free', 'monthly', 'annual', 'family'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired', 'trialing', 'past_due'],
      default: 'active',
    },
    stripeCustomerId: { type: String, required: true },
    stripeSubscriptionId: { type: String },
    stripePriceId: { type: String },
    currentPeriodStart: { type: Date, required: true },
    currentPeriodEnd: { type: Date, required: true },
    cancelAtPeriodEnd: { type: Boolean, default: false },
    trialEnd: { type: Date },
    maxChildren: { type: Number },
    childrenIds: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    amount: { type: Number, required: true },
    currency: { type: String, default: 'myr' },
    interval: { type: String, enum: ['month', 'year'] },
    cancelledAt: { type: Date },
  },
  { timestamps: true }
)

SubscriptionSchema.index({ userId: 1 })
SubscriptionSchema.index({ stripeCustomerId: 1 })
SubscriptionSchema.index({ stripeSubscriptionId: 1 }, { sparse: true })
SubscriptionSchema.index({ status: 1 })
SubscriptionSchema.index({ currentPeriodEnd: 1 })

export const Subscription =
  models.Subscription || model<ISubscriptionDocument>('Subscription', SubscriptionSchema)
export default Subscription
