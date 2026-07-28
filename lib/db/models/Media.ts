import { Schema, model, models, Document } from 'mongoose'

// Small images (quiz pictures, thumbnails) stored directly in MongoDB so the
// app needs no external file storage. Served via GET /api/media/[id].
export interface IMediaDocument extends Document {
  filename: string
  contentType: string
  size: number
  data: Buffer
  uploadedBy: Schema.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const MediaSchema = new Schema<IMediaDocument>(
  {
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

MediaSchema.index({ uploadedBy: 1 })

export const Media = models.Media || model<IMediaDocument>('Media', MediaSchema)
export default Media
