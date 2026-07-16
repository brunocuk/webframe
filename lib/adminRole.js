import { cookies } from 'next/headers'
import { ADMIN_COOKIE, roleForToken } from './adminAuth'

// Server-side role lookup for pages and actions (not edge-safe — middleware
// uses lib/adminAuth directly).
export async function getAdminRole() {
  const cookieStore = await cookies()
  return roleForToken(cookieStore.get(ADMIN_COOKIE)?.value)
}
