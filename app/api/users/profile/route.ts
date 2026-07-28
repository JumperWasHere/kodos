import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { auth } from '@/lib/auth/config'
import { connectDB } from '@/lib/db/connect'
import { User } from '@/lib/db/models'
import { z } from 'zod'

const UpdateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/).optional(),
}).refine((d) => !d.newPassword || !!d.currentPassword, {
  path: ['currentPassword'],
  message: 'Current password is required to set a new one',
})

// PUT /api/users/profile — update own name and/or password
export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = UpdateProfileSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 }
      )
    }

    await connectDB()
    const user = await User.findById(session.user.id).select('+password')
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })

    if (parsed.data.newPassword) {
      if (!user.password) {
        return NextResponse.json(
          { success: false, error: 'This account uses Google sign-in and has no password' },
          { status: 400 }
        )
      }
      const valid = await bcrypt.compare(parsed.data.currentPassword!, user.password)
      if (!valid) {
        return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 400 })
      }
      user.password = await bcrypt.hash(parsed.data.newPassword, 12)
    }

    if (parsed.data.name) user.name = parsed.data.name.trim()

    await user.save()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Profile PUT]', error)
    return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 })
  }
}
