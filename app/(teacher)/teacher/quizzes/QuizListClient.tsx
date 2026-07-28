'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn, getAgeGroupLabel } from '@/lib/utils'
import type { AgeGroup } from '@/types'

interface QuizRow {
  _id: string
  title: string
  subjectSlug: string
  ageGroup: AgeGroup
  grade: number[]
  type: string
  difficulty: string
  duration: number
  xpReward: number
  coinReward: number
  isPremium: boolean
  isActive: boolean
  isMine: boolean
  questionCount: number
  updatedAt: string
}

interface Props {
  subjects: Array<{ slug: string; name: string; icon: string }>
}

const AGE_BADGE: Record<AgeGroup, string> = {
  toddler: 'bg-rose-100 text-rose-700',
  preschool: 'bg-pink-100 text-pink-700',
  lower_primary: 'bg-sky-100 text-sky-700',
  upper_primary: 'bg-indigo-100 text-indigo-700',
}

export default function QuizListClient({ subjects }: Props) {
  const [quizzes, setQuizzes] = useState<QuizRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [scope, setScope] = useState<'mine' | 'all'>('mine')
  const [subjectFilter, setSubjectFilter] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ scope })
      if (subjectFilter) params.set('subjectSlug', subjectFilter)
      const res = await fetch(`/api/teacher/lessons?${params}`)
      const payload = await res.json()
      if (!res.ok || !payload.success) {
        toast.error(payload.error ?? 'Could not load quizzes')
        return
      }
      setQuizzes(payload.data)
    } catch {
      toast.error('Could not load quizzes')
    } finally {
      setIsLoading(false)
    }
  }, [scope, subjectFilter])

  useEffect(() => { load() }, [load])

  const handleDelete = async (quiz: QuizRow) => {
    if (!window.confirm(`Delete "${quiz.title}"? Student progress on this quiz will also be removed. This cannot be undone.`)) return
    setDeletingId(quiz._id)
    try {
      const res = await fetch(`/api/teacher/lessons/${quiz._id}`, { method: 'DELETE' })
      const payload = await res.json()
      if (!res.ok || !payload.success) {
        toast.error(payload.error ?? 'Could not delete the quiz')
        return
      }
      toast.success('Quiz deleted 🗑️')
      setQuizzes((prev) => prev.filter((q) => q._id !== quiz._id))
    } catch {
      toast.error('Could not delete the quiz')
    } finally {
      setDeletingId(null)
    }
  }

  const subjectMeta = (slug: string) => subjects.find((s) => s.slug === slug)

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1">My Quizzes 🧩</h1>
          <p className="text-muted-foreground">Create, edit, and manage quizzes for your students</p>
        </div>
        <Link href="/teacher/quizzes/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Create Quiz
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-full bg-muted p-1">
          {(['mine', 'all'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setScope(s)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-semibold transition-colors',
                scope === s ? 'bg-white shadow text-foreground' : 'text-muted-foreground'
              )}
            >
              {s === 'mine' ? 'My quizzes' : 'All content'}
            </button>
          ))}
        </div>
        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="rounded-full border-2 border-gray-200 px-3 py-1.5 text-sm font-semibold bg-white outline-none focus:border-primary"
        >
          <option value="">All subjects</option>
          {subjects.map((s) => (
            <option key={s.slug} value={s.slug}>{s.icon} {s.name}</option>
          ))}
        </select>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : quizzes.length === 0 ? (
        <div className="text-center py-16 card-kid">
          <div className="text-5xl mb-3">🧩</div>
          <p className="font-display text-xl font-bold">
            {scope === 'mine' ? 'No quizzes yet!' : 'No content found'}
          </p>
          <p className="text-muted-foreground text-sm mt-1 mb-4">
            {scope === 'mine'
              ? 'Create your first quiz and add pictures to make learning fun.'
              : 'Try a different filter.'}
          </p>
          {scope === 'mine' && (
            <Link href="/teacher/quizzes/new">
              <Button className="gap-2"><Plus className="w-4 h-4" /> Create your first quiz</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {quizzes.map((quiz, i) => {
            const subj = subjectMeta(quiz.subjectSlug)
            return (
              <motion.div
                key={quiz._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="card-kid p-4 flex items-center gap-4"
              >
                <div className="w-11 h-11 rounded-2xl bg-muted flex items-center justify-center text-xl flex-shrink-0">
                  {subj?.icon ?? '📚'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-display font-bold truncate">{quiz.title}</p>
                    {quiz.isPremium && <span className="text-xs">👑</span>}
                    {!quiz.isActive && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Hidden</span>
                    )}
                    {!quiz.isMine && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">KidOS content</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-muted-foreground">
                    <span>{subj?.name ?? quiz.subjectSlug}</span>
                    <span>·</span>
                    <span className={cn('font-bold px-2 py-0.5 rounded-full', AGE_BADGE[quiz.ageGroup])}>
                      {getAgeGroupLabel(quiz.ageGroup)}
                    </span>
                    <span>·</span>
                    <span>{quiz.questionCount} questions</span>
                    <span>·</span>
                    <span className="capitalize">{quiz.difficulty}</span>
                    <span>·</span>
                    <span>⚡ {quiz.xpReward} XP</span>
                  </div>
                </div>
                {quiz.isMine && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Link href={`/teacher/quizzes/${quiz._id}/edit`}>
                      <Button variant="ghost" size="sm" className="gap-1.5">
                        <Pencil className="w-4 h-4" /> Edit
                      </Button>
                    </Link>
                    <button
                      onClick={() => handleDelete(quiz)}
                      disabled={deletingId === quiz._id}
                      className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                      aria-label="Delete quiz"
                    >
                      {deletingId === quiz._id
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
