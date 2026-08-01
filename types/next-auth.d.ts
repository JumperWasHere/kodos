import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import type { UserRole } from '@/types'

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string
      role: UserRole
      isPremium: boolean
      displayName?: string
      level?: number
      xp?: number
      studentId?: string
      activeChildId?: string
    }
  }
  interface User extends DefaultUser {
    role?: UserRole
    isPremium?: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    role?: UserRole
    isPremium?: boolean
    displayName?: string
    level?: number
    xp?: number
    studentId?: string
    activeChildId?: string
  }
}
