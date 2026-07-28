'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Lock, ChevronRight, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn, getSubjectGradient, getSubjectIcon, percentOf } from '@/lib/utils'
import type { AgeGroup, SubjectSlug } from '@/types'

interface Props {
  subjects: Array<{
    _id: string
    name: string
    slug: SubjectSlug
    icon: string
    gradient: string
    description: string
    ageGroups?: AgeGroup[]
    totalLessons: number
    totalQuizzes: number
    totalGames: number
    isPremium: boolean
    topics: Array<{
      id: string
      title: string
      icon: string
      lessonCount: number
      isLocked: boolean
    }>
  }>
  studentProgress: Array<{
    subjectSlug: SubjectSlug
    completedLessons: number
    totalLessons: number
    masteryLevel: number
  }>
  isPremium: boolean
  studentAgeGroup?: AgeGroup
}

const AGE_TABS: Array<{ value: AgeGroup | 'all'; label: string; emoji: string }> = [
  { value: 'all', label: 'All Ages', emoji: '🌈' },
  { value: 'toddler', label: 'Little Ones (1–3)', emoji: '👶' },
  { value: 'preschool', label: 'Preschool (3–6)', emoji: '🧸' },
  { value: 'lower_primary', label: 'Lower Primary (7–9)', emoji: '✏️' },
  { value: 'upper_primary', label: 'Upper Primary (10–12)', emoji: '🎓' },
]

export default function SubjectsClient({ subjects, studentProgress, isPremium, studentAgeGroup }: Props) {
  const [search, setSearch] = useState('')
  const [selectedAge, setSelectedAge] = useState<AgeGroup | 'all'>('all')

  const filtered = subjects.filter((s) => {
    if (!s.name.toLowerCase().includes(search.toLowerCase())) return false
    if (selectedAge !== 'all' && !s.ageGroups?.includes(selectedAge)) return false
    return true
  })

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">All Subjects 📚</h1>
        <p className="text-muted-foreground">Choose a subject to start learning!</p>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search subjects..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Age group filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {AGE_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setSelectedAge(tab.value)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-1',
              selectedAge === tab.value
                ? 'bg-purple-600 text-white'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            )}
          >
            {tab.emoji} {tab.label}
            {tab.value === studentAgeGroup && selectedAge !== tab.value && (
              <span className="text-[10px] bg-purple-200 text-purple-800 rounded-full px-1.5">For you</span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">🔍</div>
          <p className="font-display text-xl font-bold">No subjects found</p>
          <p className="text-muted-foreground text-sm mt-1">
            Try a different age group or search. (If “Little Ones” is empty, re-run <code>npm run seed</code> to load the new toddler content.)
          </p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((subject, i) => {
          const progress = studentProgress.find(p => p.subjectSlug === subject.slug)
          const pct = percentOf(progress?.completedLessons ?? 0, subject.totalLessons)
          const isLocked = subject.isPremium && !isPremium

          return (
            <motion.div
              key={subject._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={isLocked ? {} : { y: -4 }}
              className={cn('card-kid overflow-hidden', isLocked && 'opacity-70')}
            >
              {/* Header */}
              <div
                className={cn(
                  'relative p-6 text-white',
                  `bg-gradient-to-br ${getSubjectGradient(subject.slug)}`
                )}
              >
                {isLocked && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="text-center">
                      <Lock className="w-10 h-10 text-white mx-auto mb-2" />
                      <p className="font-bold text-sm">Premium Only</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-4xl mb-2">{subject.icon || getSubjectIcon(subject.slug)}</div>
                    <h2 className="font-display font-bold text-xl">{subject.name}</h2>
                    {subject.isPremium && (
                      <span className="inline-block bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1">
                        ⭐ PREMIUM
                      </span>
                    )}
                  </div>
                  <div className="text-right text-white/70 text-xs">
                    <div>{subject.totalLessons} lessons</div>
                    <div>{subject.totalQuizzes} quizzes</div>
                    <div>{subject.totalGames} games</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-2 bg-white/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.3 + i * 0.05, duration: 1 }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
                <div className="flex justify-between text-white/70 text-[10px] mt-1">
                  <span>{progress?.completedLessons ?? 0} completed</span>
                  <span>{pct}%</span>
                </div>
              </div>

              {/* Topics preview */}
              <div className="p-4">
                <p className="text-xs text-muted-foreground font-semibold mb-3">TOPICS</p>
                <div className="space-y-2">
                  {subject.topics?.slice(0, 3).map((topic) => (
                    <div
                      key={topic.id}
                      className={cn(
                        'flex items-center gap-2 text-sm',
                        topic.isLocked && 'opacity-50'
                      )}
                    >
                      <span className="text-base">{topic.icon}</span>
                      <span className="font-medium flex-1 truncate">{topic.title}</span>
                      {topic.isLocked ? (
                        <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                      ) : (
                        <span className="text-xs text-muted-foreground">{topic.lessonCount} lessons</span>
                      )}
                    </div>
                  ))}
                  {(subject.topics?.length ?? 0) > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{subject.topics.length - 3} more topics
                    </p>
                  )}
                </div>

                {isLocked ? (
                  <Link href="/parent/subscription">
                    <button className="mt-4 w-full py-2.5 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 text-yellow-900 font-bold text-sm flex items-center justify-center gap-2">
                      ⭐ Upgrade to Access
                    </button>
                  </Link>
                ) : (
                  <Link href={`/student/subjects/${subject.slug}`}>
                    <button className="mt-4 w-full py-2.5 rounded-2xl border-2 border-primary text-primary font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors">
                      Start Learning <ChevronRight className="w-4 h-4" />
                    </button>
                  </Link>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
