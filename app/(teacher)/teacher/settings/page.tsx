'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { KeyRound, Loader2, Save, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function TeacherSettingsPage() {
  const { data: session, update } = useSession()
  const [name, setName] = useState(session?.user?.name ?? '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSavingName, setIsSavingName] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)

  // The session loads asynchronously — fill the name in once it arrives
  useEffect(() => {
    if (session?.user?.name) setName((n) => n || session.user.name!)
  }, [session?.user?.name])

  const handleSaveName = async () => {
    if (name.trim().length < 2) {
      toast.error('Name must be at least 2 characters.')
      return
    }
    setIsSavingName(true)
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      })
      const payload = await res.json()
      if (!res.ok || !payload.success) {
        toast.error(payload.error ?? 'Could not update your name')
        return
      }
      await update({ name: name.trim() })
      toast.success('Name updated! ✅')
    } catch {
      toast.error('Could not update your name')
    } finally {
      setIsSavingName(false)
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.')
      return
    }
    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      toast.error('New password needs 8+ characters, an uppercase letter, and a number.')
      return
    }
    setIsSavingPassword(true)
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const payload = await res.json()
      if (!res.ok || !payload.success) {
        toast.error(payload.error ?? 'Could not change your password')
        return
      }
      toast.success('Password changed! 🔒')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch {
      toast.error('Could not change your password')
    } finally {
      setIsSavingPassword(false)
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold mb-1">Settings ⚙️</h1>
        <p className="text-muted-foreground">Manage your account</p>
      </div>

      {/* Profile */}
      <div className="card-kid p-6 space-y-4">
        <div className="flex items-center gap-2">
          <UserRound className="w-5 h-5 text-primary" />
          <h2 className="font-display font-bold text-lg">Profile</h2>
        </div>
        <div>
          <label className="block text-xs font-bold text-muted-foreground mb-1.5">Full name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        </div>
        <div>
          <label className="block text-xs font-bold text-muted-foreground mb-1.5">Email</label>
          <Input value={session?.user?.email ?? ''} disabled className="bg-muted" />
          <p className="text-xs text-muted-foreground mt-1">Email cannot be changed.</p>
        </div>
        <Button onClick={handleSaveName} disabled={isSavingName} className="gap-2">
          {isSavingName ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Profile
        </Button>
      </div>

      {/* Password */}
      <div className="card-kid p-6 space-y-4">
        <div className="flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-primary" />
          <h2 className="font-display font-bold text-lg">Change Password</h2>
        </div>
        <div>
          <label className="block text-xs font-bold text-muted-foreground mb-1.5">Current password</label>
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">New password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="Min. 8 characters"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">Confirm new password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
        </div>
        <Button
          onClick={handleChangePassword}
          disabled={isSavingPassword || !currentPassword || !newPassword}
          className="gap-2"
        >
          {isSavingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
          Change Password
        </Button>
      </div>
    </div>
  )
}
