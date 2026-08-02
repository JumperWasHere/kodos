import { Types } from 'mongoose'
import { getActiveChild } from '@/lib/auth/active-child'
import { connectDB } from '@/lib/db/connect'
import Lesson from '@/lib/db/models/Lesson'
import Subject from '@/lib/db/models/Subject'
import Student from '@/lib/db/models/Student'
import { notFound } from 'next/navigation'
import LessonPlayerClient from './LessonPlayerClient'

interface Props {
  params: Promise<{ subject: string; lesson: string }>
}

export default async function LessonPlayerPage({ params }: Props) {
  const { subject: slug, lesson: lessonId } = await params
  const [activeChild] = await Promise.all([getActiveChild(), connectDB()])
  if (!activeChild) return null

  if (!Types.ObjectId.isValid(lessonId)) notFound()

  const [lesson, subject, student] = await Promise.all([
    Lesson.findOne({ _id: lessonId, subjectSlug: slug, isActive: true }).lean() as any,
    Subject.findOne({ slug, isActive: true }).lean() as any,
    Student.findById(activeChild._id).lean() as any,
  ])

  if (!lesson || !subject) notFound()

  const isPremium = student?.isPremium ?? false
  if (lesson.isPremium && !isPremium) notFound()

  return (
    <LessonPlayerClient
      lesson={JSON.parse(JSON.stringify(lesson))}
      subject={JSON.parse(JSON.stringify(subject))}
      isPremium={isPremium}
      studentId={activeChild._id.toString()}
    />
  )
}
