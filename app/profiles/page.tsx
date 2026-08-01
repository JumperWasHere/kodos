import { auth } from '@/lib/auth/config'
import { redirect } from 'next/navigation'
import { connectDB } from '@/lib/db/connect'
import Student from '@/lib/db/models/Student'
import ProfilesClient from './profiles-client'

export default async function ProfilesPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'parent') redirect('/login')
  await connectDB()
  const children = await Student.find({ parentId: session.user.id })
    .select('displayName avatar grade ageGroup level xp').sort({ createdAt: 1 }).lean() as any[]
  const serializedChildren = children.map((child) => ({
    id: child._id.toString(), name: child.displayName, avatar: child.avatar, grade: child.grade,
    ageGroup: child.ageGroup, level: child.level, xp: child.xp,
  }))
  return <ProfilesClient parentName={session.user.name ?? 'Parent'} profiles={JSON.parse(JSON.stringify(serializedChildren))} />
}
