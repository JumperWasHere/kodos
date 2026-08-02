import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { SubjectSlug, AgeGroup } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatXP(xp: number): string {
  if (xp >= 1_000_000) return `${(xp / 1_000_000).toFixed(1)}M`
  if (xp >= 1_000) return `${(xp / 1_000).toFixed(1)}K`
  return xp.toString()
}

export function formatCoins(coins: number): string {
  if (coins >= 1_000) return `${(coins / 1_000).toFixed(1)}K`
  return coins.toString()
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-MY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const then = new Date(date)
  const diff = now.getTime() - then.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 7) return formatDate(date)
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'just now'
}

export function getSubjectColor(slug: SubjectSlug): string {
  const colors: Record<SubjectSlug, string> = {
    mathematics: '#3B82F6',
    english: '#8B5CF6',
    science: '#10B981',
    'bahasa-malaysia': '#F59E0B',
    mandarin: '#EF4444',
    geography: '#06B6D4',
    history: '#78716C',
    art: '#EC4899',
    ict: '#6366F1',
  }
  return colors[slug] ?? '#6B7280'
}

export function getSubjectGradient(slug: SubjectSlug): string {
  const gradients: Record<SubjectSlug, string> = {
    mathematics: 'from-blue-500 to-blue-700',
    english: 'from-purple-500 to-purple-700',
    science: 'from-emerald-500 to-emerald-700',
    'bahasa-malaysia': 'from-amber-500 to-amber-700',
    mandarin: 'from-red-500 to-red-700',
    geography: 'from-cyan-500 to-cyan-700',
    history: 'from-stone-500 to-stone-700',
    art: 'from-pink-500 to-pink-700',
    ict: 'from-indigo-500 to-indigo-700',
  }
  return gradients[slug] ?? 'from-gray-500 to-gray-700'
}

export function getSubjectIcon(slug: SubjectSlug): string {
  const icons: Record<SubjectSlug, string> = {
    mathematics: '🔢',
    english: '📖',
    science: '🔬',
    'bahasa-malaysia': '🇲🇾',
    mandarin: '🀄',
    geography: '🌏',
    history: '🏛️',
    art: '🎨',
    ict: '💻',
  }
  return icons[slug] ?? '📚'
}

export function getAgeGroupLabel(ageGroup: AgeGroup): string {
  const labels: Record<AgeGroup, string> = {
    toddler: 'Little Ones (1–3)',
    preschool: 'Preschool (3–6)',
    lower_primary: 'Lower Primary (7–9)',
    upper_primary: 'Upper Primary (10–12)',
  }
  return labels[ageGroup]
}

export function getGradeLabel(grade: number): string {
  if (grade === 0) return 'Preschool'
  return `Year ${grade}`
}

// XP required to go from `level` to `level + 1` (exponential growth).
// Single source of truth shared by the client store and API routes.
export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1))
}

export function totalXPForLevel(level: number): number {
  let total = 0
  for (let i = 1; i < level; i++) {
    total += xpForLevel(i)
  }
  return total
}

export function getLevelFromXP(xp: number): number {
  let level = 1
  let totalXP = 0
  while (totalXP + xpForLevel(level) <= xp) {
    totalXP += xpForLevel(level)
    level++
  }
  return level
}

export function getXPProgress(xp: number): { current: number; required: number; percentage: number } {
  const level = getLevelFromXP(xp)
  const totalForCurrentLevel = totalXPForLevel(level)
  const required = xpForLevel(level)
  const current = xp - totalForCurrentLevel
  const percentage = Math.min((current / required) * 100, 100)
  return { current, required, percentage }
}

export function calculateLevel(xp: number): number {
  return getLevelFromXP(xp)
}

export function xpForNextLevel(level: number): number {
  return xpForLevel(level)
}

export function getRarityColor(rarity: string): string {
  const colors: Record<string, string> = {
    common: '#6B7280',
    rare: '#3B82F6',
    epic: '#8B5CF6',
    legendary: '#F59E0B',
  }
  return colors[rarity] ?? '#6B7280'
}

export function getRarityLabel(rarity: string): string {
  const labels: Record<string, string> = {
    common: 'Common',
    rare: 'Rare',
    epic: 'Epic',
    legendary: 'Legendary ✨',
  }
  return labels[rarity] ?? rarity
}

export function generateAvatarUrl(seed: string): string {
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

export function truncate(text: string, length = 100): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '…'
}

export function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function percentOf(value: number, total: number): number {
  if (total === 0) return 0
  return clamp(Math.round((value / total) * 100), 0, 100)
}

export function formatCurrency(amount: number, currency = 'MYR'): string {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount / 100) // Stripe amounts in cents
}

export function isToday(date: Date | string): boolean {
  const today = new Date()
  const d = new Date(date)
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  )
}

export function getDaysUntil(date: Date | string): number {
  const now = new Date()
  const then = new Date(date)
  const diff = then.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export const MOTIVATION_MESSAGES = [
  "Amazing work! Keep it up! 🌟",
  "You're a superstar! ⭐",
  "Fantastic job! 🎉",
  "Brilliant! You're doing great! 🚀",
  "Keep going, champion! 🏆",
  "Excellent work! You're so smart! 💡",
  "Wow, you're on fire! 🔥",
  "Learning hero! That's you! 🦸",
]

export const ENCOURAGEMENT_MESSAGES = [
  "Don't give up! You've got this! 💪",
  "Try again — you're getting closer! 🎯",
  "Mistakes help us learn! Try once more! 📚",
  "Almost there! Give it another go! ⚡",
  "Every expert was once a beginner! 🌱",
]
