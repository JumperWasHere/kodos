import { Schema, model, models, Document } from 'mongoose'
import type { LessonType, DifficultyLevel, AgeGroup, SubjectSlug } from '@/types'

export interface IQuizQuestion {
  id: string
  question: string
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'drag_drop' | 'match'
  options?: string[]
  correctAnswer: string | string[]
  explanation?: string
  imageUrl?: string
  audioUrl?: string
  points: number
  timeLimit?: number
}

export interface IStoryPage {
  pageNumber: number
  text: string
  imageUrl: string
  audioUrl?: string
  hasInteraction?: boolean
}

export interface ILessonDocument extends Document {
  title: string
  titleMs?: string
  description: string
  descriptionMs?: string
  subjectId: Schema.Types.ObjectId
  subjectSlug: SubjectSlug
  topicId?: string
  ageGroup: AgeGroup
  grade: number[]
  type: LessonType
  difficulty: DifficultyLevel
  thumbnail: string
  duration: number
  xpReward: number
  coinReward: number
  // Content
  videoUrl?: string
  questions?: IQuizQuestion[]
  storyPages?: IStoryPage[]
  gameData?: Record<string, unknown>
  worksheetUrl?: string
  // Meta
  isPremium: boolean
  isActive: boolean
  order: number
  prerequisites: Schema.Types.ObjectId[]
  tags: string[]
  // Stats
  totalCompletions: number
  averageScore: number
  averageTimeSpent: number
  createdAt: Date
  updatedAt: Date
}

const QuizQuestionSchema = new Schema<IQuizQuestion>(
  {
    id: { type: String, required: true },
    question: { type: String, required: true },
    type: {
      type: String,
      enum: ['multiple_choice', 'true_false', 'fill_blank', 'drag_drop', 'match'],
      required: true,
    },
    options: [{ type: String }],
    correctAnswer: { type: Schema.Types.Mixed, required: true },
    explanation: { type: String },
    imageUrl: { type: String },
    audioUrl: { type: String },
    points: { type: Number, default: 10 },
    timeLimit: { type: Number },
  },
  { _id: false }
)

const StoryPageSchema = new Schema<IStoryPage>(
  {
    pageNumber: { type: Number, required: true },
    text: { type: String, required: true },
    imageUrl: { type: String, required: true },
    audioUrl: { type: String },
    hasInteraction: { type: Boolean, default: false },
  },
  { _id: false }
)

const LessonSchema = new Schema<ILessonDocument>(
  {
    title: { type: String, required: true, trim: true },
    titleMs: { type: String },
    description: { type: String, required: true },
    descriptionMs: { type: String },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    subjectSlug: { type: String, required: true },
    topicId: { type: String },
    ageGroup: {
      type: String,
      enum: ['preschool', 'lower_primary', 'upper_primary'],
      required: true,
    },
    grade: [{ type: Number }],
    type: {
      type: String,
      enum: ['video', 'interactive', 'quiz', 'game', 'story', 'worksheet'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy',
    },
    thumbnail: { type: String, default: '' },
    duration: { type: Number, default: 10 },
    xpReward: { type: Number, default: 50 },
    coinReward: { type: Number, default: 10 },
    // Content
    videoUrl: { type: String },
    questions: [QuizQuestionSchema],
    storyPages: [StoryPageSchema],
    gameData: { type: Schema.Types.Mixed },
    worksheetUrl: { type: String },
    // Meta
    isPremium: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    prerequisites: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    tags: [{ type: String }],
    // Stats
    totalCompletions: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    averageTimeSpent: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

LessonSchema.index({ subjectSlug: 1, ageGroup: 1 })
LessonSchema.index({ subjectId: 1, order: 1 })
LessonSchema.index({ type: 1 })
LessonSchema.index({ isPremium: 1, isActive: 1 })
LessonSchema.index({ tags: 1 })

export const Lesson = models.Lesson || model<ILessonDocument>('Lesson', LessonSchema)
export default Lesson
