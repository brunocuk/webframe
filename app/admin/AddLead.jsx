'use client'

import { useState, useTransition } from 'react'
import { createManualLead } from './actions'
import { PLAN_OPTIONS } from '@/lib/inquiryOptions'

const EMPTY = { name: '', email: '', business: '', plan: '', callAt: '', notes: '' }

export default function AddLead() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState(null)
  const [isPending, startTransition] = useTransition()

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const submit = () => {
    setError(null)
    startTransition(async () => {
      const result = await createManualLead({
        ...form,
        plan: form.plan === 'unsure' ? 'Not sure' : form.plan,
      })
      if (result?.error) setError(result.error)
      else {
        setForm(EMPTY)
        setOpen(false)
      }
    })
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1 rounded-full bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition-colors"
      >
        + Add lead
      </button>
    )
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-900">New outbound lead</h2>
        <button
          onClick={() => setOpen(false)}
          className="text-gray-400 hover:text-gray-600 text-sm"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={set('name')}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary"
        />
        <input
          type="email"
          placeholder="Email *"
          required
          value={form.email}
          onChange={set('email')}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary"
        />
        <input
          type="text"
          placeholder="Business / website"
          value={form.business}
          onChange={set('business')}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary"
        />
        <select
          value={form.plan}
          onChange={set('plan')}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:border-primary"
        >
          <option value="">Plan interest (optional)</option>
          {PLAN_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 focus-within:border-primary">
          <span className="text-xs whitespace-nowrap">Call:</span>
          <input
            type="datetime-local"
            value={form.callAt}
            onChange={set('callAt')}
            className="w-full text-sm text-gray-900 focus:outline-none bg-transparent"
          />
        </label>
        <input
          type="text"
          placeholder="Notes (context from the chat)"
          value={form.notes}
          onChange={set('notes')}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary"
        />
      </div>
      {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
      <div className="mt-4 flex gap-2">
        <button
          onClick={submit}
          disabled={isPending || !form.email}
          className="px-4 py-2 rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Saving…' : 'Save lead'}
        </button>
      </div>
    </div>
  )
}
