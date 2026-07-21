'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { PROJECT_STAGES } from '@/lib/projectStages'
import { updateProjectStage, markQuotePaid } from '@/app/admin/actions'

export function StageSelect({ project, readOnly = false }) {
  const [isPending, startTransition] = useTransition()
  if (readOnly) {
    return (
      <span className="inline-block px-2.5 py-1.5 rounded-full border border-primary/30 bg-purple-50 text-primary text-xs font-semibold">
        {PROJECT_STAGES.find((s) => s.value === project.stage)?.label || project.stage}
      </span>
    )
  }
  return (
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
  )
}

export function MarkPaidButton({ quoteId }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  return (
    <>
      <button
        onClick={async () => {
          setBusy(true)
          setError(null)
          const result = await markQuotePaid(quoteId)
          setBusy(false)
          if (result?.error) return setError(result.error)
          router.refresh()
        }}
        disabled={busy}
        className="text-[10px] font-semibold text-primary hover:text-primary-dark disabled:opacity-50 transition-colors"
      >
        {busy ? '…' : 'Mark paid'}
      </button>
      {error && <span className="text-[10px] text-red-600">{error}</span>}
    </>
  )
}

export function CopyPortalLink({ token }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(`${window.location.origin}/portal/${token}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className="text-xs font-medium text-primary hover:text-primary-dark transition-colors"
    >
      {copied ? 'Copied ✓' : 'Copy portal link'}
    </button>
  )
}
