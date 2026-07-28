import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { auth } from '@/lib/auth/config'
import { connectDB } from '@/lib/db/connect'
import { Assignment, Class, Lesson, Progress } from '@/lib/db/models'
import { z } from 'zod'

const CreateAssignmentSchema = z.object({
  classId: z.string().refine(Types.ObjectId.isValid, 'Invalid class'),
  lessonId: z.string().refine(Types.ObjectId.isValid, 'Invalid quiz'),
  title: z.string().min(2).max(200).optional(),
  instructions: z.string().max(1000).optional(),
  dueDate: z.string().refine((v) => !isNaN(Date.parse(v)), 'Invalid date').optional(),
})

async function requireTeacher() {
  const session = await auth()
  if (!session?.user || !['teacher', 'admin'].includes(session.user.role)) return null
  return session
}

// GET /api/teacher/assignments — teacher's assignments with completion stats
export async function GET() {
  try {
    const session = await requireTeacher()
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })

    await connectDB()
    const assignments = await Assignment.find({ teacherId: session.user.id, isActive: true })
      .sort({ createdAt: -1 })
      .populate('classId', 'name studentIds')
      .populate('lessonId', 'title subjectSlug')
      .lean() as any[]

    const data = await Promise.all(
      assignments.map(async (a) => {
        const studentIds = a.classId?.studentIds ?? []
        const completed = studentIds.length > 0
          ? await Progress.countDocuments({
              lessonId: a.lessonId?._id,
              studentId: { $in: studentIds },
              status: 'completed',
            })
          : 0
        return {
          _id: a._id.toString(),
          title: a.title,
          instructions: a.instructions,
          className: a.classId?.name ?? 'Deleted class',
          lessonTitle: a.lessonId?.title ?? 'Deleted quiz',
          subjectSlug: a.lessonId?.subjectSlug,
          dueDate: a.dueDate,
          totalStudents: studentIds.length,
          completedCount: completed,
          createdAt: a.createdAt,
        }
      })
    )

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[Teacher Assignments GET]', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

// POST /api/teacher/assignments — assign a quiz to a class
export async function POST(req: NextRequest) {
  try {
    const session = await requireTeacher()
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })

    const body = await req.json()
    const parsed = CreateAssignmentSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 })
    }

    await connectDB()

    const [klass, lesson] = await Promise.all([
      Class.findById(parsed.data.classId).select('teacherId').lean() as any,
      Lesson.findById(parsed.data.lessonId).select('title').lean() as any,
    ])
    if (!klass) return NextResponse.json({ success: false, error: 'Class not found' }, { status: 404 })
    if (session.user.role !== 'admin' && klass.teacherId.toString() !== session.user.id) {
      return NextResponse.json({ success: false, error: 'This is not your class' }, { status: 403 })
    }
    if (!lesson) return NextResponse.json({ success: false, error: 'Quiz not found' }, { status: 404 })

    const created = await Assignment.create({
      title: parsed.data.title?.trim() || lesson.title,
      instructions: parsed.data.instructions,
      teacherId: session.user.id,
      classId: parsed.data.classId,
      lessonId: parsed.data.lessonId,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
    })

    return NextResponse.json({ success: true, data: { id: created._id.toString() } }, { status: 201 })
  } catch (error) {
    console.error('[Teacher Assignments POST]', error)
    return NextResponse.json({ success: false, error: 'Failed to create assignment' }, { status: 500 })
  }
}
