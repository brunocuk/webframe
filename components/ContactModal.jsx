'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PROJECT_TYPES,
  PROJECT_SIZES,
  PLAN_OPTIONS,
  PLAN_PRICES,
  labelFor,
} from '@/lib/inquiryOptions'

// Start Your Project modal, styled as the site's signature device: a tiny
// editor window drafting the visitor's project brief, step by step, until
// it "ships" on the success screen. When opened from a plan card the plan
// is recorded and shown; otherwise step 2 asks the visitor to pick one.
const stepMeta = (step, hasPlan) => ({
  1: { eyebrow: '// step 1 of 3', title: 'What are you building?' },
  2: hasPlan
    ? { eyebrow: '// step 2 of 3', title: 'How big should it be?' }
    : { eyebrow: '// step 2 of 3', title: 'Which plan fits best?' },
  3: { eyebrow: '// step 3 of 3', title: 'Where do we send your quote?' },
})[step]

const chipContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
}

const chipItem = {
  hidden: { opacity: 0, y: 12, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 420, damping: 26 },
  },
}

function Chip({ selected, onClick, children }) {
  return (
    <motion.button
      variants={chipItem}
      onClick={onClick}
      whileHover={{ scale: 1.06, y: -2 }}
      whileTap={{ scale: 0.94 }}
      className={`px-5 py-2.5 rounded-full border-2 font-medium transition-colors ${
        selected
          ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30'
          : 'bg-white text-gray-700 border-gray-200 hover:border-primary/50'
      }`}
    >
      {children}
    </motion.button>
  )
}

export default function ContactModal({ isOpen, onClose, preselectedPlan = null }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    projectType: '',
    projectSize: '',
    plan: '',
    name: '',
    email: '',
    business: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const sent = step === 4

  // Reset form when modal closes; adopt the clicked plan when it opens
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, plan: preselectedPlan || prev.plan }))
    } else {
      setTimeout(() => {
        setStep(1)
        setFormData({ projectType: '', projectSize: '', plan: '', name: '', email: '', business: '' })
        setError(null)
      }, 300)
    }
  }, [isOpen, preselectedPlan])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleOptionSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Let the selection state register before advancing
    setTimeout(() => setStep(prev => prev + 1), 250)
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    if (!formData.email) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          projectType: labelFor(PROJECT_TYPES, formData.projectType),
          projectSize: formData.projectSize
            ? labelFor(PROJECT_SIZES, formData.projectSize)
            : '',
          plan: formData.plan === 'unsure' ? 'Not sure' : formData.plan,
          business: formData.business,
          source: 'modal',
        }),
      })

      const result = await response.json()

      if (result.success) {
        setStep(4) // Success step
      } else {
        console.error('Form submission failed:', result)
        setError('Something went wrong sending your request. Please try again, or email hello@web-frame.eu.')
      }
    } catch (err) {
      console.error('Form submission error:', err)
      setError('Something went wrong sending your request. Please try again, or email hello@web-frame.eu.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = sent ? 1 : (step - 1) / 3

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-hidden"
          >
            {/* Ambient glow drifting behind the card */}
            <motion.div
              className="absolute w-[700px] h-[700px] rounded-full blur-3xl -top-40 -left-20"
              style={{
                background:
                  'radial-gradient(circle, rgba(75, 43, 255, 0.25) 0%, rgba(139, 92, 246, 0.12) 50%, transparent 100%)',
              }}
              animate={{ x: ['0%', '25%', '0%'], y: ['0%', '18%', '0%'] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 24, stiffness: 320 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-label="Start your project"
          >
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden pointer-events-auto">
              {/* Editor chrome header */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-[#161221]">
                <div className="flex items-center gap-1.5" aria-hidden>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                </div>
                <span className="font-mono text-[11px] text-white/60">
                  your-project.brief
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] flex items-center gap-1.5">
                    {sent ? (
                      <span className="text-green-400">✓ sent</span>
                    ) : (
                      <>
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400" />
                        </span>
                        <span className="text-white/50">drafting…</span>
                      </>
                    )}
                  </span>
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    className="w-6 h-6 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Build progress bar */}
              <div className="h-1 bg-gray-100">
                <motion.div
                  className={`h-full ${sent ? 'bg-green-500' : 'bg-primary'}`}
                  initial={false}
                  animate={{ width: `${Math.max(progress * 100, 8)}%` }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>

              {/* Content */}
              <div className="px-8 pt-8 pb-8">
                <AnimatePresence mode="wait">
                  {!sent && (
                    <motion.div
                      key={`step${step}`}
                      initial={{ opacity: 0, x: 32 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -32 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    >
                      <p className="font-mono text-xs font-semibold tracking-wider text-primary text-center mb-2">
                        {stepMeta(step, !!preselectedPlan).eyebrow}
                      </p>
                      {preselectedPlan && PLAN_PRICES[preselectedPlan] && (
                        <div className="flex justify-center mb-3">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-primary/20 rounded-full text-xs font-semibold text-primary">
                            {preselectedPlan} plan · €{PLAN_PRICES[preselectedPlan].toLocaleString('en-IE')}
                          </span>
                        </div>
                      )}
                      <h2 className="text-2xl font-bold text-center text-gray-900 mb-7">
                        {stepMeta(step, !!preselectedPlan).title}
                      </h2>

                      {step === 1 && (
                        <motion.div
                          variants={chipContainer}
                          initial="hidden"
                          animate="visible"
                          className="flex flex-wrap justify-center gap-3"
                        >
                          {PROJECT_TYPES.map((type) => (
                            <Chip
                              key={type.value}
                              selected={formData.projectType === type.value}
                              onClick={() => handleOptionSelect('projectType', type.value)}
                            >
                              {type.label}
                            </Chip>
                          ))}
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div
                          variants={chipContainer}
                          initial="hidden"
                          animate="visible"
                          className="flex flex-wrap justify-center gap-3"
                        >
                          {preselectedPlan
                            ? PROJECT_SIZES.map((size) => (
                                <Chip
                                  key={size.value}
                                  selected={formData.projectSize === size.value}
                                  onClick={() => handleOptionSelect('projectSize', size.value)}
                                >
                                  {size.label}
                                </Chip>
                              ))
                            : PLAN_OPTIONS.map((option) => (
                                <Chip
                                  key={option.value}
                                  selected={formData.plan === option.value}
                                  onClick={() => handleOptionSelect('plan', option.value)}
                                >
                                  {option.label}
                                </Chip>
                              ))}
                        </motion.div>
                      )}

                      {step === 3 && (
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                          <motion.div
                            variants={chipContainer}
                            initial="hidden"
                            animate="visible"
                            className="space-y-4"
                          >
                            <motion.input
                              variants={chipItem}
                              type="email"
                              placeholder="your@email.com"
                              autoComplete="email"
                              value={formData.email}
                              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                              required
                              autoFocus
                              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors text-center text-lg"
                            />
                            <motion.input
                              variants={chipItem}
                              type="text"
                              placeholder="Your name (optional)"
                              autoComplete="name"
                              value={formData.name}
                              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors text-center"
                            />
                            <motion.input
                              variants={chipItem}
                              type="text"
                              placeholder="Business name or current website (optional)"
                              value={formData.business}
                              onChange={(e) => setFormData(prev => ({ ...prev, business: e.target.value }))}
                              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors text-center"
                            />
                          </motion.div>
                          {error && (
                            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-left">
                              {error}
                            </p>
                          )}
                          <motion.button
                            type="submit"
                            disabled={isSubmitting || !formData.email}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/30 hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all"
                          >
                            {isSubmitting ? 'Sending…' : 'Get My Quote'}
                          </motion.button>
                        </form>
                      )}
                    </motion.div>
                  )}

                  {/* Success — the brief ships */}
                  {sent && (
                    <motion.div
                      key="sent"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-center py-2"
                    >
                      <div className="relative w-16 h-16 mx-auto mb-6">
                        {/* Radiating pulse */}
                        <motion.div
                          initial={{ scale: 0.6, opacity: 0.8 }}
                          animate={{ scale: 2.2, opacity: 0 }}
                          transition={{ duration: 1.2, delay: 0.25, ease: 'easeOut' }}
                          className="absolute inset-0 rounded-full bg-green-400"
                        />
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 18 }}
                          className="relative w-16 h-16 bg-green-500 rounded-full flex items-center justify-center"
                        >
                          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <motion.path
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ delay: 0.4, duration: 0.4, ease: 'easeOut' }}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </motion.div>
                      </div>
                      <p className="font-mono text-xs font-semibold tracking-wider text-green-600 mb-2">
                        ✓ brief received
                      </p>
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        Done — we&apos;ll be in touch!
                      </h2>
                      <p className="text-gray-500 mb-6">
                        Expect an email within 24 hours.
                      </p>
                      <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
                      >
                        Close
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Back button (steps 2-3) */}
              {step > 1 && !sent && (
                <div className="px-8 pb-6 text-center">
                  <button
                    onClick={() => setStep(prev => prev - 1)}
                    className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ← Back
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
