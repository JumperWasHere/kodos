'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Users, TrendingUp, BookOpen, CreditCard, ChevronRight,
  Star, Flame, Clock, BarChart3, Plus, Eye
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { cn, getSubjectIcon, getSubjectColor, percentOf } from '@/lib/utils'
import type { SubjectSlug } from '@/types'

// Mock data for demo
const MOCK_CHILDREN = [
  {
    id: 'c1',
    displayName: 'Arif',
    grade: 3,
    ageGroup: 'lower_primary',
    level: 8,
    xp: 2450,
    streakDays: 7,
    coins: 850,
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=arif',
    subjectProgress: [
      { subjectSlug: 'mathematics' as SubjectSlug, completedLessons: 24, totalLessons: 120, masteryLevel: 20 },
      { subjectSlug: 'english' as SubjectSlug, completedLessons: 18, totalLessons: 100, masteryLevel: 18 },
      { subjectSlug: 'science' as SubjectSlug, completedLessons: 10, totalLessons: 80, masteryLevel: 12 },
    ],
    totalTimeSpent: 840,
    weeklyActivity: [45, 30, 60, 0, 50, 75, 40],
    lastActive: 'Today, 4:30 PM',
    isPremium: true,
  },
  {
    id: 'c2',
    displayName: 'Alya',
    grade: 1,
    ageGroup: 'preschool',
    level: 3,
    xp: 450,
    streakDays: 2,
    coins: 320,
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=alya',
    subjectProgress: [
      { subjectSlug: 'mathematics' as SubjectSlug, completedLessons: 5, totalLessons: 120, masteryLevel: 4 },
      { subjectSlug: 'english' as SubjectSlug, completedLessons: 6, totalLessons: 100, masteryLevel: 6 },
    ],
    totalTimeSpent: 180,
    weeklyActivity: [20, 0, 15, 30, 0, 25, 10],
    lastActive: 'Yesterday, 7:00 PM',
    isPremium: true,
  },
]

const SUBSCRIPTION = {
  plan: 'Family Plan',
  status: 'active',
  nextBilling: '2025-02-01',
  amount: 'RM 299/year',
  children: 5,
  usedChildren: 2,
}

export default function ParentDashboard() {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold mb-1">Parent Dashboard 👨‍👩‍👧</h1>
        <p className="text-muted-foreground">Monitor your children&apos;s learning progress</p>
      </motion.div>

      {/* Summary stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { icon: '👦', label: 'Children', value: MOCK_CHILDREN.length, color: 'from-purple-500 to-purple-600' },
          { icon: '📚', label: 'Lessons Completed', value: MOCK_CHILDREN.reduce((s, c) => s + c.subjectProgress.reduce((a, p) => a + p.completedLessons, 0), 0), color: 'from-blue-500 to-blue-600' },
          { icon: '⏱️', label: 'Total Hours', value: `${Math.floor(MOCK_CHILDREN.reduce((s, c) => s + c.totalTimeSpent, 0) / 60)}h`, color: 'from-green-500 to-green-600' },
          { icon: '🔥', label: 'Active Streaks', value: MOCK_CHILDREN.reduce((s, c) => s + c.streakDays, 0), color: 'from-orange-500 to-red-500' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className={cn('rounded-3xl p-5 text-white bg-gradient-to-br', stat.color)}
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="font-display font-bold text-2xl">{stat.value}</div>
            <div className="text-white/70 text-xs font-semibold">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Children cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            My Children
          </h2>
          <Button size="sm" variant="outline" className="gap-2">
            <Plus className="w-4 h-4" /> Add Child
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {MOCK_CHILDREN.map((child, i) => (
            <motion.div
              key={child.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.15 }}
              className="card-kid overflow-hidden"
            >
              {/* Child header */}
              <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 border-b">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={child.avatar}
                      alt={child.displayName}
                      className="w-14 h-14 rounded-2xl border-2 border-purple-200"
                    />
                    <div className="level-badge absolute -bottom-1 -right-1 w-6 h-6 text-xs">
                      {child.level}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-lg">{child.displayName}</h3>
                    <p className="text-sm text-muted-foreground">Year {child.grade} • {child.xp.toLocaleString()} XP</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-orange-500 text-xs font-bold">
                        <Flame className="w-3 h-3" /> {child.streakDays} days
                      </span>
                      <span className="flex items-center gap-1 text-yellow-600 text-xs font-bold">
                        🪙 {child.coins}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground text-xs">
                        <Clock className="w-3 h-3" /> {child.lastActive}
                      </span>
                    </div>
                  </div>
                  <Link href={`/parent/children/${child.id}`}>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Eye className="w-3.5 h-3.5" /> View
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Subject progress */}
              <div className="p-5">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Subject Progress</p>
                <div className="space-y-3">
                  {child.subjectProgress.map((prog) => {
                    const pct = percentOf(prog.completedLessons, prog.totalLessons)
                    const color = getSubjectColor(prog.subjectSlug)
                    return (
                      <div key={prog.subjectSlug} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1.5">
                            <span>{getSubjectIcon(prog.subjectSlug)}</span>
                            <span className="font-semibold capitalize">
                              {prog.subjectSlug.replace('-', ' ')}
                            </span>
                          </div>
                          <span className="text-muted-foreground font-bold">
                            {prog.completedLessons}/{prog.totalLessons}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: color }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Weekly activity mini chart */}
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Weekly Activity (min)</p>
                  <div className="flex items-end gap-1 h-10">
                    {child.weeklyActivity.map((mins, day) => (
                      <div key={day} className="flex-1 flex flex-col items-center gap-0.5">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(mins / 80) * 100}%` }}
                          transition={{ delay: 0.7 + day * 0.05, duration: 0.5 }}
                          className={cn('w-full rounded-t', mins > 0 ? 'bg-primary' : 'bg-gray-200')}
                          style={{ minHeight: '4px' }}
                        />
                        <span className="text-[9px] text-muted-foreground">
                          {['M', 'T', 'W', 'T', 'F', 'S', 'S'][day]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Subscription info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card-kid p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Subscription
          </h2>
          <Link href="/parent/subscription">
            <Button size="sm" variant="outline">Manage</Button>
          </Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs font-bold text-green-700 uppercase">Active</span>
            </div>
            <p className="font-display font-bold text-lg">{SUBSCRIPTION.plan}</p>
            <p className="text-sm text-muted-foreground">{SUBSCRIPTION.amount}</p>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4">
            <p className="text-xs font-bold text-blue-700 uppercase mb-1">Next Billing</p>
            <p className="font-bold">{new Date(SUBSCRIPTION.nextBilling).toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="bg-purple-50 rounded-2xl p-4">
            <p className="text-xs font-bold text-purple-700 uppercase mb-1">Children Slots</p>
            <p className="font-bold">{SUBSCRIPTION.usedChildren} / {SUBSCRIPTION.children} used</p>
            <div className="h-1.5 bg-gray-200 rounded-full mt-2">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{ width: `${(SUBSCRIPTION.usedChildren / SUBSCRIPTION.children) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
