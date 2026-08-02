'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
  isParent: z.literal(true, { errorMap: () => ({ message: 'Only parents can create an account' }) }),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the terms' }),
  }),
}).refine((d) => d.password === d.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
})

type SignupData = z.infer<typeof signupSchema>

export default function SignupPage() {
  const router = useRouter()
  const [showPw, setShowPw] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { isParent: true },
  })

  const onSubmit = async (data: SignupData) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          isParent: data.isParent,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        toast.error(err.error || 'Registration failed. Please try again.')
        return
      }

      toast.success('Account created! 🎉 Welcome to KidOS!')
      router.push('/login?registered=1')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="font-display text-3xl font-bold mb-2">Create your account 🚀</h1>
      <p className="text-muted-foreground mb-6">
        Already have an account?{' '}
        <Link href="/login" className="text-primary font-bold hover:underline">
          Log in
        </Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="rounded-2xl border-2 border-primary bg-primary/5 p-4">
          <p className="font-bold">Are you a Parent? 👨‍👩‍👧</p>
          <p className="mt-1 text-sm text-muted-foreground">Parents create an account, then add child learning profiles after logging in.</p>
          <input type="hidden" {...register('isParent')} />
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-bold mb-1.5">Full Name</label>
          <Input
            placeholder="Ahmad Razif"
            autoComplete="name"
            {...register('name')}
            className={errors.name ? 'border-red-400' : ''}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-bold mb-1.5">Email Address</label>
          <Input
            type="email"
            placeholder="your@email.com"
            autoComplete="email"
            {...register('email')}
            className={errors.email ? 'border-red-400' : ''}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-bold mb-1.5">Password</label>
          <div className="relative">
            <Input
              type={showPw ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              {...register('password')}
              className={errors.password ? 'border-red-400 pr-12' : 'pr-12'}
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-bold mb-1.5">Confirm Password</label>
          <Input
            type="password"
            placeholder="Repeat password"
            autoComplete="new-password"
            {...register('confirmPassword')}
            className={errors.confirmPassword ? 'border-red-400' : ''}
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="terms"
            className="w-4 h-4 mt-0.5 accent-purple-600"
            {...register('agreeToTerms')}
          />
          <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
            I agree to KidOS&apos;{' '}
            <Link href="/terms" className="text-primary font-semibold hover:underline">Terms of Service</Link>
            {' '}&amp;{' '}
            <Link href="/privacy" className="text-primary font-semibold hover:underline">Privacy Policy</Link>
          </label>
        </div>
        {errors.agreeToTerms && <p className="text-red-500 text-xs -mt-3">{errors.agreeToTerms.message}</p>}

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : '🎉 Create Parent Account'}
        </Button>
      </form>
    </motion.div>
  )
}
