'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminReplyTicket, setTicketStatus } from '@/app/admin/actions'

const timeFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

// Expandable ticket thread with admin reply + open/close controls.
// Used by the clients list cards and the client detail page.
export default function TicketRow({ ticket, readOnly, defaultOpen = false }) {
  const router = useRouter()
  const [open, setOpen] = useState(defaultOpen)
  const [reply, setReply] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const messages = ticket.webframe_ticket_messages || []

  const send = async () => {
    setBusy(true)
    setError(null)
    const result = await adminReplyTicket(ticket.id, reply)
    setBusy(false)
    if (result?.error) return setError(result.error)
    if (result?.warning) setError(result.warning)
    setReply('')
    router.refresh()
  }

  const toggleStatus = async () => {
    setBusy(true)
    const next = ticket.status === 'open' ? 'closed' : 'open'
    const result = await setTicketStatus(ticket.id, next)
    setBusy(false)
    if (result?.error) return setError(result.error)
    router.refresh()
  }

  return (
    <div className="border border-gray-200 rounded-xl p-3 bg-white">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 text-left"
      >
        <span className="text-xs font-semibold text-gray-900 truncate">
          {ticket.subject}
        </span>
        <span
          className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
            ticket.status === 'open'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {ticket.status}
        </span>
      </button>
      {open && (
        <div className="mt-3 space-y-2">
          {messages.map((message) => (
            <div key={message.id} className="text-[11px] leading-relaxed">
              <span
                className={`font-semibold ${
                  message.sender === 'admin' ? 'text-primary' : 'text-gray-900'
                }`}
              >
                {message.sender === 'admin' ? 'You' : 'Client'}
              </span>{' '}
              <span className="text-gray-400">
                {timeFormat.format(new Date(message.created_at))}
              </span>
              <p className="text-gray-600 whitespace-pre-wrap">{message.body}</p>
            </div>
          ))}
          {!readOnly && (
            <div className="flex gap-1.5 pt-1">
              <input
                type="text"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Reply (emails the client)…"
                className="flex-1 px-3 py-1.5 rounded-full border border-gray-200 text-[11px] focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                onClick={send}
                disabled={busy || !reply.trim()}
                className="px-3 py-1.5 rounded-full bg-gray-900 text-white text-[11px] font-semibold disabled:opacity-50"
              >
                Send
              </button>
              <button
                onClick={toggleStatus}
                disabled={busy}
                className="px-3 py-1.5 rounded-full border border-gray-200 text-[11px] font-semibold text-gray-600 hover:border-gray-400 disabled:opacity-50"
              >
                {ticket.status === 'open' ? 'Close' : 'Reopen'}
              </button>
            </div>
          )}
          {error && <p className="text-[11px] text-red-600">{error}</p>}
        </div>
      )}
    </div>
  )
}
