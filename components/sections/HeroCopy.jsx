'use client'

import { motion } from 'framer-motion'
import { useContactModal } from '../ContactModalProvider'

// Hero copy column — the left half of the hero, separate from the visual.
export default function HeroCopy({ centered = false, showGuarantees = true }) {
  const { openModal } = useContactModal()
  const align = centered ? 'items-center text-center' : 'items-start text-left'

  return (
    <div className={`flex flex-col ${align}`}>
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-white/60 backdrop-blur-sm border border-primary/20 rounded-full"
      >
        <span className="px-2 py-0.5 bg-primary text-white text-xs font-bold rounded-full">
          Custom
        </span>
        <span className="text-sm font-medium text-gray-700">
          Built for Your Business
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-lg font-medium text-gray-600 mb-6"
      >
        From vision to launch
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-5xl md:text-6xl xl:text-7xl font-bold mb-6 leading-[0.95] tracking-tight"
      >
        Your Custom
        <br />
        Website.
        <br />
        <span className="italic font-light bg-gradient-to-r from-primary via-purple-600 to-blue-500 bg-clip-text text-transparent">
          In 7 Days.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className={`text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl leading-relaxed ${centered ? 'mx-auto' : ''}`}
      >
        No templates, no page builders. A hand-coded website built around your
        business — live within a week.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className={`flex flex-col sm:flex-row gap-4 ${showGuarantees ? 'mb-8' : ''} ${centered ? 'justify-center' : ''}`}
      >
        <motion.button
          onClick={openModal}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group inline-flex items-center gap-3 px-4 py-3 bg-white rounded-full border-2 border-gray-200 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            <div className="w-full h-full bg-gradient-to-br from-primary to-purple-600" />
          </div>
          <div className="flex-1 text-left">
            <div className="text-sm font-bold text-gray-900">Book a free call</div>
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span>Available today</span>
            </div>
          </div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-400 group-hover:text-primary transition-colors"
          >
            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>

        <motion.a
          href="/#portfolio"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition-all"
        >
          View Our Work
        </motion.a>
      </motion.div>

      {showGuarantees && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 items-start"
        >
          {[
            ['7-Day Delivery', 'Guaranteed or free'],
            ['Your Website', 'Full control & flexibility'],
            ['30-Day Support', 'Free revisions included'],
          ].map(([title, sub]) => (
            <div key={title} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{title}</p>
                <p className="text-xs text-gray-600">{sub}</p>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
