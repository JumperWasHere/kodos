'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Lock, Play, Star, Clock, Zap, BookOpen, ChevronRight, Trophy, Coins } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface Lesson {
  _id: string
  title: string
  description?: string
  type: 'quiz' | 'video' | 'interactive' | 'game' | 'story' | 'worksheet'
  difficulty: 'easy' | 'medium' | 'hard'
  duration: number
  xpReward: number
  coinReward: number
  thumbnail?: string
  topicId?: string
  isPremium: boolean
  order: number
}

interface Subject {
  _id: string
  name: string
  nameMs: string
  slug: string
  description: string
  icon: string
  color: string
  gradient: string
  topics: Array<{ id: string; title: string; icon: string; color: string; order: number; isLocked: boolean }>
}

interface Props {
  subject: Subject
  lessons: Lesson[]
  isPremium: boolean
  studentId: string
}

const TYPE_META: Record<string, { label: string; emoji: string; bg: string }> = {
  quiz: { label: 'Quiz', emoji: '🧠', bg: 'bg-blue-100 text-blue-700' },
  video: { label: 'Video', emoji: '🎬', bg: 'bg-red-100 text-red-700' },
  interactive: { label: 'Interactive', emoji: '🎮', bg: 'bg-purple-100 text-purple-700' },
  game: { label: 'Game', emoji: '🕹️', bg: 'bg-green-100 text-green-700' },
  story: { label: 'Story', emoji: '📖', bg: 'bg-yellow-100 text-yellow-700' },
  worksheet: { label: 'Worksheet', emoji: '📝', bg: 'bg-orange-100 text-orange-700' },
}

const DIFF_COLORS: Record<string, string> = {
  easy: 'text-green-600 bg-green-50',
  medium: 'text-yellow-600 bg-yellow-50',
  hard: 'text-red-600 bg-red-50',
}

// Mock lessons when DB has no lessons seeded yet
const MOCK_LESSONS: Lesson[] = [
  { _id: 'mock-1', title: 'Alphabet Adventure', description: 'Learn A–Z with fun animations and sounds', type: 'interactive', difficulty: 'easy', duration: 10, xpReward: 30, coinReward: 15, isPremium: false, order: 1 },
  { _id: 'mock-2', title: 'Phonics Fun', description: 'Sound out letters and build words', type: 'game', difficulty: 'easy', duration: 8, xpReward: 25, coinReward: 10, isPremium: false, order: 2 },
  { _id: 'mock-3', title: 'Sight Words Quiz', description: 'Test your knowledge of common sight words', type: 'quiz', difficulty: 'easy', duration: 5, xpReward: 40, coinReward: 20, isPremium: false, order: 3 },
  { _id: 'mock-4', title: 'Story Time: The Big Red Dog', description: 'Read along and answer questions', type: 'story', difficulty: 'easy', duration: 12, xpReward: 35, coinReward: 15, isPremium: false, order: 4 },
  { _id: 'mock-5', title: 'Vocabulary Builder', description: 'Learn 20 new words with pictures', type: 'interactive', difficulty: 'medium', duration: 15, xpReward: 50, coinReward: 25, isPremium: false, order: 5 },
  { _id: 'mock-6', title: 'Grammar Basics: Nouns', description: 'Identify nouns in sentences', type: 'quiz', difficulty: 'medium', duration: 7, xpReward: 45, coinReward: 20, isPremium: true, order: 6 },
  { _id: 'mock-7', title: 'Reading Comprehension', description: 'Read a short passage and answer questions', type: 'quiz', difficulty: 'medium', duration: 10, xpReward: 60, coinReward: 30, isPremium: true, order: 7 },
  { _id: 'mock-8', title: 'Creative Writing', description: 'Write your own short story', type: 'worksheet', difficulty: 'hard', duration: 20, xpReward: 80, coinReward: 40, isPremium: true, order: 8 },
]

export default function SubjectDetailClient({ subject, lessons, isPremium, studentId }: Props) {
  const router = useRouter()
  const displayLessons = lessons.length > 0 ? lessons : MOCK_LESSONS
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  const filteredLessons = selectedTopic
    ? displayLessons.filter(l => l.topicId === selectedTopic)
    : displayLessons

  const visibleLessons = filteredLessons.length > 0 ? filteredLessons : displayLessons

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
          style={{ background: `linear-gradient(135deg, ${subject.color}, ${subject.color}99)` }}
        >
          {subject.icon}
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">{subject.name}</h1>
          <p className="text-sm text-muted-foreground">{subject.nameMs} · {displayLessons.length} lessons</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-muted-foreground">{subject.description}</p>

      {/* Topic filter pills */}
      {subject.topics?.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedTopic(null)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-semibold transition-colors',
              !selectedTopic ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/70'
            )}
          >
            All Topics
          </button>
          {subject.topics.map(topic => (
            <button
              key={topic.id}
              onClick={() => !topic.isLocked ? setSelectedTopic(topic.id) : null}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-1',
                topic.isLocked && !isPremium
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : selectedTopic === topic.id
                  ? 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/70'
              )}
            >
              {topic.icon} {topic.title}
              {topic.isLocked && !isPremium && <Lock className="w-3 h-3" />}
            </button>
          ))}
        </div>
      )}

      {/* Lessons grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {visibleLessons.map((lesson, i) => {
          const locked = lesson.isPremium && !isPremium
          const meta = TYPE_META[lesson.type] ?? TYPE_META.quiz

          return (
            <motion.div
              key={lesson._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn('card-kid overflow-hidden', locked && 'opacity-70')}
            >
              {/* Lesson header */}
              <div
                className="h-16 flex items-center justify-between px-4"
                style={{ background: `linear-gradient(135deg, ${subject.color}22, ${subject.color}11)` }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{meta.emoji}</span>
                  <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', meta.bg)}>
                    {meta.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full capitalize', DIFF_COLORS[lesson.difficulty])}>
                    {lesson.difficulty}
                  </span>
                  {locked && (
                    <div className="w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center">
                      <Lock className="w-3.5 h-3.5 text-yellow-900" />
                    </div>
                  )}
                </div>
              </div>

              {/* Lesson body */}
              <div className="p-4">
                <h3 className="font-display font-bold text-base mb-1">{lesson.title}</h3>
                {lesson.description && (
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{lesson.description}</p>
                )}
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {lesson.duration} min
                  </span>
                  <span className="flex items-center gap-1 text-purple-600 font-bold">
                    <Zap className="w-3 h-3" /> {lesson.xpReward} XP
                  </span>
                  <span className="flex items-center gap-1 text-yellow-600 font-bold">
                    🪙 {lesson.coinReward}
                  </span>
                </div>

                {locked ? (
                  <Link href="/parent/subscription">
                    <Button size="sm" className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 gap-2">
                      <Lock className="w-3.5 h-3.5" /> Unlock Premium
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/student/subjects/${subject.slug}/${lesson._id}`}>
                    <Button size="sm" className="w-full gap-2">
                      <Play className="w-3.5 h-3.5" /> Start Lesson
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Empty state */}
      {visibleLessons.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">🚧</div>
          <p className="font-display text-xl font-bold">Coming Soon!</p>
          <p className="text-muted-foreground text-sm mt-1">Lessons for this topic are being prepared.</p>
        </div>
      )}
    </div>
  )
}
