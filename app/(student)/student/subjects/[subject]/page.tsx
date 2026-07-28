import { auth } from '@/lib/auth/config'
import { connectDB } from '@/lib/db/connect'
import Subject from '@/lib/db/models/Subject'
import Lesson from '@/lib/db/models/Lesson'
import Student from '@/lib/db/models/Student'
import { notFound } from 'next/navigation'
import SubjectDetailClient from './SubjectDetailClient'

interface Props {
  params: Promise<{ subject: string }>
}

export default async function SubjectDetailPage({ params }: Props) {
  const { subject: slug } = await params
  const [session] = await Promise.all([auth(), connectDB()])
  if (!session?.user?.id) return null

  const [subjectDoc, lessonsDoc, student] = await Promise.all([
    Subject.findOne({ slug, isActive: true }).lean() as any,
    Lesson.find({ subjectSlug: slug, isActive: true })
      .sort({ order: 1 })
      .select('-questions') // don't load questions in list view
      .lean() as unknown as any[],
    Student.findOne({ userId: session.user.id }).lean() as any,
  ])

  if (!subjectDoc) notFound()

  const isPremium = student?.isPremium ?? false

  return (
    <SubjectDetailClient
      subject={JSON.parse(JSON.stringify(subjectDoc))}
      lessons={JSON.parse(JSON.stringify(lessonsDoc))}
      isPremium={isPremium}
      studentAgeGroup={student?.ageGroup}
    />
  )
}
