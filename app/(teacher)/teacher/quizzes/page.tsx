import { connectDB } from '@/lib/db/connect'
import { Subject } from '@/lib/db/models'
import QuizListClient from './QuizListClient'

export default async function TeacherQuizzesPage() {
  await connectDB()
  const subjects = await Subject.find({ isActive: true })
    .sort({ order: 1 })
    .select('slug name icon')
    .lean() as any[]

  return <QuizListClient subjects={JSON.parse(JSON.stringify(subjects))} />
}
