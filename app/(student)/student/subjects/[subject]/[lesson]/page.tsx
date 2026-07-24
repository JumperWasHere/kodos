import { auth } from '@/lib/auth/config'
import { connectDB } from '@/lib/db/connect'
import Lesson from '@/lib/db/models/Lesson'
import Subject from '@/lib/db/models/Subject'
import Student from '@/lib/db/models/Student'
import { notFound } from 'next/navigation'
import LessonPlayerClient from './LessonPlayerClient'
import type { QuizQuestion } from '@/types'

interface Props {
  params: Promise<{ subject: string; lesson: string }>
}

export default async function LessonPlayerPage({ params }: Props) {
  const { subject: slug, lesson: lessonId } = await params
  const session = await auth()
  if (!session?.user?.id) return null

  // Handle mock lesson IDs (when seeded data isn't present)
  if (lessonId.startsWith('mock-')) {
    const subject = await (async () => {
      await connectDB()
      return Subject.findOne({ slug, isActive: true }).lean() as any
    })()
    if (!subject) notFound()
    return (
      <LessonPlayerClient
        lesson={getMockLesson(lessonId, slug) as any}
        subject={JSON.parse(JSON.stringify(subject))}
        isPremium={false}
        studentId={session.user.studentId ?? ''}
      />
    )
  }

  await connectDB()

  const [lesson, subject, student] = await Promise.all([
    Lesson.findById(lessonId).lean() as any,
    Subject.findOne({ slug, isActive: true }).lean() as any,
    Student.findOne({ userId: session.user.id }).lean() as any,
  ])

  if (!lesson || !subject) notFound()

  const isPremium = student?.isPremium ?? false
  if (lesson.isPremium && !isPremium) notFound()

  return (
    <LessonPlayerClient
      lesson={JSON.parse(JSON.stringify(lesson))}
      subject={JSON.parse(JSON.stringify(subject))}
      isPremium={isPremium}
      studentId={session.user.studentId ?? ''}
    />
  )
}

function getMockLesson(id: string, subjectSlug: string) {
  const mockQuestions: QuizQuestion[] = [
    {
      id: 'q1',
      question: 'Which letter comes after "D" in the alphabet?',
      type: 'multiple_choice',
      options: ['C', 'E', 'F', 'B'],
      correctAnswer: 'E',
      explanation: 'The alphabet goes: A, B, C, D, E...',
      points: 10,
      timeLimit: 20,
    },
    {
      id: 'q2',
      question: 'Which of these is a vowel?',
      type: 'multiple_choice',
      options: ['B', 'C', 'O', 'T'],
      correctAnswer: 'O',
      explanation: 'The vowels are A, E, I, O, U.',
      points: 10,
      timeLimit: 20,
    },
    {
      id: 'q3',
      question: '"CAT" starts with the letter ___',
      type: 'multiple_choice',
      options: ['A', 'T', 'C', 'K'],
      correctAnswer: 'C',
      explanation: 'The word CAT starts with the letter C.',
      points: 10,
      timeLimit: 20,
    },
    {
      id: 'q4',
      question: 'How many letters are in the English alphabet?',
      type: 'multiple_choice',
      options: ['24', '26', '28', '22'],
      correctAnswer: '26',
      explanation: 'The English alphabet has 26 letters, from A to Z.',
      points: 10,
      timeLimit: 20,
    },
    {
      id: 'q5',
      question: 'Which word rhymes with "CAT"?',
      type: 'multiple_choice',
      options: ['DOG', 'BAT', 'BUS', 'COW'],
      correctAnswer: 'BAT',
      explanation: 'BAT and CAT both end with the "-AT" sound.',
      points: 10,
      timeLimit: 20,
    },
  ]

  return {
    _id: id,
    title: 'Alphabet Adventure',
    description: 'Learn A–Z with fun questions!',
    type: 'quiz' as const,
    subjectSlug,
    xpReward: 30,
    coinReward: 15,
    duration: 5,
    difficulty: 'easy' as const,
    questions: mockQuestions,
    isPremium: false,
  }
}
