import { auth } from '@/lib/auth/config'
import { connectDB } from '@/lib/db/connect'
import Student from '@/lib/db/models/Student'
import User from '@/lib/db/models/User'
import { Leaderboard } from '@/components/gamification/Leaderboard'
import type { LeaderboardEntry } from '@/types'

export default async function LeaderboardPage() {
  const session = await auth()
  await connectDB()

  // Get top 20 students
  const topStudents = await Student.find({})
    .sort({ xp: -1 })
    .limit(20)
    .populate('userId', 'name avatar')
    .lean() as any[]

  const entries: LeaderboardEntry[] = topStudents.map((s, i) => ({
    rank: i + 1,
    studentId: s._id.toString(),
    displayName: s.displayName,
    avatar: s.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${s.displayName}`,
    xp: s.xp,
    level: s.level,
  }))

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2 flex items-center gap-2">
          🏆 Leaderboard
        </h1>
        <p className="text-muted-foreground">Top learners this week</p>
      </div>

      {/* Period tabs */}
      <div className="flex gap-2 mb-6">
        {['Weekly', 'Monthly', 'All Time'].map((p) => (
          <button
            key={p}
            className="px-4 py-2 rounded-2xl text-sm font-bold bg-white border-2 border-gray-200 hover:border-primary hover:text-primary transition-colors first:border-primary first:text-primary first:bg-primary/5"
          >
            {p}
          </button>
        ))}
      </div>

      <div className="card-kid p-4">
        <Leaderboard
          entries={entries.length > 0 ? entries : getMockLeaderboard()}
          currentUserId={session?.user?.studentId}
        />
      </div>
    </div>
  )
}

function getMockLeaderboard(): LeaderboardEntry[] {
  return [
    { rank: 1, studentId: 's1', displayName: 'Arif', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=arif', xp: 4250, level: 12 },
    { rank: 2, studentId: 's2', displayName: 'Siti', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=siti', xp: 3800, level: 11 },
    { rank: 3, studentId: 's3', displayName: 'Wei Ming', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=weiming', xp: 3400, level: 10 },
    { rank: 4, studentId: 's4', displayName: 'Priya', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=priya', xp: 2900, level: 9 },
    { rank: 5, studentId: 's5', displayName: 'Danish', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=danish', xp: 2600, level: 9 },
    { rank: 6, studentId: 's6', displayName: 'Nurul', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=nurul', xp: 2400, level: 8 },
    { rank: 7, studentId: 's7', displayName: 'Zack', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=zack', xp: 2100, level: 8 },
    { rank: 8, studentId: 's8', displayName: 'Aina', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=aina', xp: 1950, level: 7 },
    { rank: 9, studentId: 's9', displayName: 'Hafiz', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=hafiz', xp: 1700, level: 7 },
    { rank: 10, studentId: 's10', displayName: 'Maya', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=maya', xp: 1500, level: 6 },
  ]
}
