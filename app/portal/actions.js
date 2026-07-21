'use server'

import crypto from 'crypto'
import { redirect } from 'next/navigation'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { sendEmail, loginCodeEmailHtml } from '@/lib/email'
import { setPortalSession, clearPortalSession } from '@/lib/portalAuth'

const CODE_TTL_MINUTES = 10
const MAX_ATTEMPTS = 5

const normalizeEmail = (email) => String(email || '').trim().toLowerCase()

const hashCode = (email, code) =>
  crypto.createHash('sha256').update(`${email}:${code}`).digest('hex')

// Latest portal token for an email, or null. Clients can have several leads
// (re-inquiries); the newest project wins.
async function portalTokenForEmail(supabase, email) {
  const { data: leads } = await supabase
    .from('webframe_leads')
    .select('id')
    .ilike('email', email)
  const leadIds = (leads || []).map((lead) => lead.id)
  if (leadIds.length === 0) return null
  const { data: project } = await supabase
    .from('webframe_projects')
    .select('portal_token')
    .in('lead_id', leadIds)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  return project?.portal_token || null
}

// Step 1: email in → 6-digit code out (if a portal exists). Always returns
// ok so the form can't be used to probe which emails are clients.
export async function requestLoginCode(email) {
  const supabase = getSupabaseAdmin()
  if (!supabase) return { error: 'Login is not available right now.' }

  const clean = normalizeEmail(email)
  if (!clean || !clean.includes('@')) return { error: 'Enter a valid email address.' }

  const token = await portalTokenForEmail(supabase, clean)
  if (token) {
    const code = crypto.randomInt(100000, 1000000).toString()
    // One live code per email: drop older ones first.
    await supabase.from('webframe_login_codes').delete().eq('email', clean)
    const { error } = await supabase.from('webframe_login_codes').insert({
      email: clean,
      code_hash: hashCode(clean, code),
      expires_at: new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000).toISOString(),
    })
    if (error) {
      console.error('Login code insert failed:', error)
      return { error: 'Something went wrong — please try again.' }
    }
    try {
      await sendEmail({
        to: clean,
        subject: `${code} is your Webframe portal code`,
        html: loginCodeEmailHtml({ code }),
      })
    } catch (err) {
      console.error('Login code email failed:', err)
      return { error: 'The code email could not be sent — please try again.' }
    }
  }
  return { ok: true }
}

// Step 2: verify the code, set the session cookie, hand back the portal
// token so the client can redirect into the portal.
export async function verifyLoginCode(email, code) {
  const supabase = getSupabaseAdmin()
  if (!supabase) return { error: 'Login is not available right now.' }

  const clean = normalizeEmail(email)
  const cleanCode = String(code || '').replace(/\D/g, '')
  if (cleanCode.length !== 6) return { error: 'Enter the 6-digit code from the email.' }

  const { data: row } = await supabase
    .from('webframe_login_codes')
    .select('*')
    .eq('email', clean)
    .is('consumed_at', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const invalid = { error: 'That code is wrong or expired — request a new one.' }
  if (!row || new Date(row.expires_at) < new Date() || row.attempts >= MAX_ATTEMPTS) {
    return invalid
  }

  if (row.code_hash !== hashCode(clean, cleanCode)) {
    await supabase
      .from('webframe_login_codes')
      .update({ attempts: row.attempts + 1 })
      .eq('id', row.id)
    return invalid
  }

  const token = await portalTokenForEmail(supabase, clean)
  if (!token) return invalid

  await supabase
    .from('webframe_login_codes')
    .update({ consumed_at: new Date().toISOString() })
    .eq('id', row.id)
  await setPortalSession(token)
  return { ok: true, token }
}

export async function portalSignOut() {
  await clearPortalSession()
  redirect('/portal')
}
