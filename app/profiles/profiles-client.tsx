'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Child = { id: string; name: string; avatar: string; grade: number; ageGroup: string; level: number; xp: number }
const AVATARS = ['🦊', '🐼', '🦁', '🐯', '🦄', '🚀', '🌈', '🐬']

export default function ProfilesClient({ parentName, profiles }: { parentName: string; profiles: Child[] }) {
  const router = useRouter()
  const { update } = useSession()
  const [children] = useState(profiles)
  const [adding, setAdding] = useState(false)
  const [selecting, setSelecting] = useState<string | null>(null)
  const [avatar, setAvatar] = useState(AVATARS[0])

  async function choose(childId: string) {
    setSelecting(childId)
    try {
      await update({ activeChildId: childId })
      router.push('/student/dashboard')
      router.refresh()
    } finally { setSelecting(null) }
  }

  async function addChild(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const payload = { name: form.get('name'), avatar, grade: Number(form.get('grade')), ageGroup: form.get('ageGroup') }
    const res = await fetch('/api/profiles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const body = await res.json()
    if (!res.ok) return toast.error(body.error ?? 'Could not create child profile')
    toast.success('Child profile created')
    setAdding(false)
    router.refresh()
  }

  return <main className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-pink-50 p-6 md:p-12">
    <div className="mx-auto max-w-4xl text-center">
      <div className="mb-10"><div className="text-5xl mb-4">🎓</div><h1 className="font-display text-3xl font-bold">Who&apos;s learning today?</h1><p className="mt-2 text-muted-foreground">Choose a child profile, {parentName.split(' ')[0]}.</p></div>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
        {children.map((child) => <button key={child.id} onClick={() => choose(child.id)} disabled={!!selecting} className="group rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-lg disabled:opacity-60">
          <div className="mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-full bg-violet-100 text-5xl group-hover:ring-4 group-hover:ring-violet-200">{child.avatar}</div><p className="font-bold">{child.name}</p><p className="mt-1 text-xs text-muted-foreground">Year {child.grade} · Level {child.level}</p>{selecting === child.id && <Loader2 className="mx-auto mt-2 h-4 w-4 animate-spin" />}
        </button>)}
        <button onClick={() => setAdding(true)} className="min-h-52 rounded-3xl border-2 border-dashed border-violet-300 bg-white/60 p-5 text-violet-700 transition hover:bg-violet-50"><Plus className="mx-auto mb-3 h-10 w-10" /><span className="font-bold">Add Child</span></button>
      </div>
      {adding && <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"><form onSubmit={addChild} className="w-full max-w-md space-y-4 rounded-3xl bg-white p-6 text-left shadow-xl"><div><h2 className="font-display text-2xl font-bold">Add a child</h2><p className="text-sm text-muted-foreground">This profile will not have its own email or password.</p></div><Input name="name" placeholder="Child's name" required maxLength={50} /><select name="grade" defaultValue="1" className="w-full rounded-xl border border-input bg-background px-3 py-2"><option value="0">Preschool</option>{[1,2,3,4,5,6].map((grade) => <option key={grade} value={grade}>Year {grade}</option>)}</select><select name="ageGroup" defaultValue="lower_primary" className="w-full rounded-xl border border-input bg-background px-3 py-2"><option value="toddler">Little Ones</option><option value="preschool">Preschool</option><option value="lower_primary">Lower Primary</option><option value="upper_primary">Upper Primary</option></select><div className="flex flex-wrap gap-2">{AVATARS.map((item) => <button type="button" key={item} onClick={() => setAvatar(item)} className={`grid h-11 w-11 place-items-center rounded-xl text-2xl ${avatar === item ? 'bg-violet-200 ring-2 ring-violet-600' : 'bg-gray-100'}`}>{item}</button>)}</div><div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setAdding(false)}>Cancel</Button><Button type="submit">Create profile</Button></div></form></div>}
    </div>
  </main>
}
