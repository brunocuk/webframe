import Link from 'next/link'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { getAdminRole } from '@/lib/adminRole'
import { LEAD_STATUSES } from '@/lib/inquiryOptions'
import { UPLOADS_BUCKET } from '@/lib/portal'
import StatusSelect from './StatusSelect'
import QuotePanel from './QuotePanel'
import ProjectPanel from './ProjectPanel'
import AddLead from './AddLead'
import CallTime from './CallTime'
import { logout } from './login/actions'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Leads - Webframe Admin',
  robots: { index: false, follow: false },
}

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

const looksLikeDomain = (value) =>
  /^[\w-]+(\.[\w-]+)+$/i.test((value || '').replace(/^https?:\/\//, '').split('/')[0]) &&
  !(value || '').includes(' ')

function Hint({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
      <h2 className="font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-sm text-gray-600 max-w-md mx-auto">{children}</p>
    </div>
  )
}

function ZoneLabel({ children }) {
  return (
    <div className="font-mono text-[10px] tracking-wider text-gray-400 uppercase mb-1.5">
      {children}
    </div>
  )
}

export default async function AdminLeadsPage({ searchParams }) {
  const role = (await getAdminRole()) || 'sales'
  const isOwner = role === 'owner'
  const { status: statusFilter, source: sourceFilter } = await searchParams

  const filterUrl = (status, source) => {
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    if (source) params.set('source', source)
    const qs = params.toString()
    return qs ? `/admin?${qs}` : '/admin'
  }

  const supabase = getSupabaseAdmin()

  let leads = null
  let loadError = null
  if (supabase) {
    const { data, error } = await supabase
      .from('webframe_leads')
      .select('*, webframe_quotes(*), webframe_projects(*, webframe_content_items(*))')
      .order('created_at', { ascending: false })
      .order('created_at', { referencedTable: 'webframe_quotes', ascending: false })
    leads = data
    loadError = error
  }

  // Signed download URLs (1 h) for every uploaded client file, keyed by path.
  const fileLinks = {}
  if (supabase && leads) {
    const paths = leads.flatMap((lead) =>
      (lead.webframe_projects || []).flatMap((project) =>
        (project.webframe_content_items || []).flatMap((item) =>
          (item.files || []).map((file) => file.path)
        )
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

  const counts = Object.fromEntries(LEAD_STATUSES.map((s) => [s, 0]))
  for (const lead of leads || []) {
    if (counts[lead.status] !== undefined) counts[lead.status] += 1
  }

  const matchesSource = (lead) =>
    !sourceFilter ||
    (sourceFilter === 'outbound' ? lead.source === 'outbound' : lead.source !== 'outbound')

  const visibleLeads = (leads || []).filter(
    (lead) => (!statusFilter || lead.status === statusFilter) && matchesSource(lead)
  )

  // Outbound performance rollup (Chris's numbers) — paid cash only.
  const outboundLeads = (leads || []).filter((l) => l.source === 'outbound')
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)
  const outboundStats = {
    total: outboundLeads.length,
    won: outboundLeads.filter((l) => l.status === 'won').length,
    upcomingCalls: outboundLeads.filter((l) => l.call_at && new Date(l.call_at) > new Date()).length,
    paidAllTime: 0,
    paidThisMonth: 0,
  }
  for (const lead of outboundLeads) {
    for (const quote of lead.webframe_quotes || []) {
      if (quote.status !== 'paid') continue
      const amount = Number(quote.amount_eur) || 0
      outboundStats.paidAllTime += amount
      if (quote.paid_at && new Date(quote.paid_at) >= monthStart) {
        outboundStats.paidThisMonth += amount
      }
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-1">
            <div>
              <div className="font-mono text-xs font-semibold tracking-wider text-primary mb-1.5">
                // webframe crm
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                Leads
                {!isOwner && (
                  <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full text-[11px] font-semibold text-amber-700">
                    sales access
                  </span>
                )}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <AddLead />
              <Link
                href="/admin/emails"
                className="px-4 py-2 rounded-full border border-gray-200 bg-white text-xs font-medium text-gray-500 hover:text-gray-900 hover:border-gray-400 transition-colors"
              >
                Emails
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full border border-gray-200 bg-white text-xs font-medium text-gray-500 hover:text-gray-900 hover:border-gray-400 transition-colors"
                >
                  Log out
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Pipeline + source filters */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Link
            href={filterUrl(null, sourceFilter)}
            className={`px-4 py-2 rounded-full border text-xs font-semibold transition-colors ${
              !statusFilter
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            All {leads ? leads.length : 0}
          </Link>
          {LEAD_STATUSES.map((s) => (
            <Link
              key={s}
              href={filterUrl(s, sourceFilter)}
              className={`px-4 py-2 rounded-full border text-xs font-semibold capitalize transition-colors ${
                statusFilter === s
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {s} <span className={statusFilter === s ? 'text-white/70' : 'text-gray-400'}>{counts[s]}</span>
            </Link>
          ))}
          <span className="mx-1 h-5 w-px bg-gray-200" aria-hidden />
          {[
            { value: null, label: 'All sources' },
            { value: 'outbound', label: 'Outbound' },
            { value: 'inbound', label: 'Website' },
          ].map((option) => (
            <Link
              key={option.label}
              href={filterUrl(statusFilter, option.value)}
              className={`px-4 py-2 rounded-full border text-xs font-semibold transition-colors ${
                (sourceFilter || null) === option.value
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50'
              }`}
            >
              {option.label}
            </Link>
          ))}
        </div>

        {/* Outbound performance strip */}
        {sourceFilter === 'outbound' && (
          <div className="mb-8 bg-white rounded-2xl border border-gray-200 p-5">
            <div className="font-mono text-[10px] tracking-wider text-gray-400 uppercase mb-3">
              outbound performance
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {[
                ['Leads added', outboundStats.total],
                ['Upcoming calls', outboundStats.upcomingCalls],
                ['Won', outboundStats.won],
                ['Paid this month', `€${outboundStats.paidThisMonth.toLocaleString('en-IE')}`],
                ['Paid all time', `€${outboundStats.paidAllTime.toLocaleString('en-IE')}`],
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="text-xl font-bold text-gray-900">{value}</div>
                  <div className="text-[11px] text-gray-500">{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {sourceFilter !== 'outbound' && <div className="mb-4" />}

        {!supabase && (
          <Hint title="Supabase is not configured">
            Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment,
            then reload this page.
          </Hint>
        )}

        {loadError && (
          <Hint title="Couldn't load leads">
            {loadError.message}. If a table or column is missing, run the SQL
            files in{' '}
            <code className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">supabase/</code>{' '}
            in the Supabase SQL editor.
          </Hint>
        )}

        {leads && visibleLeads.length === 0 && (
          <Hint title={statusFilter ? `No ${statusFilter} leads` : 'No leads yet'}>
            {statusFilter
              ? 'Nothing in this stage right now.'
              : 'New inquiries from the site — and leads you add manually — appear here the moment they arrive.'}
          </Hint>
        )}

        {/* Lead cards */}
        <div className="space-y-4">
          {visibleLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="grid gap-6 md:grid-cols-[minmax(200px,240px)_minmax(0,1fr)_auto]">
                {/* Who */}
                <div className="min-w-0">
                  <div className="text-[15px] font-bold text-gray-900 truncate">
                    {lead.name || 'No name'}
                  </div>
                  <a
                    href={`mailto:${lead.email}`}
                    className="block text-sm text-primary hover:text-primary-dark transition-colors truncate"
                  >
                    {lead.email}
                  </a>
                  <div className="mt-2">
                    <CallTime leadId={lead.id} callAt={lead.call_at} />
                  </div>
                  <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-gray-400">
                    <span>{dateFormat.format(new Date(lead.created_at))}</span>
                    <span className="font-mono px-2 py-0.5 bg-gray-100 rounded-full text-gray-500">
                      {lead.source || 'unknown'}
                    </span>
                  </div>
                </div>

                {/* What they want */}
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900">
                    {[lead.project_type, lead.project_size].filter(Boolean).join(' · ') ||
                      'No project details'}
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    {lead.plan && (
                      <span className="px-2 py-0.5 bg-purple-50 border border-primary/20 rounded-full text-[11px] font-semibold text-primary">
                        {lead.plan}
                      </span>
                    )}
                    {lead.business &&
                      (looksLikeDomain(lead.business) ? (
                        <a
                          href={`https://${lead.business.replace(/^https?:\/\//, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-medium text-gray-600 hover:text-primary transition-colors"
                        >
                          🌐 {lead.business}
                        </a>
                      ) : (
                        <span className="text-xs font-medium text-gray-600">🏢 {lead.business}</span>
                      ))}
                  </div>
                  {lead.message && (
                    <p
                      className="mt-2 text-[13px] text-gray-500 leading-relaxed line-clamp-2"
                      title={lead.message}
                    >
                      “{lead.message}”
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap md:flex-nowrap gap-6 md:gap-8 md:justify-end">
                  <div>
                    <ZoneLabel>status</ZoneLabel>
                    <StatusSelect id={lead.id} status={lead.status} />
                  </div>
                  <div>
                    <ZoneLabel>quote</ZoneLabel>
                    <QuotePanel
                      leadId={lead.id}
                      quotes={lead.webframe_quotes}
                      defaultPlan={lead.plan}
                      readOnly={!isOwner}
                    />
                  </div>
                  <div>
                    <ZoneLabel>project</ZoneLabel>
                    <ProjectPanel
                      lead={lead}
                      project={lead.webframe_projects?.[0] || null}
                      fileLinks={fileLinks}
                      readOnly={!isOwner}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
