import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client for the shared ninefold project (its `leads`
// table doubles as webframe's CRM). Service-role key — import only from API
// routes / server code, never from client components. Returns null when the
// env vars aren't configured so callers can degrade gracefully.
export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}
