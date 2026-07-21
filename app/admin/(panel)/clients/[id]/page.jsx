import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { getAdminRole } from '@/lib/adminRole'
import { UPLOADS_BUCKET } from '@/lib/portal'
import { isItemDone, isImageFile } from '@/lib/contentItems'
import {
  buildDeadline,
  supportEnds,
  formatDateLong,
  formatDateShort,
} from '@/lib/projectTime'
import Countdown from '@/app/portal/[token]/Countdown'
import TicketRow from '../TicketRow'
import { StageSelect, MarkPaidButton, CopyPortalLink } from '../controls'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Client - Webframe Admin',
  robots: { index: false, follow: false },
}

const euro = (value) => `€${Number(value || 0).toLocaleString('en-IE')}`

const dateTime = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const MODE_LABELS = {
  full: 'Full payment',
  upfront: 'Full payment',
  deposit: '50% deposit',
  balance: 'Final balance',
  monthly: 'Monthly plan',
}

function Card({ title, action, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="font-mono text-[10px] tracking-wider text-gray-400 uppercase">
          {title}
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}

export default async function ClientDetailPage({ params }) {
  const { id } = await params
  const role = (await getAdminRole()) || 'sales'
  const isOwner = role === 'owner'
  const supabase = getSupabaseAdmin()
  if (!supabase) notFound()

  const { data: project } = await supabase
    .from('webframe_projects')
    .select(
      '*, webframe_leads(*, webframe_quotes(*)), webframe_content_items(*), webframe_tickets(*, webframe_ticket_messages(*))'
    )
    .eq('id', id)
    .maybeSingle()
  if (!project) notFound()

  const lead = project.webframe_leads
  const quotes = (lead?.webframe_quotes || []).sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  )
  const items = (project.webframe_content_items || []).sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  )
  const tickets = (project.webframe_tickets || []).sort(
    (a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at)
  )

  const { data: payments } = lead
    ? await supabase
        .from('webframe_payments')
        .select('*')
        .eq('lead_id', lead.id)
        .order('created_at', { ascending: false })
    : { data: [] }

  // Signed URLs (1 h) for every file, plus which ones are image previews.
  const paths = items.flatMap((item) => (item.files || []).map((f) => f.path))
  const fileLinks = {}
  if (paths.length > 0) {
    const { data: signed } = await supabase.storage
      .from(UPLOADS_BUCKET)
      .createSignedUrls(paths, 3600)
    for (const entry of signed || []) {
      if (entry.signedUrl) fileLinks[entry.path] = entry.signedUrl
    }
  }

  const deadline = buildDeadline(project)
  const supportUntil = supportEnds(project)
  const doneCount = items.filter(isItemDone).length
  const paidTotal = quotes
    .filter((q) => q.status === 'paid')
    .reduce((s, q) => s + (Number(q.amount_eur) || 0), 0)
  const recurringTotal = (payments || [])
    .filter((p) => p.kind === 'recurring')
    .reduce((s, p) => s + (Number(p.amount_eur) || 0), 0)

  return (
    <>
      <Link
        href="/admin/clients"
        className="inline-block mb-4 text-xs font-semibold text-gray-400 hover:text-gray-900 transition-colors"
      >
        ← All clients
      </Link>

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 truncate">
            {project.name}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            {lead && (
              <>
                <span className="text-gray-600">{lead.name}</span>
                <a
                  href={`mailto:${lead.email}`}
                  className="text-primary hover:text-primary-dark transition-colors"
                >
                  {lead.email}
                </a>
                {lead.business && <span className="text-gray-500">🏢 {lead.business}</span>}
              </>
            )}
            <CopyPortalLink token={project.portal_token} />
          </div>
          <div className="mt-1.5 text-[11px] text-gray-400">
            Client since {formatDateShort(project.created_at)}
            {lead?.source && <> · source: {lead.source}</>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {(project.stage === 'build' || project.stage === 'review') && deadline && (
            <Countdown deadline={deadline.toISOString()} className="text-lg font-bold" />
          )}
          <StageSelect project={project} readOnly={!isOwner} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 items-start">
        {/* Left 2/3: content + tickets */}
        <div className="lg:col-span-2 space-y-4">
          <Card title={`content · ${doneCount}/${items.length} in`}>
            <div className="space-y-4">
              {items.map((item) => {
                const files = item.files || []
                const images = files.filter((f) => fileLinks[f.path] && isImageFile(f.path))
                const others = files.filter((f) => !isImageFile(f.path))
                const done = isItemDone(item)
                return (
                  <div key={item.id} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="text-sm font-semibold text-gray-900">
                        {item.label}
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          done
                            ? 'bg-green-50 border border-green-200 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {files.length > 0
                          ? `${files.length} file${files.length === 1 ? '' : 's'}${item.note?.trim() ? ' + note' : ''}`
                          : item.note?.trim()
                            ? 'note'
                            : item.skipped
                              ? 'skipped'
                              : 'waiting'}
                      </span>
                    </div>
                    {images.length > 0 && (
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-2">
                        {images.map((file) => (
                          <a
                            key={file.path}
                            href={fileLinks[file.path]}
                            target="_blank"
                            rel="noreferrer"
                            className="block aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 hover:opacity-80 transition-opacity"
                            title={file.name}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={fileLinks[file.path]}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          </a>
                        ))}
                      </div>
                    )}
                    {others.length > 0 && (
                      <ul className="space-y-1 mb-2">
                        {others.map((file, i) => (
                          <li key={file.path || i} className="text-xs">
                            📎{' '}
                            {fileLinks[file.path] ? (
                              <a
                                href={fileLinks[file.path]}
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary hover:text-primary-dark"
                              >
                                {file.name}
                              </a>
                            ) : (
                              <span className="text-gray-600">{file.name}</span>
                            )}
                            {file.size && (
                              <span className="text-gray-400">
                                {' '}
                                · {(file.size / 1024 / 1024).toFixed(1)} MB
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                    {item.note?.trim() && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600 whitespace-pre-wrap">
                        {item.note.trim()}
                      </div>
                    )}
                    {item.updated_at && (
                      <div className="mt-2 text-[10px] text-gray-400">
                        Last activity {dateTime.format(new Date(item.updated_at))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>

          <Card title={`tickets · ${tickets.filter((t) => t.status === 'open').length} open`}>
            {tickets.length === 0 ? (
              <p className="text-sm text-gray-500">No tickets from this client.</p>
            ) : (
              <div className="space-y-2">
                {tickets.map((ticket) => (
                  <TicketRow
                    key={ticket.id}
                    ticket={ticket}
                    readOnly={!isOwner}
                    defaultOpen={ticket.status === 'open'}
                  />
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right 1/3: build status, money, lead details */}
        <div className="space-y-4">
          <Card title="build status">
            <dl className="space-y-2 text-xs">
              <div className="flex justify-between">
                <dt className="text-gray-500">Portal created</dt>
                <dd className="text-gray-900 font-semibold">
                  {formatDateShort(project.created_at)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Content complete</dt>
                <dd className="text-gray-900 font-semibold">
                  {project.content_completed_at
                    ? formatDateShort(project.content_completed_at)
                    : `${doneCount}/${items.length} in`}
                </dd>
              </div>
              {deadline && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Build deadline</dt>
                  <dd className="font-semibold text-gray-900">
                    {formatDateLong(deadline)}
                  </dd>
                </div>
              )}
              {project.live_at && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Went live</dt>
                  <dd className="text-green-600 font-semibold">
                    {formatDateShort(project.live_at)}
                  </dd>
                </div>
              )}
              {supportUntil && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Support until</dt>
                  <dd className="text-gray-900 font-semibold">
                    {formatDateShort(supportUntil)}
                  </dd>
                </div>
              )}
            </dl>
          </Card>

          <Card title={`money · ${euro(paidTotal + recurringTotal)} collected`}>
            {quotes.length === 0 && (payments || []).length === 0 ? (
              <p className="text-sm text-gray-500">No quotes or payments yet.</p>
            ) : (
              <>
                <div className="space-y-2 mb-3">
                  {quotes.map((quote) => (
                    <div
                      key={quote.id}
                      className="flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="min-w-0">
                        <span className="font-semibold text-gray-900">
                          {euro(quote.amount_eur)}
                          {quote.payment_mode === 'monthly' ? '/mo' : ''}
                        </span>{' '}
                        <span className="text-gray-500">
                          {MODE_LABELS[quote.payment_mode] || quote.payment_mode} ·{' '}
                          {quote.plan}
                        </span>
                      </div>
                      {quote.status === 'paid' ? (
                        <span className="text-green-600 font-semibold flex-shrink-0">
                          ✓ {quote.paid_at ? formatDateShort(quote.paid_at) : 'paid'}
                        </span>
                      ) : quote.status === 'cancelled' ? (
                        <span className="text-gray-400 flex-shrink-0">cancelled</span>
                      ) : (
                        <span className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-amber-600 font-semibold">unpaid</span>
                          {isOwner && <MarkPaidButton quoteId={quote.id} />}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                {(payments || []).length > 0 && (
                  <div className="pt-3 border-t border-gray-100">
                    <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                      payment ledger
                    </div>
                    <ul className="space-y-1">
                      {(payments || []).map((payment) => (
                        <li
                          key={payment.id}
                          className="flex items-center justify-between text-[11px]"
                        >
                          <span className="text-gray-600 truncate">
                            {payment.kind === 'recurring' ? '🔁' : '💸'}{' '}
                            {euro(payment.amount_eur)}
                            <span className="text-gray-400">
                              {' '}
                              · {payment.description || payment.kind}
                            </span>
                          </span>
                          <span className="text-gray-400 flex-shrink-0">
                            {formatDateShort(payment.created_at)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </Card>

          <Card title="lead details">
            <dl className="space-y-2 text-xs">
              {lead?.project_type && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Project</dt>
                  <dd className="text-gray-900 font-semibold">
                    {[lead.project_type, lead.project_size].filter(Boolean).join(' · ')}
                  </dd>
                </div>
              )}
              {lead?.plan && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Plan interest</dt>
                  <dd className="text-gray-900 font-semibold">{lead.plan}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-500">Lead status</dt>
                <dd className="text-gray-900 font-semibold capitalize">{lead?.status}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">First contact</dt>
                <dd className="text-gray-900 font-semibold">
                  {lead ? formatDateShort(lead.created_at) : '—'}
                </dd>
              </div>
            </dl>
            {lead?.message && (
              <p className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 leading-relaxed whitespace-pre-wrap">
                “{lead.message}”
              </p>
            )}
          </Card>
        </div>
      </div>
    </>
  )
}
