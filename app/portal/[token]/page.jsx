import Link from 'next/link'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { isItemDone } from '@/lib/contentItems'
import { buildDeadline, supportEnds, formatDateLong } from '@/lib/projectTime'
import InvalidLink from './InvalidLink'
import StageTimeline from './StageTimeline'
import Countdown from './Countdown'

export const dynamic = 'force-dynamic'

function StatCard({ href, label, value, detail, done }) {
  return (
    <Link
      href={href}
      className={`block bg-white rounded-2xl border p-5 transition-colors hover:border-gray-400 ${
        done ? 'border-green-200' : 'border-gray-200'
      }`}
    >
      <div className="font-mono text-[10px] tracking-wider text-gray-400 uppercase mb-2">
        {label}
      </div>
      <div className="text-lg font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{detail}</div>
    </Link>
  )
}

export default async function PortalOverviewPage({ params }) {
  const { token } = await params
  const supabase = getSupabaseAdmin()
  if (!supabase) return <InvalidLink />

  const { data: project } = await supabase
    .from('webframe_projects')
    .select('*, webframe_content_items(*)')
    .eq('portal_token', token)
    .maybeSingle()
  if (!project) return <InvalidLink />

  const items = project.webframe_content_items || []
  const doneItems = items.filter(isItemDone).length

  const [{ data: quotes }, { count: openTickets }] = await Promise.all([
    supabase
      .from('webframe_quotes')
      .select('amount_eur, status')
      .eq('lead_id', project.lead_id),
    supabase
      .from('webframe_tickets')
      .select('id', { count: 'exact', head: true })
      .eq('project_id', project.id)
      .eq('status', 'open'),
  ])
  const unpaid = (quotes || []).filter((q) => q.status === 'sent')
  const unpaidTotal = unpaid.reduce((sum, q) => sum + (Number(q.amount_eur) || 0), 0)

  const deadline = buildDeadline(project)
  const supportUntil = supportEnds(project)
  const base = `/portal/${token}`

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-2">
          {project.name}
        </h1>
        <p className="text-gray-600">
          Hand-coded and live within 7 days of your content — here&apos;s where
          things stand.
        </p>
      </div>

      <div className="mb-6">
        <StageTimeline stage={project.stage} />
      </div>

      {/* Stage-specific callout */}
      {project.stage === 'content' && (
        <div className="bg-purple-50 border border-primary/20 rounded-3xl p-6 md:p-8 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            We&apos;re waiting on your content
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            {doneItems} of {items.length} items are in. The 7-day build starts
            the moment the rest lands — rough is fine, we polish.
          </p>
          <Link
            href={`${base}/content`}
            className="inline-block px-6 py-2.5 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            Upload your content
          </Link>
        </div>
      )}

      {(project.stage === 'build' || project.stage === 'review') && deadline && (
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 md:p-8 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-mono text-[10px] tracking-wider text-gray-400 uppercase mb-1">
                7-day build
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                On track to be live by {formatDateLong(deadline)}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {project.stage === 'review'
                  ? 'Your preview is ready — check Support for the link, or reply to our email with tweaks.'
                  : 'We&#39;re designing and coding your site right now. You&#39;ll get a preview link before launch.'}
              </p>
            </div>
            <Countdown deadline={deadline.toISOString()} className="text-2xl font-bold" />
          </div>
        </div>
      )}

      {project.stage === 'live' && (
        <div className="bg-green-50 border border-green-200 rounded-3xl p-6 md:p-8 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            Your site is live 🎉
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {supportUntil ? (
              <>
                Free support runs until{' '}
                <strong className="text-gray-900">{formatDateLong(supportUntil)}</strong>{' '}
                — spot anything off, open a ticket and we&apos;ll fix it.
              </>
            ) : (
              <>Spot anything off? Open a support ticket and we&apos;ll fix it.</>
            )}
          </p>
        </div>
      )}

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard
          href={`${base}/content`}
          label="content"
          value={`${doneItems}/${items.length} in`}
          detail={doneItems === items.length ? 'All received — thank you!' : 'Uploads, notes, or skip'}
          done={items.length > 0 && doneItems === items.length}
        />
        <StatCard
          href={`${base}/invoices`}
          label="invoices"
          value={
            unpaid.length > 0
              ? `€${unpaidTotal.toLocaleString('en-IE')} due`
              : 'All settled'
          }
          detail={
            unpaid.length > 0
              ? `${unpaid.length} open payment${unpaid.length === 1 ? '' : 's'}`
              : 'Payment history & receipts'
          }
          done={unpaid.length === 0 && (quotes || []).length > 0}
        />
        <StatCard
          href={`${base}/support`}
          label="support"
          value={openTickets > 0 ? `${openTickets} open` : 'No open tickets'}
          detail="Questions, tweaks, ideas"
          done={false}
        />
      </div>
    </>
  )
}
