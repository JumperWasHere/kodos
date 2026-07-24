import mongoose, { Schema, model, models, Document } from 'mongoose'
import type { UserRole } from '@/types'

export interface IUserDocument extends Document {
  name: string
  email: string
  password?: string
  avatar?: string
  role: UserRole
  isEmailVerified: boolean
  emailVerificationToken?: string
  emailVerificationExpiry?: Date
  passwordResetToken?: string
  passwordResetExpiry?: Date
  isActive: boolean
  lastLoginAt?: Date
  googleId?: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: { type: String, minlength: 8, select: false },
    avatar: { type: String, default: '' },
    role: {
      type: String,
      enum: ['student', 'parent', 'teacher', 'admin'],
      required: true,
    },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, select: false },
    emailVerificationExpiry: { type: Date, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpiry: { type: Date, select: false },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
    googleId: { type: String, sparse: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

UserSchema.index({ email: 1 })
UserSchema.index({ role: 1 })
UserSchema.index({ googleId: 1 }, { sparse: true })

export const User = models.User || model<IUserDocument>('User', UserSchema)
export default User
