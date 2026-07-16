'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  roleForCredentials,
  tokenForRole,
  ADMIN_COOKIE,
  ADMIN_SESSION_DAYS,
} from '@/lib/adminAuth'

export async function login(prevState, formData) {
  const email = formData.get('email')
  const password = formData.get('password')

  if (!process.env.ADMIN_PASSWORD) {
    return { error: 'ADMIN_PASSWORD is not configured on the server.' }
  }
  const role = await roleForCredentials(email, password)
  if (!role) {
    return { error: 'Wrong email or password — access denied.' }
  }

  const token = await tokenForRole(role)
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
