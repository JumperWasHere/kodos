import { auth } from '@/lib/auth/config'
import { connectDB } from '@/lib/db/connect'
import Student from '@/lib/db/models/Student'

/**
 * Resolves the selected learner from the authenticated parent's JWT. This is
 * intentionally the only source of a child ID for learner-facing operations.
 */
export async function getActiveChild() {
  const session = await auth()
  if (!session?.user?.id) return null

  await connectDB()

  if (session.user.role === 'student') {
    return Student.findOne({ userId: session.user.id }).lean() as Promise<any>
  }

  if (session.user.role === 'parent' && session.user.activeChildId) {
    return Student.findOne({
      _id: session.user.activeChildId,
      parentId: session.user.id,
    }).lean() as Promise<any>
  }

  return null
}
