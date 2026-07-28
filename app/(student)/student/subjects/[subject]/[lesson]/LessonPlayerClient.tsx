'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Clock, Zap } from 'lucide-react'
import QuizGame from '@/components/subjects/QuizGame'
import StoryPlayer from '@/components/subjects/StoryPlayer'
import type { AgeGroup, LearningPoint, LessonLanguage, QuizQuestion, StoryPage } from '@/types'

interface Props {
  lesson: {
    _id: string
    title: string
    description?: string
    type: string
    subjectSlug: string
    ageGroup?: AgeGroup
    language?: LessonLanguage
    xpReward: number
    coinReward: number
    duration: number
    difficulty: string
    questions?: QuizQuestion[]
    storyPages?: StoryPage[]
    learningPoints?: LearningPoint[]
    activityPrompts?: string[]
    songTitle?: string
    songLyrics?: string
    songAudioUrl?: string
    isPremium: boolean
  }
  subject: {
    name: string
    slug: string
    icon: string
    color: string
  }
  isPremium: boolean
  studentId: string
}

export default function LessonPlayerClient({ lesson, subject, studentId }: Props) {
  const router = useRouter()

  const handleComplete = async (_score: number, _xpEarned: number, _coinsEarned: number, answers: Record<string, string | string[]>) => {
    const response = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lessonId: lesson._id,
        timeSpent: lesson.duration * 60,
        answers,
      }),
    })

    if (!response.ok) throw new Error('Unable to save lesson progress')
    const payload = await response.json()
    return payload.data as { xpEarned: number; coinsEarned: number }
  }

  const handleBack = () => {
    router.push(`/student/subjects/${subject.slug}`)
  }

  // Render quiz for quiz/game/interactive types
  if (['quiz', 'game', 'interactive'].includes(lesson.type) && lesson.questions?.length) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto">
        <QuizGame
          lessonId={lesson._id}
          title={lesson.title}
          questions={lesson.questions}
          xpReward={lesson.xpReward}
          coinReward={lesson.coinReward}
          ageGroup={lesson.ageGroup}
          language={lesson.language}
          onComplete={handleComplete}
          onBack={handleBack}
        />
      </div>
    )
  }

  // Render the story player for story-type lessons
  if (lesson.type === 'story' && lesson.storyPages?.length) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto">
        <StoryPlayer
          title={lesson.title}
          pages={lesson.storyPages}
          learningPoints={lesson.learningPoints}
          activityPrompts={lesson.activityPrompts}
          songTitle={lesson.songTitle}
          songLyrics={lesson.songLyrics}
          songAudioUrl={lesson.songAudioUrl}
          xpReward={lesson.xpReward}
          coinReward={lesson.coinReward}
          ageGroup={lesson.ageGroup}
          language={lesson.language}
          onComplete={handleComplete}
          onBack={handleBack}
        />
      </div>
    )
  }

  // Video / worksheet — placeholder with back button
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto">
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to {subject.name}
      </button>

      <div className="card-kid p-8 text-center space-y-4">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mx-auto"
          style={{ background: `linear-gradient(135deg, ${subject.color}33, ${subject.color}11)` }}
        >
          {lesson.type === 'video' ? '🎬' : lesson.type === 'story' ? '📖' : '📝'}
        </div>
        <h1 className="font-display text-2xl font-bold">{lesson.title}</h1>
        {lesson.description && (
          <p className="text-muted-foreground">{lesson.description}</p>
        )}
        <div className="flex items-center justify-center gap-4 text-sm">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-4 h-4" /> {lesson.duration} min
          </span>
          <span className="flex items-center gap-1 text-purple-600 font-bold">
            <Zap className="w-4 h-4" /> {lesson.xpReward} XP
          </span>
          <span className="flex items-center gap-1 text-yellow-600 font-bold">
            🪙 {lesson.coinReward}
          </span>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-800 text-sm font-semibold">
          🚧 This content type is coming soon! Check back for {lesson.type} lessons.
        </div>
      </div>
    </div>
  )
}
