import { Schema, model, models, Document } from 'mongoose'

export interface IClassDocument extends Document {
  name: string
  teacherId: Schema.Types.ObjectId
  grade: number
  studentIds: Schema.Types.ObjectId[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const ClassSchema = new Schema<IClassDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    grade: { type: Number, min: 0, max: 6, default: 1 },
    studentIds: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

ClassSchema.index({ teacherId: 1 })

export const Class = models.Class || model<IClassDocument>('Class', ClassSchema)
export default Class
