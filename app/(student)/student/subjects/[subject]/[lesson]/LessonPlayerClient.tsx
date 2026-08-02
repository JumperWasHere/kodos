'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Clock, Zap } from 'lucide-react'
import QuizGame from '@/components/subjects/QuizGame'
import StoryPlayer from '@/components/subjects/StoryPlayer'
import { MatchingPuzzle } from '@/components/subjects/MatchingPuzzle'
import type { MatchingPuzzleGameData } from '@/components/subjects/MatchingPuzzle'
import type { AgeGroup, LearningPoint, LessonLanguage, QuizQuestion, StoryPage } from '@/types'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

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
    learningPoints?: LearningPoint[]
    activityPrompts?: string[]
    songTitle?: string
    songLyrics?: string
    songAudioUrl?: string
    videoUrl?: string
    worksheetUrl?: string
    storyPages?: StoryPage[]
    isPremium: boolean
    gameData?: Record<string, unknown>
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
  const [storyPage, setStoryPage] = useState(0)
  const [isCompleting, setIsCompleting] = useState(false)

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

  const completeLesson = async () => {
    setIsCompleting(true)
    try {
      const response = await fetch('/api/progress', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: lesson._id, timeSpent: lesson.duration * 60, answers: {} }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error)
      toast.success(payload.data.alreadyCompleted ? 'Lesson already completed!' : `Great work! +${payload.data.xpEarned} XP`)
    } catch {
      toast.error('Unable to save lesson progress. Please try again.')
    } finally {
      setIsCompleting(false)
    }
  }

  // Render matching puzzle for game lessons with gameData.gameType === 'matching'
  if (lesson.type === 'game' && (lesson.gameData as unknown as MatchingPuzzleGameData | undefined)?.gameType === 'matching') {
    return (
      <MatchingPuzzle
        lessonId={lesson._id}
        title={lesson.title}
        ageGroup={lesson.ageGroup ?? 'lower_primary'}
        language={lesson.language ?? 'en'}
        xpReward={lesson.xpReward}
        coinReward={lesson.coinReward}
        gameData={lesson.gameData as unknown as MatchingPuzzleGameData}
        onComplete={handleComplete}
        onBack={handleBack}
      />
    )
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

  // Render the full story player (pages, learning points, activity, song) for
  // story-type lessons that actually have pages authored.
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

  // Video / worksheet / interactive-without-questions / empty story — simple fallback UI
  const page = lesson.storyPages?.[storyPage]

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto">
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to {subject.name}
      </button>

      <div className="card-kid p-6 md:p-8 space-y-5">
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
        {lesson.type === 'video' && (lesson.videoUrl ? (
          <video controls className="w-full rounded-2xl" src={lesson.videoUrl}>Your browser does not support video playback.</video>
        ) : <p className="text-sm text-muted-foreground text-center">This lesson does not have a video attached yet.</p>)}

        {lesson.type === 'story' && (page ? <>
          {page.imageUrl && <img src={page.imageUrl} alt="Story illustration" className="w-full max-h-80 object-cover rounded-2xl" />}
          <p className="text-lg leading-relaxed whitespace-pre-line">{page.text}</p>
          <div className="flex justify-between gap-3">
            <Button variant="outline" disabled={storyPage === 0} onClick={() => setStoryPage((p) => p - 1)}>Previous</Button>
            {storyPage < lesson.storyPages!.length - 1
              ? <Button onClick={() => setStoryPage((p) => p + 1)}>Next page</Button>
              : <Button onClick={completeLesson} disabled={isCompleting}>{isCompleting ? 'Saving…' : 'Finish story'}</Button>}
          </div>
        </> : <p className="text-sm text-muted-foreground text-center">This story has no pages yet.</p>)}

        {lesson.type === 'worksheet' && <div className="text-center space-y-3">
          {lesson.worksheetUrl ? <a href={lesson.worksheetUrl} target="_blank" rel="noreferrer" className="text-primary font-bold underline">Open worksheet</a> : <p className="text-sm text-muted-foreground">This worksheet has not been attached yet.</p>}
          <Button onClick={completeLesson} disabled={isCompleting}>{isCompleting ? 'Saving…' : 'Mark worksheet complete'}</Button>
        </div>}

        {['interactive', 'game'].includes(lesson.type) && <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground">Complete the activity, then record your completion.</p>
          <Button onClick={completeLesson} disabled={isCompleting}>{isCompleting ? 'Saving…' : 'Complete activity'}</Button>
        </div>}
      </div>
    </div>
  )
}
