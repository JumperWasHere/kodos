'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Loader2, ArrowLeft, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const schema = z.object({ email: z.string().email('Please enter a valid email') })
type Data = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, getValues, formState: { errors } } = useForm<Data>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: Data) => {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 1500)) // Simulate API
    setSent(true)
    setIsLoading(false)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {!sent ? (
        <>
          <Link href="/login" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 font-semibold">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
          <h1 className="font-display text-3xl font-bold mb-2">Forgot Password? 🔑</h1>
          <p className="text-muted-foreground mb-8">
            No worries! Enter your email and we&apos;ll send you a reset link.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-1.5">Email Address</label>
              <Input type="email" placeholder="your@email.com" {...register('email')} className={errors.email ? 'border-red-400' : ''} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : '📧 Send Reset Link'}
            </Button>
          </form>
        </>
      ) : (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-2">Check Your Email!</h2>
          <p className="text-muted-foreground mb-6">
            We sent a password reset link to<br />
            <strong className="text-foreground">{getValues('email')}</strong>
          </p>
          <Link href="/login">
            <Button variant="outline" className="w-full">Back to Login</Button>
          </Link>
        </motion.div>
      )}
    </motion.div>
  )
}
