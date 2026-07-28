'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, Loader2, Plus, Users } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getGradeLabel } from '@/lib/utils'

interface ClassRow {
  _id: string
  name: string
  grade: number
  studentCount: number
}

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState<ClassRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [grade, setGrade] = useState(1)
  const [isSaving, setIsSaving] = useState(false)

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/teacher/classes')
      const payload = await res.json()
      if (res.ok && payload.success) setClasses(payload.data)
      else toast.error(payload.error ?? 'Could not load classes')
    } catch {
      toast.error('Could not load classes')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleCreate = async () => {
    if (name.trim().length < 2) {
      toast.error('Please give the class a name.')
      return
    }
    setIsSaving(true)
    try {
      const res = await fetch('/api/teacher/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), grade }),
      })
      const payload = await res.json()
      if (!res.ok || !payload.success) {
        toast.error(payload.error ?? 'Could not create the class')
        return
      }
      toast.success('Class created! 🎉')
      setName('')
      setShowForm(false)
      load()
    } catch {
      toast.error('Could not create the class')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1">My Classes 🏫</h1>
          <p className="text-muted-foreground">Group your students and assign them quizzes</p>
        </div>
        <Button className="gap-2" onClick={() => setShowForm((v) => !v)}>
          <Plus className="w-4 h-4" /> New Class
        </Button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-kid p-5 space-y-3"
        >
          <h2 className="font-display font-bold">Create a class</h2>
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-bold text-muted-foreground mb-1.5">Class name</label>
              <Input
                placeholder="e.g. Year 3 Bestari"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5">Year</label>
              <select
                value={grade}
                onChange={(e) => setGrade(parseInt(e.target.value))}
                className="rounded-xl border-2 border-gray-200 px-3 py-2.5 text-sm font-medium bg-white outline-none focus:border-primary"
              >
                {[0, 1, 2, 3, 4, 5, 6].map((g) => (
                  <option key={g} value={g}>{getGradeLabel(g)}</option>
                ))}
              </select>
            </div>
            <Button onClick={handleCreate} disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create'}
            </Button>
          </div>
        </motion.div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : classes.length === 0 ? (
        <div className="text-center py-16 card-kid">
          <div className="text-5xl mb-3">🏫</div>
          <p className="font-display text-xl font-bold">No classes yet</p>
          <p className="text-muted-foreground text-sm mt-1 mb-4">
            Create a class, add your students by email, then assign them quizzes.
          </p>
          <Button className="gap-2" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" /> Create your first class
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {classes.map((c, i) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/teacher/classes/${c._id}`}>
                <div className="card-kid p-5 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                      🎓
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold truncate">{c.name}</h3>
                      <p className="text-xs text-muted-foreground">{getGradeLabel(c.grade)}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-1.5 mt-3 text-sm text-muted-foreground font-semibold">
                    <Users className="w-4 h-4" />
                    {c.studentCount} student{c.studentCount === 1 ? '' : 's'}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
