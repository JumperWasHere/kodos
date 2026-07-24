'use client'

import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Users, DollarSign, TrendingUp, BookOpen, ChevronRight, ShieldAlert, UserPlus, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const REVENUE_DATA = [
  { month: 'Jan', revenue: 12400 },
  { month: 'Feb', revenue: 18600 },
  { month: 'Mar', revenue: 22300 },
  { month: 'Apr', revenue: 19800 },
  { month: 'May', revenue: 28500 },
  { month: 'Jun', revenue: 31200 },
  { month: 'Jul', revenue: 38700 },
]

const SUBSCRIPTION_PIE = [
  { name: 'Free', value: 45, color: '#94A3B8' },
  { name: 'Monthly', value: 30, color: '#8B5CF6' },
  { name: 'Annual', value: 18, color: '#F59E0B' },
  { name: 'Family', value: 7, color: '#10B981' },
]

const RECENT_USERS = [
  { name: 'Ahmad Razif', email: 'ahmad@test.my', role: 'parent', joined: '2 min ago', plan: 'Family' },
  { name: 'Lee Wei Xin', email: 'weixin@test.my', role: 'student', joined: '15 min ago', plan: 'Monthly' },
  { name: 'Siti Nurhaliza', email: 'siti@school.my', role: 'teacher', joined: '1h ago', plan: 'Free' },
  { name: 'Raj Kumar', email: 'raj@test.my', role: 'parent', joined: '2h ago', plan: 'Annual' },
  { name: 'Fatimah Zahra', email: 'fatimah@test.my', role: 'student', joined: '3h ago', plan: 'Free' },
]

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-red-100 text-red-700',
  parent: 'bg-blue-100 text-blue-700',
  teacher: 'bg-purple-100 text-purple-700',
  student: 'bg-green-100 text-green-700',
}

export default function AdminDashboard() {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1 flex items-center gap-2">
            <ShieldAlert className="w-8 h-8 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Platform overview and management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Export Report</Button>
          <Button size="sm">Add Content</Button>
        </div>
      </div>

      {/* KPI Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { icon: <Users className="w-6 h-6" />, label: 'Total Users', value: '52,847', change: '+12.4%', color: 'from-purple-500 to-purple-700' },
          { icon: <DollarSign className="w-6 h-6" />, label: 'Monthly Revenue', value: 'RM 38,700', change: '+8.2%', color: 'from-green-500 to-green-700' },
          { icon: <Activity className="w-6 h-6" />, label: 'Active Today', value: '4,231', change: '+5.1%', color: 'from-blue-500 to-blue-700' },
          { icon: <TrendingUp className="w-6 h-6" />, label: 'Subscriptions', value: '8,420', change: '+15.8%', color: 'from-orange-500 to-amber-600' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className={cn('rounded-3xl p-5 text-white bg-gradient-to-br', stat.color)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                {stat.icon}
              </div>
              <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <div className="font-display font-bold text-2xl">{stat.value}</div>
            <div className="text-white/70 text-xs font-semibold mt-0.5">{stat.label}</div>
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
          className="lg:col-span-2 card-kid p-6"
        >
          <h2 className="font-display text-lg font-bold mb-4">Revenue (2024)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={REVENUE_DATA}>
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
          className="card-kid p-6"
        >
          <h2 className="font-display text-lg font-bold mb-4">Subscription Mix</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={SUBSCRIPTION_PIE}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {SUBSCRIPTION_PIE.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v}%`, 'Share']} contentStyle={{ borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {SUBSCRIPTION_PIE.map((p) => (
              <div key={p.name} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                <span className="flex-1 font-medium">{p.name}</span>
                <span className="font-bold">{p.value}%</span>
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
          className="lg:col-span-2 card-kid p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-green-500" /> Recent Sign-ups
            </h2>
            <Link href="/admin/users">
              <Button size="sm" variant="outline" className="gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {RECENT_USERS.map((user, i) => (
              <motion.div
                key={user.email}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.07 }}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/50"
              >
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-9 h-9 rounded-xl"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', ROLE_COLORS[user.role])}>
                    {user.role}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{user.joined}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Admin Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <div className="card-kid p-5">
            <h3 className="font-display font-bold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { icon: '📚', label: 'Manage Content', href: '/admin/content' },
                { icon: '👥', label: 'User Management', href: '/admin/users' },
                { icon: '💳', label: 'Subscriptions', href: '/admin/subscriptions' },
                { icon: '📊', label: 'Analytics', href: '/admin/analytics' },
                { icon: '⚙️', label: 'System Settings', href: '/admin/settings' },
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

          <div className="card-kid p-5 bg-gradient-to-br from-red-50 to-orange-50 border-red-100">
            <h3 className="font-display font-bold mb-2 text-red-700">⚠️ System Alerts</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-red-600">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                3 payment failures
              </div>
              <div className="flex items-center gap-2 text-orange-600">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                2 teacher verifications pending
              </div>
              <div className="flex items-center gap-2 text-yellow-600">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                Server at 72% capacity
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
