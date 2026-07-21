import Link from 'next/link'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { getAdminRole } from '@/lib/adminRole'
import { UPLOADS_BUCKET } from '@/lib/portal'
import { isItemDone } from '@/lib/contentItems'
import { buildDeadline } from '@/lib/projectTime'
import ClientCard from './ClientCard'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Clients - Webframe Admin',
  robots: { index: false, follow: false },
}

function Hint({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
      <h2 className="font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-sm text-gray-600 max-w-md mx-auto">{children}</p>
    </div>
  )
}

export default async function AdminClientsPage() {
  const role = (await getAdminRole()) || 'sales'
  const isOwner = role === 'owner'
  const supabase = getSupabaseAdmin()

  let projects = null
  let loadError = null
  if (supabase) {
    const { data, error } = await supabase
      .from('webframe_projects')
      .select(
        '*, webframe_leads(*, webframe_quotes(*)), webframe_content_items(*), webframe_tickets(*, webframe_ticket_messages(*))'
      )
      .order('created_at', { ascending: false })
    projects = data
    loadError = error
  }

  // Signed download URLs (1 h) for uploaded client files, keyed by path.
  const fileLinks = {}
  if (supabase && projects) {
    const paths = projects.flatMap((project) =>
      (project.webframe_content_items || []).flatMap((item) =>
        (item.files || []).map((file) => file.path)
      )
    )
    if (paths.length > 0) {
      const { data: signed } = await supabase.storage
        .from(UPLOADS_BUCKET)
        .createSignedUrls(paths, 3600)
      for (const entry of signed || []) {
        if (entry.signedUrl) fileLinks[entry.path] = entry.signedUrl
      }
    }
  }

  const list = projects || []
  const now = Date.now()
  const twoDays = 2 * 24 * 60 * 60 * 1000

  // Payment ledger (recurring cycles + quote payments), grouped per lead.
  const paymentsByLead = {}
  if (supabase && list.length > 0) {
    const leadIds = [...new Set(list.map((p) => p.lead_id).filter(Boolean))]
    if (leadIds.length > 0) {
      const { data: payments } = await supabase
        .from('webframe_payments')
        .select('*')
        .in('lead_id', leadIds)
        .order('created_at', { ascending: false })
      for (const payment of payments || []) {
        ;(paymentsByLead[payment.lead_id] ||= []).push(payment)
      }
    }
  }

  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  const inBuild = list.filter((p) => p.stage === 'build' || p.stage === 'review')
  const stats = {
    active: inBuild.length,
    awaitingContent: list.filter((p) => p.stage === 'content').length,
    live: list.filter((p) => p.stage === 'live').length,
    outstanding: 0,
    openTickets: 0,
    atRisk: 0,
    collectedMonth: 0,
    mrr: 0,
  }
  for (const project of list) {
    for (const quote of project.webframe_leads?.webframe_quotes || []) {
      if (quote.status === 'sent') stats.outstanding += Number(quote.amount_eur) || 0
      if (quote.status === 'paid') {
        if (quote.paid_at && new Date(quote.paid_at) >= monthStart) {
          stats.collectedMonth += Number(quote.amount_eur) || 0
        }
        if (quote.payment_mode === 'monthly') stats.mrr += Number(quote.amount_eur) || 0
      }
    }
    stats.openTickets += (project.webframe_tickets || []).filter(
      (t) => t.status === 'open'
    ).length
    const deadline = buildDeadline(project)
    if (
      deadline &&
      (project.stage === 'build' || project.stage === 'review') &&
      deadline.getTime() - now < twoDays
    ) {
      stats.atRisk += 1
    }
  }
  // Recurring cycles land in the ledger, not in quotes (quote payments are
  // already counted via paid_at above, so only add kind=recurring here).
  for (const payments of Object.values(paymentsByLead)) {
    for (const payment of payments) {
      if (payment.kind === 'recurring' && new Date(payment.created_at) >= monthStart) {
        stats.collectedMonth += Number(payment.amount_eur) || 0
      }
    }
  }

  // Most urgent first: at-risk builds, then active, then waiting on content,
  // then live.
  const stageRank = { build: 0, review: 0, content: 1, live: 2 }
  const sorted = [...list].sort((a, b) => {
    const rankDiff = (stageRank[a.stage] ?? 1) - (stageRank[b.stage] ?? 1)
    if (rankDiff !== 0) return rankDiff
    const da = buildDeadline(a)?.getTime() ?? Infinity
    const db = buildDeadline(b)?.getTime() ?? Infinity
    return da - db
  })

  return (
    <>
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
            Clients
            {!isOwner && (
              <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full text-[11px] font-semibold text-amber-700">
                sales access
              </span>
            )}
          </h1>
        </div>

        {/* Operation rollup */}
        <div className="mb-8 bg-white rounded-2xl border border-gray-200 p-5">
          <div className="font-mono text-[10px] tracking-wider text-gray-400 uppercase mb-3">
            operation at a glance
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              ['In build', stats.active, 'text-gray-900'],
              ['At risk', stats.atRisk, stats.atRisk > 0 ? 'text-red-600' : 'text-gray-900'],
              ['Awaiting content', stats.awaitingContent, 'text-gray-900'],
              ['Open tickets', stats.openTickets, stats.openTickets > 0 ? 'text-primary' : 'text-gray-900'],
              [
                'Outstanding',
                `€${stats.outstanding.toLocaleString('en-IE')}`,
                stats.outstanding > 0 ? 'text-amber-600' : 'text-gray-900',
              ],
              [
                'Collected this month',
                `€${stats.collectedMonth.toLocaleString('en-IE')}`,
                'text-green-600',
              ],
              ['MRR', `€${stats.mrr.toLocaleString('en-IE')}`, 'text-gray-900'],
              ['Live sites', stats.live, 'text-gray-900'],
            ].map(([label, value, tone]) => (
              <div key={label}>
                <div className={`text-xl font-bold ${tone}`}>{value}</div>
                <div className="text-[11px] text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {!supabase && (
          <Hint title="Supabase is not configured">
            Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment,
            then reload this page.
          </Hint>
        )}
        {loadError && (
          <Hint title="Couldn't load clients">
            {loadError.message}. If a table or column is missing, run the SQL
            files in{' '}
            <code className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">supabase/</code>{' '}
            in the Supabase SQL editor.
          </Hint>
        )}
        {projects && list.length === 0 && (
          <Hint title="No clients yet">
            Clients appear here once a lead pays and gets a portal — create one
            from the Leads page with “Create portal”.
          </Hint>
        )}

        <div className="space-y-4">
          {sorted.map((project) => (
            <ClientCard
              key={project.id}
              project={project}
              lead={project.webframe_leads}
              quotes={project.webframe_leads?.webframe_quotes || []}
              payments={paymentsByLead[project.lead_id] || []}
              items={project.webframe_content_items || []}
              tickets={project.webframe_tickets || []}
              fileLinks={fileLinks}
              readOnly={!isOwner}
            />
          ))}
        </div>
    </>
  )
}
