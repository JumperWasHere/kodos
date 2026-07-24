'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Zap, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useGamificationStore } from '@/store/gamificationStore'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'

interface LevelUpModalProps {
  newLevel: number
  onClose: () => void
}

export function LevelUpModal({ newLevel, onClose }: LevelUpModalProps) {
  const { width, height } = useWindowSize()

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <Confetti width={width} height={height} recycle={false} numberOfPieces={300} />
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 10 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="bg-white rounded-4xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Background decorations */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50" />
          <div className="blob w-32 h-32 bg-purple-400 -top-8 -left-8" />
          <div className="blob w-24 h-24 bg-pink-400 -bottom-4 -right-4" />

          <div className="relative z-10">
            <motion.div
              animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-glow-yellow"
            >
              <Star className="w-12 h-12 text-white" fill="white" />
            </motion.div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="font-display text-3xl font-bold text-gradient-primary mb-2"
            >
              Level Up! 🎉
            </motion.h2>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.5 }}
              className="level-badge w-20 h-20 mx-auto text-3xl mb-4"
            >
              {newLevel}
            </motion.div>

            <p className="text-muted-foreground font-semibold mb-2">
              You reached
            </p>
            <p className="font-display text-2xl font-bold text-foreground mb-4">
              Level {newLevel}!
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Amazing progress! New lessons and challenges are now unlocked! 🚀
            </p>

            <Button
              onClick={onClose}
              className="w-full"
              size="lg"
            >
              <Zap className="w-5 h-5" />
              Keep Learning!
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

interface AchievementToastProps {
  badge: {
    name: string
    description: string
    emoji?: string
    icon: string
    rarity: string
  }
  onClose: () => void
}

export function AchievementToast({ badge, onClose }: AchievementToastProps) {
  const rarityColors: Record<string, string> = {
    common: 'from-gray-400 to-gray-500',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-500',
  }

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', damping: 20 }}
      className="fixed bottom-6 right-6 z-50 bg-white rounded-3xl shadow-xl p-4 flex items-center gap-4 max-w-xs border border-purple-100"
    >
      <div className={cn('w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl', rarityColors[badge.rarity] ?? rarityColors.common)}>
        {badge.emoji || <Award className="w-6 h-6 text-white" />}
      </div>
      <div className="flex-1">
        <p className="text-xs font-bold text-primary uppercase tracking-wide">New Badge!</p>
        <p className="font-display font-bold text-sm">{badge.name}</p>
        <p className="text-xs text-muted-foreground truncate">{badge.description}</p>
      </div>
      <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

interface DailyRewardModalProps {
  day: number
  coins: number
  xp: number
  specialReward?: { name: string; emoji: string }
  onClaim: () => void
}

export function DailyRewardModal({ day, coins, xp, specialReward, onClaim }: DailyRewardModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.5, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="bg-white rounded-4xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-orange-50" />
          <div className="blob w-32 h-32 bg-yellow-300 -top-8 -right-8" />

          <div className="relative z-10">
            <div className="text-5xl mb-4 animate-bounce-slow">🎁</div>
            <h2 className="font-display text-2xl font-bold mb-1">Daily Reward!</h2>
            <p className="text-muted-foreground text-sm mb-6">Day {day} Check-In</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-yellow-50 rounded-2xl p-4 border-2 border-yellow-200">
                <div className="text-2xl mb-1">🪙</div>
                <p className="font-display font-bold text-xl text-yellow-700">+{coins}</p>
                <p className="text-xs text-muted-foreground">Coins</p>
              </div>
              <div className="bg-purple-50 rounded-2xl p-4 border-2 border-purple-200">
                <div className="text-2xl mb-1">⚡</div>
                <p className="font-display font-bold text-xl text-purple-700">+{xp}</p>
                <p className="text-xs text-muted-foreground">XP</p>
              </div>
            </div>

            {specialReward && (
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-3 mb-4 border-2 border-purple-200">
                <p className="text-xs font-bold text-purple-600 mb-1">BONUS REWARD!</p>
                <p className="font-bold">{specialReward.emoji} {specialReward.name}</p>
              </div>
            )}

            <Button onClick={onClaim} className="w-full" size="lg" variant="yellow">
              🎉 Claim Reward!
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
