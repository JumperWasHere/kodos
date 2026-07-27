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
  timeSpent: z.number().min(0),
  answers: z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional(),
})

function answersMatch(expected: string | string[], submitted: string | string[] | undefined) {
  if (submitted === undefined) return false
  const normalize = (value: string) => value.trim().toLocaleLowerCase()
  const expectedAnswers = (Array.isArray(expected) ? expected : [expected]).map(normalize).sort()
  const submittedAnswers = (Array.isArray(submitted) ? submitted : [submitted]).map(normalize).sort()

  return expectedAnswers.length === submittedAnswers.length &&
    expectedAnswers.every((answer, index) => answer === submittedAnswers[index])
}

// POST /api/progress — Complete/update a lesson
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    console.log('Session:', session)
    if (!session?.user?.studentId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = CompleteSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const { lessonId, timeSpent, answers = {} } = parsed.data

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

    // Scores and rewards are calculated from the stored answer key, never from
    // client-provided totals.
    const questions = lesson.questions ?? []
    const totalPoints = questions.reduce((total: number, question: { points: number }) => total + question.points, 0)
    const earnedPoints = questions.reduce((total: number, question: { id: string; points: number; correctAnswer: string | string[] }) => (
      answersMatch(question.correctAnswer, answers[question.id]) ? total + question.points : total
    ), 0)
    const scorePct = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 100
    const earnedXP = Math.round(lesson.xpReward * (scorePct / 100))
    const earnedCoins = Math.round(lesson.coinReward * (scorePct / 100))

    // Only the transition to completed can award rewards. This conditional update
    // also prevents repeated requests from farming XP and coins.
    const progressDoc = await Progress.findOneAndUpdate(
      { studentId: student._id, lessonId, status: { $ne: 'completed' } },
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
      { new: true }
    )

    let completedNow = Boolean(progressDoc)
    let completedProgress = progressDoc

    if (!completedProgress) {
      try {
        completedProgress = await Progress.create({
          studentId: student._id,
          lessonId,
          subjectSlug: lesson.subjectSlug,
          status: 'completed',
          score: scorePct,
          xpEarned: earnedXP,
          coinsEarned: earnedCoins,
          timeSpent,
          answers,
          attempts: 1,
          completedAt: new Date(),
        })
        completedNow = true
      } catch (error: unknown) {
        // A concurrent request may have created the unique progress record first.
        if (!(error && typeof error === 'object' && 'code' in error && error.code === 11000)) throw error
        completedNow = false
        completedProgress = await Progress.findOne({ studentId: student._id, lessonId })
      }
    }

    if (!completedNow) {
      return NextResponse.json({
        success: true,
        data: { xpEarned: 0, coinsEarned: 0, score: completedProgress?.score ?? scorePct, progressId: completedProgress?._id, alreadyCompleted: true },
      })
    }

    // Update student XP, coins, and subject progress for a first completion only.
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
        progressId: completedProgress!._id,
      },
    })
  } catch (error) {
    console.error('[Progress POST]', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
