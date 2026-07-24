'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Star, Zap, Shield, Trophy, Users, BookOpen, ArrowRight,
  Check, Sparkles, Globe, Heart, PlayCircle, ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ── Hero Section ─────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
          className="blob w-96 h-96 bg-purple-400 top-[-10%] left-[-5%]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], x: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
          className="blob w-80 h-80 bg-pink-400 bottom-[-5%] right-[-5%]"
        />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
          className="blob w-48 h-48 bg-indigo-400 top-[30%] right-[10%]"
        />
        {/* Stars */}
        <div className="absolute inset-0 stars-bg opacity-30" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-bold px-4 py-2 rounded-full border border-white/30 mb-6"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              🇲🇾 Designed for Malaysian Kids
            </motion.div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Learning is{' '}
              <span className="text-gradient-rainbow">
                Super Fun!
              </span>
            </h1>

            <p className="text-white/80 text-lg md:text-xl mb-8 leading-relaxed max-w-lg">
              The ultimate educational adventure for Malaysian children aged 3–12.
              Master Maths, English, Science, BM, Mandarin and more through
              <strong className="text-yellow-300"> games, quizzes & rewards!</strong>
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mb-8">
              {[
                { icon: '👦', label: '50K+ Students' },
                { icon: '📚', label: '9 Subjects' },
                { icon: '🏆', label: '500+ Lessons' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2 text-white">
                  <span className="text-xl">{stat.icon}</span>
                  <span className="font-bold text-sm">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link href="/signup">
                <Button size="xl" variant="yellow" className="shadow-glow-yellow">
                  <PlayCircle className="w-5 h-5" />
                  Start Learning Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="xl" className="bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white hover:bg-white/30 shadow-none translate-y-0">
                  View Plans
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right: Hero illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex justify-center items-center"
          >
            <div className="relative w-96 h-96">
              {/* Main character placeholder (emoji-based) */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="text-[10rem]">🧒</div>
              </motion.div>

              {/* Floating subject bubbles */}
              {[
                { emoji: '🔢', x: '-20%', y: '10%', delay: 0 },
                { emoji: '📖', x: '80%', y: '5%', delay: 0.5 },
                { emoji: '🔬', x: '-25%', y: '65%', delay: 1 },
                { emoji: '🎨', x: '85%', y: '70%', delay: 1.5 },
                { emoji: '🌏', x: '40%', y: '-10%', delay: 0.3 },
              ].map((bubble, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{
                    scale: 1,
                    y: [0, -10, 0],
                  }}
                  transition={{
                    scale: { delay: bubble.delay + 0.5, type: 'spring' },
                    y: { repeat: Infinity, duration: 2 + i * 0.3, delay: bubble.delay },
                  }}
                  className="absolute w-14 h-14 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center text-2xl"
                  style={{ left: bubble.x, top: bubble.y }}
                >
                  {bubble.emoji}
                </motion.div>
              ))}

              {/* XP/Coins floating elements */}
              <motion.div
                animate={{ x: [0, 10, 0], y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute top-4 right-2 bg-yellow-400 text-yellow-900 rounded-2xl px-3 py-1.5 font-bold text-sm shadow-lg"
              >
                +50 XP ⚡
              </motion.div>
              <motion.div
                animate={{ x: [0, -10, 0], y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, delay: 1 }}
                className="absolute bottom-8 left-2 bg-white rounded-2xl px-3 py-1.5 font-bold text-sm shadow-lg text-orange-600"
              >
                🔥 7 day streak!
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L60 68C120 56 240 32 360 26.7C480 21.3 600 34.7 720 42.7C840 50.7 960 53.3 1080 48C1200 42.7 1320 29.3 1380 22.7L1440 16V80H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  )
}

// ── Subjects Section ─────────────────────────────────────────
const SUBJECTS = [
  { emoji: '🔢', name: 'Mathematics', color: 'from-blue-500 to-blue-600', lessons: 120 },
  { emoji: '📖', name: 'English', color: 'from-purple-500 to-purple-600', lessons: 100 },
  { emoji: '🔬', name: 'Science', color: 'from-emerald-500 to-emerald-600', lessons: 80 },
  { emoji: '🇲🇾', name: 'Bahasa Malaysia', color: 'from-amber-500 to-amber-600', lessons: 90 },
  { emoji: '🀄', name: 'Mandarin', color: 'from-red-500 to-red-600', lessons: 80 },
  { emoji: '🌏', name: 'Geography', color: 'from-cyan-500 to-cyan-600', lessons: 60 },
  { emoji: '🏛️', name: 'History', color: 'from-stone-500 to-stone-600', lessons: 50 },
  { emoji: '🎨', name: 'Art', color: 'from-pink-500 to-pink-600', lessons: 40 },
  { emoji: '💻', name: 'ICT', color: 'from-indigo-500 to-indigo-600', lessons: 50 },
]

function SubjectsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            9 Exciting Subjects 📚
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive curriculum aligned with Malaysian education standards (KSSR).
            Learn all core subjects and more!
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {SUBJECTS.map((subject, i) => (
            <motion.div
              key={subject.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                'relative overflow-hidden rounded-3xl p-5 cursor-pointer text-white',
                `bg-gradient-to-br ${subject.color}`,
                'shadow-lg hover:shadow-xl transition-shadow'
              )}
            >
              <div className="text-4xl mb-3">{subject.emoji}</div>
              <h3 className="font-display font-bold text-sm leading-tight mb-1">
                {subject.name}
              </h3>
              <p className="text-white/70 text-xs">{subject.lessons}+ lessons</p>
              {/* Decorative circle */}
              <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Gamification Section ──────────────────────────────────────
const FEATURES = [
  { emoji: '⚡', title: 'XP & Levels', desc: 'Earn XP for every lesson and level up your character!' },
  { emoji: '🪙', title: 'Coins & Rewards', desc: 'Collect coins to unlock avatars and special items.' },
  { emoji: '🔥', title: 'Daily Streaks', desc: 'Login every day to keep your streak and earn bonus rewards!' },
  { emoji: '🏆', title: 'Leaderboards', desc: 'Compete with friends and be the top learner!' },
  { emoji: '🏅', title: 'Badges & Achievements', desc: 'Unlock over 50 unique badges for your accomplishments.' },
  { emoji: '🐾', title: 'Virtual Pets', desc: 'Adopt and care for cute virtual pets that grow with you!' },
  { emoji: '🌟', title: 'Weekly Challenges', desc: 'Take on special weekly challenges for epic rewards.' },
  { emoji: '🎭', title: 'Avatar Builder', desc: 'Customize your unique character with unlockable items.' },
]

function GamificationSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-bold text-sm mb-4">
            <Zap className="w-4 h-4" />
            Gamified Learning
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Learning Feels Like a Game! 🎮
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Duolingo-inspired gamification keeps kids motivated, engaged, and coming back every day.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="card-kid p-6 text-center hover:shadow-card-hover"
            >
              <div className="text-4xl mb-3">{f.emoji}</div>
              <h3 className="font-display font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Pricing Section ───────────────────────────────────────────
const PLANS = [
  {
    name: 'Free',
    nameMs: 'Percuma',
    price: 0,
    period: 'forever',
    description: 'Start your learning journey',
    color: 'from-gray-100 to-gray-200',
    textColor: 'text-gray-700',
    buttonVariant: 'outline' as const,
    features: [
      { text: 'Access to 3 subjects', included: true },
      { text: '5 lessons per day', included: true },
      { text: 'Basic quizzes', included: true },
      { text: 'Progress tracking', included: true },
      { text: 'Unlimited lessons', included: false },
      { text: 'Premium games', included: false },
      { text: 'Parent dashboard', included: false },
    ],
  },
  {
    name: 'Premium Monthly',
    nameMs: 'Premium Bulanan',
    price: 29,
    period: '/month',
    description: 'Full access to all features',
    color: 'from-purple-500 to-purple-700',
    textColor: 'text-white',
    buttonVariant: 'default' as const,
    isPopular: true,
    features: [
      { text: 'All 9 subjects', included: true },
      { text: 'Unlimited lessons', included: true },
      { text: 'All premium games', included: true },
      { text: 'Progress & reports', included: true },
      { text: 'Parent dashboard', included: true },
      { text: 'Priority support', included: false },
      { text: 'Family plan', included: false },
    ],
  },
  {
    name: 'Premium Annual',
    nameMs: 'Premium Tahunan',
    price: 199,
    period: '/year',
    badge: 'Save 43%',
    description: 'Best value for committed learners',
    color: 'from-amber-400 to-orange-500',
    textColor: 'text-white',
    buttonVariant: 'yellow' as const,
    features: [
      { text: 'All 9 subjects', included: true },
      { text: 'Unlimited lessons', included: true },
      { text: 'All premium games', included: true },
      { text: 'Progress & reports', included: true },
      { text: 'Parent dashboard', included: true },
      { text: 'Priority support', included: true },
      { text: 'Exclusive annual badges', included: true },
    ],
  },
  {
    name: 'Family Plan',
    nameMs: 'Pelan Keluarga',
    price: 299,
    period: '/year',
    description: 'For the whole family (up to 5 children)',
    color: 'from-green-400 to-green-600',
    textColor: 'text-white',
    buttonVariant: 'green' as const,
    features: [
      { text: 'Up to 5 children', included: true },
      { text: 'All 9 subjects each', included: true },
      { text: 'Unlimited lessons', included: true },
      { text: 'Family dashboard', included: true },
      { text: 'Parent controls', included: true },
      { text: 'Priority support', included: true },
      { text: 'Offline mode', included: true },
    ],
  },
]

function PricingSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="py-24 bg-white" id="pricing">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Simple, Affordable Pricing 💚
          </h2>
          <p className="text-muted-foreground text-lg">
            Start free, upgrade when you&apos;re ready. Cancel anytime.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className={cn(
                'relative rounded-3xl overflow-hidden',
                plan.isPopular ? 'ring-4 ring-purple-500 scale-105' : ''
              )}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-0 right-0 bg-purple-600 text-white text-center text-xs font-bold py-1.5 z-10">
                  ⭐ MOST POPULAR
                </div>
              )}
              {plan.badge && (
                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                  {plan.badge}
                </div>
              )}
              <div className={cn(`bg-gradient-to-br ${plan.color} p-6`, plan.isPopular && 'pt-9')}>
                <h3 className={cn('font-display text-xl font-bold mb-1', plan.textColor)}>
                  {plan.name}
                </h3>
                <p className={cn('text-sm mb-4 opacity-80', plan.textColor)}>{plan.description}</p>
                <div className={cn('flex items-baseline gap-1', plan.textColor)}>
                  <span className="text-sm">RM</span>
                  <span className="font-display text-4xl font-bold">{plan.price}</span>
                  <span className="text-sm opacity-70">{plan.period}</span>
                </div>
              </div>
              <div className="bg-white p-6 space-y-3">
                {plan.features.map((f) => (
                  <div key={f.text} className="flex items-center gap-2.5 text-sm">
                    <div className={cn(
                      'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0',
                      f.included ? 'bg-green-100' : 'bg-gray-100'
                    )}>
                      {f.included
                        ? <Check className="w-3 h-3 text-green-600" />
                        : <X className="w-3 h-3 text-gray-400" />
                      }
                    </div>
                    <span className={f.included ? 'text-foreground font-medium' : 'text-muted-foreground line-through'}>
                      {f.text}
                    </span>
                  </div>
                ))}
                <Link href="/signup" className="block mt-4">
                  <Button variant={plan.buttonVariant} className="w-full">
                    {plan.price === 0 ? 'Start Free' : 'Get Started'}
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Testimonials ──────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: "My son loves KidOS! He asks to do his Math lessons every evening now. His grades improved so much!",
    name: "Puan Rohani",
    role: "Parent, Petaling Jaya",
    avatar: "👩",
    rating: 5,
  },
  {
    quote: "As a teacher, I use KidOS to supplement my Year 3 class. The interactive lessons are amazing for engagement!",
    name: "Cikgu Ahmad",
    role: "Primary School Teacher, Johor Bahru",
    avatar: "👨‍🏫",
    rating: 5,
  },
  {
    quote: "KidOS helped my daughter learn Mandarin! She can now read and write basic characters at age 6!",
    name: "Mrs. Lim",
    role: "Parent, Penang",
    avatar: "👩‍👧",
    rating: 5,
  },
]

function TestimonialsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-purple-900 to-purple-800">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Parents & Teachers Love KidOS ❤️
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 text-white"
            >
              <div className="flex mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-white/90 text-sm leading-relaxed mb-4 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{t.avatar}</span>
                <div>
                  <p className="font-bold text-sm">{t.name}</p>
                  <p className="text-white/60 text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CTA Section ───────────────────────────────────────────────
function CTASection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto bg-gradient-to-br from-purple-600 to-pink-600 rounded-4xl p-12 text-white relative overflow-hidden"
        >
          <div className="blob w-32 h-32 bg-white/20 -top-8 -left-8" />
          <div className="blob w-24 h-24 bg-white/20 -bottom-4 -right-4" />
          <div className="relative z-10">
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Start Your Learning Adventure Today!
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              Join 50,000+ Malaysian children who are already learning smarter with KidOS.
              <br />No credit card required to start!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/signup">
                <Button size="xl" variant="yellow" className="shadow-glow-yellow">
                  <PlayCircle className="w-5 h-5" />
                  Create Free Account
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="xl" className="bg-white/20 border-2 border-white/40 shadow-none translate-y-0 hover:bg-white/30">
                  See All Plans
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm">
                🎓
              </div>
              <span className="font-display font-bold text-lg text-white">KidOS</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Malaysia&apos;s most engaging educational platform for children aged 3–12.
            </p>
          </div>
          {[
            { title: 'Platform', links: ['Subjects', 'Pricing', 'For Teachers', 'For Parents'] },
            { title: 'Company', links: ['About Us', 'Blog', 'Careers', 'Contact'] },
            { title: 'Legal', links: ['Privacy Policy', 'Terms of Use', 'Cookie Policy', 'PDPA'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-bold text-sm mb-4 text-gray-300">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© 2024 KidOS Sdn Bhd. All rights reserved. 🇲🇾 Made in Malaysia.</p>
          <p>SSM: 1234567-A · ROC No: 1234567</p>
        </div>
      </div>
    </footer>
  )
}

// ── Navbar ────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-white/20 shadow-sm">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm">
            🎓
          </div>
          <span className="font-display font-bold text-xl text-gradient-primary">KidOS</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {['Subjects', 'Pricing', 'For Teachers', 'About'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Start Free 🚀</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

// ── Page ──────────────────────────────────────────────────────
// Missing X import
function X({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <div className="pt-16">
        <HeroSection />
        <SubjectsSection />
        <GamificationSection />
        <PricingSection />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </div>
    </main>
  )
}
