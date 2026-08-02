'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Clock, Brain, Hand } from 'lucide-react'
import { CelebrationModal } from '@/components/gamification/CelebrationModal'
import { speak, playCorrectSound, playWrongSound } from '@/lib/audio'
import type { AgeGroup, LessonLanguage } from '@/types'

// ---- exported types -------------------------------------------------------

export interface MatchingPuzzleGameData {
  gameType: 'matching'
  categories: string[]
  pairsCount: number
  mode?: 'tap' | 'memory'
  timeLimit?: number | null
  showLabels?: boolean
}

// ---- internal types -------------------------------------------------------

interface FetchedItem {
  _id: string
  category: string
  slug: string
  label: string
  labelMs: string
  emoji: string
  colorHex?: string
  colorClass?: string
  audioText: string
  audioTextMs: string
  difficulty: number
}

interface GameCard {
  id: string
  pairId: string
  side: 'visual' | 'label'
  emoji: string
  label: string
  labelMs: string
  colorHex?: string
  colorClass?: string
  category: string
  audioText: string
  audioTextMs: string
}

// ---- component props -------------------------------------------------------

interface MatchingPuzzleProps {
  lessonId: string
  title: string
  ageGroup: AgeGroup
  language: LessonLanguage
  xpReward: number
  coinReward: number
  gameData: MatchingPuzzleGameData
  onComplete: (
    score: number,
    xp: number,
    coins: number,
    answers: Record<string, string>,
  ) => Promise<{ xpEarned: number; coinsEarned: number }>
  onBack: () => void
}

// ---- helpers ---------------------------------------------------------------

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function getMascot(categories: string[]): string {
  const joined = categories.map((c) => c.toLowerCase()).join(' ')
  if (joined.includes('animal')) return '🐶'
  if (joined.includes('plant') || joined.includes('flower')) return '🌻'
  if (joined.includes('color') || joined.includes('colour')) return '🎨'
  if (joined.includes('shape')) return '⭐'
  return '🎮'
}

function getCardAudioText(card: GameCard, language: LessonLanguage): string {
  return language === 'ms' ? (card.audioTextMs || card.audioText) : card.audioText
}

function getGridCols(pairsCount: number): string {
  if (pairsCount <= 4) return 'grid-cols-4'
  if (pairsCount <= 6) return 'grid-cols-4 md:grid-cols-6'
  if (pairsCount <= 8) return 'grid-cols-4'
  if (pairsCount <= 10) return 'grid-cols-4 md:grid-cols-5'
  return 'grid-cols-4 md:grid-cols-6'
}

const BG_GRADIENT: Record<AgeGroup, string> = {
  toddler: 'from-rose-400 to-pink-500',
  preschool: 'from-pink-400 to-purple-500',
  lower_primary: 'from-sky-400 to-blue-600',
  upper_primary: 'from-indigo-500 to-violet-700',
}

const CARD_SIZE: Record<AgeGroup, string> = {
  toddler: 'min-w-[120px] min-h-[120px]',
  preschool: 'min-w-[100px] min-h-[100px]',
  lower_primary: 'min-w-[80px] min-h-[80px]',
  upper_primary: 'min-w-[68px] min-h-[68px]',
}

const EMOJI_SIZE: Record<AgeGroup, string> = {
  toddler: 'text-5xl',
  preschool: 'text-4xl',
  lower_primary: 'text-3xl',
  upper_primary: 'text-2xl',
}

const CARD_BACK_COLOR: Record<AgeGroup, string> = {
  toddler: 'bg-rose-400',
  preschool: 'bg-pink-400',
  lower_primary: 'bg-sky-400',
  upper_primary: 'bg-indigo-500',
}

const PLAY_PHRASES: Record<LessonLanguage, string> = {
  en: "Let's play!",
  ms: 'Jom bermain!',
  zh: '来玩吧！',
  ar: 'هيا نلعب!',
}

// ---- phase type ------------------------------------------------------------

type Phase = 'loading' | 'intro' | 'playing' | 'complete'

// ---- component -------------------------------------------------------------

export function MatchingPuzzle({
  title,
  ageGroup,
  language,
  xpReward,
  coinReward,
  gameData,
  onComplete,
  onBack,
}: MatchingPuzzleProps) {
  const showLabels = gameData.showLabels ?? true
  const isToddlerMode = ageGroup === 'toddler' || !showLabels

  const resolvedMode: 'tap' | 'memory' =
    gameData.mode ??
    (ageGroup === 'toddler' || ageGroup === 'preschool' ? 'tap' : 'memory')

  // ---- phase & data state --------------------------------------------------
  const [phase, setPhase] = useState<Phase>('loading')
  const [error, setError] = useState<string | null>(null)

  // tap mode columns
  const [visualCards, setVisualCards] = useState<GameCard[]>([])
  const [labelCards, setLabelCards] = useState<GameCard[]>([])
  // memory mode flat array
  const [allCards, setAllCards] = useState<GameCard[]>([])
  // one emoji per unique category (intro screen)
  const [categoryEmojis, setCategoryEmojis] = useState<string[]>([])

  // ---- game state ----------------------------------------------------------
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [flipped, setFlipped] = useState<string[]>([])
  const [matched, setMatched] = useState<string[]>([])
  const [mistakes, setMistakes] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isLocked, setIsLocked] = useState(false)

  // ---- completion state ----------------------------------------------------
  const [computedStars, setComputedStars] = useState<0 | 1 | 2 | 3>(0)
  const [serverReward, setServerReward] = useState<{
    xpEarned: number
    coinsEarned: number
  }>({ xpEarned: 0, coinsEarned: 0 })

  // ---- refs ----------------------------------------------------------------
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isFinishingRef = useRef(false)

  // ---- fetch items & build cards -------------------------------------------
  useEffect(() => {
    async function loadItems() {
      try {
        const params = new URLSearchParams({
          categories: gameData.categories.join(','),
          ageGroup,
          count: String(gameData.pairsCount),
        })
        const res = await fetch(`/api/matching/items?${params.toString()}`)
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as {
            error?: string
          }
          throw new Error(body.error ?? 'Failed to load items')
        }
        const body = (await res.json()) as {
          success: boolean
          data: FetchedItem[]
        }
        if (!body.success || !Array.isArray(body.data)) {
          throw new Error('Invalid response from server')
        }
        const items = body.data.slice(0, gameData.pairsCount)

        const vCards: GameCard[] = items.map((item) => ({
          id: `${item._id}-visual`,
          pairId: item._id,
          side: 'visual',
          emoji: item.emoji,
          label: item.label,
          labelMs: item.labelMs,
          colorHex: item.colorHex,
          colorClass: item.colorClass,
          category: item.category,
          audioText: item.audioText,
          audioTextMs: item.audioTextMs,
        }))
        const lCards: GameCard[] = items.map((item) => ({
          id: `${item._id}-label`,
          pairId: item._id,
          side: 'label',
          emoji: item.emoji,
          label: item.label,
          labelMs: item.labelMs,
          colorHex: item.colorHex,
          colorClass: item.colorClass,
          category: item.category,
          audioText: item.audioText,
          audioTextMs: item.audioTextMs,
        }))

        // one emoji per unique category for intro
        const seen = new Set<string>()
        const catEmojis: string[] = []
        for (const item of items) {
          if (!seen.has(item.category)) {
            seen.add(item.category)
            catEmojis.push(item.emoji)
          }
        }

        setCategoryEmojis(catEmojis)
        setVisualCards(shuffleArray(vCards))
        setLabelCards(shuffleArray(lCards))
        setAllCards(shuffleArray([...vCards, ...lCards]))
        setPhase('intro')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      }
    }
    void loadItems()
    // intentional: only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---- timer ---------------------------------------------------------------
  useEffect(() => {
    if (phase !== 'playing') {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      return
    }
    timerRef.current = setInterval(() => {
      setTimeElapsed((prev) => prev + 1)
    }, 1000)
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [phase])

  // ---- unmount cleanup -----------------------------------------------------
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // ---- finish game ---------------------------------------------------------
  const finishGame = useCallback(
    async (timedOut: boolean) => {
      if (isFinishingRef.current) return
      isFinishingRef.current = true

      if (timerRef.current !== null) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      const pct = timedOut
        ? 0
        : mistakes === 0
          ? 100
          : Math.max(0, 100 - (mistakes / gameData.pairsCount) * 50)

      const stars: 0 | 1 | 2 | 3 =
        pct >= 95 ? 3 : pct >= 65 ? 2 : pct > 0 ? 1 : 0
      const xp = Math.round(xpReward * pct / 100)
      const coins = Math.round(coinReward * pct / 100)

      setComputedStars(stars)

      try {
        const reward = await onComplete(pct, xp, coins, {})
        setServerReward(reward)
      } catch {
        setServerReward({ xpEarned: xp, coinsEarned: coins })
      }

      setPhase('complete')
    },
    [mistakes, gameData.pairsCount, xpReward, coinReward, onComplete],
  )

  // ---- time-limit check ----------------------------------------------------
  useEffect(() => {
    if (phase !== 'playing') return
    if (!gameData.timeLimit) return
    if (timeElapsed >= gameData.timeLimit) {
      void finishGame(true)
    }
  }, [timeElapsed, phase, gameData.timeLimit, finishGame])

  // ---- win check -----------------------------------------------------------
  useEffect(() => {
    if (phase !== 'playing') return
    if (gameData.pairsCount > 0 && matched.length === gameData.pairsCount) {
      void finishGame(false)
    }
  }, [matched, phase, gameData.pairsCount, finishGame])

  // ---- start game ----------------------------------------------------------
  const startGame = useCallback(() => {
    isFinishingRef.current = false
    setSelectedId(null)
    setFlipped([])
    setMatched([])
    setMistakes(0)
    setTimeElapsed(0)
    setIsLocked(false)
    speak(PLAY_PHRASES[language], language)
    setPhase('playing')
  }, [language])

  // ---- restart (back to intro, re-shuffle) ---------------------------------
  const handleRestart = useCallback(() => {
    isFinishingRef.current = false
    setSelectedId(null)
    setFlipped([])
    setMatched([])
    setMistakes(0)
    setTimeElapsed(0)
    setIsLocked(false)
    setComputedStars(0)
    setServerReward({ xpEarned: 0, coinsEarned: 0 })
    setVisualCards((prev) => shuffleArray([...prev]))
    setLabelCards((prev) => shuffleArray([...prev]))
    setAllCards((prev) => shuffleArray([...prev]))
    setPhase('intro')
  }, [])

  // ---- tap mode: visual card tapped ----------------------------------------
  const handleTapVisual = useCallback(
    (card: GameCard) => {
      if (matched.includes(card.pairId)) return
      setSelectedId((prev) => (prev === card.id ? null : card.id))
    },
    [matched],
  )

  // ---- tap mode: label card tapped -----------------------------------------
  const handleTapLabel = useCallback(
    (labelCard: GameCard) => {
      if (matched.includes(labelCard.pairId)) return
      if (!selectedId) return

      const selectedVisual = visualCards.find((c) => c.id === selectedId)
      if (!selectedVisual) return

      if (selectedVisual.pairId === labelCard.pairId) {
        playCorrectSound()
        speak(getCardAudioText(labelCard, language), language)
        setMatched((prev) => [...prev, labelCard.pairId])
        setSelectedId(null)
      } else {
        playWrongSound()
        setSelectedId(null)
      }
    },
    [selectedId, visualCards, matched, language],
  )

  // ---- memory mode: card tapped --------------------------------------------
  const handleFlipCard = useCallback(
    (card: GameCard) => {
      if (isLocked) return
      if (matched.includes(card.pairId)) return
      if (flipped.includes(card.id)) return
      if (flipped.length >= 2) return

      const newFlipped = [...flipped, card.id]
      setFlipped(newFlipped)

      if (newFlipped.length === 2) {
        const [firstId, secondId] = newFlipped
        const firstCard = allCards.find((c) => c.id === firstId)
        const secondCard = allCards.find((c) => c.id === secondId)

        if (
          firstCard &&
          secondCard &&
          firstCard.pairId === secondCard.pairId
        ) {
          playCorrectSound()
          speak(getCardAudioText(firstCard, language), language)
          setMatched((prev) => [...prev, firstCard.pairId])
          setFlipped([])
        } else {
          setMistakes((prev) => prev + 1)
          playWrongSound()
          setIsLocked(true)
          setTimeout(() => {
            setFlipped([])
            setIsLocked(false)
          }, 900)
        }
      }
    },
    [isLocked, matched, flipped, allCards, language],
  )

  // ---- derived values ------------------------------------------------------
  const timeRemaining =
    gameData.timeLimit != null
      ? Math.max(0, gameData.timeLimit - timeElapsed)
      : null
  const mascot = getMascot(gameData.categories)
  const bgGradient = BG_GRADIENT[ageGroup]
  const cardSize = CARD_SIZE[ageGroup]
  const emojiSize = EMOJI_SIZE[ageGroup]
  const cardBackColor = CARD_BACK_COLOR[ageGroup]
  const gridCols = getGridCols(gameData.pairsCount)

  // Safe area + gradient container
  const safeAreaStyle: React.CSSProperties = {
    paddingTop: 'max(env(safe-area-inset-top, 0px), 16px)',
    paddingRight: 'max(env(safe-area-inset-right, 0px), 16px)',
    paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)',
    paddingLeft: 'max(env(safe-area-inset-left, 0px), 16px)',
  }

  // ---- render --------------------------------------------------------------
  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden flex flex-col bg-gradient-to-br ${bgGradient}`}
      style={safeAreaStyle}
    >
      {/* ── Loading ───────────────────────────────────────────── */}
      {phase === 'loading' && !error && (
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-white/40 border-t-white rounded-full"
          />
        </div>
      )}

      {/* ── Error ─────────────────────────────────────────────── */}
      {error && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-white text-center p-8">
          <span className="text-5xl">😕</span>
          <p className="text-xl font-bold">{error}</p>
          <button
            onClick={() => {
              setError(null)
              setPhase('loading')
              // re-trigger fetch by reloading
              window.location.reload()
            }}
            className="bg-white/20 hover:bg-white/30 active:bg-white/10 text-white rounded-2xl px-6 py-3 font-bold transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={onBack}
            className="text-white/70 hover:text-white underline text-sm transition-colors"
          >
            Go Back
          </button>
        </div>
      )}

      {/* ── Intro ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col flex-1 overflow-hidden"
          >
            {/* Top bar */}
            <div className="h-14 flex items-center px-2 shrink-0">
              <button
                onClick={onBack}
                aria-label="Go back"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/10 text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Centered intro card */}
            <div className="flex-1 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.88, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 18, stiffness: 220 }}
                className="card-kid p-8 max-w-sm w-full text-center"
              >
                <h1 className="font-display text-2xl font-bold text-gray-800 mb-4">
                  {title}
                </h1>

                {/* Category emojis */}
                <div className="flex justify-center gap-3 flex-wrap mb-5">
                  {categoryEmojis.map((emoji, i) => (
                    <span key={i} className="text-4xl">
                      {emoji}
                    </span>
                  ))}
                </div>

                {/* Mode chip */}
                <div className="flex justify-center mb-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${
                      resolvedMode === 'memory'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {resolvedMode === 'memory' ? (
                      <>
                        <Brain className="w-4 h-4" />
                        Memory Flip 🧠
                      </>
                    ) : (
                      <>
                        <Hand className="w-4 h-4" />
                        Tap to Match
                      </>
                    )}
                  </span>
                </div>

                {resolvedMode === 'memory' && (
                  <p className="text-gray-500 text-sm mb-5">
                    Flip cards and find matching pairs!
                  </p>
                )}

                <button
                  onClick={startGame}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400
                             hover:from-yellow-300 hover:to-orange-300 active:from-yellow-500 active:to-orange-500
                             text-white font-display font-bold text-xl shadow-lg transition-all active:scale-95"
                >
                  {"Let's Play! 🎮"}
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Playing ───────────────────────────────────────────── */}
      <AnimatePresence>
        {phase === 'playing' && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col flex-1 overflow-hidden"
          >
            {/* Top bar */}
            <div className="h-14 flex items-center px-2 shrink-0 gap-2">
              <button
                onClick={onBack}
                aria-label="Go back"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20
                           hover:bg-white/30 active:bg-white/10 text-white transition-colors shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <h2 className="flex-1 text-center text-white font-bold text-lg truncate">
                {title}
              </h2>

              <div className="flex items-center gap-2 shrink-0">
                {mistakes > 0 && (
                  <span className="flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-1 text-white text-sm font-bold">
                    ❌ {mistakes}
                  </span>
                )}
                <span className="flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-1 text-white text-sm font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  {timeRemaining !== null
                    ? formatTime(timeRemaining)
                    : formatTime(timeElapsed)}
                </span>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="px-4 pb-2 shrink-0">
              <div className="flex justify-between text-white/70 text-xs font-semibold mb-1">
                <span>Matched</span>
                <span>
                  {matched.length} / {gameData.pairsCount}
                </span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  animate={{
                    width: `${(matched.length / gameData.pairsCount) * 100}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Game area */}
            <div className="flex-1 overflow-auto flex items-center justify-center p-4">
              {resolvedMode === 'tap' ? (
                /* ── Tap mode: two-column layout ──────────────── */
                <div className="flex gap-4 md:gap-6 justify-center items-start">
                  {/* Left column — visual cards */}
                  <div className="flex flex-col gap-3">
                    {visualCards.map((card) => {
                      const isMatched = matched.includes(card.pairId)
                      const isSelected = selectedId === card.id
                      return (
                        <motion.button
                          key={card.id}
                          onClick={() => handleTapVisual(card)}
                          whileTap={{ scale: 0.95 }}
                          animate={{ scale: isSelected ? 1.05 : 1 }}
                          disabled={isMatched}
                          aria-label={`Visual: ${card.label}`}
                          aria-pressed={isSelected}
                          className={[
                            cardSize,
                            'flex flex-col items-center justify-center rounded-2xl bg-white shadow-md transition-colors',
                            isSelected
                              ? 'ring-4 ring-yellow-400 shadow-xl'
                              : 'hover:ring-2 hover:ring-yellow-200',
                            isMatched
                              ? 'ring-4 ring-green-400 opacity-60 pointer-events-none'
                              : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        >
                          <span className={emojiSize}>{card.emoji}</span>
                          {isMatched && (
                            <span className="text-green-500 text-base leading-none mt-1">
                              ✓
                            </span>
                          )}
                        </motion.button>
                      )
                    })}
                  </div>

                  {/* Right column — label cards */}
                  <div className="flex flex-col gap-3">
                    {labelCards.map((card) => {
                      const isMatched = matched.includes(card.pairId)
                      return (
                        <motion.button
                          key={card.id}
                          onClick={() => handleTapLabel(card)}
                          whileTap={{ scale: 0.95 }}
                          disabled={isMatched}
                          aria-label={`Label: ${card.label}`}
                          className={[
                            cardSize,
                            'flex flex-col items-center justify-center rounded-2xl bg-white shadow-md transition-colors',
                            !isMatched ? 'hover:ring-2 hover:ring-blue-200' : '',
                            isMatched
                              ? 'ring-4 ring-green-400 opacity-60 pointer-events-none'
                              : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        >
                          {isToddlerMode ? (
                            <span className={emojiSize}>{card.emoji}</span>
                          ) : (
                            <>
                              <span className="text-2xl mb-1">{card.emoji}</span>
                              <span className="font-bold text-gray-800 text-center leading-tight px-2 text-sm">
                                {language === 'ms' ? card.labelMs : card.label}
                              </span>
                            </>
                          )}
                          {isMatched && (
                            <span className="text-green-500 text-base leading-none mt-1">
                              ✓
                            </span>
                          )}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
              ) : (
                /* ── Memory mode: grid ────────────────────────── */
                <div className={`grid ${gridCols} gap-3`}>
                  {allCards.map((card) => {
                    const isFaceUp =
                      flipped.includes(card.id) ||
                      matched.includes(card.pairId)
                    const isMatchedCard = matched.includes(card.pairId)
                    return (
                      <motion.button
                        key={card.id}
                        onClick={() => handleFlipCard(card)}
                        whileTap={{ scale: 0.95 }}
                        disabled={isMatchedCard || isLocked}
                        aria-label={
                          isFaceUp
                            ? `${card.side === 'visual' ? 'Emoji' : 'Label'}: ${card.label}`
                            : 'Hidden card'
                        }
                        className={[
                          cardSize,
                          'flex flex-col items-center justify-center rounded-2xl shadow-md transition-colors overflow-hidden',
                          isFaceUp
                            ? 'bg-white'
                            : `${cardBackColor} text-white`,
                          isMatchedCard
                            ? 'ring-4 ring-green-400 opacity-60 pointer-events-none'
                            : '',
                          !isFaceUp && !isMatchedCard
                            ? 'hover:brightness-110'
                            : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        <AnimatePresence mode="wait">
                          {isFaceUp ? (
                            <motion.div
                              key="face"
                              initial={{ scale: 0.7, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.7, opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              className="flex flex-col items-center justify-center w-full h-full p-2"
                            >
                              <span className={emojiSize}>{card.emoji}</span>
                              {showLabels && card.side === 'label' && (
                                <span className="font-bold text-gray-800 text-center text-xs mt-1 px-1 leading-tight line-clamp-2">
                                  {language === 'ms'
                                    ? card.labelMs
                                    : card.label}
                                </span>
                              )}
                              {isMatchedCard && (
                                <span className="text-green-500 text-sm leading-none mt-0.5">
                                  ✓
                                </span>
                              )}
                            </motion.div>
                          ) : (
                            <motion.div
                              key="back"
                              initial={{ scale: 0.7, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.7, opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              className="text-white/80 select-none text-3xl"
                              aria-hidden="true"
                            >
                              ✨
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Complete: CelebrationModal is its own fixed overlay ── */}
      {phase === 'complete' && (
        <CelebrationModal
          stars={computedStars}
          xpEarned={serverReward.xpEarned}
          coinsEarned={serverReward.coinsEarned}
          mascot={mascot}
          onRestart={handleRestart}
          onHome={onBack}
        />
      )}
    </div>
  )
}
