import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db/connect'
import { User, Student } from '@/lib/db/models'
import { z } from 'zod'

const RegisterSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
  role: z.enum(['student', 'parent', 'teacher']),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = RegisterSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    await connectDB()

    const { name, email, password, role } = parsed.data

    // Check existing user
    const existing = await User.findOne({ email }).lean()
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      )
    }

    const hashedPw = await bcrypt.hash(password, 12)

    const user = await User.create({
      name,
      email,
      password: hashedPw,
      role,
      isEmailVerified: false, // In prod: send verification email
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
    })

    // Create student profile if student role
    if (role === 'student') {
      await Student.create({
        userId: user._id,
        displayName: name.split(' ')[0],
        ageGroup: 'lower_primary',
        grade: 1,
        xp: 0,
        level: 1,
        coins: 100, // Starting coins
        streakDays: 0,
      })
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        data: { id: user._id.toString(), role },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[Register API]', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
