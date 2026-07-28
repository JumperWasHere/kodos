import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { connectDB } from '@/lib/db/connect'
import { Class } from '@/lib/db/models'
import { z } from 'zod'

const CreateClassSchema = z.object({
  name: z.string().min(2, 'Class name is too short').max(100),
  grade: z.number().int().min(0).max(6).default(1),
})

async function requireTeacher() {
  const session = await auth()
  if (!session?.user || !['teacher', 'admin'].includes(session.user.role)) return null
  return session
}

// GET /api/teacher/classes — the teacher's classes with student counts
export async function GET() {
  try {
    const session = await requireTeacher()
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })

    await connectDB()
    const classes = await Class.find({ teacherId: session.user.id, isActive: true })
      .sort({ createdAt: -1 })
      .lean() as any[]

    const data = classes.map((c) => ({
      _id: c._id.toString(),
      name: c.name,
      grade: c.grade,
      studentCount: c.studentIds?.length ?? 0,
      createdAt: c.createdAt,
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[Teacher Classes GET]', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

// POST /api/teacher/classes — create a class
export async function POST(req: NextRequest) {
  try {
    const session = await requireTeacher()
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })

    const body = await req.json()
    const parsed = CreateClassSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 })
    }

    await connectDB()
    const created = await Class.create({
      ...parsed.data,
      teacherId: session.user.id,
      studentIds: [],
    })

    return NextResponse.json({ success: true, data: { id: created._id.toString() } }, { status: 201 })
  } catch (error) {
    console.error('[Teacher Classes POST]', error)
    return NextResponse.json({ success: false, error: 'Failed to create class' }, { status: 500 })
  }
}
