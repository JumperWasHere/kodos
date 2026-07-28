import { NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { auth } from '@/lib/auth/config'
import { connectDB } from '@/lib/db/connect'
import { Class } from '@/lib/db/models'

// Loads a class after verifying the caller is its teacher (or an admin).
export async function loadClassForTeacher(id: string) {
  const session = await auth()
  if (!session?.user || !['teacher', 'admin'].includes(session.user.role)) {
    return { error: NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 }) }
  }
  if (!Types.ObjectId.isValid(id)) {
    return { error: NextResponse.json({ success: false, error: 'Class not found' }, { status: 404 }) }
  }

  await connectDB()
  const klass = await Class.findById(id)
  if (!klass || !klass.isActive) {
    return { error: NextResponse.json({ success: false, error: 'Class not found' }, { status: 404 }) }
  }
  if (session.user.role !== 'admin' && klass.teacherId.toString() !== session.user.id) {
    return { error: NextResponse.json({ success: false, error: 'This is not your class' }, { status: 403 }) }
  }

  return { session, klass }
}
