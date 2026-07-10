'use client'

import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'

// Stat-anchored cards: every claim is a verifiable number, with a small
// mono annotation echoing the hero's code motif.
const BENEFITS = [
  {
    stat: '100/100',
    label: 'Google PageSpeed',
    description:
      'Hand-written code loads instantly. Faster sites convert better and rank higher on Google.',
    mono: '// measured on every launch',
  },
  {
    stat: '~40kb',
    label: 'Typical page weight',
    description:
      'No builder bloat, no unused scripts. Your site ships only the code it actually needs.',
    mono: '// builder average: ~2.5mb',
  },
  {
    stat: '€0',
    label: 'Platform fees',
    description:
      'No subscription keeping your site alive. Host it anywhere, or let us handle it for you.',
    mono: '// you own the code',
  },
  {
    stat: '1:1',
    label: 'Direct with the developer',
    description:
      'You talk to the person building your site — not a chatbot, not a ticket queue.',
    mono: '// reply within 24h',
  },
  {
    stat: '100%',
    label: 'Yours to keep',
    description:
      'Full source code, your domain, your content. Leave anytime and take everything with you.',
    mono: '// no vendor lock-in',
  },
  {
    stat: 'CET',
    label: 'European, like you',
    description:
      'Serving NL, DK, IE & UK from the EU. Clear communication, in your working hours.',
    mono: '// nl · dk · ie · uk',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function BenefitsSection() {
  return (
    <section className="py-20 px-6 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          eyebrow="// why custom code"
          title="Built by hand. Better by default."
          sub="Wix, Webflow and Framer are fine for DIY. A hand-coded site is faster, lighter, and completely yours — with nothing to subscribe to."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '0px 0px -60px 0px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {BENEFITS.map((benefit) => (
            <motion.div
              key={benefit.label}
              variants={itemVariants}
              className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="text-4xl font-bold tracking-tight text-gray-900 mb-1">
                {benefit.stat}
              </div>
              <h3 className="text-sm font-semibold text-primary mb-3">
                {benefit.label}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed flex-grow">
                {benefit.description}
              </p>
              <div className="mt-4 pt-3 border-t border-gray-100 font-mono text-[11px] text-gray-400">
                {benefit.mono}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-12 text-center"
        >
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
          >
            See what's included
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
