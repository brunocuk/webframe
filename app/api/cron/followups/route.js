import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { sendEmail, quoteReminderEmailHtml, contentNudgeEmailHtml } from '@/lib/email'
import { portalUrl } from '@/lib/portal'
import { isContentComplete } from '@/lib/contentItems'
import { buildDeadline, timeLeftLabel } from '@/lib/projectTime'
import { notifyWhatsApp } from '@/lib/notify'

// Daily follow-up sweep (Vercel cron, see vercel.json):
//  1. Quotes still unpaid 3+ days after sending → one payment reminder.
//  2. Projects 4+ days old whose content checklist is still incomplete and
//     has seen no activity for 3+ days → one content nudge with the portal
//     link. Catches both never-started and started-then-stalled portals.
//  3. Builds within 24h of (or past) their 7-day deadline → one WhatsApp
//     warning to Bruno.
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
    if (!lead?.email) continue
    const items = project.webframe_content_items || []
    if (isContentComplete(items)) continue
    // Leave clients alone while they're actively working through the list.
    const lastActivity = Math.max(
      new Date(project.created_at).getTime(),
      ...items.map((item) => (item.updated_at ? new Date(item.updated_at).getTime() : 0))
    )
    if (lastActivity > new Date(daysAgo(3)).getTime()) continue
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
      await notifyWhatsApp(`⏰ Content nudge sent: ${project.name} — checklist incomplete`)
      sent += 1
    } catch (err) {
      console.error(`Content nudge failed for ${project.id}:`, err)
    }
  }
  return sent
}

async function warnTightDeadlines(supabase) {
  const { data: projects } = await supabase
    .from('webframe_projects')
    .select('*')
    .in('stage', ['build', 'review'])
    .not('content_completed_at', 'is', null)
    .is('deadline_warned_at', null)
  let sent = 0
  for (const project of projects || []) {
    const deadline = buildDeadline(project)
    if (!deadline || deadline.getTime() - Date.now() > 24 * 60 * 60 * 1000) continue
    try {
      await notifyWhatsApp(
        `⏳ Build deadline — ${project.name}: ${timeLeftLabel(deadline)} (due ${deadline.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })})`
      )
      await supabase
        .from('webframe_projects')
        .update({ deadline_warned_at: new Date().toISOString() })
        .eq('id', project.id)
      sent += 1
    } catch (err) {
      console.error(`Deadline warning failed for ${project.id}:`, err)
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

  const [quoteReminders, contentNudges, deadlineWarnings] = await Promise.all([
    remindUnpaidQuotes(supabase),
    nudgeMissingContent(supabase),
    warnTightDeadlines(supabase),
  ])

  return NextResponse.json({ quoteReminders, contentNudges, deadlineWarnings })
}
