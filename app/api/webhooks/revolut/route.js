import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { sendEmail, onboardingEmailHtml } from '@/lib/email'
import { ensureProjectForLead, portalUrl } from '@/lib/portal'
import { getOrder } from '@/lib/revolut'
import { notifyWhatsApp } from '@/lib/notify'

// Revolut Merchant webhook.
//  - ORDER_COMPLETED for a quote's order: mark it paid, move the lead to
//    `won`, fire the onboarding email + WhatsApp ping.
//  - Every completed webframe order (quote or recurring subscription cycle)
//    is also recorded in webframe_payments, so recurring revenue shows up
//    in /admin/clients.
//  - ORDER_FAILED: WhatsApp alert (failed recurring cards would otherwise
//    go unnoticed).
// The merchant account is shared with ninefold — orders that can't be
// attributed to webframe (no quote, no lead email match, no "Webframe"
// description) are ignored entirely.
//
// Register the webhook (once, per environment) pointing at
//   https://web-frame.eu/api/webhooks/revolut
// with events ORDER_COMPLETED + ORDER_FAILED, and put its signing secret in
// REVOLUT_WEBHOOK_SECRET.

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

const euro = (value) =>
  `€${Number(value || 0).toLocaleString('en-IE')}`

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

  if (!['ORDER_COMPLETED', 'ORDER_FAILED'].includes(event.event) || !event.order_id) {
    return new NextResponse(null, { status: 204 })
  }

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  // Attribution: the quote that created this order (if any), the full order
  // from Revolut, and the lead (via quote, or via customer email).
  const { data: quote } = await supabase
    .from('webframe_quotes')
    .select('*, webframe_leads(*)')
    .eq('revolut_order_id', event.order_id)
    .maybeSingle()

  let order = null
  try {
    order = await getOrder(event.order_id)
  } catch (err) {
    console.error('Order lookup failed:', err)
  }

  const customerEmail = order?.customer?.email?.toLowerCase() || null
  let lead = quote?.webframe_leads || null
  if (!lead && customerEmail) {
    const { data } = await supabase
      .from('webframe_leads')
      .select('*')
      .ilike('email', customerEmail)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    lead = data
  }

  // Shared Revolut account: silently skip anything that isn't webframe's.
  const isWebframe =
    Boolean(quote) || Boolean(lead) || (order?.description || '').startsWith('Webframe')
  if (!isWebframe) return new NextResponse(null, { status: 204 })

  const amountEur =
    order?.amount != null ? order.amount / 100 : quote ? Number(quote.amount_eur) : null
  const who = lead?.name || lead?.email || customerEmail || 'unknown'

  if (event.event === 'ORDER_FAILED') {
    await notifyWhatsApp(
      `⚠️ Payment FAILED — ${euro(amountEur)} (${order?.description || 'no description'}) — ${who}`
    )
    return new NextResponse(null, { status: 204 })
  }

  // --- ORDER_COMPLETED ---

  // Ledger entry; the unique revolut_order_id makes webhook redeliveries
  // idempotent, and `inserted` gates the notifications below.
  const isRecurring = !quote && Boolean(order?.subscription_data)
  const { data: insertedRows } = await supabase
    .from('webframe_payments')
    .upsert(
      {
        revolut_order_id: event.order_id,
        quote_id: quote?.id || null,
        lead_id: lead?.id || null,
        amount_eur: amountEur,
        currency: order?.currency || 'EUR',
        description: order?.description || null,
        customer_email: customerEmail,
        kind: quote ? 'quote' : isRecurring ? 'recurring' : 'other',
      },
      { onConflict: 'revolut_order_id', ignoreDuplicates: true }
    )
    .select()
  const inserted = (insertedRows || []).length > 0

  if (quote && quote.status !== 'paid') {
    await supabase
      .from('webframe_quotes')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('id', quote.id)

    await supabase
      .from('webframe_leads')
      .update({ status: 'won' })
      .eq('id', quote.lead_id)

    // Onboarding only when the project is actually booked — a legacy balance
    // payment gets no "next steps" email. Provision the client portal first
    // so the email can carry the magic link.
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
      `💸 PAID: ${who} — ${euro(quote.amount_eur)} (${quote.plan}, ${quote.payment_mode})`
    )
  } else if (inserted && isRecurring) {
    await notifyWhatsApp(
      `🔁 Recurring payment — ${euro(amountEur)} (${order?.description || 'subscription'}) — ${who}`
    )
  } else if (inserted && !quote) {
    await notifyWhatsApp(
      `💸 Payment received — ${euro(amountEur)} (${order?.description || 'no description'}) — ${who}`
    )
  }

  return new NextResponse(null, { status: 204 })
}
