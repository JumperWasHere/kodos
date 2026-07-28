import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { connectDB } from '@/lib/db/connect'
import { Media } from '@/lib/db/models'

// GET /api/media/[id] — serve an uploaded image
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await connectDB()
    const media = await Media.findById(id).lean() as any
    if (!media) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return new NextResponse(Buffer.from(media.data.buffer ?? media.data), {
      headers: {
        'Content-Type': media.contentType,
        'Content-Length': String(media.size),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('[Media GET]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
