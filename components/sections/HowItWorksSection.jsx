'use client'

import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'

// The process as an actual 7-day calendar — the section's job is to make
// "custom in a week" believable.
const STAGES = [
  {
    days: 'Day 1',
    title: 'Kickoff call',
    description:
      'Tell us about your business, goals and taste. You get a clear proposal and a fixed quote the same day.',
    features: ['Free consultation', 'Fixed quote, no surprises'],
  },
  {
    days: 'Day 2',
    title: 'Content in',
    description:
      'Send your text, images and logo — our content guide makes it easy. We organise and optimise everything.',
    features: ['Simple content guide', 'We handle the polish'],
  },
  {
    days: 'Days 3–6',
    title: 'We build, hand-coded',
    description:
      'Design and code written for your business. Performance, SEO and device testing are part of the build, not extras.',
    features: ['Custom design & code', 'SEO + performance', 'Tested on all devices'],
  },
  {
    days: 'Day 7',
    title: "You're live",
    description:
      'Final approval, then launch on your domain. You get the keys, a walkthrough, and 30 days of support.',
    features: ['Launch on your domain', '30 days of free support'],
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function HowItWorksSection() {
  return (
    <section
      id="process"
      className="py-20 px-6 bg-gradient-to-br from-gray-50 via-white to-purple-50/30 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          eyebrow="// how it works"
          title="One week, start to live."
          sub="Four stages, seven days. Here's exactly what happens after you say go."
        />

        {/* 7-day rail — echoes the hero's build progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '0px 0px -60px 0px' }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: 'easeInOut', delay: 0.2 }}
              className="h-full bg-primary rounded-full"
            />
          </div>
          <div className="flex justify-between mt-2.5 font-mono text-[11px] text-gray-400">
            {['Day 1', '2', '3', '4', '5', '6', 'Day 7'].map((d, i) => (
              <span key={d} className={i === 6 ? 'text-primary font-semibold' : ''}>
                {d}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Stage cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '0px 0px -60px 0px' }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {STAGES.map((stage) => (
            <motion.div
              key={stage.days}
              variants={itemVariants}
              className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="font-mono text-[11px] font-semibold text-primary mb-3">
                {stage.days}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {stage.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {stage.description}
              </p>
              <ul className="space-y-1.5">
                {stage.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-xs font-medium text-gray-700"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-5">Day 1 can be tomorrow.</p>
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
          >
            View pricing
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
