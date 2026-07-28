import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { auth } from '@/lib/auth/config'
import { connectDB } from '@/lib/db/connect'
import { Assignment } from '@/lib/db/models'

type RouteParams = { params: Promise<{ id: string }> }

// DELETE /api/teacher/assignments/[id]
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user || !['teacher', 'admin'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = await params
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Assignment not found' }, { status: 404 })
    }

    await connectDB()
    const assignment = await Assignment.findById(id)
    if (!assignment) {
      return NextResponse.json({ success: false, error: 'Assignment not found' }, { status: 404 })
    }
    if (session.user.role !== 'admin' && assignment.teacherId.toString() !== session.user.id) {
      return NextResponse.json({ success: false, error: 'This is not your assignment' }, { status: 403 })
    }

    await assignment.deleteOne()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Teacher Assignment DELETE]', error)
    return NextResponse.json({ success: false, error: 'Failed to delete assignment' }, { status: 500 })
  }
}
