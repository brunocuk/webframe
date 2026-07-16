import Link from 'next/link'
import {
  quoteEmailHtml,
  quoteReminderEmailHtml,
  onboardingEmailHtml,
  contentNudgeEmailHtml,
} from '@/lib/email'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Email Previews - Webframe Admin',
  robots: { index: false, follow: false },
}

// Every transactional email the system sends, rendered with sample data.
export default function EmailPreviewsPage() {
  const samples = [
    {
      title: 'Quote — full payment',
      note: 'Sent when you click "Create & send" with Full amount.',
      html: quoteEmailHtml({
        name: 'Anna de Vries',
        plan: 'Business',
        amountEur: 2400,
        paymentMode: 'full',
        paymentLink: '#',
      }),
    },
    {
      title: 'Quote — 50% deposit',
      note: 'Deposit mode; the balance email follows before launch.',
      html: quoteEmailHtml({
        name: 'Anna de Vries',
        plan: 'Business',
        amountEur: 1200,
        paymentMode: 'deposit',
        paymentLink: '#',
      }),
    },
    {
      title: 'Quote — final balance',
      note: 'Sent via "Request balance" after a paid deposit.',
      html: quoteEmailHtml({
        name: 'Anna de Vries',
        plan: 'Business',
        amountEur: 1200,
        paymentMode: 'balance',
        paymentLink: '#',
      }),
    },
    {
      title: 'Quote — monthly plan',
      note: 'Subscription setup; first payment saves the card.',
      html: quoteEmailHtml({
        name: 'Anna de Vries',
        plan: 'Business',
        amountEur: 299,
        paymentMode: 'monthly',
        paymentLink: '#',
      }),
    },
    {
      title: 'Onboarding + portal magic link',
      note: 'Fires automatically when a payment lands (webhook).',
      html: onboardingEmailHtml({
        name: 'Anna de Vries',
        portalUrl: '#',
      }),
    },
    {
      title: 'Payment reminder',
      note: 'Daily cron — quote unpaid for 3+ days, sent once.',
      html: quoteReminderEmailHtml({
        name: 'Anna de Vries',
        plan: 'Business',
        amountEur: 2400,
        paymentLink: '#',
      }),
    },
    {
      title: 'Content nudge',
      note: 'Daily cron — paid project with no uploads for 4+ days, sent once.',
      html: contentNudgeEmailHtml({
        name: 'Anna de Vries',
        portalUrl: '#',
      }),
    },
  ]

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="font-mono text-xs font-semibold tracking-wider text-primary mb-1.5">
            // webframe crm
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Email previews</h1>
            <Link
              href="/admin"
              className="px-4 py-2 rounded-full border border-gray-200 bg-white text-xs font-medium text-gray-500 hover:text-gray-900 hover:border-gray-400 transition-colors"
            >
              ← Back to leads
            </Link>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Rendered with sample data — exactly what clients receive. Copy lives
            in <code className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">lib/email.js</code>.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {samples.map((sample) => (
            <div key={sample.title} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100">
                <h2 className="text-sm font-bold text-gray-900">{sample.title}</h2>
                <p className="text-[11px] text-gray-500">{sample.note}</p>
              </div>
              <iframe
                srcDoc={sample.html}
                title={sample.title}
                className="w-full h-[560px] bg-[#f4f4f7]"
                sandbox=""
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
