'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, ArrowRight, Timer, Trophy, Star, Zap, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn, MOTIVATION_MESSAGES, ENCOURAGEMENT_MESSAGES, randomFrom, shuffle } from '@/lib/utils'
import { useGamificationStore } from '@/store/gamificationStore'
import { toast } from 'sonner'
import type { QuizQuestion } from '@/types'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'

interface QuizGameProps {
  lessonId: string
  title: string
  questions: QuizQuestion[]
  xpReward: number
  coinReward: number
  onComplete?: (score: number, xpEarned: number, coinsEarned: number) => void
  onBack?: () => void
}

type QuizState = 'intro' | 'playing' | 'reviewing' | 'result'

export default function QuizGame({
  lessonId,
  title,
  questions,
  xpReward,
  coinReward,
  onComplete,
  onBack,
}: QuizGameProps) {
  const [state, setState] = useState<QuizState>('intro')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [answers, setAnswers] = useState<Array<{ question: string; selected: string; correct: string; isCorrect: boolean }>>([])
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([])
  const { addXP, addCoins } = useGamificationStore()
  const { width, height } = useWindowSize()
  const [showConfetti, setShowConfetti] = useState(false)

  const currentQ = questions[currentIdx]
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0)
  const progress = ((currentIdx) / questions.length) * 100

  // Shuffle options when question changes
  useEffect(() => {
    if (currentQ?.options) {
      setShuffledOptions(shuffle(currentQ.options))
    }
  }, [currentIdx, currentQ])

  // Timer
  useEffect(() => {
    if (state !== 'playing' || isAnswered || !currentQ?.timeLimit) return
    setTimeLeft(currentQ.timeLimit)
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval)
          handleTimeUp()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [currentIdx, state, isAnswered])

  const handleTimeUp = useCallback(() => {
    if (isAnswered) return
    setIsAnswered(true)
    setStreak(0)
    setAnswers((prev) => [
      ...prev,
      {
        question: currentQ.question,
        selected: '(Time up)',
        correct: Array.isArray(currentQ.correctAnswer) ? currentQ.correctAnswer[0] : currentQ.correctAnswer,
        isCorrect: false,
      },
    ])
    toast.error("⏰ Time's up!")
  }, [isAnswered, currentQ])

  const handleAnswer = (answer: string) => {
    if (isAnswered) return
    setSelectedAnswer(answer)
    setIsAnswered(true)

    const correct = Array.isArray(currentQ.correctAnswer)
      ? currentQ.correctAnswer.includes(answer)
      : currentQ.correctAnswer === answer

    setAnswers((prev) => [
      ...prev,
      { question: currentQ.question, selected: answer, correct: Array.isArray(currentQ.correctAnswer) ? currentQ.correctAnswer[0] : currentQ.correctAnswer, isCorrect: correct },
    ])

    if (correct) {
      const newStreak = streak + 1
      setStreak(newStreak)
      setScore((s) => s + currentQ.points)
      toast.success(newStreak >= 3 ? `🔥 ${newStreak}x Streak! +${currentQ.points} pts` : `✅ Correct! +${currentQ.points} pts`)
    } else {
      setStreak(0)
      toast.error(randomFrom(ENCOURAGEMENT_MESSAGES))
    }
  }

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    } else {
      finishQuiz()
    }
  }

  const finishQuiz = () => {
    const pct = Math.round((score / totalPoints) * 100)
    const earnedXP = Math.round(xpReward * (pct / 100))
    const earnedCoins = Math.round(coinReward * (pct / 100))

    addXP(earnedXP, 'quiz')
    addCoins(earnedCoins)

    if (pct >= 80) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    }

    onComplete?.(pct, earnedXP, earnedCoins)
    setState('result')
  }

  // ── Intro Screen ───────────────────────────────────────────
  if (state === 'intro') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto text-center p-8"
      >
        <div className="text-6xl mb-4 animate-bounce-slow">🎯</div>
        <h1 className="font-display text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground mb-6">
          {questions.length} questions • Earn up to {xpReward} XP & {coinReward} 🪙
        </p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: '❓', label: 'Questions', value: questions.length },
            { icon: '⚡', label: 'Max XP', value: xpReward },
            { icon: '🪙', label: 'Max Coins', value: coinReward },
          ].map(s => (
            <div key={s.label} className="bg-muted rounded-2xl p-3 text-center">
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="font-display font-bold text-lg">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <Button onClick={() => setState('playing')} size="xl" className="w-full">
          <Zap className="w-5 h-5" />
          Start Quiz!
        </Button>
        {onBack && (
          <button onClick={onBack} className="mt-3 text-sm text-muted-foreground hover:text-foreground">
            ← Back to lesson
          </button>
        )}
      </motion.div>
    )
  }

  // ── Result Screen ──────────────────────────────────────────
  if (state === 'result') {
    const pct = Math.round((score / totalPoints) * 100)
    const earnedXP = Math.round(xpReward * (pct / 100))
    const earnedCoins = Math.round(coinReward * (pct / 100))

    const stars = pct >= 90 ? 3 : pct >= 70 ? 2 : 1
    const messages = {
      3: ['Perfect! 🌟', 'Outstanding! 🎉', 'Brilliant! ⭐'],
      2: ['Well done! 👍', 'Great job! 🚀', 'Keep it up! 💪'],
      1: ['Good try! 💡', 'Practice more! 📚', 'You got this! 🌱'],
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto text-center p-8"
      >
        {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={200} />}

        <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-4xl p-8 mb-6">
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3].map((s) => (
              <motion.div
                key={s}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: s <= stars ? 1 : 0.6, rotate: 0 }}
                transition={{ delay: s * 0.2, type: 'spring' }}
              >
                <Star
                  className={cn('w-10 h-10', s <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-200')}
                />
              </motion.div>
            ))}
          </div>

          <h2 className="font-display text-3xl font-bold mb-2">
            {randomFrom(messages[stars as 1 | 2 | 3])}
          </h2>

          <div className="text-6xl font-display font-bold text-gradient-primary mb-2">{pct}%</div>
          <p className="text-muted-foreground">{score} / {totalPoints} points</p>

          <div className="grid grid-cols-2 gap-4 mt-6">
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
        </div>

        <div className="space-y-3">
          <Button onClick={() => {
            setCurrentIdx(0); setSelectedAnswer(null); setIsAnswered(false)
            setScore(0); setStreak(0); setAnswers([]); setState('playing')
          }} variant="outline" className="w-full gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
          {onBack && (
            <Button onClick={onBack} className="w-full">
              Continue Learning 🚀
            </Button>
          )}
        </div>

        {/* Answer review */}
        <div className="mt-6 text-left space-y-2">
          <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wide">Review Answers</h3>
          {answers.map((a, i) => (
            <div key={i} className={cn('flex items-start gap-2 p-3 rounded-xl text-sm', a.isCorrect ? 'bg-green-50' : 'bg-red-50')}>
              {a.isCorrect
                ? <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                : <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />}
              <div>
                <p className="font-semibold">{a.question}</p>
                {!a.isCorrect && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Correct: <span className="text-green-600 font-bold">{a.correct}</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    )
  }

  // ── Playing Screen ─────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
          <span>{currentIdx + 1} / {questions.length}</span>
        </div>
        {currentQ?.timeLimit && timeLeft > 0 && (
          <div className={cn(
            'flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-full text-sm',
            timeLeft > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700 animate-pulse'
          )}>
            <Timer className="w-4 h-4" />
            {timeLeft}s
          </div>
        )}
        <div className="flex items-center gap-1 font-bold text-purple-700">
          <Trophy className="w-4 h-4 text-yellow-500" />
          {score} pts
        </div>
      </div>

      {/* Progress */}
      <Progress value={progress} className="mb-6 h-2.5" indicatorClassName="bg-gradient-to-r from-purple-500 to-pink-500" />

      {/* Question card — larger text + emoji-friendly display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="card-kid p-6 mb-6"
        >
          {/* Question image */}
          {currentQ?.imageUrl && (
            <img src={currentQ.imageUrl} alt="Question" className="w-full max-h-48 object-contain rounded-2xl mb-4" />
          )}
          <p className="font-display text-xl font-bold text-center leading-relaxed whitespace-pre-line">
            {currentQ?.question}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Answer options */}
      <div className={cn(
        'grid gap-3 mb-4',
        currentQ?.type === 'true_false' ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'
      )}>
        {currentQ?.type === 'true_false'
          ? ['True', 'False'].map((opt, idx) => (
            <AnswerButton
              key={opt}
              opt={opt}
              index={idx}
              selected={selectedAnswer}
              correct={Array.isArray(currentQ.correctAnswer) ? currentQ.correctAnswer[0] : currentQ.correctAnswer}
              isAnswered={isAnswered}
              onClick={() => handleAnswer(opt)}
            />
          ))
          : shuffledOptions.map((opt, idx) => (
            <AnswerButton
              key={opt}
              opt={opt}
              index={idx}
              selected={selectedAnswer}
              correct={Array.isArray(currentQ.correctAnswer) ? currentQ.correctAnswer[0] : currentQ.correctAnswer}
              isAnswered={isAnswered}
              onClick={() => handleAnswer(opt)}
            />
          ))}
      </div>

      {/* Explanation + Next */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {currentQ?.explanation && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-3 text-sm">
                <p className="font-bold text-blue-700 mb-1">💡 Did you know?</p>
                <p className="text-blue-600">{currentQ.explanation}</p>
              </div>
            )}
            <Button onClick={handleNext} className="w-full" size="lg">
              {currentIdx < questions.length - 1 ? (
                <>Next <ArrowRight className="w-5 h-5" /></>
              ) : (
                <>See Results! 🏆</>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function AnswerButton({
  opt, index, selected, correct, isAnswered, onClick,
}: {
  opt: string; index: number; selected: string | null; correct: string; isAnswered: boolean; onClick: () => void
}) {
  const isSelected = selected === opt
  const isCorrect = correct === opt
  const LABELS = ['A', 'B', 'C', 'D', 'E', 'F']
  const label = LABELS[index] ?? String(index + 1)

  // Detect if opt is a "visual" answer: pure number, short text (≤6 chars), or starts with emoji
  const isVisual = /^[\d.%+\-×÷=]+$/.test(opt.trim()) || opt.trim().length <= 5

  return (
    <motion.button
      whileHover={!isAnswered ? { scale: 1.02 } : {}}
      whileTap={!isAnswered ? { scale: 0.97 } : {}}
      onClick={onClick}
      disabled={isAnswered}
      className={cn(
        'answer-option transition-all',
        isVisual ? 'flex-col items-center justify-center text-center py-5 min-h-[72px]' : 'text-left',
        isAnswered && isCorrect && 'correct',
        isAnswered && isSelected && !isCorrect && 'wrong',
        !isAnswered && 'hover:border-primary hover:bg-primary/5'
      )}
    >
      {isVisual ? (
        <>
          <span className="font-display font-bold text-2xl mb-1">{opt}</span>
          <span className={cn(
            'text-xs font-bold px-2 py-0.5 rounded-full',
            !isAnswered && 'bg-gray-100 text-gray-500',
            isAnswered && isCorrect && 'bg-green-500 text-white',
            isAnswered && isSelected && !isCorrect && 'bg-red-500 text-white',
            isAnswered && !isSelected && !isCorrect && 'bg-gray-100 text-gray-500',
          )}>
            {isAnswered && isCorrect ? '✓' : isAnswered && isSelected && !isCorrect ? '✗' : label}
          </span>
        </>
      ) : (
        <>
          <div className={cn(
            'w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0',
            !isAnswered && 'bg-gray-100 text-gray-600',
            isAnswered && isCorrect && 'bg-green-500 text-white',
            isAnswered && isSelected && !isCorrect && 'bg-red-500 text-white',
            isAnswered && !isSelected && !isCorrect && 'bg-gray-100 text-gray-400'
          )}>
            {isAnswered && isCorrect ? <CheckCircle className="w-5 h-5" /> :
              isAnswered && isSelected && !isCorrect ? <XCircle className="w-5 h-5" /> :
                label}
          </div>
          <span className="font-semibold">{opt}</span>
        </>
      )}
    </motion.button>
  )
}
