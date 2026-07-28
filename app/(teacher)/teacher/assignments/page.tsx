'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CalendarDays, Loader2, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn, getSubjectIcon, percentOf } from '@/lib/utils'
import type { SubjectSlug } from '@/types'

interface AssignmentRow {
  _id: string
  title: string
  className: string
  lessonTitle: string
  subjectSlug?: SubjectSlug
  dueDate: string | null
  totalStudents: number
  completedCount: number
}

interface ClassOption { _id: string; name: string; studentCount: number }
interface QuizOption { _id: string; title: string; subjectSlug: SubjectSlug; isMine: boolean }

const selectClass = 'w-full rounded-xl border-2 border-gray-200 px-3 py-2 text-sm font-medium bg-white outline-none focus:border-primary'

export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState<AssignmentRow[]>([])
  const [classes, setClasses] = useState<ClassOption[]>([])
  const [quizzes, setQuizzes] = useState<QuizOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [classId, setClassId] = useState('')
  const [lessonId, setLessonId] = useState('')
  const [instructions, setInstructions] = useState('')
  const [dueDate, setDueDate] = useState('')

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      const [aRes, cRes, qRes] = await Promise.all([
        fetch('/api/teacher/assignments'),
        fetch('/api/teacher/classes'),
        fetch('/api/teacher/lessons?scope=all'),
      ])
      const [a, c, q] = await Promise.all([aRes.json(), cRes.json(), qRes.json()])
      if (aRes.ok && a.success) setAssignments(a.data)
      if (cRes.ok && c.success) {
        setClasses(c.data)
        if (c.data.length > 0) setClassId((prev) => prev || c.data[0]._id)
      }
      if (qRes.ok && q.success) {
        setQuizzes(q.data)
        if (q.data.length > 0) setLessonId((prev) => prev || q.data[0]._id)
      }
    } catch {
      toast.error('Could not load assignments')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleCreate = async () => {
    if (!classId || !lessonId) {
      toast.error('Pick a class and a quiz.')
      return
    }
    setIsSaving(true)
    try {
      const res = await fetch('/api/teacher/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId,
          lessonId,
          instructions: instructions.trim() || undefined,
          dueDate: dueDate || undefined,
        }),
      })
      const payload = await res.json()
      if (!res.ok || !payload.success) {
        toast.error(payload.error ?? 'Could not create the assignment')
        return
      }
      toast.success('Assignment created! 📝')
      setInstructions('')
      setDueDate('')
      setShowForm(false)
      load()
    } catch {
      toast.error('Could not create the assignment')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (a: AssignmentRow) => {
    if (!window.confirm(`Delete assignment "${a.title}"?`)) return
    try {
      const res = await fetch(`/api/teacher/assignments/${a._id}`, { method: 'DELETE' })
      const payload = await res.json()
      if (!res.ok || !payload.success) {
        toast.error(payload.error ?? 'Could not delete the assignment')
        return
      }
      toast.success('Assignment deleted')
      setAssignments((prev) => prev.filter((x) => x._id !== a._id))
    } catch {
      toast.error('Could not delete the assignment')
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1">Assignments 📝</h1>
          <p className="text-muted-foreground">Assign quizzes to your classes and track who has finished</p>
        </div>
        <Button className="gap-2" onClick={() => setShowForm((v) => !v)} disabled={classes.length === 0 && !isLoading}>
          <Plus className="w-4 h-4" /> New Assignment
        </Button>
      </div>

      {!isLoading && classes.length === 0 && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-amber-800 text-sm font-semibold">
          You need a class first —{' '}
          <Link href="/teacher/classes" className="underline">create one here</Link>{' '}
          and add your students to it.
        </div>
      )}

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card-kid p-5 space-y-4">
          <h2 className="font-display font-bold">Assign a quiz</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5">Class</label>
              <select className={selectClass} value={classId} onChange={(e) => setClassId(e.target.value)}>
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>{c.name} ({c.studentCount} students)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5">Quiz</label>
              <select className={selectClass} value={lessonId} onChange={(e) => setLessonId(e.target.value)}>
                {quizzes.map((q) => (
                  <option key={q._id} value={q._id}>
                    {getSubjectIcon(q.subjectSlug)} {q.title}{q.isMine ? ' (mine)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5">Due date (optional)</label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5">Instructions (optional)</label>
              <Input
                placeholder="e.g. Finish before Friday's lesson!"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleCreate} disabled={isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Assign'}
          </Button>
        </motion.div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : assignments.length === 0 ? (
        <div className="text-center py-16 card-kid">
          <div className="text-5xl mb-3">📝</div>
          <p className="font-display text-xl font-bold">No assignments yet</p>
          <p className="text-muted-foreground text-sm mt-1">
            Assign a quiz to a class — students will see it on their dashboard.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map((a, i) => {
            const pct = percentOf(a.completedCount, a.totalStudents || 1)
            const overdue = a.dueDate && new Date(a.dueDate) < new Date() && a.completedCount < a.totalStudents
            return (
              <motion.div
                key={a._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="card-kid p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center text-xl flex-shrink-0">
                    {a.subjectSlug ? getSubjectIcon(a.subjectSlug) : '📚'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold truncate">{a.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                      <span>🎓 {a.className}</span>
                      {a.dueDate && (
                        <span className={cn('flex items-center gap-1', overdue && 'text-red-500 font-bold')}>
                          <CalendarDays className="w-3 h-3" />
                          Due {new Date(a.dueDate).toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })}
                          {overdue && ' (overdue)'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-sm">{a.completedCount}/{a.totalStudents}</p>
                    <p className="text-[10px] text-muted-foreground">completed</p>
                  </div>
                  <button
                    onClick={() => handleDelete(a)}
                    className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition-colors"
                    aria-label="Delete assignment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
