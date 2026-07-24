import { auth } from '@/lib/auth/config'
import { redirect } from 'next/navigation'
import { Sidebar, TopNav } from '@/components/layout/Sidebar'

export default async function ParentLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'parent' && session.user.role !== 'admin') redirect('/login')

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar role="parent" user={{ name: session.user.name ?? '', email: session.user.email ?? '', avatar: session.user.image ?? undefined }} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav role="parent" userName={session.user.name ?? 'Parent'} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
