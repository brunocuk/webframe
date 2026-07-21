'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { PROJECT_STAGES } from '@/lib/projectStages'
import { isItemDone } from '@/lib/contentItems'
import { buildDeadline, supportEnds, formatDateShort } from '@/lib/projectTime'
import Countdown from '@/app/portal/[token]/Countdown'
import { updateProjectStage, markQuotePaid } from '@/app/admin/actions'
import TicketRow from './TicketRow'

const MODE_LABELS = {
  full: 'full',
  upfront: 'full',
  deposit: 'deposit',
  balance: 'balance',
  monthly: 'monthly',
}

const euro = (value) => `€${Number(value || 0).toLocaleString('en-IE')}`

function ZoneLabel({ children }) {
  return (
    <div className="font-mono text-[10px] tracking-wider text-gray-400 uppercase mb-1.5">
      {children}
    </div>
  )
}

function CopyLink({ token }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(`${window.location.origin}/portal/${token}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className="text-[11px] font-medium text-primary hover:text-primary-dark transition-colors"
    >
      {copied ? 'Copied ✓' : 'Copy portal link'}
    </button>
  )
}

export default function ClientCard({
  project,
  lead,
  quotes,
  payments = [],
  items,
  tickets,
  fileLinks,
  readOnly = false,
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const [showContent, setShowContent] = useState(false)
  const [payError, setPayError] = useState(null)

  const doneCount = items.filter(isItemDone).length
  const totalFiles = items.reduce((n, i) => n + (i.files || []).length, 0)
  const openTickets = tickets.filter((t) => t.status === 'open')
  const deadline = buildDeadline(project)
  const supportUntil = supportEnds(project)
  const unpaid = quotes.filter((q) => q.status === 'sent')

  const handleMarkPaid = async (quoteId) => {
    setPayError(null)
    const result = await markQuotePaid(quoteId)
    if (result?.error) return setPayError(result.error)
    router.refresh()
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
      {/* Header row */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
        <div className="min-w-0">
          <Link
            href={`/admin/clients/${project.id}`}
            className="block text-[15px] font-bold text-gray-900 truncate hover:text-primary transition-colors"
          >
            {project.name} <span className="text-gray-300 font-normal">→</span>
          </Link>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
            {lead && (
              <>
                <span className="text-gray-600">{lead.name}</span>
                <a
                  href={`mailto:${lead.email}`}
                  className="text-primary hover:text-primary-dark transition-colors"
                >
                  {lead.email}
                </a>
              </>
            )}
            <CopyLink token={project.portal_token} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          {readOnly ? (
            <span className="inline-block px-2.5 py-1.5 rounded-full border border-primary/30 bg-purple-50 text-primary text-xs font-semibold">
              {PROJECT_STAGES.find((s) => s.value === project.stage)?.label || project.stage}
            </span>
          ) : (
            <select
              defaultValue={project.stage}
              disabled={isPending}
              onChange={(e) => {
                const stage = e.target.value
                startTransition(() => updateProjectStage(project.id, stage))
              }}
              className="px-2.5 py-1.5 rounded-full border border-primary/30 bg-purple-50 text-primary text-xs font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
            >
              {PROJECT_STAGES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Build clock */}
        <div>
          <ZoneLabel>build clock</ZoneLabel>
          {project.stage === 'content' && (
            <div className="text-xs text-gray-500 leading-relaxed">
              <span className="font-semibold text-gray-900">Waiting on content</span>
              <br />
              {Math.floor(
                (Date.now() - new Date(project.created_at).getTime()) / 86400000
              )}
              d since portal created
            </div>
          )}
          {(project.stage === 'build' || project.stage === 'review') &&
            (deadline ? (
              <div className="text-xs text-gray-500 leading-relaxed">
                <Countdown deadline={deadline.toISOString()} className="text-base font-bold" />
                <br />
                due {formatDateShort(deadline)}
              </div>
            ) : (
              <div className="text-xs text-gray-500">
                No content timestamp — deadline unknown
              </div>
            ))}
          {project.stage === 'live' && (
            <div className="text-xs text-gray-500 leading-relaxed">
              <span className="font-semibold text-green-600">Live</span>
              {project.live_at && <> since {formatDateShort(project.live_at)}</>}
              {supportUntil && (
                <>
                  <br />
                  support until {formatDateShort(supportUntil)}
                </>
              )}
            </div>
          )}
        </div>

        {/* Payments */}
        <div>
          <ZoneLabel>payments</ZoneLabel>
          {quotes.length === 0 ? (
            <div className="text-xs text-gray-400">No quotes yet</div>
          ) : (
            <div className="space-y-1.5">
              {quotes.map((quote) => (
                <div key={quote.id} className="flex items-center gap-2 text-xs">
                  <span
                    className={`font-semibold ${
                      quote.status === 'paid'
                        ? 'text-green-600'
                        : quote.status === 'cancelled'
                          ? 'text-gray-400 line-through'
                          : 'text-amber-600'
                    }`}
                  >
                    {euro(quote.amount_eur)}
                    {quote.payment_mode === 'monthly' ? '/mo' : ''}
                  </span>
                  <span className="text-gray-500">
                    {MODE_LABELS[quote.payment_mode] || quote.payment_mode}
                  </span>
                  {quote.status === 'paid' ? (
                    <span className="text-[10px] text-green-600">
                      ✓ {quote.paid_at ? formatDateShort(quote.paid_at) : 'paid'}
                    </span>
                  ) : quote.status === 'sent' && !readOnly ? (
                    <button
                      onClick={() => handleMarkPaid(quote.id)}
                      className="text-[10px] font-semibold text-primary hover:text-primary-dark transition-colors"
                    >
                      Mark paid
                    </button>
                  ) : null}
                </div>
              ))}
              {unpaid.length > 0 && (
                <div className="text-[10px] text-amber-600 font-semibold pt-0.5">
                  {euro(unpaid.reduce((s, q) => s + (Number(q.amount_eur) || 0), 0))}{' '}
                  outstanding
                </div>
              )}
              {payments
                .filter((payment) => payment.kind === 'recurring')
                .slice(0, 3)
                .map((payment) => (
                  <div key={payment.id} className="text-[10px] text-gray-500">
                    🔁 {euro(payment.amount_eur)} · {formatDateShort(payment.created_at)}
                  </div>
                ))}
              {payError && <p className="text-[10px] text-red-600">{payError}</p>}
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <ZoneLabel>content</ZoneLabel>
          <button
            onClick={() => setShowContent((v) => !v)}
            className="text-xs font-semibold text-gray-900 hover:text-primary transition-colors"
          >
            {doneCount}/{items.length} in · {totalFiles} file{totalFiles === 1 ? '' : 's'}{' '}
            {showContent ? '▴' : '▾'}
          </button>
          {showContent && (
            <ul className="mt-2 space-y-1">
              {items.map((item) => {
                const files = item.files || []
                const done = isItemDone(item)
                return (
                  <li key={item.id} className="text-[11px] leading-relaxed">
                    <span className={done ? 'text-green-600' : 'text-gray-400'}>
                      {done ? '✓' : '○'}
                    </span>{' '}
                    <span className="text-gray-600">{item.label}</span>
                    {files.map((file, i) => (
                      <span key={i}>
                        {' · '}
                        {fileLinks?.[file.path] ? (
                          <a
                            href={fileLinks[file.path]}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:text-primary-dark"
                          >
                            {file.name}
                          </a>
                        ) : (
                          <span className="text-gray-500">{file.name}</span>
                        )}
                      </span>
                    ))}
                    {item.note?.trim() && (
                      <span className="text-gray-500 italic" title={item.note}>
                        {' · '}“{item.note.trim().slice(0, 60)}
                        {item.note.trim().length > 60 ? '…' : ''}”
                      </span>
                    )}
                    {item.skipped && !files.length && !item.note?.trim() && (
                      <span className="text-gray-400"> · skipped</span>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Tickets */}
        <div>
          <ZoneLabel>
            tickets{openTickets.length > 0 ? ` · ${openTickets.length} open` : ''}
          </ZoneLabel>
          {tickets.length === 0 ? (
            <div className="text-xs text-gray-400">No tickets</div>
          ) : (
            <div className="space-y-2">
              {tickets.map((ticket) => (
                <TicketRow key={ticket.id} ticket={ticket} readOnly={readOnly} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
