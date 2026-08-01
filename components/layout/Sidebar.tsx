'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, BookOpen, Trophy, Star, LogOut,
  Flame, Zap, Menu, X, CreditCard, BookMarked,
  Users, BarChart3, Settings, ClipboardList
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/uiStore'
import { useGamificationStore } from '@/store/gamificationStore'
import type { UserRole } from '@/types'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: string
}

// Only link to pages that exist — placeholder sections (classes, reports,
// admin tools) come back here once their pages are built.
const STUDENT_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/student/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Subjects', href: '/student/subjects', icon: <BookOpen className="w-5 h-5" /> },
  { label: 'Achievements', href: '/student/achievements', icon: <Trophy className="w-5 h-5" /> },
  { label: 'Leaderboard', href: '/student/leaderboard', icon: <Star className="w-5 h-5" /> },
]

const PARENT_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/parent/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Subscription', href: '/parent/subscription', icon: <CreditCard className="w-5 h-5" /> },
]

const TEACHER_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/teacher/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'My Quizzes', href: '/teacher/quizzes', icon: <BookMarked className="w-5 h-5" /> },
  { label: 'My Classes', href: '/teacher/classes', icon: <Users className="w-5 h-5" /> },
  { label: 'Assignments', href: '/teacher/assignments', icon: <ClipboardList className="w-5 h-5" /> },
  { label: 'Analytics', href: '/teacher/analytics', icon: <BarChart3 className="w-5 h-5" /> },
  { label: 'Settings', href: '/teacher/settings', icon: <Settings className="w-5 h-5" /> },
]

const ADMIN_NAV: NavItem[] = [
  { label: 'Overview', href: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Quizzes', href: '/teacher/quizzes', icon: <BookMarked className="w-5 h-5" /> },
]

const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  student: STUDENT_NAV,
  child: STUDENT_NAV,
  parent: PARENT_NAV,
  teacher: TEACHER_NAV,
  admin: ADMIN_NAV,
}

interface SidebarProps {
  role: UserRole
  user: {
    name: string
    email: string
    avatar?: string
    displayName?: string
    level?: number
    xp?: number
    streakDays?: number
  }
}

export function Sidebar({ role, user }: SidebarProps) {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen } = useUIStore()
  const { coins } = useGamificationStore()
  const navItems = NAV_BY_ROLE[role]

  const displayName = user.displayName || user.name.split(' ')[0]

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 bottom-0 z-50 w-64 bg-white border-r border-border flex flex-col',
          'shadow-xl lg:shadow-none',
          'transition-transform duration-300',
          // Mobile: slide in/out based on state; Desktop: always visible
          'lg:relative lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <Link href={`/${role}/dashboard`} className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg">
              🎓
            </div>
            <span className="font-display font-bold text-xl text-gradient-primary">KidOS</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-muted"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User info */}
        {role === 'student' && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`}
                  alt={displayName}
                  className="w-10 h-10 rounded-2xl border-2 border-purple-200 object-cover"
                />
                <div className="level-badge absolute -bottom-1.5 -right-1.5 w-5 h-5 text-[10px]">
                  {user.level ?? 1}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{displayName}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Zap className="w-3 h-3 text-purple-500" />
                  <span>{(user.xp ?? 0).toLocaleString()} XP</span>
                  <span>·</span>
                  <span className="text-yellow-600 font-semibold">🪙 {coins}</span>
                </div>
              </div>
            </div>
            {user.streakDays !== undefined && user.streakDays > 0 && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-orange-500 font-bold">
                <Flame className="w-3.5 h-3.5" />
                {user.streakDays} day streak!
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'nav-item',
                  isActive && 'active'
                )}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-3 border-t border-border">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="nav-item w-full text-red-500 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}

// Top Navigation Bar
export function TopNav({ role, userName, showProfileSwitcher = false }: { role: UserRole; userName: string; showProfileSwitcher?: boolean }) {
  const { toggleSidebar } = useUIStore()
  const { update } = useSession()

  const switchProfile = async () => {
    await update({ activeChildId: null })
    window.location.assign('/profiles')
  }

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-border flex items-center px-4 gap-4">
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 rounded-xl hover:bg-muted transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        {showProfileSwitcher && <button onClick={switchProfile} className="rounded-xl px-3 py-1.5 text-sm font-semibold text-violet-700 hover:bg-violet-50">Switch Profile</button>}
        <span className="text-sm font-semibold text-muted-foreground hidden sm:block">
          Hi, {userName.split(' ')[0]}!
        </span>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  )
}
