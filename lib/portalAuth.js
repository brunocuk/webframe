// Cookie sessions for the client portal, created after a 6-digit email code
// is verified on /portal. The cookie stores the project's portal token plus
// an HMAC signature, so possession of a valid cookie is equivalent to
// possession of the magic link (which keeps working independently).
// Server-only (uses next/headers).
import crypto from 'crypto'
import { cookies } from 'next/headers'

export const PORTAL_COOKIE = 'wf_portal'
export const PORTAL_SESSION_DAYS = 30

// Dedicated secret when configured; otherwise derive one from the service
// role key so no extra env setup is required. Rotating either invalidates
// all portal sessions, which is an acceptable failure mode.
function sessionSecret() {
  const base =
    process.env.PORTAL_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!base) return null
  return crypto.createHash('sha256').update(`webframe-portal-session:${base}`).digest()
}

const sign = (payload, secret) =>
  crypto.createHmac('sha256', secret).update(payload).digest('base64url')

export function createSessionValue(portalToken) {
  const secret = sessionSecret()
  if (!secret) return null
  const expires = Date.now() + PORTAL_SESSION_DAYS * 24 * 60 * 60 * 1000
  const payload = `${portalToken}.${expires}`
  return `${payload}.${sign(payload, secret)}`
}

// Returns the portal token from a valid, unexpired session cookie, else null.
export function verifySessionValue(value) {
  const secret = sessionSecret()
  if (!secret || typeof value !== 'string') return null
  const parts = value.split('.')
  if (parts.length !== 3) return null
  const [token, expires, signature] = parts
  const payload = `${token}.${expires}`
  const expected = sign(payload, secret)
  if (
    signature.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  ) {
    return null
  }
  if (!Number(expires) || Number(expires) < Date.now()) return null
  return token
}

export async function setPortalSession(portalToken) {
  const value = createSessionValue(portalToken)
  if (!value) return
  const store = await cookies()
  store.set(PORTAL_COOKIE, value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: PORTAL_SESSION_DAYS * 24 * 60 * 60,
    path: '/portal',
  })
}

export async function getPortalSessionToken() {
  const store = await cookies()
  return verifySessionValue(store.get(PORTAL_COOKIE)?.value)
}

export async function clearPortalSession() {
  const store = await cookies()
  store.set(PORTAL_COOKIE, '', { maxAge: 0, path: '/portal' })
}
