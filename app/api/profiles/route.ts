import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth/config'
import { connectDB } from '@/lib/db/connect'
import { Student, User } from '@/lib/db/models'

const ChildSchema = z.object({
  name: z.string().trim().min(1).max(50),
  avatar: z.string().min(1).max(500),
  grade: z.number().int().min(0).max(6),
  ageGroup: z.enum(['toddler', 'preschool', 'lower_primary', 'upper_primary']),
})

async function parentSession() {
  const session = await auth()
  return session?.user?.role === 'parent' && session.user.id ? session : null
}

export async function GET() {
  const session = await parentSession()
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const children = await Student.find({ parentId: session.user.id })
    .select('displayName avatar grade ageGroup level xp')
    .sort({ createdAt: 1 })
    .lean() as any[]
  return NextResponse.json({ success: true, data: children.map((child) => ({
    id: child._id.toString(), name: child.displayName, avatar: child.avatar,
    grade: child.grade, ageGroup: child.ageGroup, level: child.level, xp: child.xp,
  })) })
}

export async function POST(req: NextRequest) {
  const session = await parentSession()
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const parsed = ChildSchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message ?? 'Invalid child profile' }, { status: 400 })

  await connectDB()
  const data = parsed.data
  const childUser = await User.create({
    name: data.name,
    role: 'child',
    parentId: session.user.id,
    avatar: data.avatar,
    profileMetadata: { avatar: data.avatar, gradeLevel: data.grade, ageGroup: data.ageGroup },
    isEmailVerified: false,
  })
  const child = await Student.create({
    userId: childUser._id,
    parentId: session.user.id,
    displayName: data.name,
    avatar: data.avatar,
    grade: data.grade,
    ageGroup: data.ageGroup,
  })
  return NextResponse.json({ success: true, data: { id: child._id.toString() } }, { status: 201 })
}
