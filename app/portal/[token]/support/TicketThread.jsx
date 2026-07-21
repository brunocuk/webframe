'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { replyTicket } from '../actions'

const timeFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

export default function TicketThread({ token, ticket, messages }) {
  const router = useRouter()
  const [reply, setReply] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const closed = ticket.status === 'closed'

  const handleReply = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const result = await replyTicket(token, ticket.id, reply)
    setBusy(false)
    if (result.error) return setError(result.error)
    setReply('')
    router.refresh()
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
          <div className="text-[11px] text-gray-400 mt-0.5">
            Opened {timeFormat.format(new Date(ticket.created_at))}
          </div>
        </div>
        <span
          className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
            closed
              ? 'bg-gray-100 text-gray-500'
              : 'bg-green-50 border border-green-200 text-green-700'
          }`}
        >
          {closed ? 'closed' : 'open'}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              message.sender === 'client'
                ? 'ml-auto bg-gray-900 text-white'
                : 'bg-gray-50 border border-gray-200 text-gray-700'
            }`}
          >
            <div
              className={`text-[10px] font-semibold mb-1 ${
                message.sender === 'client' ? 'text-white/60' : 'text-primary'
              }`}
            >
              {message.sender === 'client' ? 'You' : 'Webframe'}
              {' · '}
              {timeFormat.format(new Date(message.created_at))}
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.body}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleReply} className="flex gap-2">
        <input
          type="text"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          maxLength={5000}
          placeholder={closed ? 'Reply to reopen this ticket…' : 'Write a reply…'}
          className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <button
          type="submit"
          disabled={busy || !reply.trim()}
          className="px-5 py-2.5 rounded-full bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {busy ? '…' : 'Send'}
        </button>
      </form>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  )
}
