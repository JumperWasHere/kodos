import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { connectDB } from '@/lib/db/connect'
import { Media } from '@/lib/db/models'

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
const AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm']
const MAX_IMAGE_SIZE = 2 * 1024 * 1024 // 2MB
const MAX_AUDIO_SIZE = 8 * 1024 * 1024 // 8MB — a minute or two of MP3 narration/song

// POST /api/upload — teachers and admins upload quiz images or story narration/song
// audio (multipart/form-data, field "file")
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

    const isImage = IMAGE_TYPES.includes(file.type)
    const isAudio = AUDIO_TYPES.includes(file.type)
    if (!isImage && !isAudio) {
      return NextResponse.json(
        { success: false, error: 'Only JPEG/PNG/WebP/GIF/SVG images or MP3/WAV/OGG audio files are allowed' },
        { status: 400 }
      )
    }

    const maxSize = isAudio ? MAX_AUDIO_SIZE : MAX_IMAGE_SIZE
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: `${isAudio ? 'Audio' : 'Image'} must be ${maxSize / (1024 * 1024)}MB or smaller` },
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
