import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { connectDB } from '@/lib/db/connect'
import { Media } from '@/lib/db/models'

const MAX_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']

// POST /api/upload — teachers and admins upload quiz images (multipart/form-data, field "file")
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || !['teacher', 'admin'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const formData = await req.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Only JPEG, PNG, WebP, GIF, or SVG images are allowed' },
        { status: 400 }
      )
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Image must be 2MB or smaller' },
        { status: 400 }
      )
    }

    await connectDB()

    const buffer = Buffer.from(await file.arrayBuffer())
    const media = await Media.create({
      filename: file.name,
      contentType: file.type,
      size: file.size,
      data: buffer,
      uploadedBy: session.user.id,
    })

    return NextResponse.json(
      { success: true, data: { id: media._id.toString(), url: `/api/media/${media._id}` } },
      { status: 201 }
    )
  } catch (error) {
    console.error('[Upload POST]', error)
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 })
  }
}
