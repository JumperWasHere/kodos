import { Schema, model, models, Document } from 'mongoose'

// Completion is derived from Progress records (studentId × lessonId),
// so no submissions array is stored here.
export interface IAssignmentDocument extends Document {
  title: string
  instructions?: string
  teacherId: Schema.Types.ObjectId
  classId: Schema.Types.ObjectId
  lessonId: Schema.Types.ObjectId
  dueDate?: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const AssignmentSchema = new Schema<IAssignmentDocument>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    instructions: { type: String, maxlength: 1000 },
    teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
    dueDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

AssignmentSchema.index({ teacherId: 1 })
AssignmentSchema.index({ classId: 1, isActive: 1 })

export const Assignment = models.Assignment || model<IAssignmentDocument>('Assignment', AssignmentSchema)
export default Assignment
