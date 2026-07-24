import { auth } from '@/lib/auth/config'
import { redirect } from 'next/navigation'
import { Sidebar, TopNav } from '@/components/layout/Sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'admin') redirect('/login')
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar role="admin" user={{ name: session.user.name ?? '', email: session.user.email ?? '' }} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav role="admin" userName={session.user.name ?? 'Admin'} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
