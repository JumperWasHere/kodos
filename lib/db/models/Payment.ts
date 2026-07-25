import { Schema, model, models, Document } from 'mongoose'

export interface IPaymentDocument extends Document {
  userId: Schema.Types.ObjectId
  subscriptionId?: Schema.Types.ObjectId
  stripePaymentIntentId: string
  stripeInvoiceId?: string
  amount: number
  currency: string
  status: 'pending' | 'succeeded' | 'failed' | 'refunded'
  paymentMethod: string
  description?: string
  invoiceUrl?: string
  receiptUrl?: string
  paidAt?: Date
  createdAt: Date
  updatedAt: Date
}

const PaymentSchema = new Schema<IPaymentDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscription' },
    stripePaymentIntentId: { type: String, required: true, unique: true },
    stripeInvoiceId: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'myr' },
    status: {
      type: String,
      enum: ['pending', 'succeeded', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: { type: String, default: 'card' },
    description: { type: String },
    invoiceUrl: { type: String },
    receiptUrl: { type: String },
    paidAt: { type: Date },
  },
  { timestamps: true }
)

PaymentSchema.index({ userId: 1 })
PaymentSchema.index({ status: 1, createdAt: -1 })

export const Payment = models.Payment || model<IPaymentDocument>('Payment', PaymentSchema)
export default Payment
