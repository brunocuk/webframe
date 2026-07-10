'use client'

import { motion } from 'framer-motion'

// Shared section heading: mono eyebrow + solid ink title.
// The gradient-italic treatment is reserved for the hero.
export default function SectionHeader({ eyebrow, title, sub, dark = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="text-center mb-12"
    >
      <div
        className={`font-mono text-xs font-semibold tracking-wider mb-4 ${
          dark ? 'text-primary-light' : 'text-primary'
        }`}
      >
        {eyebrow}
      </div>
      <h2
        className={`text-4xl md:text-5xl font-bold tracking-tight mb-4 ${
          dark ? 'text-white' : 'text-gray-900'
        }`}
      >
        {title}
      </h2>
      {sub && (
        <p
          className={`text-lg max-w-2xl mx-auto leading-relaxed ${
            dark ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          {sub}
        </p>
      )}
    </motion.div>
  )
}
