import { auth } from '@/lib/auth/config.edge'
import { NextResponse } from 'next/server'

const protectedRoutes = ['/student', '/parent', '/teacher', '/admin']
const authRoutes = ['/login', '/signup', '/forgot-password']

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAuthenticated = !!req.auth

  const isProtectedRoute = protectedRoutes.some((r) => pathname.startsWith(r))
  const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r))

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && isAuthenticated) {
    const role = req.auth?.user?.role ?? 'student'
    const redirectMap: Record<string, string> = {
      student: '/student/dashboard',
      parent: '/parent/dashboard',
      teacher: '/teacher/dashboard',
      admin: '/admin/dashboard',
    }
    return NextResponse.redirect(new URL(redirectMap[role] ?? '/student/dashboard', req.url))
  }

  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  return response
})

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js).*)',
  ],
}
