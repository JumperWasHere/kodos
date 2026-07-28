import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { connectDB } from '@/lib/db/connect'
import { Student } from '@/lib/db/models'

// GET /api/leaderboard?type=xp&limit=20
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(req.url)
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 50)
    const type = searchParams.get('type') ?? 'xp'

    const sortField: Record<string, 1 | -1> = type === 'streak'
      ? { streakDays: -1 }
      : { xp: -1, level: -1 }

    const students = await Student.find({ isActive: { $ne: false } })
      .sort(sortField)
      .limit(limit)
      .populate('userId', 'name avatar')
      .select('displayName level xp streakDays coins userId')
      .lean() as any[]

    const entries = students.map((s, i) => ({
      rank: i + 1,
      studentId: s._id?.toString(),
      displayName: s.displayName,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${s.displayName ?? 'user'}`,
      level: s.level,
      xp: s.xp,
      streakDays: s.streakDays,
    }))

    return NextResponse.json({ success: true, data: entries })
  } catch (error) {
    console.error('[Leaderboard GET]', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
