'use client'

import { useState, useTransition } from 'react'
import { updateLeadCall } from './actions'

// datetime-local wants "YYYY-MM-DDTHH:mm" in local time
function toLocalInput(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function CallTime({ leadId, callAt }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(toLocalInput(callAt))
  const [isPending, startTransition] = useTransition()

  const save = (next) => {
    startTransition(async () => {
      await updateLeadCall(leadId, next || null)
      setEditing(false)
    })
  }

  if (editing) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <input
          type="datetime-local"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="px-1.5 py-0.5 rounded border border-gray-200 text-[11px] focus:outline-none focus:border-primary"
        />
        <button
          onClick={() => save(value)}
          disabled={isPending}
          className="text-[11px] font-semibold text-primary hover:text-primary-dark disabled:opacity-50"
        >
          ✓
        </button>
        <button
          onClick={() => save('')}
          disabled={isPending}
          className="text-[11px] text-gray-400 hover:text-gray-600"
          title="Clear call time"
        >
          clear
        </button>
      </span>
    )
  }

  const isPast = callAt && new Date(callAt) < new Date()
  return (
    <button
      onClick={() => setEditing(true)}
      className={`text-[11px] font-medium transition-colors ${
        callAt
          ? isPast
            ? 'text-gray-400 hover:text-gray-600'
            : 'text-green-700 hover:text-green-800'
          : 'text-gray-400 hover:text-primary'
      }`}
    >
      {callAt
        ? `📞 ${new Date(callAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}`
        : '+ call time'}
    </button>
  )
}
