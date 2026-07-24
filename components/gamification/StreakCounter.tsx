'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StreakCounterProps {
  days: number
  className?: string
  showLabel?: boolean
}

export function StreakCounter({ days, className, showLabel = true }: StreakCounterProps) {
  const isHot = days >= 3
  const isOnFire = days >= 7
  const isLegendary = days >= 30

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <motion.div
        animate={isOnFire ? { scale: [1, 1.1, 1], rotate: [-5, 5, -5, 0] } : {}}
        transition={{ repeat: Infinity, duration: 2 }}
        className="relative"
      >
        <Flame
          className={cn(
            'w-6 h-6 transition-colors',
            days === 0 && 'text-gray-300',
            days >= 1 && days < 3 && 'text-orange-300',
            isHot && !isOnFire && 'text-orange-400',
            isOnFire && !isLegendary && 'text-orange-500',
            isLegendary && 'text-red-500'
          )}
          style={
            isOnFire
              ? { filter: `drop-shadow(0 0 ${isLegendary ? '12' : '6'}px rgba(249,115,22,0.7))` }
              : undefined
          }
        />
        {isLegendary && (
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        )}
      </motion.div>
      <div>
        <motion.span
          key={days}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            'font-display font-bold text-lg',
            days === 0 && 'text-gray-400',
            days >= 1 && 'text-orange-500',
            isLegendary && 'text-gradient-gold'
          )}
        >
          {days}
        </motion.span>
        {showLabel && (
          <span className="text-xs text-muted-foreground ml-1">
            {days === 1 ? 'day' : 'days'}
          </span>
        )}
      </div>
    </div>
  )
}

interface RewardCoinsProps {
  coins: number
  className?: string
  animated?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function RewardCoins({ coins, className, animated = false, size = 'md' }: RewardCoinsProps) {
  const sizeClass = { sm: 'text-sm', md: 'text-base', lg: 'text-lg' }[size]
  const coinSize = { sm: 'w-4 h-4 text-xs', md: 'w-6 h-6 text-sm', lg: 'w-8 h-8 text-base' }[size]

  return (
    <div className={cn('flex items-center gap-1.5 font-bold', sizeClass, className)}>
      <motion.div
        animate={animated ? { rotate: [0, 360] } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={cn(
          'rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center border-2 border-yellow-200 shadow-sm',
          coinSize
        )}
      >
        🪙
      </motion.div>
      <span className="text-yellow-700">{coins.toLocaleString()}</span>
    </div>
  )
}

interface XPBadgeProps {
  xp: number
  className?: string
  animated?: boolean
}

export function XPBadge({ xp, className, animated = false }: XPBadgeProps) {
  return (
    <div className={cn('flex items-center gap-1.5 font-bold text-purple-700', className)}>
      <motion.div
        animate={animated ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.4 }}
        className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center"
      >
        <Zap className="w-3 h-3 text-white" />
      </motion.div>
      <span>+{xp} XP</span>
    </div>
  )
}
