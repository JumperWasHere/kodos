import { getActiveChild } from '@/lib/auth/active-child'
import { connectDB } from '@/lib/db/connect'
import Subject from '@/lib/db/models/Subject'
import Student from '@/lib/db/models/Student'
import SubjectsClient from './SubjectsClient'

export default async function SubjectsPage() {
  const [activeChild] = await Promise.all([getActiveChild(), connectDB()])
  if (!activeChild) return null

  const [subjects, student] = await Promise.all([
    Subject.find({ isActive: true }).sort({ order: 1 }).lean() as Promise<any[]>,
    Student.findById(activeChild._id).lean() as Promise<any>,
  ])

  return (
    <SubjectsClient
      subjects={JSON.parse(JSON.stringify(subjects))}
      studentProgress={JSON.parse(JSON.stringify(student?.subjectProgress ?? []))}
      isPremium={student?.isPremium ?? false}
      studentAgeGroup={student?.ageGroup}
    />
  )
}
