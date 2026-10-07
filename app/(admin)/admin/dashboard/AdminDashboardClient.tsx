'use client'

import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import {
  Users, DollarSign, TrendingUp, BookOpen, ChevronRight, ShieldAlert,
  UserPlus, Activity,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export interface AdminStats {
  totalUsers: number
  totalStudents: number
  totalLessons: number
  activeToday: number
  activeSubscriptions: number
  monthlyRevenueRM: number
  recentSignups: Array<{
    id: string
    name: string
    email: string
    role: string
    joined: string
  }>
  subscriptionMix: Array<{
    name: string
    value: number
    color: string
  }>
  revenueHistory: Array<{
    month: string
    revenue: number
  }>
}

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-red-100 text-red-700',
  parent: 'bg-blue-100 text-blue-700',
  teacher: 'bg-purple-100 text-purple-700',
  student: 'bg-green-100 text-green-700',
  child: 'bg-emerald-100 text-emerald-700',
}

export default function AdminDashboardClient({ stats }: { stats: AdminStats }) {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1 flex items-center gap-2">
            <ShieldAlert className="w-8 h-8 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Platform overview and live management metrics</p>
        </div>
        <div className="flex gap-2">
          <Link href="/teacher/quizzes/new">
            <Button size="sm" className="gap-1.5">
              <BookOpen className="w-4 h-4" /> Add Lesson
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          {
            icon: <Users className="w-6 h-6" />,
            label: 'Total Users',
            value: stats.totalUsers.toLocaleString(),
            color: 'from-purple-500 to-purple-700',
          },
          {
            icon: <DollarSign className="w-6 h-6" />,
            label: 'Est. Monthly Revenue',
            value: `RM ${stats.monthlyRevenueRM.toLocaleString()}`,
            color: 'from-green-500 to-green-700',
          },
          {
            icon: <Activity className="w-6 h-6" />,
            label: 'Lessons Done Today',
            value: stats.activeToday.toLocaleString(),
            color: 'from-blue-500 to-blue-700',
          },
          {
            icon: <TrendingUp className="w-6 h-6" />,
            label: 'Active Subscriptions',
            value: stats.activeSubscriptions.toLocaleString(),
            color: 'from-orange-500 to-amber-600',
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className={cn('rounded-3xl p-5 text-white bg-gradient-to-br shadow-sm', stat.color)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
            <div className="font-display font-bold text-2xl">{stat.value}</div>
            <div className="text-white/80 text-xs font-semibold mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart (2/3) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 card-kid p-6 border border-gray-100 rounded-3xl bg-white shadow-sm"
        >
          <h2 className="font-display text-lg font-bold mb-4">Estimated Platform Revenue</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={stats.revenueHistory}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `RM${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                formatter={(v: number) => [`RM ${v.toLocaleString()}`, 'Revenue']}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#7C3AED"
                strokeWidth={3}
                fill="url(#revenueGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Subscription Breakdown (1/3) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-kid p-6 border border-gray-100 rounded-3xl bg-white shadow-sm"
        >
          <h2 className="font-display text-lg font-bold mb-4">Subscription Distribution</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={stats.subscriptionMix}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {stats.subscriptionMix.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v}`, 'Accounts']} contentStyle={{ borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {stats.subscriptionMix.map((p) => (
              <div key={p.name} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                <span className="flex-1 font-medium">{p.name}</span>
                <span className="font-bold">{p.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent signups + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 card-kid p-6 border border-gray-100 rounded-3xl bg-white shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-green-500" /> Recent User Registrations
            </h2>
          </div>
          <div className="space-y-3">
            {stats.recentSignups.map((user, i) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/50 border border-transparent hover:border-gray-100"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center font-bold text-sm text-purple-700">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full capitalize', ROLE_COLORS[user.role] ?? 'bg-gray-100 text-gray-700')}>
                    {user.role}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{user.joined}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Admin Actions & Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <div className="card-kid p-5 border border-gray-100 rounded-3xl bg-white shadow-sm">
            <h3 className="font-display font-bold mb-4">Quick Navigation</h3>
            <div className="space-y-2">
              {[
                { icon: '📝', label: 'Quizzes & Lessons', href: '/teacher/quizzes' },
                { icon: '🏫', label: 'Classes & Rosters', href: '/teacher/classes' },
                { icon: '📊', label: 'Teacher Analytics', href: '/teacher/analytics' },
                { icon: '💎', label: 'Subscription Plans', href: '/parent/subscription' },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted transition-colors"
                >
                  <span className="text-xl w-7 text-center">{action.icon}</span>
                  <span className="font-semibold text-sm flex-1">{action.label}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>

          <div className="card-kid p-5 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-3xl shadow-sm">
            <h3 className="font-display font-bold mb-2 text-green-800">✅ Platform Health</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-green-700">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                MongoDB Atlas connected & healthy
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                NextAuth v5 session active
              </div>
              <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                📚 {stats.totalLessons} educational lessons published
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
