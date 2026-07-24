/**
 * Edge-compatible NextAuth config — NO Node.js imports.
 * Used only by middleware.ts (Edge runtime).
 */
import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import type { UserRole } from '@/types'

export const authConfigEdge: NextAuthConfig = {
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: '/login', error: '/login' },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: UserRole }).role ?? 'student'
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as UserRole
      session.user.isPremium = (token.isPremium as boolean) ?? false
      return session
    },
  },
}

export const { auth } = NextAuth(authConfigEdge)
