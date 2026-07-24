import { auth } from '@/lib/auth/config'
import { redirect } from 'next/navigation'
import { Sidebar, TopNav } from '@/components/layout/Sidebar'

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'student' && session.user.role !== 'admin') redirect('/login')

  const user = {
    name: session.user.name ?? '',
    email: session.user.email ?? '',
    image: session.user.image ?? undefined,
    displayName: session.user.displayName,
    level: session.user.level,
    xp: session.user.xp,
    streakDays: undefined as number | undefined,
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar role="student" user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav role="student" userName={user.displayName || user.name} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
