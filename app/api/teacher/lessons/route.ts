import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { connectDB } from '@/lib/db/connect'
import { Lesson, Subject } from '@/lib/db/models'
import { LessonInputSchema } from '@/lib/validations/lesson'

async function requireTeacher() {
  const session = await auth()
  if (!session?.user || !['teacher', 'admin'].includes(session.user.role)) {
    return null
  }
  return session
}

// GET /api/teacher/lessons?subjectSlug=&ageGroup=&scope=mine|all
export async function GET(req: NextRequest) {
  try {
    const session = await requireTeacher()
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })

    await connectDB()

    const { searchParams } = new URL(req.url)
    const subjectSlug = searchParams.get('subjectSlug')
    const ageGroup = searchParams.get('ageGroup')
    const scope = searchParams.get('scope') ?? 'mine'

    const filter: Record<string, unknown> = {}
    if (scope === 'mine') filter.createdBy = session.user.id
    if (subjectSlug) filter.subjectSlug = subjectSlug
    if (ageGroup) filter.ageGroup = ageGroup

    const lessons = await Lesson.find(filter)
      .sort({ updatedAt: -1 })
      .select('title subjectSlug topicId ageGroup grade type difficulty duration xpReward coinReward isPremium isActive createdBy updatedAt questions')
      .lean() as any[]

    const data = lessons.map((l) => ({
      ...l,
      questionCount: l.questions?.length ?? 0,
      questions: undefined,
      isMine: l.createdBy?.toString() === session.user.id,
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[Teacher Lessons GET]', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

// POST /api/teacher/lessons — create a quiz lesson
export async function POST(req: NextRequest) {
  try {
    const session = await requireTeacher()
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })

    const body = await req.json()
    const parsed = LessonInputSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    await connectDB()

    const subject = await Subject.findOne({ slug: parsed.data.subjectSlug }).select('_id').lean() as any
    if (!subject) {
      return NextResponse.json({ success: false, error: 'Subject not found' }, { status: 404 })
    }

    const lastLesson = await Lesson.findOne({ subjectSlug: parsed.data.subjectSlug })
      .sort({ order: -1 })
      .select('order')
      .lean() as any

    const lesson = await Lesson.create({
      ...parsed.data,
      subjectId: subject._id,
      order: (lastLesson?.order ?? 0) + 1,
      createdBy: session.user.id,
    })

    return NextResponse.json({ success: true, data: { id: lesson._id.toString() } }, { status: 201 })
  } catch (error) {
    console.error('[Teacher Lessons POST]', error)
    return NextResponse.json({ success: false, error: 'Failed to create quiz' }, { status: 500 })
  }
}
