'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Flame, Zap, Trophy, Star, ChevronRight, BookOpen,
  Target, Calendar, Crown, ArrowRight, PlayCircle
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { XPBar } from '@/components/gamification/XPBar'
import { StreakCounter, RewardCoins } from '@/components/gamification/StreakCounter'
import { useGamificationStore, getXPProgress } from '@/store/gamificationStore'
import {
  cn, getSubjectIcon, getSubjectGradient, getSubjectColor,
  formatXP, percentOf, MOTIVATION_MESSAGES, randomFrom
} from '@/lib/utils'
import type { SubjectSlug } from '@/types'
import { toast } from 'sonner'

interface SubjectProgress {
  subjectSlug: SubjectSlug
  completedLessons: number
  totalLessons: number
  xpEarned: number
  masteryLevel: number
  lastAccessedAt?: string
}

interface DailyTask {
  id: string
  title: string
  emoji: string
  reward: number
  current: number
  target: number
}

interface StudentAssignment {
  _id: string
  title: string
  lessonId: string
  subjectSlug: SubjectSlug
  dueDate: string | null
  completed: boolean
}

interface Props {
  student: {
    displayName: string
    level: number
    xp: number
    coins: number
    gems: number
    streakDays: number
    badges: Array<{ name: string; emoji: string; rarity: string }>
    subjectProgress: SubjectProgress[]
    avatar?: string
  } | null
  subjects: Array<{
    _id: string
    name: string
    slug: SubjectSlug
    icon: string
    gradient: string
    color: string
    totalLessons: number
    isPremium: boolean
  }>
  dailyTasks: DailyTask[]
  assignments?: StudentAssignment[]
  userName: string
  dailyRewardClaimed: boolean
}

const STAGGER = {
  container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } },
  item: { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } },
}

export default function StudentDashboardClient({ student, subjects, dailyTasks, assignments = [], userName, dailyRewardClaimed }: Props) {
  const { syncWithServer, addXP } = useGamificationStore()
  const motivationMsg = randomFrom(MOTIVATION_MESSAGES)
  // Keep the daily reward state local so the UI can reflect the claim immediately.
  const [rewardClaimed, setRewardClaimed] = useState(dailyRewardClaimed)
  const [claimingReward, setClaimingReward] = useState(false)

  // Claiming the daily reward is handled server-side so XP and coin updates stay consistent.
  const claimDailyReward = async () => {
    setClaimingReward(true)
    try {
      const response = await fetch('/api/gamification', { method: 'POST' })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error)
      setRewardClaimed(true)
      syncWithServer({ xp: (student?.xp ?? 0) + payload.data.xpReward, coins: (student?.coins ?? 0) + payload.data.coinReward })
      toast.success(`Daily reward claimed: +${payload.data.xpReward} XP and +${payload.data.coinReward} coins!`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to claim reward')
    } finally {
      setClaimingReward(false)
    }
  }

  // Sync the global gamification store whenever the student profile changes.
  useEffect(() => {
    if (student) {
      syncWithServer({
        xp: student.xp,
        level: student.level,
        coins: student.coins,
        gems: student.gems,
        streakDays: student.streakDays,
      })
    }
  }, [student])

  const level = student?.level ?? 1
  const xp = student?.xp ?? 0
  const coins = student?.coins ?? 0
  const streakDays = student?.streakDays ?? 0

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

      {/* ── Welcome Banner ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 p-6 text-white"
      >
        {/* Decorative blobs */}
        <div className="blob w-32 h-32 bg-purple-400 -top-8 -right-4" />
        <div className="blob w-20 h-20 bg-pink-300 -bottom-4 right-16" />

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/70 text-sm font-semibold mb-1"
            >
              {motivationMsg}
            </motion.p>
            <h1 className="font-display text-3xl font-bold mb-3">
              Hey, {userName}! 👋
            </h1>
            <Button size="sm" variant={rewardClaimed ? 'outline' : 'yellow'} className="mb-3" onClick={claimDailyReward} disabled={rewardClaimed || claimingReward}>
              {rewardClaimed ? '✓ Daily reward claimed' : claimingReward ? 'Claiming…' : '🎁 Claim daily reward'}
            </Button>

            {/* XP & Stats row */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                <div className="level-badge w-6 h-6 text-xs">{level}</div>
                <span className="text-sm font-bold">Level {level}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-bold">
                <Flame className="w-4 h-4 text-orange-300" />
                <span>{streakDays} day streak</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-bold">
                <span className="text-yellow-300">🪙</span>
                <span>{coins.toLocaleString()}</span>
              </div>
            </div>

            {/* XP Progress */}
            <div className="max-w-xs">
              <XPBar xp={xp} level={level} showLabels={false} compact={false} />
              <p className="text-white/60 text-xs mt-1">
                {formatXP(xp)} XP total
              </p>
            </div>
          </div>

          {/* Avatar */}
          <div className="hidden sm:block relative">
            <motion.img
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              src={student?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${userName}`}
              alt={userName}
              className="w-24 h-24 rounded-3xl border-4 border-white/30 object-cover"
            />
          </div>
        </div>
      </motion.div>

      {/* ── Stats Row ────────────────────────────────────── */}
      <motion.div
        variants={STAGGER.container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { icon: '⚡', label: 'Total XP', value: formatXP(xp), color: 'from-purple-500 to-purple-600' },
          { icon: '🔥', label: 'Day Streak', value: streakDays, color: 'from-orange-400 to-red-500' },
          { icon: '🪙', label: 'Coins', value: coins.toLocaleString(), color: 'from-yellow-400 to-amber-500' },
          { icon: '🏅', label: 'Badges', value: student?.badges?.length ?? 0, color: 'from-blue-500 to-indigo-600' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={STAGGER.item}
            className={cn('rounded-3xl p-5 text-white bg-gradient-to-br', stat.color)}
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="font-display font-bold text-2xl">{stat.value}</div>
            <div className="text-white/70 text-xs font-semibold mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Main Grid ────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Subjects (2/3 width) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">Your Subjects 📚</h2>
            <Link href="/student/subjects" className="text-sm text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {subjects.slice(0, 6).map((subject, i) => {
              const progress = student?.subjectProgress?.find(
                (p) => p.subjectSlug === subject.slug
              )
              const pct = percentOf(progress?.completedLessons ?? 0, subject.totalLessons)

              return (
                <motion.div
                  key={subject._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link href={`/student/subjects/${subject.slug}`}>
                    <div
                      className={cn(
                        'relative overflow-hidden rounded-3xl p-5 text-white cursor-pointer',
                        `bg-gradient-to-br ${getSubjectGradient(subject.slug as SubjectSlug)}`,
                        'shadow-lg hover:shadow-xl transition-shadow'
                      )}
                    >
                      {subject.isPremium && (
                        <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          ⭐ PRO
                        </div>
                      )}
                      <div className="text-3xl mb-2">{subject.icon || getSubjectIcon(subject.slug as SubjectSlug)}</div>
                      <h3 className="font-display font-bold text-sm leading-tight mb-2">
                        {subject.name}
                      </h3>

                      {/* Progress bar */}
                      <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.5 + i * 0.07, duration: 1 }}
                          className="h-full bg-white rounded-full"
                        />
                      </div>
                      <p className="text-white/70 text-[10px] mt-1">
                        {progress?.completedLessons ?? 0}/{subject.totalLessons} lessons
                      </p>

                      {/* Decorative circle */}
                      <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full" />
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Right column: Daily Tasks + Recent Badges */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          {/* Homework from teachers */}
          {assignments.length > 0 && (
            <div className="card-kid p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-display font-bold">My Homework 📝</h3>
              </div>
              <div className="space-y-2">
                {assignments.slice(0, 5).map((a) => {
                  const overdue = !a.completed && a.dueDate && new Date(a.dueDate) < new Date()
                  return (
                    <Link key={a._id} href={`/student/subjects/${a.subjectSlug}/${a.lessonId}`}>
                      <div className={cn(
                        'flex items-center gap-3 p-3 rounded-2xl transition-colors',
                        a.completed ? 'bg-green-50 border border-green-200' : 'bg-blue-50 hover:bg-blue-100 border border-blue-100'
                      )}>
                        <span className="text-xl">{a.completed ? '✅' : getSubjectIcon(a.subjectSlug)}</span>
                        <div className="flex-1 min-w-0">
                          <p className={cn('text-sm font-semibold truncate', a.completed && 'line-through text-muted-foreground')}>
                            {a.title}
                          </p>
                          {a.dueDate && !a.completed && (
                            <p className={cn('text-[10px] font-bold', overdue ? 'text-red-500' : 'text-muted-foreground')}>
                              Due {new Date(a.dueDate).toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })}
                              {overdue && ' — hurry!'}
                            </p>
                          )}
                        </div>
                        {!a.completed && <PlayCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Daily Tasks */}
          <div className="card-kid p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-display font-bold">Daily Tasks</h3>
            </div>
            <div className="space-y-3">
              {dailyTasks.map((task) => {
                const done = task.current >= task.target
                return (
                  <div
                    key={task.id}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-2xl',
                      done ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                    )}
                  >
                    <div className="text-xl">{task.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-sm font-semibold', done && 'line-through text-muted-foreground')}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all"
                            style={{ width: `${percentOf(task.current, task.target)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-bold">
                          {task.current}/{task.target}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 text-yellow-600 text-xs font-bold">
                      🪙{task.reward}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent Badges */}
          <div className="card-kid p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-display font-bold">My Badges</h3>
              </div>
              <Link href="/student/achievements" className="text-xs text-primary font-bold">
                View all
              </Link>
            </div>
            {student?.badges && student.badges.length > 0 ? (
              <div className="grid grid-cols-4 gap-2">
                {student.badges.slice(0, 8).map((badge, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.08, type: 'spring' }}
                    className={cn(
                      'w-12 h-12 rounded-2xl flex items-center justify-center text-2xl cursor-pointer',
                      badge.rarity === 'legendary' && 'badge-legendary',
                      badge.rarity === 'epic' && 'badge-epic',
                      badge.rarity === 'rare' && 'badge-rare',
                      badge.rarity === 'common' && 'badge-common'
                    )}
                    title={badge.name}
                  >
                    {badge.emoji || '🏅'}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="text-4xl mb-2">🏅</div>
                <p className="text-sm text-muted-foreground">Complete lessons to earn badges!</p>
              </div>
            )}
          </div>

          {/* Quick Play CTA */}
          <Link href="/student/subjects">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="card-kid p-5 bg-gradient-to-br from-purple-600 to-pink-600 text-white cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <PlayCircle className="w-8 h-8 text-yellow-300" />
                <div>
                  <p className="font-display font-bold">Continue Learning</p>
                  <p className="text-white/70 text-xs">Pick up where you left off!</p>
                </div>
                <ArrowRight className="w-5 h-5 ml-auto" />
              </div>
            </motion.div>
          </Link>
        </motion.div>
      </div>

      {/* ── Subject Progress Chart ────────────────────────── */}
      {student?.subjectProgress && student.subjectProgress.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card-kid p-6"
        >
          <h2 className="font-display text-xl font-bold mb-5 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Subject Progress
          </h2>
          <div className="space-y-4">
            {student.subjectProgress.map((prog) => {
              const subject = subjects.find(s => s.slug === prog.subjectSlug)
              const pct = percentOf(prog.completedLessons, prog.totalLessons || 1)
              const color = getSubjectColor(prog.subjectSlug)
              return (
                <div key={prog.subjectSlug} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getSubjectIcon(prog.subjectSlug)}</span>
                      <span className="font-semibold text-sm">{subject?.name ?? prog.subjectSlug}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="font-bold text-foreground">{pct}%</span>
                      <span>{prog.completedLessons}/{prog.totalLessons} lessons</span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: 0.8 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}
    </div>
  )
}
