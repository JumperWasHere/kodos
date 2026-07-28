import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { connectDB } from '@/lib/db/connect'
import { Assignment, Class, Progress } from '@/lib/db/models'

// GET /api/assignments — assignments for the logged-in student, with completion status
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.studentId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const classes = await Class.find({ studentIds: session.user.studentId, isActive: true })
      .select('_id name')
      .lean() as any[]
    if (classes.length === 0) {
      return NextResponse.json({ success: true, data: [] })
    }

    const assignments = await Assignment.find({
      classId: { $in: classes.map((c) => c._id) },
      isActive: true,
    })
      .sort({ dueDate: 1, createdAt: -1 })
      .populate('lessonId', 'title subjectSlug type')
      .lean() as any[]

    const lessonIds = assignments.map((a) => a.lessonId?._id).filter(Boolean)
    const completed = await Progress.find({
      studentId: session.user.studentId,
      lessonId: { $in: lessonIds },
      status: 'completed',
    }).select('lessonId score').lean() as any[]
    const completedMap = new Map(completed.map((p) => [p.lessonId.toString(), p.score]))

    const classNames = new Map(classes.map((c) => [c._id.toString(), c.name]))

    const data = assignments
      .filter((a) => a.lessonId)
      .map((a) => ({
        _id: a._id.toString(),
        title: a.title,
        instructions: a.instructions,
        className: classNames.get(a.classId.toString()) ?? '',
        lessonId: a.lessonId._id.toString(),
        lessonTitle: a.lessonId.title,
        subjectSlug: a.lessonId.subjectSlug,
        dueDate: a.dueDate ?? null,
        completed: completedMap.has(a.lessonId._id.toString()),
        score: completedMap.get(a.lessonId._id.toString()) ?? null,
      }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[Assignments GET]', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
