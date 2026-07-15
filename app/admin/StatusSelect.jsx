'use client'

import { useTransition } from 'react'
import { updateLeadStatus } from './actions'
import { LEAD_STATUSES } from '@/lib/inquiryOptions'

const STATUS_STYLES = {
  new: 'bg-purple-50 text-primary border-primary/30',
  contacted: 'bg-amber-50 text-amber-700 border-amber-200',
  quoted: 'bg-blue-50 text-blue-700 border-blue-200',
  won: 'bg-green-50 text-green-700 border-green-200',
  lost: 'bg-gray-100 text-gray-500 border-gray-200',
}

export default function StatusSelect({ id, status }) {
  const [isPending, startTransition] = useTransition()

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value
        startTransition(() => updateLeadStatus(id, next))
      }}
      className={`px-2.5 py-1.5 rounded-full border text-xs font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 ${
        STATUS_STYLES[status] || STATUS_STYLES.new
      }`}
    >
      {LEAD_STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  )
}
