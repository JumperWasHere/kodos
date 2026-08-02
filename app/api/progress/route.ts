import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { getActiveChild } from '@/lib/auth/active-child'
import { Progress, Student, Lesson, Badge } from '@/lib/db/models'
import { getLevelFromXP } from '@/lib/utils'
import { z } from 'zod'

// GET /api/progress?studentId=xxx
export async function GET(req: NextRequest) {
  try {
    const student = await getActiveChild()
    if (!student) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { searchParams } = new URL(req.url)
    const subjectSlug = searchParams.get('subjectSlug')

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

  // A single submitted answer against an array of accepted answers means
  // "any of these is correct" (e.g. fill-in-the-blank alternates).
  if (Array.isArray(expected) && !Array.isArray(submitted)) {
    return expected.map(normalize).includes(normalize(submitted))
  }

  const expectedAnswers = (Array.isArray(expected) ? expected : [expected]).map(normalize).sort()
  const submittedAnswers = (Array.isArray(submitted) ? submitted : [submitted]).map(normalize).sort()

  return expectedAnswers.length === submittedAnswers.length &&
    expectedAnswers.every((answer, index) => answer === submittedAnswers[index])
}

// POST /api/progress — Complete/update a lesson
export async function POST(req: NextRequest) {
  try {
    const activeChild = await getActiveChild()
    if (!activeChild) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = CompleteSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const { lessonId, timeSpent, answers = {} } = parsed.data

    if (!Types.ObjectId.isValid(lessonId)) {
      return NextResponse.json({ error: 'Invalid lesson id' }, { status: 400 })
    }

    const [lesson, student] = await Promise.all([
      Lesson.findOne({ _id: lessonId, isActive: true }).lean() as any,
      Student.findById(activeChild._id),
    ])

    if (!lesson || !student) {
      return NextResponse.json({ error: 'Lesson or student not found' }, { status: 404 })
    }

    // Check premium access
    if (lesson.isPremium && !student.isPremium) {
      return NextResponse.json({ error: 'Premium subscription required' }, { status: 403 })
    }

    // Scores and rewards are calculated from the stored answer key, never from
    // client-provided totals, which keeps grading consistent and prevents tampering.
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
      const subjectLessonCount = await Lesson.countDocuments({
        subjectSlug: lesson.subjectSlug,
        isActive: true,
      })
      await Student.updateOne(
        { _id: student._id },
        {
          $inc: { xp: earnedXP, coins: earnedCoins },
          $push: {
            subjectProgress: {
              subjectSlug: lesson.subjectSlug,
              completedLessons: 1,
              totalLessons: Math.max(subjectLessonCount, 1),
              xpEarned: earnedXP,
              masteryLevel: Math.round(scorePct / 10),
              lastAccessedAt: new Date(),
            },
          },
        }
      )
    }

    // Keep the stored level in sync with the shared XP curve
    const updatedStudent = await Student.findById(student._id).select('xp level').lean() as any
    if (updatedStudent) {
      const newLevel = getLevelFromXP(updatedStudent.xp ?? 0)
      if (newLevel !== updatedStudent.level) {
        await Student.updateOne({ _id: student._id }, { $set: { level: newLevel } })
      }
    }

    // Award newly satisfied badges after the completion has been persisted.
    const refreshedStudent = await Student.findById(student._id).select('xp streakDays subjectProgress badges').lean() as any
    if (refreshedStudent) {
      const [completedCount, perfectCount, badges] = await Promise.all([
        Progress.countDocuments({ studentId: student._id, status: 'completed' }),
        Progress.countDocuments({ studentId: student._id, status: 'completed', score: 100 }),
        Badge.find({ isActive: true }).lean() as unknown as any[],
      ])
      const owned = new Set((refreshedStudent.badges ?? []).map((id: { toString(): string }) => id.toString()))
      const earned = badges.filter((badge) => {
        if (owned.has(badge._id.toString())) return false
        const requirement = badge.requirement
        if (requirement.type === 'lessons') return completedCount >= requirement.value
        if (requirement.type === 'xp') return (refreshedStudent.xp ?? 0) >= requirement.value
        if (requirement.type === 'streak') return (refreshedStudent.streakDays ?? 0) >= requirement.value
        if (requirement.type === 'perfect_score') return perfectCount >= requirement.value
        if (requirement.type === 'subject_mastery') {
          const subject = refreshedStudent.subjectProgress?.find((p: { subjectSlug: string }) => p.subjectSlug === requirement.subjectSlug)
          return subject && subject.totalLessons > 0 && subject.completedLessons >= subject.totalLessons
        }
        return false
      })
      if (earned.length) await Student.updateOne({ _id: student._id }, { $addToSet: { badges: { $each: earned.map((badge) => badge._id) } } })
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
