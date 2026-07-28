import Link from 'next/link'
import { Types } from 'mongoose'
import { Plus, ChevronRight } from 'lucide-react'
import { auth } from '@/lib/auth/config'
import { connectDB } from '@/lib/db/connect'
import { Class, Student, Progress, Assignment } from '@/lib/db/models'
import { Button } from '@/components/ui/button'

export default async function TeacherDashboard() {
  const [session] = await Promise.all([auth(), connectDB()])
  if (!session?.user) return null

  const classes = await Class.find({ teacherId: session.user.id, isActive: true })
    .select('name grade studentIds')
    .sort({ createdAt: -1 })
    .lean() as any[]

  const studentIdSet = new Set<string>()
  for (const c of classes) {
    for (const sid of c.studentIds ?? []) studentIdSet.add(sid.toString())
  }
  const studentIds = [...studentIdSet].map((id) => new Types.ObjectId(id))

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const [students, completionsToday, assignmentCount] = await Promise.all([
    studentIds.length > 0
      ? Student.find({ _id: { $in: studentIds } })
          .select('displayName level xp streakDays subjectProgress')
          .sort({ xp: -1 })
          .lean() as unknown as any[]
      : Promise.resolve([]),
    studentIds.length > 0
      ? Progress.countDocuments({
          studentId: { $in: studentIds },
          status: 'completed',
          completedAt: { $gte: todayStart },
        })
      : Promise.resolve(0),
    Assignment.countDocuments({ teacherId: session.user.id, isActive: true }),
  ])

  const stats = [
    { icon: '👦', label: 'Students', value: students.length, color: 'from-purple-500 to-purple-600' },
    { icon: '🏫', label: 'Classes', value: classes.length, color: 'from-blue-500 to-blue-600' },
    { icon: '📝', label: 'Assignments', value: assignmentCount, color: 'from-green-500 to-green-600' },
    { icon: '✅', label: 'Completions Today', value: completionsToday, color: 'from-orange-400 to-amber-600' },
  ]

  const topStudents = students.slice(0, 6)

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1">Teacher Dashboard 👩‍🏫</h1>
          <p className="text-muted-foreground">Welcome back, {session.user.name?.split(' ')[0] ?? 'Teacher'}!</p>
        </div>
        <Link href="/teacher/quizzes/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Create Quiz
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`rounded-3xl p-5 text-white bg-gradient-to-br ${stat.color}`}>
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="font-display font-bold text-2xl">{stat.value}</div>
            <div className="text-white/70 text-xs font-semibold">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Student list */}
        <div className="lg:col-span-2 card-kid p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold">Your Students</h2>
            <Link href="/teacher/classes">
              <Button size="sm" variant="outline" className="gap-1">
                Manage Classes <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {topStudents.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-2">🏫</div>
              <p className="font-display font-bold">No students yet</p>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Create a class and add students by their account email.
              </p>
              <Link href="/teacher/classes">
                <Button size="sm" className="gap-1.5">
                  <Plus className="w-4 h-4" /> Create a class
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {topStudents.map((student) => {
                const lessonsCompleted = (student.subjectProgress ?? []).reduce(
                  (sum: number, p: { completedLessons?: number }) => sum + (p.completedLessons ?? 0), 0
                )
                return (
                  <div
                    key={student._id.toString()}
                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-muted/50 transition-colors"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(student.displayName)}`}
                      alt={student.displayName}
                      className="w-9 h-9 rounded-xl"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{student.displayName}</p>
                      <p className="text-xs text-muted-foreground">
                        📚 {lessonsCompleted} lessons · 🔥 {student.streakDays}d streak
                      </p>
                    </div>
                    <span className="text-sm font-bold text-purple-600">⚡ {student.xp.toLocaleString()}</span>
                    <div className="level-badge w-7 h-7 text-xs">{student.level}</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <div className="card-kid p-5">
            <h3 className="font-display font-bold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { icon: '🧩', label: 'Create a Quiz', href: '/teacher/quizzes/new' },
                { icon: '📚', label: 'Manage My Quizzes', href: '/teacher/quizzes' },
                { icon: '🏫', label: 'My Classes', href: '/teacher/classes' },
                { icon: '📝', label: 'Assignments', href: '/teacher/assignments' },
                { icon: '📊', label: 'View Analytics', href: '/teacher/analytics' },
              ].map(action => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted transition-colors cursor-pointer"
                >
                  <span className="text-xl">{action.icon}</span>
                  <span className="font-semibold text-sm">{action.label}</span>
                  <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>

          {/* Classes summary */}
          <div className="card-kid p-5">
            <h3 className="font-display font-bold mb-3">Your Classes 🏫</h3>
            {classes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No classes yet.</p>
            ) : (
              <div className="space-y-2">
                {classes.slice(0, 4).map((c) => (
                  <Link key={c._id.toString()} href={`/teacher/classes/${c._id}`}>
                    <div className="flex items-center gap-2 p-2 rounded-xl hover:bg-muted transition-colors">
                      <span className="text-lg">🎓</span>
                      <span className="text-sm font-semibold flex-1 truncate">{c.name}</span>
                      <span className="text-xs text-muted-foreground">{c.studentIds?.length ?? 0} 👦</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
