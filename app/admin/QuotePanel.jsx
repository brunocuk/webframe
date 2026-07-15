'use client'

import { useState, useTransition } from 'react'
import { createAndSendQuote } from './actions'
import { PLAN_PRICES } from '@/lib/inquiryOptions'

const QUOTE_STATUS_STYLES = {
  sent: 'bg-blue-50 text-blue-700 border-blue-200',
  paid: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-gray-100 text-gray-500 border-gray-200',
}

function CopyLink({ link }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(link)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className="text-[11px] font-medium text-primary hover:text-primary-dark transition-colors"
    >
      {copied ? 'Copied ✓' : 'Copy pay link'}
    </button>
  )
}

export default function QuotePanel({ leadId, quotes }) {
  const [open, setOpen] = useState(false)
  const [plan, setPlan] = useState('Business')
  const [amount, setAmount] = useState(PLAN_PRICES.Business)
  const [mode, setMode] = useState('full')
  const [feedback, setFeedback] = useState(null)
  const [isPending, startTransition] = useTransition()

  const latest = quotes?.[0]
  // A paid full/balance quote ends the money flow; a paid deposit needs a
  // follow-up balance quote later.
  const showNewQuoteButton =
    !latest || latest.status === 'cancelled' || (latest.status === 'paid' && latest.payment_mode === 'deposit')

  const effectiveAmount = mode === 'full' ? amount : Math.round(amount / 2)

  const submit = () => {
    setFeedback(null)
    startTransition(async () => {
      const result = await createAndSendQuote(leadId, {
        plan,
        amountEur: effectiveAmount,
        paymentMode: mode === 'full' ? 'full' : latest?.payment_mode === 'deposit' ? 'balance' : 'deposit',
      })
      if (result?.error) setFeedback({ type: 'error', text: result.error })
      else {
        setOpen(false)
        if (result?.warning) setFeedback({ type: 'warning', text: result.warning })
      }
    })
  }

  return (
    <div className="space-y-2 min-w-[170px]">
      {latest && (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold ${
                QUOTE_STATUS_STYLES[latest.status] || QUOTE_STATUS_STYLES.sent
              }`}
            >
              {latest.payment_mode === 'deposit'
                ? `deposit ${latest.status}`
                : latest.payment_mode === 'balance'
                  ? `balance ${latest.status}`
                  : `quote ${latest.status}`}
            </span>
            <span className="text-xs font-semibold text-gray-700">
              €{Number(latest.amount_eur).toLocaleString('en-IE')}
            </span>
          </div>
          {latest.status === 'sent' && latest.payment_link && <CopyLink link={latest.payment_link} />}
        </div>
      )}

      {showNewQuoteButton && !open && (
        <button
          onClick={() => setOpen(true)}
          className="px-3 py-1.5 rounded-full bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition-colors"
        >
          {latest?.payment_mode === 'deposit' && latest?.status === 'paid'
            ? 'Request balance'
            : 'Send quote'}
        </button>
      )}

      {open && (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2.5 w-56">
          <select
            value={plan}
            onChange={(e) => {
              setPlan(e.target.value)
              setAmount(PLAN_PRICES[e.target.value] ?? amount)
            }}
            className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-medium bg-white focus:outline-none focus:border-primary"
          >
            {Object.keys(PLAN_PRICES).map((p) => (
              <option key={p} value={p}>
                {p} — €{PLAN_PRICES[p].toLocaleString('en-IE')}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">€</span>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-medium bg-white focus:outline-none focus:border-primary"
            />
          </div>

          {latest?.payment_mode !== 'deposit' && (
            <div className="flex gap-1.5">
              {[
                { value: 'full', label: 'Full amount' },
                { value: 'deposit', label: '50% deposit' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setMode(option.value)}
                  className={`flex-1 px-2 py-1.5 rounded-lg border text-[11px] font-semibold transition-colors ${
                    mode === option.value
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          <div className="text-[11px] text-gray-500">
            Will charge: <span className="font-bold text-gray-900">€{effectiveAmount.toLocaleString('en-IE')}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={submit}
              disabled={isPending}
              className="flex-1 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors"
            >
              {isPending ? 'Sending…' : 'Create & send'}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-500 hover:border-gray-400 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {feedback && (
        <p
          className={`text-[11px] leading-snug ${
            feedback.type === 'error' ? 'text-red-600' : 'text-amber-600'
          }`}
        >
          {feedback.text}
        </p>
      )}
    </div>
  )
}
