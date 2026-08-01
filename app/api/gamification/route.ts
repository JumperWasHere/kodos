import { NextRequest, NextResponse } from 'next/server'
import { getActiveChild } from '@/lib/auth/active-child'
import { Student } from '@/lib/db/models'

// GET /api/gamification/student — Get current student's gamification data
export async function GET(req: NextRequest) {
  try {
    const student = await getActiveChild()
    if (!student) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const populatedStudent = await Student.findById(student._id)
      .populate('badges', 'name emoji rarity description xpReward')
      .lean() as any

    if (!populatedStudent) return NextResponse.json({ error: 'Student not found' }, { status: 404 })

    return NextResponse.json({
      success: true,
      data: {
        xp: populatedStudent.xp, level: populatedStudent.level, coins: populatedStudent.coins, gems: populatedStudent.gems,
        streakDays: populatedStudent.streakDays, longestStreak: populatedStudent.longestStreak, totalLoginDays: populatedStudent.totalLoginDays,
        badges: populatedStudent.badges, lastDailyRewardDate: populatedStudent.lastDailyRewardDate,
        dailyRewardStreak: populatedStudent.dailyRewardStreak, virtualPet: populatedStudent.virtualPet,
      },
    })
  } catch (error) {
    console.error('[Gamification GET]', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

// POST /api/gamification/daily-reward — Claim daily reward
export async function POST(req: NextRequest) {
  try {
    const student = await getActiveChild()
    if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 })

    const now = new Date()
    const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
    const startOfYesterday = new Date(startOfToday)
    startOfYesterday.setUTCDate(startOfYesterday.getUTCDate() - 1)
    const isConsecutive = student.lastDailyRewardDate?.getTime() === startOfYesterday.getTime()

    const newStreak = isConsecutive ? (student.dailyRewardStreak + 1) : 1
    const day = newStreak

    // Daily reward amounts (increases with streak)
    const coinReward = Math.min(50 + (day - 1) * 10, 200)
    const xpReward = Math.min(20 + (day - 1) * 5, 100)

    // Special reward on day 7
    const specialReward = day === 7 ? { type: 'gem', amount: 5 } : null

    const result = await Student.updateOne(
      {
        _id: student._id,
        $or: [
          { lastDailyRewardDate: { $lt: startOfToday } },
          { lastDailyRewardDate: { $exists: false } },
        ],
      },
      {
        $inc: {
          xp: xpReward,
          coins: coinReward,
          gems: specialReward ? 5 : 0,
          totalLoginDays: 1,
        },
        $set: {
          lastDailyRewardDate: startOfToday,
          dailyRewardStreak: newStreak,
        },
      }
    )

    if (result.modifiedCount !== 1) {
      return NextResponse.json({ success: false, error: 'Daily reward already claimed today' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: { day: newStreak, coinReward, xpReward, specialReward },
    })
  } catch (error) {
    console.error('[Daily Reward POST]', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
