import mongoose, { Schema, Document } from 'mongoose'

export type MatchingCategory = 'animals' | 'plants' | 'colors' | 'shapes'
export type MatchingAgeGroup = 'toddler' | 'preschool' | 'lower_primary' | 'upper_primary'

export interface IMatchingItem extends Document {
  category: MatchingCategory
  slug: string
  label: string
  labelMs: string
  emoji: string
  imageUrl?: string
  colorHex?: string
  colorClass?: string
  audioText: string
  audioTextMs: string
  ageGroups: MatchingAgeGroup[]
  difficulty: 1 | 2 | 3 | 4
  sortOrder: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const MatchingItemSchema = new Schema<IMatchingItem>(
  {
    category: {
      type: String,
      required: true,
      enum: ['animals', 'plants', 'colors', 'shapes'],
    },
    slug: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    labelMs: { type: String, required: true },
    emoji: { type: String, required: true },
    imageUrl: { type: String },
    colorHex: { type: String },
    colorClass: { type: String },
    audioText: { type: String, required: true },
    audioTextMs: { type: String, required: true },
    ageGroups: [
      {
        type: String,
        enum: ['toddler', 'preschool', 'lower_primary', 'upper_primary'],
      },
    ],
    difficulty: { type: Number, enum: [1, 2, 3, 4], default: 2 },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

MatchingItemSchema.index({ category: 1, ageGroups: 1, isActive: 1 })

export default (mongoose.models.MatchingItem as mongoose.Model<IMatchingItem>) ||
  mongoose.model<IMatchingItem>('MatchingItem', MatchingItemSchema)
