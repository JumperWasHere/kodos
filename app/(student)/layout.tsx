import { auth } from '@/lib/auth/config'
import { redirect } from 'next/navigation'
import { Sidebar, TopNav } from '@/components/layout/Sidebar'
import { getActiveChild } from '@/lib/auth/active-child'

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'parent') redirect('/login')
  const child = await getActiveChild()
  if (!child) redirect('/profiles')

  const user = {
    name: child.displayName,
    email: session.user.email ?? '',
    avatar: child.avatar,
    displayName: child.displayName,
    level: child.level,
    xp: child.xp,
    streakDays: child.streakDays,
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar role="student" user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav role="student" userName={user.displayName || user.name} showProfileSwitcher />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
