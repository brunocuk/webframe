// Cookie-session auth for the /admin CRM with two access levels:
//  - owner (ADMIN_PASSWORD): everything, including quotes and projects
//  - sales (SALES_PASSWORD): view leads, add leads, statuses, call times
// Session tokens are SHA-256 digests derived from the passwords, so changing
// a password invalidates that role's sessions. WebCrypto only — this must
// run in edge middleware.
const encoder = new TextEncoder()

export const ADMIN_COOKIE = 'wf_admin'
export const ADMIN_SESSION_DAYS = 30
export const ADMIN_ROLES = ['owner', 'sales']

async function digest(secret) {
  const bytes = await crypto.subtle.digest(
    'SHA-256',
    encoder.encode(`webframe-admin-session:${secret}`)
  )
  return Array.from(new Uint8Array(bytes))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function accountForRole(role) {
  if (role === 'owner') {
    return {
      email: (process.env.ADMIN_EMAIL || 'bruno@web-frame.eu').toLowerCase(),
      secret: process.env.ADMIN_PASSWORD,
    }
  }
  return {
    email: (process.env.SALES_EMAIL || 'chris@web-frame.eu').toLowerCase(),
    secret: process.env.SALES_PASSWORD,
  }
}

export async function tokenForRole(role) {
  const { secret } = accountForRole(role)
  if (!secret) return null
  return digest(secret)
}

export async function roleForToken(token) {
  if (!token) return null
  for (const role of ADMIN_ROLES) {
    const expected = await tokenForRole(role)
    if (expected && expected === token) return role
  }
  return null
}

export async function roleForCredentials(email, password) {
  if (typeof email !== 'string' || typeof password !== 'string') return null
  for (const role of ADMIN_ROLES) {
    const account = accountForRole(role)
    if (account.secret && email.trim().toLowerCase() === account.email && password === account.secret) {
      return role
    }
  }
  return null
}
