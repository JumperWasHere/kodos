'use client'

import { useState } from 'react'
import { Leaderboard } from '@/components/gamification/Leaderboard'
import type { LeaderboardEntry } from '@/types'

const PERIODS = [
  ['weekly', 'Weekly'], ['monthly', 'Monthly'], ['alltime', 'All Time'],
] as const

export default function LeaderboardClient({ initialEntries, currentUserId }: { initialEntries: LeaderboardEntry[]; currentUserId?: string }) {
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'alltime'>('alltime')
  const [entries, setEntries] = useState(initialEntries)
  const [loading, setLoading] = useState(false)

  // Fetch fresh leaderboard rows when the period changes so the UI stays current.
  const changePeriod = async (nextPeriod: typeof period) => {
    setPeriod(nextPeriod)
    setLoading(true)
    try {
      const response = await fetch(`/api/leaderboard?period=${nextPeriod}&limit=20`)
      const payload = await response.json()
      if (response.ok) setEntries(payload.data)
    } finally { setLoading(false) }
  }

  return <>
    <div className="flex gap-2 mb-6">
      {PERIODS.map(([value, label]) => <button key={value} onClick={() => changePeriod(value)} className={`px-4 py-2 rounded-2xl text-sm font-bold border-2 transition-colors ${period === value ? 'border-primary text-primary bg-primary/5' : 'bg-white border-gray-200 hover:border-primary hover:text-primary'}`}>{label}</button>)}
    </div>
    <div className="card-kid p-4">{loading ? <p className="text-center py-10 text-muted-foreground">Loading leaderboard…</p> : entries.length ? <Leaderboard entries={entries} currentUserId={currentUserId} period={period} /> : <p className="text-center py-10 text-muted-foreground">No activity in this period yet.</p>}</div>
  </>
}
