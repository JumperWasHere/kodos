import { getActiveChild } from '@/lib/auth/active-child'
import { connectDB } from '@/lib/db/connect'
import { Badge, Student } from '@/lib/db/models'
import { Trophy, Lock } from 'lucide-react'
import { cn, getRarityColor, getRarityLabel } from '@/lib/utils'

export default async function AchievementsPage() {
  const [activeChild] = await Promise.all([getActiveChild(), connectDB()])
  if (!activeChild) return null
  const [student, badges] = await Promise.all([
    Student.findById(activeChild._id).select('badges').lean() as any,
    Badge.find({ isActive: true }).sort({ order: 1 }).lean() as unknown as any[],
  ])
  // Split badges into earned and locked sets so the page can show progress clearly.
  const earnedIds = new Set((student?.badges ?? []).map((id: { toString(): string }) => id.toString()))
  const earned = badges.filter((badge) => earnedIds.has(badge._id.toString()))
  const locked = badges.filter((badge) => !earnedIds.has(badge._id.toString()))
  const total = badges.length || 1

  const BadgeCard = ({ badge, earned: isEarned }: { badge: any; earned: boolean }) => (
    <div className={cn('card-kid p-4 text-center', !isEarned && 'opacity-50 grayscale')} style={{ borderTop: `3px solid ${getRarityColor(badge.rarity)}` }}>
      <div className="text-4xl mb-2">{badge.emoji || '🏅'}</div>
      <p className="font-bold text-xs leading-tight mb-1">{badge.name}</p>
      <p className="text-[10px] text-muted-foreground">{badge.description}</p>
      {isEarned ? <p className="text-[10px] font-bold uppercase mt-2" style={{ color: getRarityColor(badge.rarity) }}>{getRarityLabel(badge.rarity)}</p> : <Lock className="w-3 h-3 mx-auto mt-2 text-muted-foreground" />}
    </div>
  )

  return <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
    <div className="mb-8"><h1 className="font-display text-3xl font-bold mb-2 flex items-center gap-2"><Trophy className="w-8 h-8 text-yellow-500" />Achievements & Badges</h1><p className="text-muted-foreground">Collected <strong>{earned.length}</strong> out of <strong>{badges.length}</strong> badges</p></div>
    <div className="card-kid p-6 mb-8 bg-gradient-to-br from-yellow-50 to-orange-50"><div className="grid grid-cols-3 gap-6 text-center"><div><div className="font-display text-2xl font-bold text-green-600">{earned.length}</div><div className="text-xs text-muted-foreground font-semibold">Earned</div></div><div><div className="font-display text-2xl font-bold text-gray-500">{locked.length}</div><div className="text-xs text-muted-foreground font-semibold">Remaining</div></div><div><div className="font-display text-2xl font-bold text-purple-600">{Math.round((earned.length / total) * 100)}%</div><div className="text-xs text-muted-foreground font-semibold">Complete</div></div></div><div className="mt-4 h-3 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500" style={{ width: `${(earned.length / total) * 100}%` }} /></div></div>
    <section className="mb-8"><h2 className="font-display text-xl font-bold mb-4">✅ Earned Badges ({earned.length})</h2><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">{earned.map((badge) => <BadgeCard key={badge._id.toString()} badge={badge} earned />)}</div>{earned.length === 0 && <p className="text-muted-foreground text-sm">Complete lessons and maintain your streak to earn badges.</p>}</section>
    <section><h2 className="font-display text-xl font-bold mb-4">🔒 To Unlock ({locked.length})</h2><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">{locked.map((badge) => <BadgeCard key={badge._id.toString()} badge={badge} earned={false} />)}</div></section>
  </div>
}
