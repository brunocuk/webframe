// Cookie-session auth for the /admin CRM. The session token is a SHA-256
// digest derived from ADMIN_PASSWORD, so changing the password invalidates
// every existing session. WebCrypto only — this must run in edge middleware.
const encoder = new TextEncoder()

export const ADMIN_COOKIE = 'wf_admin'
export const ADMIN_SESSION_DAYS = 30

export async function adminToken() {
  const secret = process.env.ADMIN_PASSWORD
  if (!secret) return null
  const digest = await crypto.subtle.digest(
    'SHA-256',
    encoder.encode(`webframe-admin-session:${secret}`)
  )
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
