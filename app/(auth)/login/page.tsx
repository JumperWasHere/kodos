'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, Chrome } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Metadata } from 'next'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

type LoginData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [showPw, setShowPw] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true)
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Invalid email or password. Please try again.')
        return
      }

      toast.success('Welcome back! 🎉')

      // Fetch session to get role-based redirect
      const sessionRes = await fetch('/api/auth/session')
      const session = await sessionRes.json()
      const role = session?.user?.role ?? 'student'

      const redirectMap: Record<string, string> = {
        student: '/student/dashboard',
        parent: '/parent/dashboard',
        teacher: '/teacher/dashboard',
        admin: '/admin/dashboard',
      }
      router.push(redirectMap[role] ?? '/student/dashboard')
    } catch (err) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    await signIn('google', { callbackUrl: '/parent/dashboard' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="font-display text-3xl font-bold mb-2">Welcome back! 👋</h1>
      <p className="text-muted-foreground mb-8">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-primary font-bold hover:underline">
          Sign up free
        </Link>
      </p>

      {/* Google Login */}
      <Button
        type="button"
        variant="outline"
        className="w-full mb-4 border-2 gap-3"
        onClick={handleGoogleLogin}
        disabled={isGoogleLoading}
      >
        {isGoogleLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        Continue with Google
      </Button>

      <div className="relative my-6">
        <div className="divider-gradient" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-muted-foreground font-semibold">
          OR LOGIN WITH EMAIL
        </span>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-bold mb-1.5">Email Address</label>
          <Input
            type="email"
            placeholder="your@email.com"
            autoComplete="email"
            {...register('email')}
            className={errors.email ? 'border-red-400' : ''}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-bold">Password</label>
            <Link href="/forgot-password" className="text-xs text-primary font-semibold hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              {...register('password')}
              className={errors.password ? 'border-red-400 pr-12' : 'pr-12'}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : '🚀 Login'}
        </Button>
      </form>

      {/* Demo accounts hint */}
      <div className="mt-6 p-4 bg-purple-50 rounded-2xl border border-purple-100">
        <p className="text-xs font-bold text-purple-700 mb-2">🧪 Demo Accounts:</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-purple-600 font-medium">
          <div>
            <div>student@kidos.my</div>
            <div>parent@kidos.my</div>
          </div>
          <div>
            <div>teacher@kidos.my</div>
            <div>admin@kidos.my</div>
          </div>
        </div>
        <p className="text-xs text-purple-500 mt-1">Password: see role + @123 (e.g., Student@123)</p>
      </div>
    </motion.div>
  )
}
