import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { auth } from '@/lib/auth/config'
import { connectDB } from '@/lib/db/connect'
import { Lesson, Subject, Progress } from '@/lib/db/models'
import { LessonInputSchema } from '@/lib/validations/lesson'

type RouteParams = { params: Promise<{ id: string }> }

async function loadLessonForTeacher(id: string) {
  const session = await auth()
  if (!session?.user || !['teacher', 'admin'].includes(session.user.role)) {
    return { error: NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 }) }
  }
  if (!Types.ObjectId.isValid(id)) {
    return { error: NextResponse.json({ success: false, error: 'Quiz not found' }, { status: 404 }) }
  }

  await connectDB()
  const lesson = await Lesson.findById(id)
  if (!lesson) {
    return { error: NextResponse.json({ success: false, error: 'Quiz not found' }, { status: 404 }) }
  }

  // Teachers can only manage their own quizzes; admins can manage any.
  const isOwner = lesson.createdBy?.toString() === session.user.id
  if (session.user.role !== 'admin' && !isOwner) {
    return { error: NextResponse.json({ success: false, error: 'You can only edit quizzes you created' }, { status: 403 }) }
  }

  return { session, lesson }
}

// GET /api/teacher/lessons/[id] — full lesson including questions/answers
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const result = await loadLessonForTeacher(id)
    if ('error' in result) return result.error

    return NextResponse.json({ success: true, data: result.lesson.toJSON() })
  } catch (error) {
    console.error('[Teacher Lesson GET]', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

// PUT /api/teacher/lessons/[id] — update a quiz
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const result = await loadLessonForTeacher(id)
    if ('error' in result) return result.error

    const body = await req.json()
    const parsed = LessonInputSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const subject = await Subject.findOne({ slug: parsed.data.subjectSlug }).select('_id').lean() as any
    if (!subject) {
      return NextResponse.json({ success: false, error: 'Subject not found' }, { status: 404 })
    }

    result.lesson.set({ ...parsed.data, subjectId: subject._id })
    await result.lesson.save()

    return NextResponse.json({ success: true, data: { id } })
  } catch (error) {
    console.error('[Teacher Lesson PUT]', error)
    return NextResponse.json({ success: false, error: 'Failed to update quiz' }, { status: 500 })
  }
}

// DELETE /api/teacher/lessons/[id]
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const result = await loadLessonForTeacher(id)
    if ('error' in result) return result.error

    await Promise.all([
      result.lesson.deleteOne(),
      // Remove orphaned student progress for this lesson
      Progress.deleteMany({ lessonId: result.lesson._id }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Teacher Lesson DELETE]', error)
    return NextResponse.json({ success: false, error: 'Failed to delete quiz' }, { status: 500 })
  }
}
