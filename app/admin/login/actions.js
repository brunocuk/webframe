'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { adminToken, ADMIN_COOKIE, ADMIN_SESSION_DAYS } from '@/lib/adminAuth'

export async function login(prevState, formData) {
  const password = formData.get('password')
  const expected = process.env.ADMIN_PASSWORD

  if (!expected) {
    return { error: 'ADMIN_PASSWORD is not configured on the server.' }
  }
  if (typeof password !== 'string' || password !== expected) {
    return { error: 'Wrong password — access denied.' }
  }

  const token = await adminToken()
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * ADMIN_SESSION_DAYS,
  })
  redirect('/admin')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE)
  redirect('/admin/login')
}
