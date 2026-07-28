import { Types } from 'mongoose'
import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth/config'
import { connectDB } from '@/lib/db/connect'
import { Lesson, Subject } from '@/lib/db/models'
import QuizForm, { type QuizDraft, type QuestionDraft } from '@/components/teacher/QuizForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditQuizPage({ params }: Props) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) redirect('/login')
  if (!Types.ObjectId.isValid(id)) notFound()

  await connectDB()
  const [lesson, subjects] = await Promise.all([
    Lesson.findById(id).lean() as any,
    Subject.find({ isActive: true }).sort({ order: 1 }).select('slug name icon topics').lean() as unknown as any[],
  ])

  if (!lesson) notFound()

  // Teachers may only edit their own quizzes; admins may edit any
  const isOwner = lesson.createdBy?.toString() === session.user.id
  if (session.user.role !== 'admin' && !isOwner) redirect('/teacher/quizzes')

  const questions: QuestionDraft[] = (lesson.questions ?? []).map((q: any) => {
    const answers = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer]
    return {
      id: q.id,
      question: q.question,
      type: ['multiple_choice', 'true_false', 'fill_blank'].includes(q.type) ? q.type : 'multiple_choice',
      options: q.options ?? [],
      correctAnswer: answers[0] ?? '',
      acceptedAnswers: answers.slice(1),
      explanation: q.explanation ?? '',
      imageUrl: q.imageUrl || undefined,
      points: q.points ?? 10,
      timeLimit: q.timeLimit ?? 20,
    }
  })

  const initialData: QuizDraft = {
    title: lesson.title,
    description: lesson.description,
    subjectSlug: lesson.subjectSlug,
    topicId: lesson.topicId ?? '',
    ageGroup: lesson.ageGroup,
    grade: lesson.grade ?? [],
    type: ['quiz', 'interactive', 'game'].includes(lesson.type) ? lesson.type : 'quiz',
    difficulty: lesson.difficulty,
    language: ['en', 'ms', 'zh', 'ar'].includes(lesson.language) ? lesson.language : 'en',
    duration: lesson.duration,
    xpReward: lesson.xpReward,
    coinReward: lesson.coinReward,
    isPremium: lesson.isPremium,
    questions: questions.length > 0 ? questions : [],
  }

  return (
    <QuizForm
      subjects={JSON.parse(JSON.stringify(subjects))}
      initialData={JSON.parse(JSON.stringify(initialData))}
      lessonId={id}
    />
  )
}
