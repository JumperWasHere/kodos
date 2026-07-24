import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { connectDB } from '@/lib/db/connect'
import { Progress, Student, Lesson } from '@/lib/db/models'
import { z } from 'zod'

// GET /api/progress?studentId=xxx
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const { searchParams } = new URL(req.url)
    const studentId = searchParams.get('studentId')
    const subjectSlug = searchParams.get('subjectSlug')

    const student = await Student.findOne({ userId: session.user.id }).lean() as any
    if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 })

    const filter: Record<string, unknown> = { studentId: student._id }
    if (subjectSlug) filter.subjectSlug = subjectSlug

    const progress = await Progress.find(filter)
      .populate('lessonId', 'title type difficulty thumbnail xpReward')
      .sort({ updatedAt: -1 })
      .lean()

    return NextResponse.json({ success: true, data: progress })
  } catch (error) {
    console.error('[Progress GET]', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

const CompleteSchema = z.object({
  lessonId: z.string(),
  score: z.number().min(0).max(100).optional(),
  timeSpent: z.number().min(0),
  answers: z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional(),
})

// POST /api/progress — Complete/update a lesson
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.studentId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = CompleteSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const { lessonId, score, timeSpent, answers } = parsed.data

    await connectDB()

    const [lesson, student] = await Promise.all([
      Lesson.findById(lessonId).lean() as any,
      Student.findById(session.user.studentId),
    ])

    if (!lesson || !student) {
      return NextResponse.json({ error: 'Lesson or student not found' }, { status: 404 })
    }

    // Check premium access
    if (lesson.isPremium && !student.isPremium) {
      return NextResponse.json({ error: 'Premium subscription required' }, { status: 403 })
    }

    // Calculate XP/coins based on score
    const scorePct = score ?? 100
    const earnedXP = Math.round(lesson.xpReward * (scorePct / 100))
    const earnedCoins = Math.round(lesson.coinReward * (scorePct / 100))

    // Upsert progress record
    const progressDoc = await Progress.findOneAndUpdate(
      { studentId: student._id, lessonId },
      {
        $set: {
          status: 'completed',
          score: scorePct,
          xpEarned: earnedXP,
          coinsEarned: earnedCoins,
          timeSpent,
          answers,
          completedAt: new Date(),
          subjectSlug: lesson.subjectSlug,
        },
        $inc: { attempts: 1 },
      },
      { upsert: true, new: true }
    )

    // Update student XP, coins, and subject progress
    const subjectProgressIdx = student.subjectProgress?.findIndex(
      (p: { subjectSlug: string }) => p.subjectSlug === lesson.subjectSlug
    ) ?? -1

    if (subjectProgressIdx >= 0) {
      await Student.updateOne(
        { _id: student._id, 'subjectProgress.subjectSlug': lesson.subjectSlug },
        {
          $inc: {
            xp: earnedXP,
            coins: earnedCoins,
            'subjectProgress.$.completedLessons': 1,
            'subjectProgress.$.xpEarned': earnedXP,
          },
          $set: { 'subjectProgress.$.lastAccessedAt': new Date() },
        }
      )
    } else {
      await Student.updateOne(
        { _id: student._id },
        {
          $inc: { xp: earnedXP, coins: earnedCoins },
          $push: {
            subjectProgress: {
              subjectSlug: lesson.subjectSlug,
              completedLessons: 1,
              totalLessons: lesson.totalCompletions ?? 1,
              xpEarned: earnedXP,
              masteryLevel: Math.round(scorePct / 10),
              lastAccessedAt: new Date(),
            },
          },
        }
      )
    }

    // Update lesson stats
    await Lesson.findByIdAndUpdate(lessonId, {
      $inc: { totalCompletions: 1 },
    })

    return NextResponse.json({
      success: true,
      data: {
        xpEarned: earnedXP,
        coinsEarned: earnedCoins,
        score: scorePct,
        progressId: progressDoc._id,
      },
    })
  } catch (error) {
    console.error('[Progress POST]', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
