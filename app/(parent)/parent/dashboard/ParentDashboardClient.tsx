'use client'

import { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  Users, CreditCard, Plus, Eye, Flame, Clock, Loader2, Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn, getSubjectIcon, getSubjectColor, percentOf } from '@/lib/utils'
import { toast } from 'sonner'
import type { SubjectSlug } from '@/types'

export interface ChildData {
  id: string
  displayName: string
  grade: number
  ageGroup: string
  level: number
  xp: number
  streakDays: number
  coins: number
  avatar: string
  subjectProgress: Array<{
    subjectSlug: SubjectSlug
    completedLessons: number
    totalLessons: number
    masteryLevel: number
  }>
  totalLessonsCompleted: number
  totalTimeSpent: number // minutes
  weeklyActivity: number[] // minutes per day for last 7 days (Mon..Sun)
  lastActive: string
  isPremium: boolean
}

export interface SubscriptionData {
  plan: string
  status: string
  nextBilling: string | null
  amount: string
  maxChildren: number
  usedChildren: number
  isSubscribed: boolean
}

interface Props {
  parentName: string
  childrenList: ChildData[]
  subscription: SubscriptionData
}

const AVATARS = ['🦊', '🐼', '🦁', '🐯', '🦄', '🚀', '🌈', '🐬']

export default function ParentDashboardClient({ parentName, childrenList, subscription }: Props) {
  const router = useRouter()
  const { update } = useSession()
  const [children, setChildren] = useState(childrenList)
  const [adding, setAdding] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectingChildId, setSelectingChildId] = useState<string | null>(null)
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0])

  const totalLessons = children.reduce((s, c) => s + c.totalLessonsCompleted, 0)
  const totalHours = Math.floor(children.reduce((s, c) => s + c.totalTimeSpent, 0) / 60)
  const totalStreaks = children.reduce((s, c) => s + c.streakDays, 0)

  async function viewAsChild(childId: string) {
    setSelectingChildId(childId)
    try {
      await update({ activeChildId: childId })
      router.push('/student/dashboard')
    } catch {
      toast.error('Failed to switch to child profile')
      setSelectingChildId(null)
    }
  }

  async function handleAddChild(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    const form = new FormData(e.currentTarget)
    const payload = {
      name: form.get('name'),
      avatar: selectedAvatar,
      grade: Number(form.get('grade')),
      ageGroup: form.get('ageGroup'),
    }

    try {
      const res = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to create child profile')
        return
      }
      toast.success('Child profile created successfully!')
      setAdding(false)
      router.refresh()
    } catch {
      toast.error('Network error creating child profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold mb-1">Parent Dashboard 👨‍👩‍👧</h1>
        <p className="text-muted-foreground">
          Welcome back, {parentName}. Monitor your children&apos;s learning progress and activity.
        </p>
      </motion.div>

      {/* Summary stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { icon: '👦', label: 'Children', value: children.length, color: 'from-purple-500 to-purple-600' },
          { icon: '📚', label: 'Lessons Completed', value: totalLessons, color: 'from-blue-500 to-blue-600' },
          { icon: '⏱️', label: 'Total Learning Time', value: `${totalHours}h`, color: 'from-green-500 to-green-600' },
          { icon: '🔥', label: 'Active Streaks', value: totalStreaks, color: 'from-orange-500 to-red-500' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className={cn('rounded-3xl p-5 text-white bg-gradient-to-br shadow-sm', stat.color)}
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="font-display font-bold text-2xl">{stat.value}</div>
            <div className="text-white/80 text-xs font-semibold">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Children Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            My Children
          </h2>
          <Button size="sm" onClick={() => setAdding(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Add Child
          </Button>
        </div>

        {children.length === 0 ? (
          <div className="card-kid p-8 text-center bg-white border border-gray-100 rounded-3xl space-y-4">
            <div className="w-16 h-16 bg-purple-50 text-3xl rounded-full flex items-center justify-center mx-auto">
              👶
            </div>
            <h3 className="font-display font-bold text-xl">No children profiles yet</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Create a profile for your child to start exploring lessons, earning XP, and building learning streaks.
            </p>
            <Button onClick={() => setAdding(true)} className="gap-2">
              <Plus className="w-4 h-4" /> Create First Child Profile
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {children.map((child, i) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.15 }}
                className="card-kid overflow-hidden border border-gray-100 rounded-3xl bg-white shadow-sm"
              >
                {/* Child header */}
                <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl border-2 border-purple-200 bg-white flex items-center justify-center text-3xl shadow-sm">
                        {child.avatar.startsWith('http') ? (
                          <img
                            src={child.avatar}
                            alt={child.displayName}
                            className="w-full h-full rounded-2xl object-cover"
                          />
                        ) : (
                          child.avatar
                        )}
                      </div>
                      <div className="level-badge absolute -bottom-1 -right-1 w-6 h-6 text-xs flex items-center justify-center bg-primary text-white rounded-full font-bold shadow">
                        {child.level}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-lg">{child.displayName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {child.grade === 0 ? 'Preschool' : `Year ${child.grade}`} • {child.xp.toLocaleString()} XP
                      </p>
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
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => viewAsChild(child.id)}
                      disabled={selectingChildId === child.id}
                      className="gap-1.5 rounded-xl border-purple-200 hover:bg-purple-100/50"
                    >
                      {selectingChildId === child.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                      <span>View</span>
                    </Button>
                  </div>
                </div>

                {/* Subject progress */}
                <div className="p-5">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
                    Subject Progress
                  </p>
                  {child.subjectProgress.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-2">No subjects started yet.</p>
                  ) : (
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
                  )}

                  {/* Weekly activity mini chart */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
                      Weekly Activity (min)
                    </p>
                    <div className="flex items-end gap-1.5 h-12">
                      {child.weeklyActivity.map((mins, day) => {
                        const maxMin = Math.max(...child.weeklyActivity, 60)
                        const heightPct = Math.min(Math.round((mins / maxMin) * 100), 100)
                        return (
                          <div key={day} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${heightPct}%` }}
                              transition={{ delay: 0.7 + day * 0.05, duration: 0.5 }}
                              className={cn(
                                'w-full rounded-t transition-all',
                                mins > 0 ? 'bg-primary' : 'bg-gray-100'
                              )}
                              style={{ minHeight: '4px' }}
                              title={`${mins} mins`}
                            />
                            <span className="text-[10px] text-muted-foreground font-medium">
                              {['M', 'T', 'W', 'T', 'F', 'S', 'S'][day]}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Subscription info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card-kid p-6 border border-gray-100 rounded-3xl bg-white shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Subscription & Family Plan
          </h2>
          <Link href="/parent/subscription">
            <Button size="sm" variant="outline">
              Manage
            </Button>
          </Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
            <div className="flex items-center gap-2 mb-1">
              <div
                className={cn(
                  'w-2 h-2 rounded-full',
                  subscription.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                )}
              />
              <span className="text-xs font-bold text-green-700 uppercase">
                {subscription.status}
              </span>
            </div>
            <p className="font-display font-bold text-lg">{subscription.plan}</p>
            <p className="text-sm text-muted-foreground">{subscription.amount}</p>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
            <p className="text-xs font-bold text-blue-700 uppercase mb-1">Next Billing</p>
            <p className="font-bold">
              {subscription.nextBilling
                ? new Date(subscription.nextBilling).toLocaleDateString('en-MY', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : 'Free Tier (No renewal)'}
            </p>
          </div>
          <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
            <p className="text-xs font-bold text-purple-700 uppercase mb-1">Children Slots</p>
            <p className="font-bold">
              {children.length} / {subscription.maxChildren} used
            </p>
            <div className="h-1.5 bg-purple-200/50 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{
                  width: `${Math.min((children.length / subscription.maxChildren) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Add Child Modal */}
      {adding && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <form
            onSubmit={handleAddChild}
            className="w-full max-w-md space-y-4 rounded-3xl bg-white p-6 text-left shadow-2xl border"
          >
            <div>
              <h2 className="font-display text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Add Child Profile
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                This child profile will be managed directly from your parent account.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Name</label>
                <Input
                  name="name"
                  placeholder="Child's display name"
                  required
                  maxLength={50}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Grade / Year</label>
                <select
                  name="grade"
                  defaultValue="1"
                  className="w-full mt-1 rounded-xl border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="0">Preschool</option>
                  {[1, 2, 3, 4, 5, 6].map((grade) => (
                    <option key={grade} value={grade}>
                      Year {grade}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Age Group</label>
                <select
                  name="ageGroup"
                  defaultValue="lower_primary"
                  className="w-full mt-1 rounded-xl border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="toddler">Little Ones (1-3 yrs)</option>
                  <option value="preschool">Preschool (4-6 yrs)</option>
                  <option value="lower_primary">Lower Primary (7-9 yrs)</option>
                  <option value="upper_primary">Upper Primary (10-12 yrs)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block">
                  Choose Avatar Emoji
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVATARS.map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setSelectedAvatar(item)}
                      className={cn(
                        'grid h-11 w-11 place-items-center rounded-xl text-2xl transition-all',
                        selectedAvatar === item
                          ? 'bg-purple-100 ring-2 ring-primary scale-105'
                          : 'bg-gray-100 hover:bg-gray-200'
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAdding(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Profile
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
