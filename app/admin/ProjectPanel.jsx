'use client'

import { useState, useTransition } from 'react'
import { createPortalForLead, updateProjectStage } from './actions'
import { PROJECT_STAGES } from '@/lib/projectStages'

function CopyButton({ getText, label }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(getText())
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className="text-[11px] font-medium text-primary hover:text-primary-dark transition-colors"
    >
      {copied ? 'Copied ✓' : label}
    </button>
  )
}

export default function ProjectPanel({ lead, project, fileLinks }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState(null)
  const [showFiles, setShowFiles] = useState(false)

  if (!project) {
    return (
      <div className="min-w-[150px]">
        <button
          onClick={() => {
            setError(null)
            startTransition(async () => {
              const result = await createPortalForLead(lead.id)
              if (result?.error) setError(result.error)
            })
          }}
          disabled={isPending}
          className="px-3 py-1.5 rounded-full border border-gray-300 text-xs font-semibold text-gray-600 hover:border-gray-500 hover:text-gray-900 disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Creating…' : 'Create portal'}
        </button>
        {error && <p className="mt-1 text-[11px] text-red-600">{error}</p>}
      </div>
    )
  }

  const items = project.webframe_content_items || []
  const uploadedCount = items.filter((i) => (i.files || []).length > 0).length
  const totalFiles = items.reduce((n, i) => n + (i.files || []).length, 0)

  return (
    <div className="space-y-1.5 min-w-[170px]">
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

      <div className="flex items-center gap-2.5">
        <CopyButton
          getText={() => `${window.location.origin}/portal/${project.portal_token}`}
          label="Copy portal link"
        />
        {totalFiles > 0 && (
          <button
            onClick={() => setShowFiles((v) => !v)}
            className="text-[11px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            {uploadedCount}/{items.length} in · {totalFiles} file{totalFiles === 1 ? '' : 's'} {showFiles ? '▴' : '▾'}
          </button>
        )}
      </div>

      {showFiles && (
        <ul className="space-y-1 pt-1">
          {items.flatMap((item) =>
            (item.files || []).map((file, i) => {
              const href = fileLinks?.[file.path]
              return (
                <li key={`${item.id}-${i}`} className="text-[11px] truncate max-w-[220px]">
                  <span className="text-gray-400">{item.label}:</span>{' '}
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:text-primary-dark"
                    >
                      {file.name}
                    </a>
                  ) : (
                    <span className="text-gray-600">{file.name}</span>
                  )}
                </li>
              )
            })
          )}
        </ul>
      )}
    </div>
  )
}
