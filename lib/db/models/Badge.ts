import { Schema, model, models, Document } from 'mongoose'
import type { BadgeCategory } from '@/types'

export interface IBadgeDocument extends Document {
  name: string
  nameMs?: string
  description: string
  descriptionMs?: string
  icon: string
  emoji?: string
  category: BadgeCategory
  requirement: {
    type: string
    value: number
    subjectSlug?: string
  }
  xpReward: number
  coinReward: number
  isSpecial: boolean
  isSeasonal: boolean
  season?: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  isActive: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

const BadgeSchema = new Schema<IBadgeDocument>(
  {
    name: { type: String, required: true },
    nameMs: { type: String },
    description: { type: String, required: true },
    descriptionMs: { type: String },
    icon: { type: String, required: true },
    emoji: { type: String },
    category: {
      type: String,
      enum: ['learning', 'streak', 'achievement', 'special', 'seasonal', 'social'],
      required: true,
    },
    requirement: {
      type: { type: String, required: true },
      value: { type: Number, required: true },
      subjectSlug: { type: String },
    },
    xpReward: { type: Number, default: 100 },
    coinReward: { type: Number, default: 50 },
    isSpecial: { type: Boolean, default: false },
    isSeasonal: { type: Boolean, default: false },
    season: { type: String },
    rarity: {
      type: String,
      enum: ['common', 'rare', 'epic', 'legendary'],
      default: 'common',
    },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

BadgeSchema.index({ category: 1 })
BadgeSchema.index({ rarity: 1 })

export const Badge = models.Badge || model<IBadgeDocument>('Badge', BadgeSchema)
export default Badge
