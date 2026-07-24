import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db/connect'
import User from '@/lib/db/models/User'
import Student from '@/lib/db/models/Student'
import type { UserRole } from '@/types'

// MongoDB client for the adapter
const client = new MongoClient(process.env.MONGODB_URI!)
const clientPromise = client.connect()

export const authConfig: NextAuthConfig = {
  adapter: MongoDBAdapter(clientPromise, { databaseName: 'kidosdb' }),
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'parent' as UserRole,
        }
      },
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        await connectDB()

        const user = await User.findOne({ email: credentials.email })
          .select('+password')
          .lean() as any

        if (!user || !user.password) return null

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )
        if (!isValid) return null

        if (!user.isActive) {
          throw new Error('Account is disabled. Contact support.')
        }

        // Update last login
        await User.findByIdAndUpdate(user._id, { lastLoginAt: new Date() })

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.avatar,
          role: user.role as UserRole,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: UserRole }).role ?? 'student'
      }

      if (trigger === 'update' && session) {
        token = { ...token, ...session }
      }

      // Fetch student-specific data on first sign-in only (when user object present)
      if (user && token.role === 'student' && token.id) {
        await connectDB()
        const student = await Student.findOne({ userId: token.id }).lean() as any
        token.isPremium = student?.isPremium ?? false
        token.displayName = student?.displayName ?? token.name
        token.level = student?.level ?? 1
        token.xp = student?.xp ?? 0
        token.studentId = student?._id?.toString()
      }

      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as UserRole
      session.user.isPremium = (token.isPremium as boolean) ?? false

      if (token.role === 'student') {
        session.user.displayName = token.displayName as string
        session.user.level = token.level as number
        session.user.xp = token.xp as number
        session.user.studentId = token.studentId as string
      }

      return session
    },
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        await connectDB()
        const existingUser = await User.findOne({ email: user.email })
        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email,
            avatar: user.image,
            role: 'parent',
            isEmailVerified: true,
            googleId: user.id,
          })
        }
      }
      return true
    },
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

