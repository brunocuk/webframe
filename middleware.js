import { NextResponse } from 'next/server'
import { roleForToken, ADMIN_COOKIE } from '@/lib/adminAuth'

// Session gate for the /admin CRM (owner or sales role). Unauthenticated
// visitors are sent to the branded /admin/login page. Denies everything
// (secure default) until at least ADMIN_PASSWORD is set.
export async function middleware(request) {
  const { pathname } = request.nextUrl

  if (pathname === '/admin/login') return NextResponse.next()

  const role = await roleForToken(request.cookies.get(ADMIN_COOKIE)?.value)
  if (role) return NextResponse.next()

  return NextResponse.redirect(new URL('/admin/login', request.url))
}

export const config = {
  matcher: ['/admin/:path*'],
}
