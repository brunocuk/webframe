import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { sendEmail, quoteReminderEmailHtml, contentNudgeEmailHtml } from '@/lib/email'
import { portalUrl } from '@/lib/portal'
import { notifyWhatsApp } from '@/lib/notify'

// Daily follow-up sweep (Vercel cron, see vercel.json):
//  1. Quotes still unpaid 3+ days after sending → one payment reminder.
//  2. Projects stuck in the content stage 4+ days with zero uploads → one
//     content nudge with the portal link.
// Each reminder fires at most once per quote/project.

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString()

async function remindUnpaidQuotes(supabase) {
  const { data: quotes } = await supabase
    .from('webframe_quotes')
    .select('*, webframe_leads(*)')
    .eq('status', 'sent')
    .is('reminder_sent_at', null)
    .lt('created_at', daysAgo(3))
  let sent = 0
  for (const quote of quotes || []) {
    const lead = quote.webframe_leads
    if (!lead?.email || !quote.payment_link) continue
    try {
      await sendEmail({
        to: lead.email,
        subject: `Your Webframe quote is still waiting — ${quote.plan} plan`,
        html: quoteReminderEmailHtml({
          name: lead.name,
          plan: quote.plan,
          amountEur: quote.amount_eur,
          paymentLink: quote.payment_link,
        }),
      })
      await supabase
        .from('webframe_quotes')
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq('id', quote.id)
      await notifyWhatsApp(
        `⏰ Reminder sent: unpaid ${quote.plan} quote (€${quote.amount_eur}) — ${lead.name || lead.email}`
      )
      sent += 1
    } catch (err) {
      console.error(`Quote reminder failed for ${quote.id}:`, err)
    }
  }
  return sent
}

async function nudgeMissingContent(supabase) {
  const { data: projects } = await supabase
    .from('webframe_projects')
    .select('*, webframe_leads(*), webframe_content_items(*)')
    .eq('stage', 'content')
    .is('content_reminder_sent_at', null)
    .lt('created_at', daysAgo(4))
  let sent = 0
  for (const project of projects || []) {
    const lead = project.webframe_leads
    const hasUploads = (project.webframe_content_items || []).some(
      (item) => (item.files || []).length > 0
    )
    if (hasUploads || !lead?.email) continue
    try {
      await sendEmail({
        to: lead.email,
        subject: 'Your build week is waiting on your content',
        html: contentNudgeEmailHtml({
          name: lead.name,
          portalUrl: portalUrl(project.portal_token),
        }),
      })
      await supabase
        .from('webframe_projects')
        .update({ content_reminder_sent_at: new Date().toISOString() })
        .eq('id', project.id)
      await notifyWhatsApp(`⏰ Content nudge sent: ${project.name} — no uploads yet`)
      sent += 1
    } catch (err) {
      console.error(`Content nudge failed for ${project.id}:`, err)
    }
  }
  return sent
}

export async function GET(request) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  const [quoteReminders, contentNudges] = await Promise.all([
    remindUnpaidQuotes(supabase),
    nudgeMissingContent(supabase),
  ])

  return NextResponse.json({ quoteReminders, contentNudges })
}
