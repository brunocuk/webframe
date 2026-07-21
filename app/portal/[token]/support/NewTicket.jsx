'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createTicket } from '../actions'

export default function NewTicket({ token, hasTickets }) {
  const router = useRouter()
  const [open, setOpen] = useState(!hasTickets)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const result = await createTicket(token, subject, body)
    setBusy(false)
    if (result.error) return setError(result.error)
    setSubject('')
    setBody('')
    setOpen(false)
    router.refresh()
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
      >
        + New ticket
      </button>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6"
    >
      <h3 className="font-semibold text-gray-900 mb-4">New ticket</h3>
      <input
        type="text"
        required
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        maxLength={120}
        placeholder="What's it about? e.g. “Change the opening hours”"
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/40 mb-3"
      />
      <textarea
        required
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        maxLength={5000}
        placeholder="Tell us what you need — as rough or detailed as you like."
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-y mb-3"
      />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="px-6 py-2.5 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {busy ? 'Sending…' : 'Send ticket'}
        </button>
        {hasTickets && (
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
      {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
    </form>
  )
}
