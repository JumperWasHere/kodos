'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, GripVertical, Loader2, Plus, Save, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ImageUpload from '@/components/teacher/ImageUpload'
import { cn } from '@/lib/utils'
import type { AgeGroup, LessonLanguage } from '@/types'

export interface SubjectOption {
  slug: string
  name: string
  icon: string
  topics: Array<{ id: string; title: string; icon: string }>
}

export interface QuestionDraft {
  id: string
  question: string
  type: 'multiple_choice' | 'true_false' | 'fill_blank'
  options: string[]
  correctAnswer: string
  acceptedAnswers: string[] // extra accepted answers for fill_blank
  explanation: string
  imageUrl?: string
  points: number
  timeLimit: number
}

export interface QuizDraft {
  title: string
  description: string
  subjectSlug: string
  topicId: string
  ageGroup: AgeGroup
  grade: number[]
  type: 'quiz' | 'interactive' | 'game'
  difficulty: 'easy' | 'medium' | 'hard'
  language: LessonLanguage
  duration: number
  xpReward: number
  coinReward: number
  isPremium: boolean
  questions: QuestionDraft[]
}

interface QuizFormProps {
  subjects: SubjectOption[]
  initialData?: QuizDraft
  lessonId?: string // present when editing
}

const AGE_GROUPS: Array<{ value: AgeGroup; label: string; emoji: string; grades: number[] }> = [
  { value: 'toddler', label: 'Little Ones (1–3)', emoji: '👶', grades: [0] },
  { value: 'preschool', label: 'Preschool (3–6)', emoji: '🧸', grades: [0] },
  { value: 'lower_primary', label: 'Lower Primary (7–9)', emoji: '✏️', grades: [1, 2, 3] },
  { value: 'upper_primary', label: 'Upper Primary (10–12)', emoji: '🎓', grades: [4, 5, 6] },
]

const QUESTION_TYPES = [
  { value: 'multiple_choice', label: 'Multiple Choice', emoji: '🔤' },
  { value: 'true_false', label: 'True / False', emoji: '⚖️' },
  { value: 'fill_blank', label: 'Fill in the Blank', emoji: '✍️' },
] as const

function newQuestion(): QuestionDraft {
  return {
    id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    question: '',
    type: 'multiple_choice',
    options: ['', ''],
    correctAnswer: '',
    acceptedAnswers: [],
    explanation: '',
    imageUrl: undefined,
    points: 10,
    timeLimit: 20,
  }
}

function emptyDraft(subjects: SubjectOption[]): QuizDraft {
  return {
    title: '',
    description: '',
    subjectSlug: subjects[0]?.slug ?? 'mathematics',
    topicId: '',
    ageGroup: 'lower_primary',
    grade: [1, 2, 3],
    type: 'quiz',
    difficulty: 'easy',
    language: 'en',
    duration: 10,
    xpReward: 40,
    coinReward: 15,
    isPremium: false,
    questions: [newQuestion()],
  }
}

const inputClass = 'w-full rounded-xl border-2 border-gray-200 px-3 py-2 text-sm font-medium outline-none focus:border-primary transition-colors bg-white'

export default function QuizForm({ subjects, initialData, lessonId }: QuizFormProps) {
  const router = useRouter()
  const [draft, setDraft] = useState<QuizDraft>(() => initialData ?? emptyDraft(subjects))
  const [isSaving, setIsSaving] = useState(false)

  const currentSubject = useMemo(
    () => subjects.find((s) => s.slug === draft.subjectSlug),
    [subjects, draft.subjectSlug]
  )

  const set = <K extends keyof QuizDraft>(key: K, value: QuizDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }))

  const setQuestion = (idx: number, patch: Partial<QuestionDraft>) =>
    setDraft((d) => ({
      ...d,
      questions: d.questions.map((q, i) => (i === idx ? { ...q, ...patch } : q)),
    }))

  const validate = (): string | null => {
    if (draft.title.trim().length < 3) return 'Please give your quiz a title (min 3 characters).'
    if (draft.description.trim().length < 3) return 'Please add a short description.'
    if (draft.grade.length === 0) return 'Pick at least one year.'
    if (draft.questions.length === 0) return 'Add at least one question.'
    for (let i = 0; i < draft.questions.length; i++) {
      const q = draft.questions[i]
      if (!q.question.trim()) return `Question ${i + 1} needs text.`
      if (q.type === 'multiple_choice') {
        const options = q.options.map((o) => o.trim()).filter(Boolean)
        if (options.length < 2) return `Question ${i + 1} needs at least 2 answer options.`
        if (!q.correctAnswer.trim() || !options.includes(q.correctAnswer.trim()))
          return `Question ${i + 1}: mark one option as the correct answer.`
      }
      if (q.type === 'true_false' && !['True', 'False'].includes(q.correctAnswer))
        return `Question ${i + 1}: choose True or False as the correct answer.`
      if (q.type === 'fill_blank' && !q.correctAnswer.trim())
        return `Question ${i + 1}: type the correct answer.`
    }
    return null
  }

  const handleSave = async () => {
    const problem = validate()
    if (problem) {
      toast.error(problem)
      return
    }

    const payload = {
      title: draft.title.trim(),
      description: draft.description.trim(),
      subjectSlug: draft.subjectSlug,
      topicId: draft.topicId || undefined,
      ageGroup: draft.ageGroup,
      grade: draft.grade,
      type: draft.type,
      difficulty: draft.difficulty,
      language: draft.language,
      duration: draft.duration,
      xpReward: draft.xpReward,
      coinReward: draft.coinReward,
      isPremium: draft.isPremium,
      tags: [],
      questions: draft.questions.map((q) => {
        const alternates = q.acceptedAnswers.map((a) => a.trim()).filter(Boolean)
        return {
          id: q.id,
          question: q.question.trim(),
          type: q.type,
          options: q.type === 'multiple_choice'
            ? q.options.map((o) => o.trim()).filter(Boolean)
            : undefined,
          correctAnswer: q.type === 'fill_blank' && alternates.length > 0
            ? [q.correctAnswer.trim(), ...alternates]
            : q.correctAnswer.trim(),
          explanation: q.explanation.trim() || undefined,
          imageUrl: q.imageUrl || undefined,
          points: q.points,
          timeLimit: q.timeLimit || undefined,
        }
      }),
    }

    setIsSaving(true)
    try {
      const res = await fetch(lessonId ? `/api/teacher/lessons/${lessonId}` : '/api/teacher/lessons', {
        method: lessonId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await res.json()
      if (!res.ok || !result.success) {
        toast.error(result.error ?? 'Could not save the quiz.')
        return
      }
      toast.success(lessonId ? 'Quiz updated! ✅' : 'Quiz created! 🎉')
      router.push('/teacher/quizzes')
      router.refresh()
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/teacher/quizzes')} className="p-2 rounded-xl hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold">
            {lessonId ? 'Edit Quiz ✏️' : 'Create a New Quiz 🧩'}
          </h1>
          <p className="text-sm text-muted-foreground">
            Add pictures to questions to make them more fun and engaging!
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {lessonId ? 'Save Changes' : 'Publish Quiz'}
        </Button>
      </div>

      {/* Basics */}
      <div className="card-kid p-6 space-y-4">
        <h2 className="font-display font-bold text-lg">1. Quiz Details</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">Title</label>
            <Input
              placeholder="e.g. Fun with Fractions 🍕"
              value={draft.title}
              onChange={(e) => set('title', e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">Description</label>
            <textarea
              className={cn(inputClass, 'min-h-[70px] resize-y')}
              placeholder="What will students learn in this quiz?"
              value={draft.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">Subject</label>
            <select
              className={inputClass}
              value={draft.subjectSlug}
              onChange={(e) => setDraft((d) => ({ ...d, subjectSlug: e.target.value, topicId: '' }))}
            >
              {subjects.map((s) => (
                <option key={s.slug} value={s.slug}>{s.icon} {s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">Topic</label>
            <select
              className={inputClass}
              value={draft.topicId}
              onChange={(e) => set('topicId', e.target.value)}
            >
              <option value="">— No specific topic —</option>
              {currentSubject?.topics.map((t) => (
                <option key={t.id} value={t.id}>{t.icon} {t.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">Lesson Type</label>
            <select className={inputClass} value={draft.type} onChange={(e) => set('type', e.target.value as QuizDraft['type'])}>
              <option value="quiz">🧠 Quiz</option>
              <option value="interactive">🎮 Interactive</option>
              <option value="game">🕹️ Game</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">Difficulty</label>
            <select className={inputClass} value={draft.difficulty} onChange={(e) => set('difficulty', e.target.value as QuizDraft['difficulty'])}>
              <option value="easy">🟢 Easy</option>
              <option value="medium">🟡 Medium</option>
              <option value="hard">🔴 Hard</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">
              Question Language 🔊 <span className="font-normal">(the read-aloud voice uses this)</span>
            </label>
            <select className={inputClass} value={draft.language} onChange={(e) => set('language', e.target.value as LessonLanguage)}>
              <option value="en">🇬🇧 English</option>
              <option value="ms">🇲🇾 Bahasa Melayu</option>
              <option value="zh">🀄 中文 (Mandarin)</option>
              <option value="ar">🕌 العربية (Arabic)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Age & rewards */}
      <div className="card-kid p-6 space-y-4">
        <h2 className="font-display font-bold text-lg">2. Age Group & Rewards</h2>

        <div>
          <label className="block text-xs font-bold text-muted-foreground mb-2">Age Group</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {AGE_GROUPS.map((group) => (
              <button
                key={group.value}
                type="button"
                onClick={() => setDraft((d) => ({ ...d, ageGroup: group.value, grade: group.grades }))}
                className={cn(
                  'flex items-center gap-2 p-3 rounded-2xl border-2 transition-all text-left',
                  draft.ageGroup === group.value
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <span className="text-xl">{group.emoji}</span>
                <span className="font-bold text-sm">{group.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-muted-foreground mb-2">Years</label>
          <div className="flex flex-wrap gap-2">
            {[0, 1, 2, 3, 4, 5, 6].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() =>
                  set('grade', draft.grade.includes(g)
                    ? draft.grade.filter((x) => x !== g)
                    : [...draft.grade, g].sort())
                }
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-colors',
                  draft.grade.includes(g)
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-200 text-muted-foreground hover:border-gray-300'
                )}
              >
                {g === 0 ? 'Preschool' : `Year ${g}`}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">Duration (min)</label>
            <Input type="number" min={1} max={120} value={draft.duration}
              onChange={(e) => set('duration', Math.max(1, parseInt(e.target.value) || 1))} />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">⚡ XP Reward</label>
            <Input type="number" min={0} max={500} value={draft.xpReward}
              onChange={(e) => set('xpReward', Math.max(0, parseInt(e.target.value) || 0))} />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">🪙 Coin Reward</label>
            <Input type="number" min={0} max={500} value={draft.coinReward}
              onChange={(e) => set('coinReward', Math.max(0, parseInt(e.target.value) || 0))} />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 accent-purple-600"
                checked={draft.isPremium}
                onChange={(e) => set('isPremium', e.target.checked)}
              />
              👑 Premium only
            </label>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg">3. Questions ({draft.questions.length})</h2>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setDraft((d) => ({ ...d, questions: [...d.questions, newQuestion()] }))}
          >
            <Plus className="w-4 h-4" /> Add Question
          </Button>
        </div>

        {draft.questions.map((q, idx) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-kid p-5 space-y-4"
          >
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-muted-foreground" />
              <span className="font-display font-bold">Question {idx + 1}</span>
              <select
                className={cn(inputClass, 'w-auto ml-2 py-1.5')}
                value={q.type}
                onChange={(e) => {
                  const type = e.target.value as QuestionDraft['type']
                  setQuestion(idx, {
                    type,
                    correctAnswer: type === 'true_false' ? 'True' : '',
                    options: type === 'multiple_choice' ? (q.options.length >= 2 ? q.options : ['', '']) : [],
                    acceptedAnswers: [],
                  })
                }}
              >
                {QUESTION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>
                ))}
              </select>
              <div className="flex-1" />
              {draft.questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, questions: d.questions.filter((_, i) => i !== idx) }))}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                  aria-label="Delete question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <textarea
              className={cn(inputClass, 'min-h-[60px] resize-y')}
              placeholder="Type the question here… Emojis welcome! 🍎🐘✨"
              value={q.question}
              onChange={(e) => setQuestion(idx, { question: e.target.value })}
            />

            <ImageUpload
              value={q.imageUrl}
              onChange={(url) => setQuestion(idx, { imageUrl: url })}
              label="Question picture"
            />

            {/* Answers */}
            {q.type === 'multiple_choice' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-muted-foreground">
                  Options — tick the correct one ✅
                </label>
                {q.options.map((opt, optIdx) => (
                  <div key={optIdx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${q.id}`}
                      className="w-4 h-4 accent-green-600"
                      checked={opt.trim() !== '' && q.correctAnswer === opt}
                      onChange={() => setQuestion(idx, { correctAnswer: opt })}
                    />
                    <Input
                      placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                      value={opt}
                      onChange={(e) => {
                        const options = q.options.map((o, i) => (i === optIdx ? e.target.value : o))
                        setQuestion(idx, {
                          options,
                          // keep the correct answer in sync when its text is edited
                          correctAnswer: q.correctAnswer === opt ? e.target.value : q.correctAnswer,
                        })
                      }}
                      className="h-9 text-sm"
                    />
                    {q.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => setQuestion(idx, {
                          options: q.options.filter((_, i) => i !== optIdx),
                          correctAnswer: q.correctAnswer === opt ? '' : q.correctAnswer,
                        })}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50"
                        aria-label="Remove option"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
                {q.options.length < 6 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-muted-foreground"
                    onClick={() => setQuestion(idx, { options: [...q.options, ''] })}
                  >
                    <Plus className="w-3.5 h-3.5" /> Add option
                  </Button>
                )}
              </div>
            )}

            {q.type === 'true_false' && (
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-2">Correct answer</label>
                <div className="grid grid-cols-2 gap-2 max-w-xs">
                  {['True', 'False'].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setQuestion(idx, { correctAnswer: v })}
                      className={cn(
                        'py-2 rounded-xl border-2 font-bold text-sm transition-colors',
                        q.correctAnswer === v
                          ? v === 'True' ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 text-muted-foreground hover:border-gray-300'
                      )}
                    >
                      {v === 'True' ? '✅ True' : '❌ False'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {q.type === 'fill_blank' && (
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1.5">Correct answer</label>
                  <Input
                    placeholder="e.g. butterfly"
                    value={q.correctAnswer}
                    onChange={(e) => setQuestion(idx, { correctAnswer: e.target.value })}
                    className="h-9 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                    Also accept (comma-separated)
                  </label>
                  <Input
                    placeholder="e.g. a butterfly, the butterfly"
                    value={q.acceptedAnswers.join(', ')}
                    onChange={(e) => setQuestion(idx, { acceptedAnswers: e.target.value.split(',').map((s) => s.trimStart()) })}
                    className="h-9 text-sm"
                  />
                </div>
              </div>
            )}

            {/* Explanation + scoring */}
            <div className="grid sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-muted-foreground mb-1.5">💡 Explanation (shown after answering)</label>
                <Input
                  placeholder="Why is this the answer?"
                  value={q.explanation}
                  onChange={(e) => setQuestion(idx, { explanation: e.target.value })}
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1.5">Points</label>
                <Input
                  type="number" min={1} max={100} value={q.points}
                  onChange={(e) => setQuestion(idx, { points: Math.max(1, parseInt(e.target.value) || 1) })}
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1.5">Time limit (s)</label>
                <Input
                  type="number" min={5} max={300} value={q.timeLimit}
                  onChange={(e) => setQuestion(idx, { timeLimit: Math.max(5, parseInt(e.target.value) || 5) })}
                  className="h-9 text-sm"
                />
              </div>
            </div>
          </motion.div>
        ))}

        <Button
          variant="outline"
          className="w-full gap-2 border-dashed"
          onClick={() => setDraft((d) => ({ ...d, questions: [...d.questions, newQuestion()] }))}
        >
          <Plus className="w-4 h-4" /> Add Another Question
        </Button>
      </div>

      {/* Bottom save */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} size="lg" className="gap-2">
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {lessonId ? 'Save Changes' : 'Publish Quiz'}
        </Button>
      </div>
    </div>
  )
}
