'use client'

import { motion } from 'framer-motion'
import { Trophy, Star, Lock } from 'lucide-react'
import { cn, getRarityColor, getRarityLabel } from '@/lib/utils'

const MOCK_BADGES = [
  { id: '1', name: 'First Step', description: 'Complete your first lesson!', emoji: '👣', rarity: 'common', earned: true, earnedAt: '2024-01-15' },
  { id: '2', name: 'Quick Learner', description: 'Complete 10 lessons', emoji: '⚡', rarity: 'common', earned: true, earnedAt: '2024-01-20' },
  { id: '3', name: 'Hot Streak', description: 'Login for 3 days in a row', emoji: '🔥', rarity: 'common', earned: true, earnedAt: '2024-01-22' },
  { id: '4', name: 'Week Warrior', description: 'Login for 7 days in a row', emoji: '⚔️', rarity: 'rare', earned: true, earnedAt: '2024-01-28' },
  { id: '5', name: 'Perfect Score', description: 'Get 100% on any quiz', emoji: '⭐', rarity: 'rare', earned: true, earnedAt: '2024-02-01' },
  { id: '6', name: 'Knowledge Seeker', description: 'Complete 50 lessons', emoji: '📚', rarity: 'rare', earned: false },
  { id: '7', name: 'Math Whiz', description: 'Master Mathematics Level 1', emoji: '🔢', rarity: 'epic', earned: false },
  { id: '8', name: 'Scholar', description: 'Complete 100 lessons', emoji: '🎓', rarity: 'epic', earned: false },
  { id: '9', name: 'Monthly Master', description: '30-day login streak', emoji: '🏆', rarity: 'legendary', earned: false },
  { id: '10', name: 'Super Star', description: 'Reach 5000 XP', emoji: '🌟', rarity: 'legendary', earned: false },
  { id: '11', name: 'Malaysia Boleh!', description: 'Complete Geography module', emoji: '🇲🇾', rarity: 'rare', earned: false },
  { id: '12', name: 'XP Champion', description: 'Reach 1000 XP', emoji: '✨', rarity: 'rare', earned: true, earnedAt: '2024-02-05' },
]

export default function AchievementsPage() {
  const earned = MOCK_BADGES.filter(b => b.earned)
  const locked = MOCK_BADGES.filter(b => !b.earned)

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2 flex items-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          Achievements & Badges
        </h1>
        <p className="text-muted-foreground">
          Collected <strong>{earned.length}</strong> out of <strong>{MOCK_BADGES.length}</strong> badges
        </p>
      </div>

      {/* Progress overview */}
      <div className="card-kid p-6 mb-8 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="grid grid-cols-3 gap-6 text-center">
          {[
            { label: 'Earned', value: earned.length, emoji: '✅', color: 'text-green-600' },
            { label: 'Remaining', value: locked.length, emoji: '🔒', color: 'text-gray-500' },
            { label: 'Completion', value: `${Math.round((earned.length / MOCK_BADGES.length) * 100)}%`, emoji: '📊', color: 'text-purple-600' },
          ].map(stat => (
            <div key={stat.label}>
              <div className="text-2xl mb-1">{stat.emoji}</div>
              <div className={cn('font-display text-2xl font-bold', stat.color)}>{stat.value}</div>
              <div className="text-xs text-muted-foreground font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(earned.length / MOCK_BADGES.length) * 100}%` }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
          />
        </div>
      </div>

      {/* Earned Badges */}
      <section className="mb-8">
        <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
          ✅ Earned Badges ({earned.length})
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {earned.map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.07, type: 'spring' }}
              whileHover={{ scale: 1.08 }}
              className="card-kid p-4 text-center cursor-pointer group"
              style={{ borderTop: `3px solid ${getRarityColor(badge.rarity)}` }}
            >
              <div className="text-4xl mb-2">{badge.emoji}</div>
              <p className="font-bold text-xs leading-tight mb-1">{badge.name}</p>
              <p
                className="text-[10px] font-bold uppercase"
                style={{ color: getRarityColor(badge.rarity) }}
              >
                {getRarityLabel(badge.rarity)}
              </p>
              {badge.earnedAt && (
                <p className="text-[10px] text-muted-foreground mt-1">
                  {new Date(badge.earnedAt).toLocaleDateString('en-MY', { month: 'short', day: 'numeric' })}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Locked Badges */}
      <section>
        <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
          🔒 To Unlock ({locked.length})
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {locked.map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.07 }}
              className="card-kid p-4 text-center opacity-50 grayscale"
            >
              <div className="text-4xl mb-2">{badge.emoji}</div>
              <p className="font-bold text-xs leading-tight mb-1">{badge.name}</p>
              <p className="text-[10px] text-muted-foreground">{badge.description}</p>
              <Lock className="w-3 h-3 mx-auto mt-2 text-muted-foreground" />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
