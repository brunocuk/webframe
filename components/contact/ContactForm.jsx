'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PROJECT_TYPES, PROJECT_SIZES, PLAN_OPTIONS, labelFor } from '@/lib/inquiryOptions'

// Inline variant of the project inquiry flow — same endpoint and questions as
// the Start Your Project modal, plus an optional message.

function ChipGroup({ label, options, value, onChange }) {
  return (
    <div>
      <span className="block text-sm font-semibold text-gray-900 mb-2.5">{label}</span>
      <div className="flex flex-wrap gap-2.5">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
            className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
              value === option.value
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    projectType: '',
    projectSize: '',
    plan: '',
    message: '',
    website: '', // honeypot — hidden field, real users never fill it
  })
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  const set = (field) => (value) => setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email) return
    setStatus('submitting')

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          projectType: labelFor(PROJECT_TYPES, form.projectType),
          projectSize: labelFor(PROJECT_SIZES, form.projectSize),
          plan: form.plan === 'unsure' ? 'Not sure' : form.plan,
          message: form.message,
          website: form.website,
          source: 'contact-page',
        }),
      })
      const result = await response.json()
      setStatus(result.success ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Message sent!</h2>
        <p className="text-gray-600">Expect a reply within 24 hours.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot — hidden from real users, bots auto-fill it */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={form.website}
        onChange={(e) => set('website')(e.target.value)}
        className="hidden"
        aria-hidden="true"
      />
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-semibold text-gray-900 mb-2.5">
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={(e) => set('name')(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-900 focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm font-semibold text-gray-900 mb-2.5">
            Email <span className="text-primary">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(e) => set('email')(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-900 focus:outline-none transition-colors"
          />
        </div>
      </div>

      <ChipGroup
        label="What are you building?"
        options={PROJECT_TYPES}
        value={form.projectType}
        onChange={set('projectType')}
      />

      <ChipGroup
        label="How big should it be?"
        options={PROJECT_SIZES}
        value={form.projectSize}
        onChange={set('projectSize')}
      />

      <ChipGroup
        label="Which plan are you interested in?"
        options={PLAN_OPTIONS}
        value={form.plan}
        onChange={set('plan')}
      />

      <div>
        <label htmlFor="contact-message" className="block text-sm font-semibold text-gray-900 mb-2.5">
          Anything else we should know?
        </label>
        <textarea
          id="contact-message"
          rows={4}
          value={form.message}
          onChange={(e) => set('message')(e.target.value)}
          placeholder="Tell us about your business, links to sites you like, questions…"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-900 focus:outline-none transition-colors resize-y"
        />
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          Something went wrong sending your message. Please try again, or email
          us directly at hello@web-frame.eu.
        </p>
      )}

      <motion.button
        type="submit"
        disabled={status === 'submitting' || !form.email}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </motion.button>
    </form>
  )
}
