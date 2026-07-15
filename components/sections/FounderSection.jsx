'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

// The trust bridge before the contact CTA: one person, no handoffs.
// Headline is written in the founder's voice on purpose — the section's
// job is to make "you'll work with me directly" feel true.
const FACTS = [
  { label: 'role', value: 'Founder & Developer' },
  { label: 'serving', value: 'NL · DK · IE · UK' },
  { label: 'delivery', value: '7 days' },
  { label: 'response', value: '< 24 hours' },
]

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function FounderSection() {
  return (
    <section id="founder" className="relative py-20 md:py-28 px-6 bg-black overflow-hidden">
      {/* Quiet ambient glow — calmer than the CTA below it */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(75, 43, 255, 0.14) 0%, rgba(139, 92, 246, 0.06) 50%, transparent 100%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ staggerChildren: 0.08 }}
          className="grid md:grid-cols-12 gap-10 md:gap-14 items-center"
        >
          {/* Portrait */}
          <motion.div variants={itemVariants} className="md:col-span-5">
            <div className="relative max-w-sm mx-auto md:mx-0">
              <div className="rounded-2xl overflow-hidden border border-white/10">
                <Image
                  src="/images/bruno-portrait.webp"
                  alt="Bruno Čukić, founder of Webframe"
                  width={720}
                  height={900}
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Caption bar */}
              <div className="flex items-center justify-between mt-3 px-1 font-mono text-[11px]">
                <span className="text-white/80 font-semibold">Bruno Čukić</span>
                <span className="text-gray-500">// the founder</span>
              </div>
            </div>
          </motion.div>

          {/* Statement */}
          <div className="md:col-span-7">
            <motion.div
              variants={itemVariants}
              className="font-mono text-xs font-semibold tracking-wider text-primary-light mb-4"
            >
              // who you&apos;ll work with
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight"
            >
              Hi, I&apos;m Bruno.
              <br />
              I build every site{' '}
              <span className="italic font-light text-primary-light">myself.</span>
            </motion.h2>

            <motion.div variants={itemVariants} className="space-y-4 mb-8">
              <p className="text-lg text-gray-400 leading-relaxed">
                Webframe is a one-person studio — and that&apos;s the point. No
                account managers, no handoffs, no juniors learning on your
                project. You explain your business once, and the person you
                explain it to is the person who designs, codes and launches
                your site.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                I started Webframe because small businesses kept having to
                choose between a template that looks like everyone else&apos;s
                and an agency quote with months of meetings. A hand-coded
                site, live in a week, is my answer to both.
              </p>
            </motion.div>

            {/* Fact ledger */}
            <motion.dl
              variants={itemVariants}
              className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 rounded-xl overflow-hidden border border-white/10 mb-8"
            >
              {FACTS.map((fact) => (
                <div key={fact.label} className="bg-black px-4 py-3.5">
                  <dt className="font-mono text-[11px] text-gray-500 mb-1">
                    {fact.label}
                  </dt>
                  <dd className="text-sm font-semibold text-white/90">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </motion.dl>

            <motion.a
              variants={itemVariants}
              href="#contact"
              className="inline-flex items-center gap-2 text-white font-semibold group"
            >
              <span className="border-b border-white/30 group-hover:border-white transition-colors pb-0.5">
                Book a free 15-minute call
              </span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform group-hover:translate-x-1"
              >
                <path
                  d="M7.5 15L12.5 10L7.5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
