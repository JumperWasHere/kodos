import { Schema, model, models, Document } from 'mongoose'
import type { AgeGroup, SubjectSlug } from '@/types'

export interface IAvatarCustomization {
  character: string
  hairStyle: string
  hairColor: string
  skinTone: string
  eyeType: string
  outfit: string
  accessory?: string
  background: string
}

export interface ISubjectProgress {
  subjectSlug: SubjectSlug
  completedLessons: number
  totalLessons: number
  xpEarned: number
  lastAccessedAt: Date
  masteryLevel: number
}

export interface IStudentDocument extends Document {
  userId: Schema.Types.ObjectId
  displayName: string
  ageGroup: AgeGroup
  grade: number
  dateOfBirth?: Date
  parentId?: Schema.Types.ObjectId
  // Gamification
  xp: number
  level: number
  coins: number
  gems: number
  streakDays: number
  longestStreak: number
  lastLoginDate: Date
  totalLoginDays: number
  badges: Schema.Types.ObjectId[]
  achievements: Schema.Types.ObjectId[]
  // Avatar
  avatar: string
  avatarCustomization: IAvatarCustomization
  // Pet
  virtualPet?: {
    type: string
    name: string
    level: number
    happiness: number
    hunger: number
    lastFed: Date
  }
  // Progress
  subjectProgress: ISubjectProgress[]
  // Daily rewards
  lastDailyRewardDate?: Date
  dailyRewardStreak: number
  // Subscription
  isPremium: boolean
  subscriptionId?: Schema.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const SubjectProgressSchema = new Schema<ISubjectProgress>(
  {
    subjectSlug: { type: String, required: true },
    completedLessons: { type: Number, default: 0 },
    totalLessons: { type: Number, default: 0 },
    xpEarned: { type: Number, default: 0 },
    lastAccessedAt: { type: Date, default: Date.now },
    masteryLevel: { type: Number, default: 0, min: 0, max: 100 },
  },
  { _id: false }
)

const StudentSchema = new Schema<IStudentDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    displayName: { type: String, required: true, trim: true, maxlength: 50 },
    ageGroup: {
      type: String,
      enum: ['toddler', 'preschool', 'lower_primary', 'upper_primary'],
      required: true,
    },
    grade: { type: Number, min: 0, max: 6, required: true },
    dateOfBirth: { type: Date },
    parentId: { type: Schema.Types.ObjectId, ref: 'User' },
    // Gamification
    xp: { type: Number, default: 0, min: 0 },
    level: { type: Number, default: 1, min: 1 },
    coins: { type: Number, default: 100, min: 0 },
    gems: { type: Number, default: 0, min: 0 },
    streakDays: { type: Number, default: 0, min: 0 },
    longestStreak: { type: Number, default: 0 },
    lastLoginDate: { type: Date, default: Date.now },
    totalLoginDays: { type: Number, default: 1 },
    badges: [{ type: Schema.Types.ObjectId, ref: 'Badge' }],
    achievements: [{ type: Schema.Types.ObjectId, ref: 'Achievement' }],
    // Avatar
    avatar: {
      type: String,
      default: 'https://api.dicebear.com/7.x/adventurer/svg?seed=default',
    },
    avatarCustomization: {
      character: { type: String, default: 'explorer' },
      hairStyle: { type: String, default: 'default' },
      hairColor: { type: String, default: '#4A2C1A' },
      skinTone: { type: String, default: '#F5CBA7' },
      eyeType: { type: String, default: 'default' },
      outfit: { type: String, default: 'school' },
      accessory: { type: String },
      background: { type: String, default: 'classroom' },
    },
    // Virtual Pet
    virtualPet: {
      type: { type: String },
      name: { type: String },
      level: { type: Number, default: 1 },
      happiness: { type: Number, default: 100 },
      hunger: { type: Number, default: 100 },
      lastFed: { type: Date },
    },
    // Subject progress
    subjectProgress: [SubjectProgressSchema],
    // Daily rewards
    lastDailyRewardDate: { type: Date },
    dailyRewardStreak: { type: Number, default: 0 },
    // Subscription
    isPremium: { type: Boolean, default: false },
    subscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscription' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

StudentSchema.index({ parentId: 1 })
StudentSchema.index({ level: -1, xp: -1 })
StudentSchema.index({ streakDays: -1 })

export const Student = models.Student || model<IStudentDocument>('Student', StudentSchema)
export default Student
