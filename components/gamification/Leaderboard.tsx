'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Star, Crown, Medal } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LeaderboardEntry } from '@/types'

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  currentUserId?: string
  period?: 'daily' | 'weekly' | 'monthly' | 'alltime'
  className?: string
}

export function Leaderboard({ entries, currentUserId, period = 'weekly', className }: LeaderboardProps) {
  const top3 = entries.slice(0, 3)
  const rest = entries.slice(3)

  return (
    <div className={cn('space-y-4', className)}>
      {/* Top 3 Podium */}
      {top3.length >= 3 && (
        <div className="flex items-end justify-center gap-3 pt-4 pb-2">
          {/* 2nd place */}
          <PodiumEntry entry={top3[1]} rank={2} currentUserId={currentUserId} />
          {/* 1st place (tallest) */}
          <PodiumEntry entry={top3[0]} rank={1} currentUserId={currentUserId} featured />
          {/* 3rd place */}
          <PodiumEntry entry={top3[2]} rank={3} currentUserId={currentUserId} />
        </div>
      )}

      {/* Rest of leaderboard */}
      <div className="space-y-2">
        {rest.map((entry, i) => (
          <LeaderboardRow
            key={entry.studentId}
            entry={entry}
            rank={i + 4}
            isCurrentUser={entry.studentId === currentUserId}
          />
        ))}
      </div>
    </div>
  )
}

function PodiumEntry({
  entry,
  rank,
  currentUserId,
  featured = false,
}: {
  entry: LeaderboardEntry
  rank: number
  currentUserId?: string
  featured?: boolean
}) {
  const isCurrentUser = entry.studentId === currentUserId
  const heights = { 1: 'h-24', 2: 'h-16', 3: 'h-12' }
  const colors = {
    1: 'from-yellow-400 to-yellow-600',
    2: 'from-gray-300 to-gray-400',
    3: 'from-orange-400 to-amber-500',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (3 - rank) * 0.15 }}
      className="flex flex-col items-center gap-2"
    >
      {rank === 1 && (
        <motion.div
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Crown className="w-7 h-7 text-yellow-500" />
        </motion.div>
      )}
      <div className="relative">
        <img
          src={entry.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${entry.displayName}`}
          alt={entry.displayName}
          className={cn(
            'rounded-full border-4 object-cover',
            featured ? 'w-16 h-16' : 'w-12 h-12',
            isCurrentUser ? 'border-primary' : 'border-white',
            rank === 1 && 'border-yellow-400',
            rank === 2 && 'border-gray-400',
            rank === 3 && 'border-orange-400'
          )}
        />
        <div
          className={cn(
            'absolute -bottom-1 -right-1 rounded-full flex items-center justify-center font-display font-bold text-white text-xs',
            featured ? 'w-6 h-6' : 'w-5 h-5',
            `bg-gradient-to-br ${colors[rank as 1 | 2 | 3]}`
          )}
        >
          {rank}
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs font-bold text-foreground truncate max-w-[70px]">
          {entry.displayName}
        </p>
        <p className="text-xs text-muted-foreground font-semibold">
          {entry.xp.toLocaleString()} XP
        </p>
      </div>
      {/* Podium block */}
      <div
        className={cn(
          'w-16 rounded-t-xl flex items-center justify-center',
          heights[rank as 1 | 2 | 3],
          `bg-gradient-to-br ${colors[rank as 1 | 2 | 3]}`
        )}
      >
        <span className="text-white font-display font-bold text-lg">{rank}</span>
      </div>
    </motion.div>
  )
}

function LeaderboardRow({
  entry,
  rank,
  isCurrentUser,
}: {
  entry: LeaderboardEntry
  rank: number
  isCurrentUser: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: (rank - 4) * 0.05 }}
      className={cn(
        'flex items-center gap-3 p-3 rounded-2xl transition-colors',
        isCurrentUser
          ? 'bg-primary/10 border-2 border-primary/30'
          : 'bg-muted/50 hover:bg-muted'
      )}
    >
      <span className="w-6 text-center text-sm font-bold text-muted-foreground">
        {rank}
      </span>
      <img
        src={entry.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${entry.displayName}`}
        alt={entry.displayName}
        className="w-8 h-8 rounded-full border-2 border-white object-cover"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold truncate">
          {entry.displayName}
          {isCurrentUser && (
            <span className="ml-2 text-xs text-primary font-semibold">(You)</span>
          )}
        </p>
        <p className="text-xs text-muted-foreground">Level {entry.level}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-primary">{entry.xp.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">XP</p>
      </div>
    </motion.div>
  )
}
