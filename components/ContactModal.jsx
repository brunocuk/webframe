'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ContactModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    projectType: '',
    timeline: '',
    email: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalSteps = 4

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1)
        setFormData({ projectType: '', timeline: '', email: '' })
      }, 300)
    }
  }, [isOpen])

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
    // Auto-advance after selection
    setTimeout(() => setStep(prev => prev + 1), 200)
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    if (!formData.email) return

    setIsSubmitting(true)

    try {
      // Get human-readable labels for the selected options
      const projectTypeLabel = projectTypes.find(t => t.value === formData.projectType)?.label || formData.projectType
      const timelineLabel = timelines.find(t => t.value === formData.timeline)?.label || formData.timeline

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          subject: `New Project Inquiry: ${projectTypeLabel}`,
          from_name: 'Webframe Contact Form',
          email: formData.email,
          project_type: projectTypeLabel,
          timeline: timelineLabel,
          message: `New project inquiry from ${formData.email}\n\nProject Type: ${projectTypeLabel}\nTimeline: ${timelineLabel}`,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setStep(4) // Success step
      } else {
        console.error('Form submission failed:', result)
        alert('Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const projectTypes = [
    { value: 'business', label: 'Business Website' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'portfolio', label: 'Portfolio' },
    { value: 'other', label: 'Something Else' },
  ]

  const timelines = [
    { value: 'asap', label: 'ASAP' },
    { value: '2-4weeks', label: '2-4 Weeks' },
    { value: 'flexible', label: 'Flexible' },
  ]

  const ProgressDots = () => (
    <div className="flex justify-center gap-2 mb-6">
      {[1, 2, 3].map((dotStep) => (
        <div
          key={dotStep}
          className={`w-2.5 h-2.5 rounded-full transition-colors ${
            step >= dotStep ? 'bg-green-500' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  )

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
              {/* Header */}
              <div className="px-8 pt-8 pb-4 text-center">
                <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
                  One question at a <span className="text-gray-900">time</span>
                </p>
              </div>

              {/* Content */}
              <div className="px-8 pb-8">
                <AnimatePresence mode="wait">
                  {/* Step 1: Project Type */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-xs text-gray-400 text-center mb-1">STEP 1 OF 3</p>
                      <ProgressDots />
                      <h2 className="text-xl font-semibold text-center text-gray-900 mb-6">
                        What do you need?
                      </h2>
                      <div className="flex flex-wrap justify-center gap-3">
                        {projectTypes.map((type) => (
                          <motion.button
                            key={type.value}
                            onClick={() => handleOptionSelect('projectType', type.value)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-5 py-2.5 rounded-full border-2 font-medium transition-all ${
                              formData.projectType === type.value
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                            }`}
                          >
                            {type.label}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Timeline */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-xs text-gray-400 text-center mb-1">STEP 2 OF 3</p>
                      <ProgressDots />
                      <h2 className="text-xl font-semibold text-center text-gray-900 mb-6">
                        When do you want to launch?
                      </h2>
                      <div className="flex flex-wrap justify-center gap-3">
                        {timelines.map((time) => (
                          <motion.button
                            key={time.value}
                            onClick={() => handleOptionSelect('timeline', time.value)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-5 py-2.5 rounded-full border-2 font-medium transition-all ${
                              formData.timeline === time.value
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                            }`}
                          >
                            {time.label}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Email */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-xs text-gray-400 text-center mb-1">STEP 3 OF 3</p>
                      <ProgressDots />
                      <h2 className="text-xl font-semibold text-center text-gray-900 mb-6">
                        Where do we send details?
                      </h2>
                      <form onSubmit={handleEmailSubmit} className="space-y-4">
                        <input
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          required
                          autoFocus
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-center text-lg"
                        />
                        <motion.button
                          type="submit"
                          disabled={isSubmitting || !formData.email}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                        >
                          {isSubmitting ? 'Sending...' : 'Get My Quote'}
                        </motion.button>
                      </form>
                    </motion.div>
                  )}

                  {/* Step 4: Success */}
                  {step === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-center py-4"
                    >
                      <div className="flex justify-center gap-2 mb-6">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Done — we'll be in touch!
                      </h2>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                      >
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
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
              {step > 1 && step < 4 && (
                <div className="px-8 pb-6 text-center">
                  <button
                    onClick={() => setStep(prev => prev - 1)}
                    className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ← Back
                  </button>
                </div>
              )}

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
