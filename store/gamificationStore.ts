import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getLevelFromXP } from '@/lib/utils'

interface XPGain {
  amount: number
  source: string
  timestamp: number
}

interface GamificationState {
  xp: number
  level: number
  coins: number
  gems: number
  streakDays: number
  lastLoginDate: string | null
  pendingXP: number
  pendingCoins: number
  recentXPGains: XPGain[]
  showLevelUpModal: boolean
  newBadges: string[]
  // Actions
  addXP: (amount: number, source?: string) => void
  addCoins: (amount: number) => void
  addGems: (amount: number) => void
  spendCoins: (amount: number) => boolean
  setStreak: (days: number) => void
  checkAndUpdateStreak: () => void
  setShowLevelUpModal: (show: boolean) => void
  clearNewBadges: () => void
  addNewBadge: (badgeId: string) => void
  syncWithServer: (data: Partial<GamificationState>) => void
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      coins: 100,
      gems: 0,
      streakDays: 0,
      lastLoginDate: null,
      pendingXP: 0,
      pendingCoins: 0,
      recentXPGains: [],
      showLevelUpModal: false,
      newBadges: [],

      addXP: (amount, source = 'lesson') => {
        set((state) => {
          const newXP = state.xp + amount
          const oldLevel = state.level
          const newLevel = getLevelFromXP(newXP)
          const gains = [
            ...state.recentXPGains.slice(-4),
            { amount, source, timestamp: Date.now() },
          ]
          return {
            xp: newXP,
            level: newLevel,
            recentXPGains: gains,
            showLevelUpModal: newLevel > oldLevel,
          }
        })
      },

      addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
      addGems: (amount) => set((state) => ({ gems: state.gems + amount })),

      spendCoins: (amount) => {
        const { coins } = get()
        if (coins < amount) return false
        set((state) => ({ coins: state.coins - amount }))
        return true
      },

      setStreak: (days) => set({ streakDays: days }),

      checkAndUpdateStreak: () => {
        const today = new Date().toDateString()
        const { lastLoginDate, streakDays } = get()

        if (lastLoginDate === today) return

        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)

        const isConsecutive = lastLoginDate === yesterday.toDateString()
        const newStreak = isConsecutive ? streakDays + 1 : 1

        set({ streakDays: newStreak, lastLoginDate: today })
      },

      setShowLevelUpModal: (show) => set({ showLevelUpModal: show }),

      addNewBadge: (badgeId) =>
        set((state) => ({ newBadges: [...state.newBadges, badgeId] })),

      clearNewBadges: () => set({ newBadges: [] }),

      syncWithServer: (data) => set((state) => ({ ...state, ...data })),
    }),
    {
      name: 'kidos-gamification',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
