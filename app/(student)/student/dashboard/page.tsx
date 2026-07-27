import { auth } from '@/lib/auth/config'
import { connectDB } from '@/lib/db/connect'
import Student from '@/lib/db/models/Student'
import Subject from '@/lib/db/models/Subject'
import '@/lib/db/models/Badge' // ensure Badge schema is registered for populate
import StudentDashboardClient from './StudentDashboardClient'

export default async function StudentDashboardPage() {
  const [session] = await Promise.all([auth(), connectDB()])
  if (!session?.user?.id) return null

  const [student, subjects] = await Promise.all([
    Student.findOne({ userId: session.user.id })
      .populate('badges', 'name emoji rarity')
      .lean(),
    Subject.find({ isActive: true })
      .sort({ order: 1 })
      .limit(9)
      .lean(),
  ])

  // Calculate daily tasks
  const dailyTasks = [
    { id: '1', title: 'Complete 3 lessons', emoji: '📚', reward: 30, current: 1, target: 3 },
    { id: '2', title: 'Score 80%+ on a quiz', emoji: '🎯', reward: 50, current: 0, target: 1 },
    { id: '3', title: 'Login streak', emoji: '🔥', reward: 20, current: 1, target: 1 },
  ]

  return (
    <StudentDashboardClient
      student={JSON.parse(JSON.stringify(student))}
      subjects={JSON.parse(JSON.stringify(subjects))}
      dailyTasks={dailyTasks}
      userName={session.user.displayName || session.user.name || 'Explorer'}
    />
  )
}
