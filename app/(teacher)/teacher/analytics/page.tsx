import Link from 'next/link'
import { Types } from 'mongoose'
import { auth } from '@/lib/auth/config'
import { connectDB } from '@/lib/db/connect'
import { Class, Student, Progress, Lesson } from '@/lib/db/models'
import { getSubjectIcon, percentOf } from '@/lib/utils'
import type { SubjectSlug } from '@/types'

export default async function TeacherAnalyticsPage() {
  const [session] = await Promise.all([auth(), connectDB()])
  if (!session?.user) return null

  const classes = await Class.find({ teacherId: session.user.id, isActive: true })
    .select('name studentIds')
    .lean() as any[]

  const studentIdSet = new Set<string>()
  for (const c of classes) {
    for (const sid of c.studentIds ?? []) studentIdSet.add(sid.toString())
  }
  const studentIds = [...studentIdSet].map((id) => new Types.ObjectId(id))

  if (studentIds.length === 0) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
        <h1 className="font-display text-3xl font-bold mb-1">Analytics 📊</h1>
        <p className="text-muted-foreground mb-8">Insights across your classes</p>
        <div className="text-center py-16 card-kid">
          <div className="text-5xl mb-3">📊</div>
          <p className="font-display text-xl font-bold">No data yet</p>
          <p className="text-muted-foreground text-sm mt-1">
            Analytics appear once you{' '}
            <Link href="/teacher/classes" className="text-primary font-bold underline">create a class</Link>{' '}
            and add students to it.
          </p>
        </div>
      </div>
    )
  }

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const [students, overall, weekCompletions, perLesson] = await Promise.all([
    Student.find({ _id: { $in: studentIds } })
      .select('displayName level xp streakDays subjectProgress')
      .sort({ xp: -1 })
      .lean() as unknown as any[],
    Progress.aggregate([
      { $match: { studentId: { $in: studentIds }, status: 'completed' } },
      { $group: { _id: null, count: { $sum: 1 }, avgScore: { $avg: '$score' } } },
    ]),
    Progress.countDocuments({
      studentId: { $in: studentIds },
      status: 'completed',
      completedAt: { $gte: weekAgo },
    }),
    Progress.aggregate([
      { $match: { studentId: { $in: studentIds }, status: 'completed' } },
      { $group: { _id: '$lessonId', completions: { $sum: 1 }, avgScore: { $avg: '$score' } } },
      { $sort: { completions: -1 } },
      { $limit: 10 },
    ]),
  ])

  const lessonDocs = await Lesson.find({ _id: { $in: perLesson.map((p) => p._id) } })
    .select('title subjectSlug')
    .lean() as any[]
  const lessonMap = new Map(lessonDocs.map((l) => [l._id.toString(), l]))

  const totalCompletions = overall[0]?.count ?? 0
  const avgScore = Math.round(overall[0]?.avgScore ?? 0)
  const topStudents = students.slice(0, 5)

  const stats = [
    { icon: '👦', label: 'Students', value: students.length, color: 'from-purple-500 to-purple-600' },
    { icon: '🏫', label: 'Classes', value: classes.length, color: 'from-blue-500 to-blue-600' },
    { icon: '✅', label: 'Total Completions', value: totalCompletions, color: 'from-green-500 to-green-600' },
    { icon: '🎯', label: 'Average Score', value: `${avgScore}%`, color: 'from-orange-400 to-amber-500' },
  ]

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold mb-1">Analytics 📊</h1>
        <p className="text-muted-foreground">
          Insights across your classes · {weekCompletions} completion{weekCompletions === 1 ? '' : 's'} in the last 7 days
        </p>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`rounded-3xl p-5 text-white bg-gradient-to-br ${stat.color}`}>
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="font-display font-bold text-2xl">{stat.value}</div>
            <div className="text-white/70 text-xs font-semibold">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quiz performance */}
        <div className="card-kid p-6">
          <h2 className="font-display text-lg font-bold mb-4">Quiz Performance 🧩</h2>
          {perLesson.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No quizzes completed yet — assign one to get data here.
            </p>
          ) : (
            <div className="space-y-3">
              {perLesson.map((p) => {
                const lesson = lessonMap.get(p._id.toString())
                const score = Math.round(p.avgScore)
                return (
                  <div key={p._id.toString()} className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold truncate">
                        {lesson ? `${getSubjectIcon(lesson.subjectSlug as SubjectSlug)} ${lesson.title}` : 'Deleted quiz'}
                      </span>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {p.completions}× · avg {score}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-400'}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Top students */}
        <div className="card-kid p-6">
          <h2 className="font-display text-lg font-bold mb-4">Top Students 🏆</h2>
          <div className="space-y-2">
            {topStudents.map((s, i) => {
              const lessonsCompleted = (s.subjectProgress ?? []).reduce(
                (sum: number, p: { completedLessons?: number }) => sum + (p.completedLessons ?? 0), 0
              )
              return (
                <div key={s._id.toString()} className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-muted/50">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-amber-600' : 'bg-purple-300'
                  }`}>
                    {i + 1}
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(s.displayName)}`}
                    alt={s.displayName}
                    className="w-9 h-9 rounded-xl"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{s.displayName}</p>
                    <p className="text-xs text-muted-foreground">
                      Level {s.level} · {lessonsCompleted} lessons · 🔥 {s.streakDays}d
                    </p>
                  </div>
                  <span className="font-bold text-sm text-purple-600">⚡ {s.xp.toLocaleString()}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Per-class summary */}
      <div className="card-kid p-6">
        <h2 className="font-display text-lg font-bold mb-4">Classes 🏫</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((c) => {
            const classStudents = students.filter((s) =>
              (c.studentIds ?? []).some((sid: any) => sid.toString() === s._id.toString())
            )
            const avgXP = classStudents.length > 0
              ? Math.round(classStudents.reduce((sum, s) => sum + (s.xp ?? 0), 0) / classStudents.length)
              : 0
            return (
              <Link key={c._id.toString()} href={`/teacher/classes/${c._id}`}>
                <div className="rounded-2xl border-2 border-gray-100 hover:border-primary/40 p-4 transition-colors cursor-pointer">
                  <p className="font-display font-bold truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {classStudents.length} students · avg ⚡ {avgXP.toLocaleString()} XP
                  </p>
                  <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${percentOf(classStudents.length, Math.max(students.length, 1))}%` }}
                    />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
