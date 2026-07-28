import { connectDB } from '@/lib/db/connect'
import { Subject } from '@/lib/db/models'
import QuizForm from '@/components/teacher/QuizForm'

export default async function NewQuizPage() {
  await connectDB()
  const subjects = await Subject.find({ isActive: true })
    .sort({ order: 1 })
    .select('slug name icon topics')
    .lean() as any[]

  return <QuizForm subjects={JSON.parse(JSON.stringify(subjects))} />
}
