import { auth } from '@/lib/auth/config'
import { connectDB } from '@/lib/db/connect'
import Student from '@/lib/db/models/Student'
import Subject from '@/lib/db/models/Subject'
import { Class, Assignment, Progress } from '@/lib/db/models'
import '@/lib/db/models/Badge' // ensure Badge schema is registered for populate
import StudentDashboardClient from './StudentDashboardClient'

async function getAssignments(studentId: string | undefined) {
  if (!studentId) return []

  const classes = await Class.find({ studentIds: studentId, isActive: true }).select('_id').lean() as any[]
  if (classes.length === 0) return []

  const assignments = await Assignment.find({
    classId: { $in: classes.map((c) => c._id) },
    isActive: true,
  })
    .sort({ dueDate: 1, createdAt: -1 })
    .populate('lessonId', 'title subjectSlug')
    .lean() as any[]

  const lessonIds = assignments.map((a) => a.lessonId?._id).filter(Boolean)
  const completed = await Progress.find({
    studentId,
    lessonId: { $in: lessonIds },
    status: 'completed',
  }).select('lessonId').lean() as any[]
  const completedSet = new Set(completed.map((p) => p.lessonId.toString()))

  return assignments
    .filter((a) => a.lessonId)
    .map((a) => ({
      _id: a._id.toString(),
      title: a.title,
      lessonId: a.lessonId._id.toString(),
      subjectSlug: a.lessonId.subjectSlug,
      dueDate: a.dueDate?.toISOString() ?? null,
      completed: completedSet.has(a.lessonId._id.toString()),
    }))
}

export default async function StudentDashboardPage() {
  const [session] = await Promise.all([auth(), connectDB()])
  if (!session?.user?.id) return null

  const [rawStudent, subjects, assignments] = await Promise.all([
    Student.findOne({ userId: session.user.id })
      .populate('badges', 'name emoji rarity')
      .lean(),
    Subject.find({ isActive: true })
      .sort({ order: 1 })
      .limit(9)
      .lean(),
    getAssignments(session.user.studentId),
  ])
  const student = rawStudent as any

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const todayProgress = student
    ? await Progress.find({ studentId: student._id, status: 'completed', completedAt: { $gte: startOfToday } }).select('score').lean()
    : []
  const completedToday = todayProgress.length
  const hasHighScoreToday = todayProgress.some((p) => (p.score ?? 0) >= 80)

  // Calculate daily tasks from actual completion records.
  const dailyTasks = [
    { id: '1', title: 'Complete 3 lessons', emoji: '📚', reward: 30, current: completedToday, target: 3 },
    { id: '2', title: 'Score 80%+ on a quiz', emoji: '🎯', reward: 50, current: hasHighScoreToday ? 1 : 0, target: 1 },
    { id: '3', title: 'Login streak', emoji: '🔥', reward: 20, current: student?.streakDays ? 1 : 0, target: 1 },
  ]

  return (
    <StudentDashboardClient
      student={JSON.parse(JSON.stringify(student))}
      subjects={JSON.parse(JSON.stringify(subjects))}
      dailyTasks={dailyTasks}
      assignments={assignments}
      userName={session.user.displayName || session.user.name || 'Explorer'}
      dailyRewardClaimed={student?.lastDailyRewardDate ? new Date(student.lastDailyRewardDate) >= startOfToday : false}
    />
  )
}
