import { getActiveChild } from '@/lib/auth/active-child'
import { connectDB } from '@/lib/db/connect'
import Student from '@/lib/db/models/Student'
import LeaderboardClient from './LeaderboardClient'
import type { LeaderboardEntry } from '@/types'

export default async function LeaderboardPage() {
  const [activeChild] = await Promise.all([getActiveChild(), connectDB()])
  if (!activeChild) return null
  // Load the top students server-side and pass them to the client for period-based filtering.
  const students = await Student.find({ isActive: { $ne: false } }).sort({ xp: -1, level: -1 }).limit(20).lean() as any[]
  const entries: LeaderboardEntry[] = students.map((student, index) => ({ rank: index + 1, studentId: student._id.toString(), displayName: student.displayName, avatar: student.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${student.displayName}`, xp: student.xp, level: student.level }))
  return <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto"><div className="mb-8"><h1 className="font-display text-3xl font-bold mb-2">🏆 Leaderboard</h1><p className="text-muted-foreground">Top learners by the selected period</p></div><LeaderboardClient initialEntries={entries} currentUserId={activeChild._id.toString()} /></div>
}
