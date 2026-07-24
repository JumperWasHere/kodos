import { Schema, model, models, Document } from 'mongoose'
import type { SubjectSlug } from '@/types'

export interface IProgressDocument extends Document {
  studentId: Schema.Types.ObjectId
  lessonId: Schema.Types.ObjectId
  subjectSlug: SubjectSlug
  status: 'not_started' | 'in_progress' | 'completed'
  score?: number
  xpEarned: number
  coinsEarned: number
  timeSpent: number
  attempts: number
  answers?: Record<string, string | string[]>
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const ProgressSchema = new Schema<IProgressDocument>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
    subjectSlug: { type: String, required: true },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started',
    },
    score: { type: Number, min: 0, max: 100 },
    xpEarned: { type: Number, default: 0 },
    coinsEarned: { type: Number, default: 0 },
    timeSpent: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },
    answers: { type: Schema.Types.Mixed },
    completedAt: { type: Date },
  },
  {
    timestamps: true,
  }
)

ProgressSchema.index({ studentId: 1, lessonId: 1 }, { unique: true })
ProgressSchema.index({ studentId: 1, subjectSlug: 1 })
ProgressSchema.index({ studentId: 1, status: 1 })
ProgressSchema.index({ completedAt: -1 })

export const Progress = models.Progress || model<IProgressDocument>('Progress', ProgressSchema)
export default Progress
