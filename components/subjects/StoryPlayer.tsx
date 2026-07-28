'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, BookOpen, Loader2, Music, Sparkles, Volume2, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { speak, stopSpeaking, playAudioFile, stopAudioFile, playCelebrationSound } from '@/lib/audio'
import { useGamificationStore } from '@/store/gamificationStore'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import type { AgeGroup, LearningPoint, LessonLanguage, StoryPage } from '@/types'

interface StoryPlayerProps {
  title: string
  pages: StoryPage[]
  learningPoints?: LearningPoint[]
  activityPrompts?: string[]
  songTitle?: string
  songLyrics?: string
  songAudioUrl?: string
  xpReward: number
  coinReward: number
  ageGroup?: AgeGroup
  language?: LessonLanguage
  onComplete?: (score: number, xpEarned: number, coinsEarned: number, answers: Record<string, string | string[]>) => Promise<{ xpEarned: number; coinsEarned: number } | void> | void
  onBack?: () => void
}

type StoryStage = 'intro' | 'reading' | 'recap' | 'activity' | 'song' | 'result'

export default function StoryPlayer({
  title,
  pages,
  learningPoints = [],
  activityPrompts = [],
  songTitle,
  songLyrics,
  songAudioUrl,
  xpReward,
  coinReward,
  ageGroup,
  language = 'en',
  onComplete,
  onBack,
}: StoryPlayerProps) {
  const littleKidMode = ageGroup === 'toddler' || ageGroup === 'preschool'
  const [stage, setStage] = useState<StoryStage>('intro')
  const [pageIdx, setPageIdx] = useState(0)
  const [isFinishing, setIsFinishing] = useState(false)
  const [awardedRewards, setAwardedRewards] = useState<{ xp: number; coins: number } | null>(null)
  const { addXP, addCoins } = useGamificationStore()
  const { width, height } = useWindowSize()
  const [showConfetti, setShowConfetti] = useState(false)

  const sortedPages = [...pages].sort((a, b) => a.pageNumber - b.pageNumber)
  const currentPage = sortedPages[pageIdx]
  const isLastPage = pageIdx === sortedPages.length - 1

  // Narrate a page: a real recording (page.audioUrl) always wins over
  // synthesized speech, since it actually sounds like a person.
  const narratePage = (page: StoryPage) => {
    if (page.audioUrl) playAudioFile(page.audioUrl)
    else speak(page.text, language)
  }

  // Auto-narrate each story page for little kids
  useEffect(() => {
    if (stage === 'reading' && littleKidMode && currentPage) {
      narratePage(currentPage)
    }
    return () => { stopSpeaking(); stopAudioFile() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, pageIdx, littleKidMode, currentPage, language])

  const goToNextStage = (from: StoryStage) => {
    stopSpeaking()
    stopAudioFile()
    if (from === 'reading') {
      setStage(learningPoints.length > 0 ? 'recap' : activityPrompts.length > 0 ? 'activity' : songLyrics ? 'song' : 'result')
    } else if (from === 'recap') {
      setStage(activityPrompts.length > 0 ? 'activity' : songLyrics ? 'song' : 'result')
    } else if (from === 'activity') {
      setStage(songLyrics ? 'song' : 'result')
    } else if (from === 'song') {
      setStage('result')
    }
  }

  const finish = async () => {
    if (isFinishing || stage === 'result') return
    setIsFinishing(true)
    try {
      const result = await onComplete?.(100, xpReward, coinReward, {})
      const earnedXP = result?.xpEarned ?? xpReward
      const earnedCoins = result?.coinsEarned ?? coinReward
      setAwardedRewards({ xp: earnedXP, coins: earnedCoins })
      addXP(earnedXP, 'story')
      addCoins(earnedCoins)
      setShowConfetti(true)
      playCelebrationSound()
      setTimeout(() => setShowConfetti(false), 5000)
    } finally {
      setStage('result')
      setIsFinishing(false)
    }
  }

  // ── Intro ───────────────────────────────────────────────────
  if (stage === 'intro') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center p-8">
        {sortedPages[0]?.imageUrl && (
          <img src={sortedPages[0].imageUrl} alt={title} className="w-full max-h-56 object-contain rounded-3xl mb-4" />
        )}
        <div className="text-5xl mb-3">📖</div>
        <h1 className="font-display text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground mb-6">
          {sortedPages.length} pages • Earn {xpReward} XP & {coinReward} 🪙
        </p>
        <Button onClick={() => setStage('reading')} size="xl" className="w-full gap-2">
          <BookOpen className="w-5 h-5" /> Start Story!
        </Button>
        {onBack && (
          <button onClick={onBack} className="mt-3 text-sm text-muted-foreground hover:text-foreground">
            ← Back to lesson
          </button>
        )}
      </motion.div>
    )
  }

  // ── Reading a page ────────────────────────────────────────────
  if (stage === 'reading' && currentPage) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center justify-center gap-1.5 mb-4">
          {sortedPages.map((p, i) => (
            <div key={p.pageNumber} className={cn('h-1.5 rounded-full transition-all', i === pageIdx ? 'w-6 bg-primary' : 'w-1.5 bg-gray-200')} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={pageIdx}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="card-kid overflow-hidden mb-4"
          >
            {currentPage.imageUrl && (
              <img src={currentPage.imageUrl} alt={`Page ${currentPage.pageNumber}`} className="w-full max-h-72 object-contain bg-muted/30" />
            )}
            <div className="p-6 flex items-start justify-center gap-2">
              <p className={cn('font-display font-bold text-center leading-relaxed whitespace-pre-line', littleKidMode ? 'text-2xl' : 'text-lg')}>
                {currentPage.text}
              </p>
              <button
                type="button"
                onClick={() => narratePage(currentPage)}
                className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors flex items-center justify-center"
                aria-label="Read this page aloud"
                title={currentPage.audioUrl ? 'Play narration 🔊' : 'Read aloud 🔊'}
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            disabled={pageIdx === 0}
            onClick={() => setPageIdx((i) => Math.max(0, i - 1))}
            className="gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <Button
            className="flex-1 gap-1.5"
            onClick={() => (isLastPage ? goToNextStage('reading') : setPageIdx((i) => i + 1))}
          >
            {isLastPage ? <>The End! ✨</> : <>Next <ArrowRight className="w-4 h-4" /></>}
          </Button>
        </div>
      </div>
    )
  }

  // ── Recap: learning points ───────────────────────────────────
  if (stage === 'recap') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto text-center p-8">
        <h2 className="font-display text-2xl font-bold mb-2">You Learned These! 🌟</h2>
        <p className="text-muted-foreground mb-6">Tap a card to hear it again</p>
        <div className="grid grid-cols-2 gap-3 mb-8">
          {learningPoints.map((point, i) => (
            <motion.button
              key={point.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, type: 'spring' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => speak(point.label, language)}
              className="card-kid p-5 flex flex-col items-center gap-2 hover:border-primary transition-colors"
            >
              <span className="text-5xl">{point.emoji}</span>
              <span className="font-bold text-sm">{point.label}</span>
            </motion.button>
          ))}
        </div>
        <Button onClick={() => goToNextStage('recap')} size="xl" className="w-full">
          Continue <ArrowRight className="w-5 h-5" />
        </Button>
      </motion.div>
    )
  }

  // ── Parent & child activity ───────────────────────────────────
  if (stage === 'activity') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto p-8">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">👨‍👩‍👧</div>
          <h2 className="font-display text-2xl font-bold">Let&apos;s Play Together!</h2>
          <p className="text-muted-foreground text-sm mt-1">A grown-up reads these out loud — talk about the answers together!</p>
        </div>
        <div className="space-y-3 mb-8">
          {activityPrompts.map((prompt, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card-kid p-4 flex items-center gap-3"
            >
              <span className="font-display font-bold text-lg text-primary flex-shrink-0">{i + 1}</span>
              <p className="flex-1 font-semibold">{prompt}</p>
              <button
                type="button"
                onClick={() => speak(prompt, language)}
                className="flex-shrink-0 w-9 h-9 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors flex items-center justify-center"
                aria-label="Read this question aloud"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
        <Button onClick={() => goToNextStage('activity')} size="xl" className="w-full">
          Continue <ArrowRight className="w-5 h-5" />
        </Button>
      </motion.div>
    )
  }

  // ── Sing-along ────────────────────────────────────────────────
  if (stage === 'song') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto text-center p-8">
        <div className="text-5xl mb-2">🎵</div>
        <h2 className="font-display text-2xl font-bold mb-4">{songTitle ?? 'Sing Along!'}</h2>
        <div className="card-kid p-6 mb-6 text-left whitespace-pre-line font-semibold leading-loose">
          {songLyrics}
        </div>

        {songAudioUrl ? (
          <div className="mb-3">
            <p className="text-xs font-semibold text-muted-foreground mb-2">🎶 Press play to sing along!</p>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <audio controls className="w-full" src={songAudioUrl} />
          </div>
        ) : (
          <Button variant="outline" className="w-full gap-2 mb-3" onClick={() => songLyrics && speak(songLyrics, language)}>
            <Music className="w-4 h-4" /> Sing Along!
          </Button>
        )}

        <Button onClick={() => goToNextStage('song')} size="xl" className="w-full">
          Continue <ArrowRight className="w-5 h-5" />
        </Button>
      </motion.div>
    )
  }

  // ── Result ────────────────────────────────────────────────────
  const earnedXP = awardedRewards?.xp ?? xpReward
  const earnedCoins = awardedRewards?.coins ?? coinReward

  return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center p-8">
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={200} />}

      <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-4xl p-8 mb-6">
        <Sparkles className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
        <h2 className="font-display text-3xl font-bold mb-2">Great Job! 🎉</h2>
        <p className="text-muted-foreground mb-6">You finished &ldquo;{title}&rdquo;!</p>

        {awardedRewards === null ? (
          <Button onClick={finish} disabled={isFinishing} size="lg" className="w-full gap-2">
            {isFinishing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
            Claim Your Reward!
          </Button>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-4">
              <Zap className="w-6 h-6 text-purple-500 mx-auto mb-1" />
              <div className="font-bold text-xl text-purple-700">+{earnedXP}</div>
              <div className="text-xs text-muted-foreground">XP Earned</div>
            </div>
            <div className="bg-white rounded-2xl p-4">
              <span className="text-2xl block text-center mb-1">🪙</span>
              <div className="font-bold text-xl text-yellow-700">+{earnedCoins}</div>
              <div className="text-xs text-muted-foreground">Coins Earned</div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={() => { setPageIdx(0); setStage('reading') }}
        >
          <BookOpen className="w-4 h-4" /> Read Again
        </Button>
        {onBack && (
          <Button onClick={onBack} className="w-full">
            Continue Learning 🚀
          </Button>
        )}
      </div>
    </motion.div>
  )
}
