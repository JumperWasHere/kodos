import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { Student, User } from '@/lib/db/models'
import { loadClassForTeacher } from '@/lib/api/teacherClass'
import { z } from 'zod'

type RouteParams = { params: Promise<{ id: string }> }

const AddStudentSchema = z.object({
  email: z.string().email('Enter a valid email address'),
})

// POST /api/teacher/classes/[id]/students — add a student by account email
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const result = await loadClassForTeacher(id)
    if ('error' in result) return result.error

    const body = await req.json()
    const parsed = AddStudentSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Enter a valid email address' }, { status: 400 })
    }

    const user = await User.findOne({ email: parsed.data.email.toLowerCase().trim() }).select('role').lean() as any
    if (!user || user.role !== 'student') {
      return NextResponse.json(
        { success: false, error: 'No student account found with that email' },
        { status: 404 }
      )
    }

    const student = await Student.findOne({ userId: user._id }).select('_id displayName').lean() as any
    if (!student) {
      return NextResponse.json(
        { success: false, error: 'That account has no student profile' },
        { status: 404 }
      )
    }

    if (result.klass.studentIds.some((sid: Types.ObjectId) => sid.toString() === student._id.toString())) {
      return NextResponse.json(
        { success: false, error: `${student.displayName} is already in this class` },
        { status: 409 }
      )
    }

    result.klass.studentIds.push(student._id)
    await result.klass.save()

    return NextResponse.json({ success: true, data: { studentId: student._id.toString(), displayName: student.displayName } })
  } catch (error) {
    console.error('[Class Students POST]', error)
    return NextResponse.json({ success: false, error: 'Failed to add student' }, { status: 500 })
  }
}

// DELETE /api/teacher/classes/[id]/students?studentId=xxx — remove from class
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const result = await loadClassForTeacher(id)
    if ('error' in result) return result.error

    const studentId = new URL(req.url).searchParams.get('studentId')
    if (!studentId || !Types.ObjectId.isValid(studentId)) {
      return NextResponse.json({ success: false, error: 'Invalid student id' }, { status: 400 })
    }

    result.klass.studentIds = result.klass.studentIds.filter(
      (sid: Types.ObjectId) => sid.toString() !== studentId
    )
    await result.klass.save()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Class Students DELETE]', error)
    return NextResponse.json({ success: false, error: 'Failed to remove student' }, { status: 500 })
  }
}
