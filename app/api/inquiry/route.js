import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

// Receives project inquiries from the Start Your Project modal and the
// /contact form. Fans out to three channels — webframe's own CRM table
// (webframe_leads, browsable at /admin), WhatsApp (CallMeBot) and email
// (web3forms) — and succeeds if the lead reached at least one durable
// channel (database or email). The WhatsApp ping is best-effort.

async function storeLead(lead) {
  const supabase = getSupabaseAdmin()
  if (!supabase) return { skipped: true }
  const { error } = await supabase.from('webframe_leads').insert({
    name: lead.name || null,
    email: lead.email,
    project_type: lead.projectType || null,
    project_size: lead.projectSize || null,
    business: lead.business || null,
    message: lead.message || null,
    source: lead.source || null,
  })
  if (error) throw new Error(`Supabase insert failed: ${error.message}`)
  return { ok: true }
}

async function sendEmail(lead, summary) {
  const key = process.env.WEB3FORMS_KEY || process.env.NEXT_PUBLIC_WEB3FORMS_KEY
  if (!key) return { skipped: true }
  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_key: key,
      subject: `New Project Inquiry: ${lead.projectType || 'Website'}`,
      from_name: 'Webframe Contact Form',
      name: lead.name,
      email: lead.email,
      message: summary,
    }),
  })
  const result = await response.json()
  if (!result.success) throw new Error('web3forms rejected the submission')
  return { ok: true }
}

async function sendWhatsApp(summary) {
  const phone = process.env.CALLMEBOT_PHONE
  const apikey = process.env.CALLMEBOT_APIKEY
  if (!phone || !apikey) return { skipped: true }
  const url =
    `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}` +
    `&apikey=${encodeURIComponent(apikey)}&text=${encodeURIComponent(summary)}`
  const response = await fetch(url)
  if (!response.ok) throw new Error(`CallMeBot responded ${response.status}`)
  return { ok: true }
}

export async function POST(request) {
  let data
  try {
    data = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
  }

  // Honeypot — real users never fill this field; silently accept bot posts.
  if (data.website) return NextResponse.json({ success: true })

  const email = typeof data.email === 'string' ? data.email.trim() : ''
  if (!email || !email.includes('@')) {
    return NextResponse.json({ success: false, error: 'A valid email is required' }, { status: 400 })
  }

  const clip = (value, max = 500) =>
    typeof value === 'string' ? value.slice(0, max).trim() : ''

  const lead = {
    email: clip(email, 200),
    name: clip(data.name, 200),
    projectType: clip(data.projectType, 100),
    projectSize: clip(data.projectSize, 100),
    business: clip(data.business, 300),
    message: clip(data.message, 2000),
    source: clip(data.source, 50),
  }

  const summary =
    `New lead: ${lead.name || lead.email}\n` +
    `Email: ${lead.email}\n` +
    `Project: ${lead.projectType || '—'} · ${lead.projectSize || '—'}\n` +
    (lead.business ? `Business: ${lead.business}\n` : '') +
    (lead.message ? `Message: ${lead.message}\n` : '') +
    `Source: ${lead.source || 'unknown'}`

  const [stored, emailed, pinged] = await Promise.allSettled([
    storeLead(lead),
    sendEmail(lead, summary),
    sendWhatsApp(summary),
  ])

  for (const [label, result] of [['store', stored], ['email', emailed], ['whatsapp', pinged]]) {
    if (result.status === 'rejected') console.error(`Inquiry ${label} failed:`, result.reason)
  }

  // The lead is safe if it reached the database or the inbox.
  const durable =
    (stored.status === 'fulfilled' && stored.value.ok) ||
    (emailed.status === 'fulfilled' && emailed.value.ok)

  if (!durable) {
    return NextResponse.json(
      { success: false, error: 'Could not deliver your message' },
      { status: 502 }
    )
  }

  return NextResponse.json({ success: true })
}
