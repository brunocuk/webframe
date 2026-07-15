import { NextResponse } from 'next/server'
import { adminToken, ADMIN_COOKIE } from '@/lib/adminAuth'

// Session gate for the /admin CRM. Unauthenticated visitors are sent to the
// branded /admin/login page. Denies everything (secure default) until
// ADMIN_PASSWORD is set in the environment.
export async function middleware(request) {
  const { pathname } = request.nextUrl

  if (pathname === '/admin/login') return NextResponse.next()

  const token = await adminToken()
  const cookie = request.cookies.get(ADMIN_COOKIE)?.value
  if (token && cookie === token) return NextResponse.next()

  return NextResponse.redirect(new URL('/admin/login', request.url))
}

export const config = {
  matcher: ['/admin/:path*'],
}
