import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { sendEmail, onboardingEmailHtml } from '@/lib/email'
import { ensureProjectForLead, portalUrl } from '@/lib/portal'
import { notifyWhatsApp } from '@/lib/notify'

// Revolut Merchant webhook. On ORDER_COMPLETED: mark the quote paid, move
// the lead to `won`, and fire the onboarding email + WhatsApp ping.
// Register the webhook (once, per environment) pointing at
//   https://web-frame.eu/api/webhooks/revolut
// and put its signing secret in REVOLUT_WEBHOOK_SECRET.

function verifySignature(rawBody, timestamp, signatureHeader, secret) {
  if (!timestamp || !signatureHeader) return false
  // Reject events older than 5 minutes (replay protection)
  if (Math.abs(Date.now() - Number(timestamp)) > 5 * 60 * 1000) return false
  const expected =
    'v1=' +
    crypto
      .createHmac('sha256', secret)
      .update(`v1.${timestamp}.${rawBody}`)
      .digest('hex')
  return signatureHeader
    .split(',')
    .some((candidate) => {
      const sig = candidate.trim()
      return (
        sig.length === expected.length &&
        crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
      )
    })
}

export async function POST(request) {
  const secret = process.env.REVOLUT_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  }

  const rawBody = await request.text()
  const valid = verifySignature(
    rawBody,
    request.headers.get('revolut-request-timestamp'),
    request.headers.get('revolut-signature'),
    secret
  )
  if (!valid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let event
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  if (event.event !== 'ORDER_COMPLETED' || !event.order_id) {
    return new NextResponse(null, { status: 204 })
  }

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  // Idempotent: only transition quotes that aren't already paid.
  const { data: quote } = await supabase
    .from('webframe_quotes')
    .select('*, webframe_leads(*)')
    .eq('revolut_order_id', event.order_id)
    .neq('status', 'paid')
    .maybeSingle()

  if (!quote) return new NextResponse(null, { status: 204 })

  await supabase
    .from('webframe_quotes')
    .update({ status: 'paid', paid_at: new Date().toISOString() })
    .eq('id', quote.id)

  await supabase
    .from('webframe_leads')
    .update({ status: 'won' })
    .eq('id', quote.lead_id)

  const lead = quote.webframe_leads
  const amount = `€${Number(quote.amount_eur).toLocaleString('en-IE')}`

  // Onboarding only when the project is actually booked (full payment or
  // deposit) — a balance payment gets no "next steps" email. Provision the
  // client portal first so the email can carry the magic link.
  if (lead && quote.payment_mode !== 'balance') {
    let portalLink = null
    try {
      const { project } = await ensureProjectForLead(supabase, lead, quote.id)
      portalLink = portalUrl(project.portal_token)
    } catch (err) {
      console.error('Portal provisioning failed:', err)
    }
    try {
      await sendEmail({
        to: lead.email,
        subject: "Payment received — here's what happens next",
        html: onboardingEmailHtml({ name: lead.name, portalUrl: portalLink }),
      })
    } catch (err) {
      console.error('Onboarding email failed:', err)
    }
  }

  await notifyWhatsApp(
    `💸 PAID: ${lead?.name || lead?.email || 'Unknown'} — ${amount} (${quote.plan}, ${quote.payment_mode})`
  )

  return new NextResponse(null, { status: 204 })
}
