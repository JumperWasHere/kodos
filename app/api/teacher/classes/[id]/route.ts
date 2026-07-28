import { NextRequest, NextResponse } from 'next/server'
import { Student, Assignment } from '@/lib/db/models'
import { loadClassForTeacher } from '@/lib/api/teacherClass'
import { z } from 'zod'

type RouteParams = { params: Promise<{ id: string }> }

const UpdateClassSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  grade: z.number().int().min(0).max(6).optional(),
})

// GET /api/teacher/classes/[id] — class detail with student roster + stats
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const result = await loadClassForTeacher(id)
    if ('error' in result) return result.error

    const students = await Student.find({ _id: { $in: result.klass.studentIds } })
      .populate('userId', 'name email lastLoginAt')
      .select('displayName level xp streakDays subjectProgress userId')
      .lean() as any[]

    const roster = students.map((s) => ({
      studentId: s._id.toString(),
      displayName: s.displayName,
      name: s.userId?.name ?? s.displayName,
      email: s.userId?.email ?? '',
      level: s.level,
      xp: s.xp,
      streakDays: s.streakDays,
      lessonsCompleted: (s.subjectProgress ?? []).reduce(
        (sum: number, p: { completedLessons?: number }) => sum + (p.completedLessons ?? 0), 0
      ),
      lastLoginAt: s.userId?.lastLoginAt ?? null,
    }))

    return NextResponse.json({
      success: true,
      data: {
        _id: result.klass._id.toString(),
        name: result.klass.name,
        grade: result.klass.grade,
        students: roster,
      },
    })
  } catch (error) {
    console.error('[Teacher Class GET]', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

// PUT /api/teacher/classes/[id] — rename / change grade
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const result = await loadClassForTeacher(id)
    if ('error' in result) return result.error

    const body = await req.json()
    const parsed = UpdateClassSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 })
    }

    result.klass.set(parsed.data)
    await result.klass.save()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Teacher Class PUT]', error)
    return NextResponse.json({ success: false, error: 'Failed to update class' }, { status: 500 })
  }
}

// DELETE /api/teacher/classes/[id]
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const result = await loadClassForTeacher(id)
    if ('error' in result) return result.error

    await Promise.all([
      result.klass.deleteOne(),
      Assignment.deleteMany({ classId: result.klass._id }),
    ])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Teacher Class DELETE]', error)
    return NextResponse.json({ success: false, error: 'Failed to delete class' }, { status: 500 })
  }
}
