'use client'

import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { useContactModal } from '@/components/ContactModalProvider'
import SectionHeader from './SectionHeader'

// Full feature matrix for the /pricing page. Every value mirrors a claim
// already made on the plan cards — keep the two in sync when plans change.
const PLANS = [
  { name: 'Starter', upfront: '€1,200', monthly: '€149', popular: false },
  { name: 'Business', upfront: '€2,400', monthly: '€299', popular: true },
  { name: 'Complete', upfront: '€3,900', monthly: '€449', popular: false },
]

const GROUPS = [
  {
    label: 'Design & build',
    rows: [
      { name: 'Pages', values: ['1–2', 'Up to 5', 'Up to 10'] },
      { name: 'Custom design, hand-coded', values: [true, true, true] },
      { name: 'Animations & transitions', values: [true, true, true] },
      { name: 'Mobile responsive', values: [true, true, true] },
      { name: '7-day delivery — guaranteed or free', values: [true, true, true] },
    ],
  },
  {
    label: 'Content & editing',
    rows: [
      { name: 'Contact form', values: [true, true, true] },
      { name: 'Blog with simple editor', values: [false, true, true] },
      { name: 'Full CMS — edit everything yourself', values: [false, false, true] },
      { name: 'Multilingual (up to 2 languages)', values: [false, false, true] },
      { name: 'Copywriting — we write your content', values: [false, false, true] },
    ],
  },
  {
    label: 'Growth & integrations',
    rows: [
      { name: 'SEO', values: ['Essentials', 'Advanced — local search, schema', 'Advanced — local search, schema'] },
      { name: 'Google Analytics', values: [true, true, true] },
      { name: 'Integrations — booking, calendar, CRM', values: [false, true, true] },
      { name: 'Advanced integrations — API & custom systems', values: [false, false, true] },
    ],
  },
  {
    label: 'Support',
    rows: [
      { name: 'Rounds of revisions', values: ['1', '2', '3'] },
      { name: '30 days free support & fixes', values: [true, true, true] },
      { name: 'Priority support', values: [false, false, true] },
      {
        name: 'Monthly maintenance',
        values: ['Optional · €49/mo', 'Optional · €79/mo', '3 months included, then €99/mo'],
      },
    ],
  },
]

function Cell({ value }) {
  if (value === true) {
    return (
      <svg className="w-5 h-5 text-primary mx-auto" viewBox="0 0 20 20" fill="currentColor" aria-label="Included">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    )
  }
  if (value === false) {
    return <span className="text-gray-300" aria-label="Not included">—</span>
  }
  return <span className="text-sm font-medium text-gray-700">{value}</span>
}

export default function ComparePlansSection() {
  const { openModal } = useContactModal()

  return (
    <section id="compare" className="py-20 px-6 bg-gradient-to-br from-gray-50 via-white to-purple-50/30 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="// compare"
          title="Every plan, side by side."
          sub="The same craft in every tier — plans differ on scale, editing power and support."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -60px 0px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-x-auto"
        >
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-6 w-[34%]" aria-label="Feature" />
                {PLANS.map((plan) => (
                  <th key={plan.name} className="p-6 text-center align-top w-[22%]">
                    {plan.popular && (
                      <div className="font-mono text-[10px] font-semibold tracking-wider text-primary mb-1.5">
                        MOST POPULAR
                      </div>
                    )}
                    <div className="text-lg font-bold text-gray-900">{plan.name}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {plan.upfront} one-time
                    </div>
                    <div className="text-xs text-gray-500">
                      or {plan.monthly}/mo for 12 months
                    </div>
                    <button
                      onClick={openModal}
                      className={`mt-4 px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                        plan.popular
                          ? 'bg-primary text-white hover:bg-primary-dark'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                    >
                      Start Your Project
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GROUPS.map((group) => (
                <Fragment key={group.label}>
                  <tr className="bg-gray-50/70">
                    <td
                      colSpan={4}
                      className="px-6 py-3 font-mono text-[11px] font-semibold tracking-wider text-gray-500 uppercase"
                    >
                      {group.label}
                    </td>
                  </tr>
                  {group.rows.map((row) => (
                    <tr key={row.name} className="border-t border-gray-100">
                      <td className="px-6 py-3.5 text-sm text-gray-700">{row.name}</td>
                      {row.values.map((value, i) => (
                        <td key={i} className="px-6 py-3.5 text-center">
                          <Cell value={value} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </motion.div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Every plan starts with a free 15-minute call and a fixed quote — no surprises after.
        </p>
      </div>
    </section>
  )
}
