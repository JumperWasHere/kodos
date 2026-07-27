import { Schema, model, models, Document } from 'mongoose'
import type { SubjectSlug, AgeGroup } from '@/types'

export interface ISubjectDocument extends Document {
  name: string
  nameMs: string // Bahasa Malaysia name
  nameMandarin?: string
  slug: SubjectSlug
  description: string
  descriptionMs: string
  icon: string
  color: string
  gradient: string
  bgClass: string
  ageGroups: AgeGroup[]
  grades: number[]
  totalLessons: number
  totalQuizzes: number
  totalGames: number
  isPremium: boolean
  isActive: boolean
  order: number
  thumbnailUrl?: string
  mascot?: string
  topics: SubjectTopic[]
  createdAt: Date
  updatedAt: Date
}

export interface SubjectTopic {
  id: string
  title: string
  titleMs?: string
  description?: string
  order: number
  lessonCount: number
  icon: string
  color: string
  isLocked: boolean
}

const SubjectTopicSchema = new Schema<SubjectTopic>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    titleMs: { type: String },
    description: { type: String },
    order: { type: Number, required: true },
    lessonCount: { type: Number, default: 0 },
    icon: { type: String, default: '📚' },
    color: { type: String, default: '#6366F1' },
    isLocked: { type: Boolean, default: false },
  },
  { _id: false }
)

const SubjectSchema = new Schema<ISubjectDocument>(
  {
    name: { type: String, required: true },
    nameMs: { type: String, required: true },
    nameMandarin: { type: String },
    slug: {
      type: String,
      required: true,
      unique: true,
      enum: [
        'mathematics',
        'english',
        'science',
        'bahasa-malaysia',
        'mandarin',
        'geography',
        'history',
        'art',
        'ict',
      ],
    },
    description: { type: String, required: true },
    descriptionMs: { type: String, required: true },
    icon: { type: String, required: true },
    color: { type: String, required: true },
    gradient: { type: String, required: true },
    bgClass: { type: String, default: 'bg-blue-500' },
    ageGroups: [{ type: String, enum: ['preschool', 'lower_primary', 'upper_primary'] }],
    grades: [{ type: Number, min: 0, max: 6 }],
    totalLessons: { type: Number, default: 0 },
    totalQuizzes: { type: Number, default: 0 },
    totalGames: { type: Number, default: 0 },
    isPremium: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    thumbnailUrl: { type: String },
    mascot: { type: String },
    topics: [SubjectTopicSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

SubjectSchema.index({ isActive: 1, order: 1 })

export const Subject = models.Subject || model<ISubjectDocument>('Subject', SubjectSchema)
export default Subject
