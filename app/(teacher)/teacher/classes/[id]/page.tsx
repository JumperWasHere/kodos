'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, Trash2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getGradeLabel } from '@/lib/utils'

interface RosterStudent {
  studentId: string
  displayName: string
  name: string
  email: string
  level: number
  xp: number
  streakDays: number
  lessonsCompleted: number
  lastLoginAt: string | null
}

interface ClassDetail {
  _id: string
  name: string
  grade: number
  students: RosterStudent[]
}

export default function ClassDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [klass, setKlass] = useState<ClassDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/teacher/classes/${id}`)
      const payload = await res.json()
      if (!res.ok || !payload.success) {
        toast.error(payload.error ?? 'Could not load the class')
        router.push('/teacher/classes')
        return
      }
      setKlass(payload.data)
    } catch {
      toast.error('Could not load the class')
    } finally {
      setIsLoading(false)
    }
  }, [id, router])

  useEffect(() => { load() }, [load])

  const handleAddStudent = async () => {
    if (!email.trim()) return
    setIsAdding(true)
    try {
      const res = await fetch(`/api/teacher/classes/${id}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const payload = await res.json()
      if (!res.ok || !payload.success) {
        toast.error(payload.error ?? 'Could not add the student')
        return
      }
      toast.success(`${payload.data.displayName} added to the class! 🎉`)
      setEmail('')
      load()
    } catch {
      toast.error('Could not add the student')
    } finally {
      setIsAdding(false)
    }
  }

  const handleRemove = async (student: RosterStudent) => {
    if (!window.confirm(`Remove ${student.displayName} from this class?`)) return
    try {
      const res = await fetch(`/api/teacher/classes/${id}/students?studentId=${student.studentId}`, {
        method: 'DELETE',
      })
      const payload = await res.json()
      if (!res.ok || !payload.success) {
        toast.error(payload.error ?? 'Could not remove the student')
        return
      }
      toast.success(`${student.displayName} removed`)
      setKlass((k) => k ? { ...k, students: k.students.filter((s) => s.studentId !== student.studentId) } : k)
    } catch {
      toast.error('Could not remove the student')
    }
  }

  const handleDeleteClass = async () => {
    if (!klass) return
    if (!window.confirm(`Delete "${klass.name}" and all its assignments? This cannot be undone.`)) return
    try {
      const res = await fetch(`/api/teacher/classes/${id}`, { method: 'DELETE' })
      const payload = await res.json()
      if (!res.ok || !payload.success) {
        toast.error(payload.error ?? 'Could not delete the class')
        return
      }
      toast.success('Class deleted')
      router.push('/teacher/classes')
    } catch {
      toast.error('Could not delete the class')
    }
  }

  if (isLoading || !klass) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/teacher/classes')} className="p-2 rounded-xl hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold">{klass.name} 🎓</h1>
          <p className="text-sm text-muted-foreground">
            {getGradeLabel(klass.grade)} · {klass.students.length} student{klass.students.length === 1 ? '' : 's'}
          </p>
        </div>
        <Button variant="outline" className="gap-1.5 text-red-500 border-red-200 hover:bg-red-50" onClick={handleDeleteClass}>
          <Trash2 className="w-4 h-4" /> Delete Class
        </Button>
      </div>

      {/* Add student */}
      <div className="card-kid p-5">
        <h2 className="font-display font-bold mb-3">Add a student</h2>
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Student's account email, e.g. student@kidos.my"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddStudent()}
          />
          <Button onClick={handleAddStudent} disabled={isAdding || !email.trim()} className="gap-1.5 flex-shrink-0">
            {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            Add
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          The student must already have a KidOS student account.
        </p>
      </div>

      {/* Roster */}
      <div className="card-kid p-5">
        <h2 className="font-display font-bold mb-4">Students</h2>
        {klass.students.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-4xl mb-2">👨‍🎓</div>
            <p className="text-muted-foreground text-sm">No students yet — add them by email above.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {klass.students.map((s, i) => (
              <motion.div
                key={s.studentId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/50 transition-colors"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(s.displayName)}`}
                  alt={s.displayName}
                  className="w-10 h-10 rounded-xl"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{s.displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground font-semibold">
                  <span>⚡ {s.xp.toLocaleString()} XP</span>
                  <span>📚 {s.lessonsCompleted} lessons</span>
                  <span>🔥 {s.streakDays}d</span>
                </div>
                <div className="level-badge w-7 h-7 text-xs">{s.level}</div>
                <button
                  onClick={() => handleRemove(s)}
                  className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition-colors"
                  aria-label={`Remove ${s.displayName}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
