import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { connectDB } from '@/lib/db/connect'
import { Progress, Student } from '@/lib/db/models'

// GET /api/leaderboard?type=xp&limit=20
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(req.url)
    const requestedLimit = Number.parseInt(searchParams.get('limit') ?? '20', 10)
    const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 50) : 20
    const type = searchParams.get('type') ?? 'xp'
    const period = searchParams.get('period') ?? 'alltime'

    // The leaderboard can sort by streaks or XP, and the period filter changes the scoring window.
    const sortField: Record<string, 1 | -1> = type === 'streak'
      ? { streakDays: -1 }
      : { xp: -1, level: -1 }

    const since = period === 'daily' ? new Date(Date.now() - 24 * 60 * 60 * 1000)
      : period === 'weekly' ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      : period === 'monthly' ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) : null
    let rankedStudents: any[]
    let periodXP = new Map<string, number>()
    if (since && type === 'xp') {
      const earned = await Progress.aggregate([
        { $match: { status: 'completed', completedAt: { $gte: since } } },
        { $group: { _id: '$studentId', xp: { $sum: '$xpEarned' } } },
        { $sort: { xp: -1 } }, { $limit: limit },
      ])
      periodXP = new Map(earned.map((row: { _id: { toString(): string }, xp: number }) => [row._id.toString(), row.xp]))
      const students = await Student.find({ _id: { $in: earned.map((row: { _id: unknown }) => row._id) }, isActive: { $ne: false } })
        .populate('userId', 'name avatar').select('displayName level xp streakDays coins userId').lean() as any[]
      rankedStudents = students.sort((a, b) => (periodXP.get(b._id.toString()) ?? 0) - (periodXP.get(a._id.toString()) ?? 0))
    } else {
      rankedStudents = await Student.find({ isActive: { $ne: false } })
        .sort(sortField).limit(limit).populate('userId', 'name avatar')
        .select('displayName level xp streakDays coins userId').lean() as any[]
    }

    const entries = rankedStudents.map((s, i) => ({
      rank: i + 1,
      studentId: s._id?.toString(),
      displayName: s.displayName,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${s.displayName ?? 'user'}`,
      level: s.level,
      xp: since && type === 'xp' ? (periodXP.get(s._id.toString()) ?? 0) : s.xp,
      streakDays: s.streakDays,
    }))

    return NextResponse.json({ success: true, data: entries })
  } catch (error) {
    console.error('[Leaderboard GET]', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
