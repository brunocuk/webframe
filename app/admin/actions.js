'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { LEAD_STATUSES } from '@/lib/inquiryOptions'
import { createOrder, createSubscriptionLink } from '@/lib/revolut'
import { sendEmail, quoteEmailHtml, ticketReplyEmailHtml } from '@/lib/email'
import { ensureProjectForLead, PROJECT_STAGES, portalUrl } from '@/lib/portal'
import { getAdminRole } from '@/lib/adminRole'
import { notifyWhatsApp } from '@/lib/notify'

// Money and delivery actions require the owner session; lead management is
// open to both roles (middleware already guarantees a valid session).
async function requireOwner() {
  const role = await getAdminRole()
  if (role !== 'owner') {
    return { error: 'This action requires the owner login.' }
  }
  return null
}

// Creates a Revolut payment order, stores the quote, emails the payment
// link to the lead, and moves the lead to `quoted`. If the email fails
// (e.g. Resend domain not verified yet) the quote is still saved so the
// payment link can be copied and sent manually.
export async function createAndSendQuote(leadId, { plan, amountEur, paymentMode }) {
  const denied = await requireOwner()
  if (denied) return denied
  const supabase = getSupabaseAdmin()
  if (!supabase) return { error: 'Supabase is not configured' }

  const amount = Number(amountEur)
  if (!plan || !Number.isFinite(amount) || amount <= 0) {
    return { error: 'Pick a plan and a valid amount.' }
  }
  // 'balance' remains only to finish legacy 50/50 quotes — new quotes are
  // full payment or monthly.
  if (!['full', 'balance', 'monthly'].includes(paymentMode)) {
    return { error: 'Invalid payment mode.' }
  }

  const { data: lead, error: leadError } = await supabase
    .from('webframe_leads')
    .select('*')
    .eq('id', leadId)
    .single()
  if (leadError || !lead) return { error: 'Lead not found.' }

  const modeLabel =
    paymentMode === 'balance'
      ? 'final balance'
      : paymentMode === 'monthly'
        ? 'monthly subscription'
        : 'full payment'

  let order
  try {
    order =
      paymentMode === 'monthly'
        ? await createSubscriptionLink({
            email: lead.email,
            name: lead.name,
            planName: plan,
            amountEur: amount,
          })
        : await createOrder({
            amountEur: amount,
            description: `Webframe ${plan} plan — ${modeLabel} — ${lead.email}`,
            customerEmail: lead.email,
          })
  } catch (err) {
    console.error(err)
    return { error: 'Revolut order failed — check the server logs.' }
  }

  const { error: insertError } = await supabase.from('webframe_quotes').insert({
    lead_id: leadId,
    plan,
    amount_eur: amount,
    payment_mode: paymentMode,
    revolut_order_id: order.id,
    payment_link: order.checkoutUrl,
  })
  if (insertError) {
    console.error('Quote insert failed:', insertError)
    return { error: `Quote could not be saved: ${insertError.message}` }
  }

  await supabase.from('webframe_leads').update({ status: 'quoted' }).eq('id', leadId)

  let emailWarning = null
  try {
    await sendEmail({
      to: lead.email,
      subject:
        paymentMode === 'balance'
          ? 'Final balance — your site is ready to go live'
          : `Your Webframe quote — ${plan} plan`,
      html: quoteEmailHtml({
        name: lead.name,
        plan,
        amountEur: amount,
        paymentMode,
        paymentLink: order.checkoutUrl,
      }),
    })
  } catch (err) {
    console.error('Quote email failed:', err)
    emailWarning =
      'Quote saved, but the email failed to send — copy the payment link and send it manually.'
  }

  revalidatePath('/admin', 'layout')
  return { ok: true, warning: emailWarning }
}

// Manual portal creation — for leads that pay outside the automated flow.
export async function createPortalForLead(leadId) {
  const denied = await requireOwner()
  if (denied) return denied
  const supabase = getSupabaseAdmin()
  if (!supabase) return { error: 'Supabase is not configured' }
  const { data: lead } = await supabase
    .from('webframe_leads')
    .select('*')
    .eq('id', leadId)
    .single()
  if (!lead) return { error: 'Lead not found.' }
  try {
    await ensureProjectForLead(supabase, lead)
  } catch (err) {
    console.error(err)
    return { error: 'Portal creation failed — check the server logs.' }
  }
  revalidatePath('/admin', 'layout')
  return { ok: true }
}

export async function updateProjectStage(projectId, stage) {
  const denied = await requireOwner()
  if (denied) throw new Error(denied.error)
  if (!PROJECT_STAGES.some((s) => s.value === stage)) {
    throw new Error('Invalid stage')
  }
  const supabase = getSupabaseAdmin()
  if (!supabase) throw new Error('Supabase is not configured')

  const update = { stage }
  if (stage === 'live') {
    // Stamp the go-live moment once — it starts the 30-day support window.
    const { data: project } = await supabase
      .from('webframe_projects')
      .select('live_at')
      .eq('id', projectId)
      .maybeSingle()
    if (project && !project.live_at) update.live_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('webframe_projects')
    .update(update)
    .eq('id', projectId)
  if (error) throw new Error(`Stage update failed: ${error.message}`)
  revalidatePath('/admin', 'layout')
}

// Manual paid toggle — for clients who pay by bank transfer or cash instead
// of the Revolut link.
export async function markQuotePaid(quoteId) {
  const denied = await requireOwner()
  if (denied) return denied
  const supabase = getSupabaseAdmin()
  if (!supabase) return { error: 'Supabase is not configured' }
  const { error } = await supabase
    .from('webframe_quotes')
    .update({ status: 'paid', paid_at: new Date().toISOString() })
    .eq('id', quoteId)
    .eq('status', 'sent')
  if (error) return { error: `Could not mark as paid: ${error.message}` }
  revalidatePath('/admin', 'layout')
  return { ok: true }
}

// --- Support tickets (admin side) -------------------------------------------

async function resolveTicket(supabase, ticketId) {
  const { data: ticket } = await supabase
    .from('webframe_tickets')
    .select('*, webframe_projects(*, webframe_leads(*))')
    .eq('id', ticketId)
    .maybeSingle()
  return ticket
}

export async function adminReplyTicket(ticketId, body) {
  const denied = await requireOwner()
  if (denied) return denied
  const supabase = getSupabaseAdmin()
  if (!supabase) return { error: 'Supabase is not configured' }

  const cleanBody = String(body || '').trim().slice(0, 5000)
  if (!cleanBody) return { error: 'Write a reply first.' }

  const ticket = await resolveTicket(supabase, ticketId)
  if (!ticket) return { error: 'Ticket not found.' }

  const { error } = await supabase
    .from('webframe_ticket_messages')
    .insert({ ticket_id: ticket.id, sender: 'admin', body: cleanBody })
  if (error) return { error: `Reply failed: ${error.message}` }

  await supabase
    .from('webframe_tickets')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', ticket.id)

  // Email the client so they don't need to be watching the portal.
  const project = ticket.webframe_projects
  const lead = project?.webframe_leads
  let emailWarning = null
  if (lead?.email) {
    try {
      await sendEmail({
        to: lead.email,
        subject: `Re: ${ticket.subject}`,
        html: ticketReplyEmailHtml({
          name: lead.name,
          subject: ticket.subject,
          reply: cleanBody,
          portalUrl: project ? portalUrl(project.portal_token) : null,
        }),
      })
    } catch (err) {
      console.error('Ticket reply email failed:', err)
      emailWarning = 'Reply saved, but the notification email failed to send.'
    }
  }

    return { ok: true, warning: emailWarning }
}

export async function setTicketStatus(ticketId, status) {
  const denied = await requireOwner()
  if (denied) return denied
  if (!['open', 'closed'].includes(status)) return { error: 'Invalid status.' }
  const supabase = getSupabaseAdmin()
  if (!supabase) return { error: 'Supabase is not configured' }
  const { error } = await supabase
    .from('webframe_tickets')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', ticketId)
  if (error) return { error: `Could not update the ticket: ${error.message}` }
    return { ok: true }
}

// Manual lead entry — Chris's workflow for LinkedIn-sourced prospects.
export async function createManualLead({ name, email, business, plan, callAt, notes }) {
  const supabase = getSupabaseAdmin()
  if (!supabase) return { error: 'Supabase is not configured' }

  const cleanEmail = typeof email === 'string' ? email.trim() : ''
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { error: 'A valid email is required.' }
  }

  const callIso = callAt ? new Date(callAt).toISOString() : null
  const { error } = await supabase.from('webframe_leads').insert({
    name: (name || '').trim() || null,
    email: cleanEmail,
    business: (business || '').trim() || null,
    plan: plan || null,
    message: (notes || '').trim() || null,
    source: 'outbound',
    status: 'contacted',
    call_at: callIso,
  })
  if (error) return { error: `Could not save the lead: ${error.message}` }

  notifyWhatsApp(
    `📇 Outbound lead added: ${name || cleanEmail}` +
      (callIso ? ` — call ${new Date(callIso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}` : '')
  )
  revalidatePath('/admin', 'layout')
  return { ok: true }
}

export async function updateLeadCall(id, callAt) {
  const supabase = getSupabaseAdmin()
  if (!supabase) return { error: 'Supabase is not configured' }
  const callIso = callAt ? new Date(callAt).toISOString() : null
  const { error } = await supabase
    .from('webframe_leads')
    .update({ call_at: callIso })
    .eq('id', id)
  if (error) return { error: `Could not update the call time: ${error.message}` }
  revalidatePath('/admin', 'layout')
  return { ok: true }
}

export async function updateLeadStatus(id, status) {
  if (!LEAD_STATUSES.includes(status)) throw new Error('Invalid status')
  const supabase = getSupabaseAdmin()
  if (!supabase) throw new Error('Supabase is not configured')
  const { error } = await supabase
    .from('webframe_leads')
    .update({ status })
    .eq('id', id)
  if (error) throw new Error(`Status update failed: ${error.message}`)
  revalidatePath('/admin', 'layout')
}
