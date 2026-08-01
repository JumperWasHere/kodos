import mongoose, { Schema, model, models, Document } from 'mongoose'
import type { UserRole } from '@/types'

export interface IUserDocument extends Document {
  name: string
  email: string
  password?: string
  avatar?: string
  role: UserRole
  parentId?: Schema.Types.ObjectId
  profileMetadata?: Record<string, unknown>
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
      required: function (this: IUserDocument) { return this.role !== 'child' },
      // Sparse lets child profiles have no email while preserving uniqueness for
      // every real account email.
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: { type: String, minlength: 8, select: false },
    avatar: { type: String, default: '' },
    role: {
      type: String,
      enum: ['student', 'parent', 'child', 'teacher', 'admin'],
      required: true,
    },
    parentId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    profileMetadata: { type: Schema.Types.Mixed, default: {} },
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

UserSchema.index({ role: 1 })
UserSchema.index({ parentId: 1, role: 1 })

export const User = models.User || model<IUserDocument>('User', UserSchema)
export default User
