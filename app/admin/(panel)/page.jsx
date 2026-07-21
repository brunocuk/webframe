import Link from 'next/link'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { LEAD_STATUSES } from '@/lib/inquiryOptions'
import { isContentComplete } from '@/lib/contentItems'
import { buildDeadline, timeLeftLabel } from '@/lib/projectTime'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Dashboard - Webframe Admin',
  robots: { index: false, follow: false },
}

const euro = (value) => `€${Number(value || 0).toLocaleString('en-IE')}`

const feedFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

function Card({ title, children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-5 ${className}`}>
      {title && (
        <div className="font-mono text-[10px] tracking-wider text-gray-400 uppercase mb-3">
          {title}
        </div>
      )}
      {children}
    </div>
  )
}

export default async function AdminDashboardPage() {
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return (
      <Card title="error">
        <p className="text-sm text-gray-600">
          Supabase is not configured — set SUPABASE_URL and
          SUPABASE_SERVICE_ROLE_KEY.
        </p>
      </Card>
    )
  }

  const [{ data: leads }, { data: projects }, { data: payments }] =
    await Promise.all([
      supabase
        .from('webframe_leads')
        .select('*, webframe_quotes(*)')
        .order('created_at', { ascending: false }),
      supabase
        .from('webframe_projects')
        .select('*, webframe_content_items(*), webframe_tickets(*)')
        .order('created_at', { ascending: false }),
      supabase
        .from('webframe_payments')
        .select('*')
        .order('created_at', { ascending: false }),
    ])

  const allLeads = leads || []
  const allProjects = projects || []
  const allPayments = payments || []
  const allQuotes = allLeads.flatMap((lead) =>
    (lead.webframe_quotes || []).map((q) => ({ ...q, lead }))
  )
  const projectByLead = Object.fromEntries(allProjects.map((p) => [p.lead_id, p]))

  const now = Date.now()
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  // --- Money KPIs -----------------------------------------------------------
  // Quote payments come from quotes.paid_at; recurring cycles only exist in
  // the payments ledger (their kind='quote' rows duplicate quotes, so only
  // kind='recurring' is added on top).
  const paidQuotes = allQuotes.filter((q) => q.status === 'paid')
  const recurringPayments = allPayments.filter((p) => p.kind === 'recurring')

  const revenueEvents = [
    ...paidQuotes.map((q) => ({
      at: new Date(q.paid_at || q.created_at),
      amount: Number(q.amount_eur) || 0,
    })),
    ...recurringPayments.map((p) => ({
      at: new Date(p.created_at),
      amount: Number(p.amount_eur) || 0,
    })),
  ]
  const allTime = revenueEvents.reduce((sum, e) => sum + e.amount, 0)
  const collectedMonth = revenueEvents
    .filter((e) => e.at >= monthStart)
    .reduce((sum, e) => sum + e.amount, 0)
  const outstanding = allQuotes
    .filter((q) => q.status === 'sent')
    .reduce((sum, q) => sum + (Number(q.amount_eur) || 0), 0)
  const mrr = paidQuotes
    .filter((q) => q.payment_mode === 'monthly')
    .reduce((sum, q) => sum + (Number(q.amount_eur) || 0), 0)

  // Last 6 months revenue series for the bar chart.
  const months = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(monthStart)
    d.setMonth(d.getMonth() - i)
    const next = new Date(d)
    next.setMonth(next.getMonth() + 1)
    months.push({
      label: d.toLocaleDateString('en-GB', { month: 'short' }),
      total: revenueEvents
        .filter((e) => e.at >= d && e.at < next)
        .reduce((sum, e) => sum + e.amount, 0),
    })
  }
  const maxMonth = Math.max(...months.map((m) => m.total), 1)

  // --- Pipeline funnel --------------------------------------------------------
  const funnel = LEAD_STATUSES.map((status) => ({
    status,
    count: allLeads.filter((lead) => lead.status === status).length,
  }))
  const winRate = allLeads.length
    ? Math.round(
        (allLeads.filter((l) => l.status === 'won').length / allLeads.length) * 100
      )
    : 0
  const leadsThisMonth = allLeads.filter(
    (l) => new Date(l.created_at) >= monthStart
  )
  const sourceSplit = {
    outbound: leadsThisMonth.filter((l) => l.source === 'outbound').length,
    website: leadsThisMonth.filter((l) => l.source !== 'outbound').length,
  }

  // --- Ops KPIs ---------------------------------------------------------------
  const activeBuilds = allProjects.filter(
    (p) => p.stage === 'build' || p.stage === 'review'
  )
  const openTickets = allProjects.flatMap((p) =>
    (p.webframe_tickets || [])
      .filter((t) => t.status === 'open')
      .map((t) => ({ ...t, project: p }))
  )

  // --- Needs attention ----------------------------------------------------------
  const attention = []
  for (const project of activeBuilds) {
    const deadline = buildDeadline(project)
    if (deadline && deadline.getTime() - now < 48 * 60 * 60 * 1000) {
      const overdue = deadline.getTime() < now
      attention.push({
        tone: overdue ? 'red' : 'amber',
        text: `${project.name} — build ${timeLeftLabel(deadline, now)}`,
        href: `/admin/clients/${project.id}`,
      })
    }
  }
  for (const quote of allQuotes) {
    if (
      quote.status === 'sent' &&
      now - new Date(quote.created_at).getTime() > 3 * 24 * 60 * 60 * 1000
    ) {
      const days = Math.floor((now - new Date(quote.created_at).getTime()) / 86400000)
      attention.push({
        tone: 'amber',
        text: `${euro(quote.amount_eur)} quote unpaid for ${days}d — ${quote.lead?.name || quote.lead?.email}`,
        href: '/admin/leads?status=quoted',
      })
    }
  }
  for (const project of allProjects) {
    if (
      project.stage === 'content' &&
      now - new Date(project.created_at).getTime() > 4 * 24 * 60 * 60 * 1000 &&
      !isContentComplete(project.webframe_content_items || [])
    ) {
      const days = Math.floor((now - new Date(project.created_at).getTime()) / 86400000)
      attention.push({
        tone: 'gray',
        text: `${project.name} — waiting on content for ${days}d`,
        href: `/admin/clients/${project.id}`,
      })
    }
  }
  for (const ticket of openTickets) {
    attention.push({
      tone: 'purple',
      text: `Open ticket — “${ticket.subject}” (${ticket.project.name})`,
      href: `/admin/clients/${ticket.project.id}`,
    })
  }

  // --- Activity feed -------------------------------------------------------------
  const activity = [
    ...allLeads.slice(0, 15).map((lead) => ({
      at: new Date(lead.created_at),
      icon: '📥',
      text: `New lead — ${lead.name || lead.email} (${lead.source || 'website'})`,
      href: '/admin/leads',
    })),
    ...paidQuotes.map((q) => ({
      at: new Date(q.paid_at || q.created_at),
      icon: '💸',
      text: `${euro(q.amount_eur)} paid — ${q.lead?.name || q.lead?.email} (${q.plan}, ${q.payment_mode})`,
      href: projectByLead[q.lead_id] ? `/admin/clients/${projectByLead[q.lead_id].id}` : '/admin/leads',
    })),
    ...recurringPayments.map((p) => ({
      at: new Date(p.created_at),
      icon: '🔁',
      text: `${euro(p.amount_eur)} recurring — ${p.description || p.customer_email}`,
      href: p.lead_id && projectByLead[p.lead_id] ? `/admin/clients/${projectByLead[p.lead_id].id}` : '/admin/clients',
    })),
    ...allProjects.flatMap((project) =>
      (project.webframe_content_items || [])
        .filter((item) => item.updated_at && (item.files || []).length > 0)
        .map((item) => ({
          at: new Date(item.updated_at),
          icon: '📦',
          text: `Content — ${project.name}: ${item.label} (${(item.files || []).length} file${(item.files || []).length === 1 ? '' : 's'})`,
          href: `/admin/clients/${project.id}`,
        }))
    ),
    ...allProjects.flatMap((project) =>
      (project.webframe_tickets || []).map((ticket) => ({
        at: new Date(ticket.created_at),
        icon: '🎫',
        text: `Ticket — “${ticket.subject}” (${project.name})`,
        href: `/admin/clients/${project.id}`,
      }))
    ),
  ]
    .sort((a, b) => b.at - a.at)
    .slice(0, 12)

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <span className="text-xs text-gray-400">
          {new Date().toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </span>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        {[
          ['Collected this month', euro(collectedMonth), 'text-green-600'],
          ['All-time revenue', euro(allTime), 'text-gray-900'],
          ['MRR', euro(mrr), 'text-gray-900'],
          ['Outstanding', euro(outstanding), outstanding > 0 ? 'text-amber-600' : 'text-gray-900'],
          ['Active builds', activeBuilds.length, 'text-gray-900'],
          ['Open tickets', openTickets.length, openTickets.length > 0 ? 'text-primary' : 'text-gray-900'],
        ].map(([label, value, tone]) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className={`text-xl font-bold ${tone}`}>{value}</div>
            <div className="text-[11px] text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        {/* Revenue chart */}
        <Card title="revenue — last 6 months">
          <div className="flex items-end gap-3 h-36">
            {months.map((month) => (
              <div key={month.label} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] font-semibold text-gray-600">
                  {month.total > 0 ? euro(month.total) : ''}
                </span>
                <div
                  className="w-full rounded-t-lg bg-primary/80 min-h-[2px] transition-all"
                  style={{ height: `${Math.max((month.total / maxMonth) * 100, 2)}%` }}
                />
                <span className="text-[10px] text-gray-400">{month.label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Pipeline funnel */}
        <Card title={`pipeline — ${allLeads.length} leads · ${winRate}% won`}>
          <div className="space-y-2.5">
            {funnel.map(({ status, count }) => {
              const width = allLeads.length ? Math.max((count / allLeads.length) * 100, 3) : 3
              return (
                <Link
                  key={status}
                  href={`/admin/leads?status=${status}`}
                  className="flex items-center gap-3 group"
                >
                  <span className="w-20 text-[11px] font-semibold text-gray-500 capitalize group-hover:text-gray-900">
                    {status}
                  </span>
                  <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        status === 'won'
                          ? 'bg-green-500/80'
                          : status === 'lost'
                            ? 'bg-gray-300'
                            : 'bg-primary/70'
                      }`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-xs font-bold text-gray-900">
                    {count}
                  </span>
                </Link>
              )
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500">
            This month: {leadsThisMonth.length} new lead
            {leadsThisMonth.length === 1 ? '' : 's'} — {sourceSplit.website} website ·{' '}
            {sourceSplit.outbound} outbound
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Needs attention */}
        <Card title={`needs attention · ${attention.length}`}>
          {attention.length === 0 ? (
            <p className="text-sm text-gray-500">
              Nothing urgent — deadlines healthy, quotes fresh, no open tickets. 🎉
            </p>
          ) : (
            <ul className="space-y-2">
              {attention.slice(0, 8).map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2.5 text-xs text-gray-700 hover:text-gray-900 group"
                  >
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        item.tone === 'red'
                          ? 'bg-red-500'
                          : item.tone === 'amber'
                            ? 'bg-amber-500'
                            : item.tone === 'purple'
                              ? 'bg-primary'
                              : 'bg-gray-300'
                      }`}
                    />
                    <span className="truncate group-hover:underline">{item.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Activity feed */}
        <Card title="recent activity">
          {activity.length === 0 ? (
            <p className="text-sm text-gray-500">No activity yet.</p>
          ) : (
            <ul className="space-y-2.5">
              {activity.map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.href}
                    className="flex items-start gap-2.5 text-xs group"
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className="min-w-0 flex-1 text-gray-700 truncate group-hover:text-gray-900">
                      {item.text}
                    </span>
                    <span className="flex-shrink-0 text-[10px] text-gray-400">
                      {feedFormat.format(item.at)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  )
}
