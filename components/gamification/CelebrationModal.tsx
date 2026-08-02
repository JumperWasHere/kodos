'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Home, ChevronRight, Star } from 'lucide-react'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import { playCelebrationSound } from '@/lib/audio'

export interface CelebrationModalProps {
  stars: 0 | 1 | 2 | 3
  xpEarned: number
  coinsEarned: number
  mascot?: string
  title?: string
  subtitle?: string
  onRestart?: () => void
  onHome: () => void
  onNext?: () => void
  soundEnabled?: boolean
}

const DEFAULT_TITLES: Record<0 | 1 | 2 | 3, string> = {
  3: 'Amazing! 🎉',
  2: 'Great Job! 👏',
  1: 'Good Try! 💪',
  0: 'Keep Practising! 🌟',
}

export function CelebrationModal({
  stars,
  xpEarned,
  coinsEarned,
  mascot = '⭐',
  title,
  subtitle,
  onRestart,
  onHome,
  onNext,
  soundEnabled = true,
}: CelebrationModalProps) {
  const { width, height } = useWindowSize()

  useEffect(() => {
    if (soundEnabled && stars >= 2) {
      playCelebrationSound()
    }
  }, [soundEnabled, stars])

  const displayTitle = title ?? DEFAULT_TITLES[stars]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      >
        {stars >= 2 && (
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={350}
            gravity={0.25}
          />
        )}

        <motion.div
          initial={{ scale: 0, rotate: -6 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 6 }}
          transition={{ type: 'spring', damping: 18, stiffness: 220 }}
          className="relative bg-gradient-to-br from-indigo-600 to-purple-700 rounded-4xl p-8 max-w-sm w-full text-center shadow-2xl overflow-hidden"
        >
          {/* Decorative blobs */}
          <div className="blob w-36 h-36 bg-white/10 -top-10 -left-10" />
          <div className="blob w-28 h-28 bg-white/10 -bottom-6 -right-6" />

          <div className="relative z-10 space-y-5">
            {/* Mascot */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-24 h-24 mx-auto rounded-full bg-white/20 flex items-center justify-center text-5xl shadow-lg"
              aria-hidden="true"
            >
              {mascot}
            </motion.div>

            {/* Title */}
            <div>
              <h2 className="font-display text-3xl font-bold text-white">{displayTitle}</h2>
              {subtitle && <p className="text-white/70 text-sm mt-1">{subtitle}</p>}
            </div>

            {/* Star rating */}
            <div className="flex justify-center gap-2" role="img" aria-label={`${stars} out of 3 stars`}>
              {[1, 2, 3].map((n) => (
                <motion.div
                  key={n}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: 'spring',
                    damping: 12,
                    stiffness: 260,
                    delay: 0.25 + n * 0.12,
                  }}
                >
                  <Star
                    className={`w-10 h-10 drop-shadow-md ${
                      n <= stars ? 'text-yellow-400' : 'text-white/25'
                    }`}
                    fill={n <= stars ? '#FACC15' : 'none'}
                    strokeWidth={1.5}
                  />
                </motion.div>
              ))}
            </div>

            {/* XP + Coins */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/15 rounded-2xl py-3 px-4">
                <div className="text-2xl mb-0.5">⚡</div>
                <p className="font-display font-bold text-xl text-yellow-300">+{xpEarned}</p>
                <p className="text-xs text-white/70">XP</p>
              </div>
              <div className="bg-white/15 rounded-2xl py-3 px-4">
                <div className="text-2xl mb-0.5">🪙</div>
                <p className="font-display font-bold text-xl text-yellow-300">+{coinsEarned}</p>
                <p className="text-xs text-white/70">Coins</p>
              </div>
            </div>

            {/* Action buttons — icon-first so pre-readers can navigate by icon */}
            <div className="flex justify-center gap-3 flex-wrap">
              {onRestart && (
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={onRestart}
                  className="flex flex-col items-center gap-1.5 bg-white/20 hover:bg-white/30 active:bg-white/10 text-white rounded-3xl px-5 py-3 min-w-[72px] min-h-[72px] transition-colors"
                  aria-label="Play again"
                >
                  <RotateCcw className="w-8 h-8" strokeWidth={2} />
                  <span className="text-xs font-bold">Again</span>
                </motion.button>
              )}

              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={onHome}
                className="flex flex-col items-center gap-1.5 bg-white/20 hover:bg-white/30 active:bg-white/10 text-white rounded-3xl px-5 py-3 min-w-[72px] min-h-[72px] transition-colors"
                aria-label="Go home"
              >
                <Home className="w-8 h-8" strokeWidth={2} />
                <span className="text-xs font-bold">Home</span>
              </motion.button>

              {onNext && (
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={onNext}
                  className="flex flex-col items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-gray-900 rounded-3xl px-5 py-3 min-w-[72px] min-h-[72px] transition-colors"
                  aria-label="Next activity"
                >
                  <ChevronRight className="w-8 h-8" strokeWidth={2.5} />
                  <span className="text-xs font-bold">Next</span>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
