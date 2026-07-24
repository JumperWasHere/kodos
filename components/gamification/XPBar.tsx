'use client'

import { motion } from 'framer-motion'
import { cn, formatXP } from '@/lib/utils'
import { getXPProgress } from '@/store/gamificationStore'

interface XPBarProps {
  xp: number
  level: number
  className?: string
  showLabels?: boolean
  compact?: boolean
  color?: string
}

export function XPBar({ xp, level, className, showLabels = true, compact = false, color }: XPBarProps) {
  const { current, required, percentage } = getXPProgress(xp)

  return (
    <div className={cn('w-full', className)}>
      {showLabels && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-muted-foreground">
            Level {level}
          </span>
          <span className="text-xs font-bold text-muted-foreground">
            {formatXP(current)} / {formatXP(required)} XP
          </span>
        </div>
      )}
      <div className={cn('relative rounded-full overflow-hidden bg-black/10', compact ? 'h-2.5' : 'h-4')}>
        <motion.div
          className={cn(
            'h-full rounded-full relative overflow-hidden',
            color ?? 'bg-gradient-to-r from-yellow-400 to-orange-400'
          )}
          initial={{ width: '0%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </motion.div>
        {!compact && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-black text-white drop-shadow mix-blend-luminosity">
              {percentage.toFixed(0)}%
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

