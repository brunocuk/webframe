import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import InvalidLink from '../InvalidLink'

export const dynamic = 'force-dynamic'

const MODE_LABELS = {
  full: 'Full payment',
  upfront: 'Full payment',
  deposit: '50% deposit',
  balance: 'Final balance',
  monthly: 'Monthly plan',
}

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const euro = (value) => `€${Number(value || 0).toLocaleString('en-IE')}`

function StatusBadge({ quote }) {
  if (quote.status === 'paid') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full text-[11px] font-semibold text-green-700">
        <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Paid{quote.paid_at ? ` · ${dateFormat.format(new Date(quote.paid_at))}` : ''}
      </span>
    )
  }
  if (quote.status === 'cancelled') {
    return (
      <span className="px-2.5 py-1 bg-gray-100 rounded-full text-[11px] font-semibold text-gray-500">
        Cancelled
      </span>
    )
  }
  return (
    <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full text-[11px] font-semibold text-amber-700">
      Awaiting payment
    </span>
  )
}

export default async function PortalInvoicesPage({ params }) {
  const { token } = await params
  const supabase = getSupabaseAdmin()
  if (!supabase) return <InvalidLink />

  const { data: project } = await supabase
    .from('webframe_projects')
    .select('id, name, lead_id')
    .eq('portal_token', token)
    .maybeSingle()
  if (!project) return <InvalidLink />

  const { data: quotes } = await supabase
    .from('webframe_quotes')
    .select('*')
    .eq('lead_id', project.lead_id)
    .order('created_at', { ascending: false })

  const list = quotes || []
  const paidTotal = list
    .filter((q) => q.status === 'paid')
    .reduce((sum, q) => sum + (Number(q.amount_eur) || 0), 0)
  const openQuotes = list.filter((q) => q.status === 'sent')
  const openTotal = openQuotes.reduce((sum, q) => sum + (Number(q.amount_eur) || 0), 0)

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mb-1">
          Invoices
        </h1>
        <p className="text-sm text-gray-600">
          Your payments for this project — processed securely by Revolut.
        </p>
      </div>

      {list.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="font-mono text-[10px] tracking-wider text-gray-400 uppercase mb-1">
              paid
            </div>
            <div className="text-xl font-bold text-gray-900">{euro(paidTotal)}</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="font-mono text-[10px] tracking-wider text-gray-400 uppercase mb-1">
              outstanding
            </div>
            <div className={`text-xl font-bold ${openTotal > 0 ? 'text-amber-600' : 'text-gray-900'}`}>
              {euro(openTotal)}
            </div>
          </div>
        </div>
      )}

      {list.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-10 text-center">
          <h2 className="font-semibold text-gray-900 mb-2">No invoices yet</h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            When there&apos;s something to pay, it shows up here with a secure
            payment link.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((quote) => (
            <div
              key={quote.id}
              className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-wrap items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-900">
                  {MODE_LABELS[quote.payment_mode] || 'Payment'} — {quote.plan} plan
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  Issued {dateFormat.format(new Date(quote.created_at))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-lg font-bold text-gray-900">
                  {euro(quote.amount_eur)}
                  {quote.payment_mode === 'monthly' && (
                    <span className="text-xs text-gray-500 font-medium">/mo</span>
                  )}
                </div>
                <StatusBadge quote={quote} />
                {quote.status === 'sent' && quote.payment_link && (
                  <a
                    href={quote.payment_link}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2 rounded-full bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Pay now
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-6 text-xs text-gray-500 leading-relaxed">
        Need a formal invoice document for your accounting? Reply to any of our
        emails or open a support ticket and we&apos;ll send one over.
      </p>
    </>
  )
}
