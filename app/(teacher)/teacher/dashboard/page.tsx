'use client'

import { motion } from 'framer-motion'
import { Users, BookOpen, BarChart3, Award, TrendingUp, Clock, Plus, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn, getSubjectIcon, percentOf } from '@/lib/utils'

const MOCK_CLASS = {
  name: 'Year 3 Bestari',
  students: 28,
  avgProgress: 64,
  activeLessons: 5,
}

const MOCK_STUDENTS = [
  { name: 'Ahmad Arif', level: 8, xp: 2450, progress: 72, lastActive: '1h ago', status: 'active' },
  { name: 'Nurul Aina', level: 9, xp: 2900, progress: 85, lastActive: '2h ago', status: 'active' },
  { name: 'Wei Xuan', level: 7, xp: 1900, progress: 58, lastActive: '3h ago', status: 'active' },
  { name: 'Priya Kumar', level: 10, xp: 3200, progress: 91, lastActive: 'Yesterday', status: 'inactive' },
  { name: 'Danish Hariz', level: 6, xp: 1500, progress: 45, lastActive: '5h ago', status: 'active' },
  { name: 'Zara Alif', level: 8, xp: 2100, progress: 67, lastActive: '1d ago', status: 'inactive' },
]

export default function TeacherDashboard() {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1">Teacher Dashboard 👩‍🏫</h1>
          <p className="text-muted-foreground">Manage your class and track student progress</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Add Assignment
        </Button>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { icon: '👦', label: 'Students', value: MOCK_CLASS.students, color: 'from-purple-500 to-purple-600' },
          { icon: '📊', label: 'Avg Progress', value: `${MOCK_CLASS.avgProgress}%`, color: 'from-blue-500 to-blue-600' },
          { icon: '📝', label: 'Active Lessons', value: MOCK_CLASS.activeLessons, color: 'from-green-500 to-green-600' },
          { icon: '✅', label: 'Completions Today', value: 47, color: 'from-orange-500 to-amber-600' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className={cn('rounded-3xl p-5 text-white bg-gradient-to-br', stat.color)}
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="font-display font-bold text-2xl">{stat.value}</div>
            <div className="text-white/70 text-xs font-semibold">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Student list */}
        <div className="lg:col-span-2 card-kid p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold">Class: {MOCK_CLASS.name}</h2>
            <Button size="sm" variant="outline" className="gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {MOCK_STUDENTS.map((student, i) => (
              <motion.div
                key={student.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-muted/50 transition-colors"
              >
                <img
                  src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${student.name}`}
                  alt={student.name}
                  className="w-9 h-9 rounded-xl"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm truncate">{student.name}</p>
                    <div className={cn(
                      'w-1.5 h-1.5 rounded-full',
                      student.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                    )} />
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 max-w-[100px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{student.progress}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="level-badge w-7 h-7 text-xs">{student.level}</div>
                  <p className="text-[10px] text-muted-foreground mt-1">{student.lastActive}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick actions & performance */}
        <div className="space-y-4">
          <div className="card-kid p-5">
            <h3 className="font-display font-bold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { icon: '📝', label: 'Create Assignment', href: '#' },
                { icon: '📊', label: 'View Analytics', href: '#' },
                { icon: '📤', label: 'Export Report', href: '#' },
                { icon: '💬', label: 'Message Parents', href: '#' },
              ].map(action => (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted transition-colors cursor-pointer"
                >
                  <span className="text-xl">{action.icon}</span>
                  <span className="font-semibold text-sm">{action.label}</span>
                  <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>

          <div className="card-kid p-5">
            <h3 className="font-display font-bold mb-3">Top Performers 🏆</h3>
            <div className="space-y-2">
              {MOCK_STUDENTS.sort((a, b) => b.progress - a.progress).slice(0, 3).map((s, i) => (
                <div key={s.name} className="flex items-center gap-2">
                  <span className={cn('w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white', i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : 'rank-3')}>
                    {i + 1}
                  </span>
                  <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${s.name}`} className="w-7 h-7 rounded-lg" alt={s.name} />
                  <span className="text-sm font-semibold flex-1 truncate">{s.name}</span>
                  <span className="text-sm font-bold text-primary">{s.progress}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
