'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'
import { useContactModal } from '@/components/ContactModalProvider'
import SectionHeader from './SectionHeader'

export default function PricingSection({ showHeader = true, showCompareLink = true }) {
  const { openModal } = useContactModal()
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: '0px 0px -60px 0px',
  })

  const [billingCycle, setBillingCycle] = useState('upfront') // 'upfront' or 'subscription'

  // Every tier gets the full craft baseline (custom design, animations, SEO,
  // analytics) — tiers differ on scale and depth, shown additively so no card
  // is a list of crossed-out features.
  const plans = [
    {
      name: 'Starter',
      description: 'For a small business that needs a sharp presence, fast.',
      priceUpfront: '1,200',
      maintenanceFee: '49',
      priceSubscription: '149',
      color: 'from-blue-500/20 to-cyan-500/20',
      popular: false,
      baseline: null,
      features: [
        '1–2 pages, custom designed',
        'Animations & transitions',
        'Mobile responsive',
        'SEO essentials',
        'Google Analytics',
        'Contact form',
        '1 round of revisions',
      ],
    },
    {
      name: 'Business',
      description: 'The right fit for most — room to grow and connect your tools.',
      priceUpfront: '2,400',
      maintenanceFee: '79',
      priceSubscription: '299',
      color: 'from-purple-500/20 to-pink-500/20',
      popular: true,
      baseline: 'Everything in Starter, plus:',
      features: [
        'Up to 5 pages',
        'Advanced SEO (local search, schema)',
        'Integrations — booking, calendar, CRM',
        'Blog with simple editor — publish posts yourself',
        '2 rounds of revisions',
      ],
    },
    {
      name: 'Complete',
      description: 'The full online presence for brands with more to say.',
      priceUpfront: '3,900',
      maintenanceFee: '99',
      priceSubscription: '449',
      color: 'from-orange-500/20 to-red-500/20',
      popular: false,
      baseline: 'Everything in Business, plus:',
      features: [
        'Up to 10 pages',
        'Full CMS — edit all your content yourself',
        'Multilingual (up to 2 languages)',
        'Copywriting — we write your content',
        'Advanced integrations (API & custom systems)',
        'Priority support',
        '3 months maintenance included',
        '3 rounds of revisions',
      ],
    },
  ]
  

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <section id="pricing" className="py-20 px-6 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {showHeader && (
          <SectionHeader
            eyebrow="// pricing"
            title="Simple, honest pricing."
            sub="No hidden costs. No surprises. The price you see is the price you pay."
          />
        )}

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 p-1.5 bg-gray-100 rounded-full">
            <button
              onClick={() => setBillingCycle('upfront')}
              className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
                billingCycle === 'upfront'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pay Upfront
            </button>
            <button
              onClick={() => setBillingCycle('subscription')}
              className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
                billingCycle === 'subscription'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly Plan
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8 mb-12"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -12, transition: { duration: 0.3 } }}
              className="group relative h-full"
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-20">
                  <div className="px-4 py-1.5 bg-primary text-white rounded-full text-xs font-bold shadow-lg">
                    MOST POPULAR
                  </div>
                </div>
              )}

              {/* Card */}
              <div className={`relative h-full ${plan.popular ? 'md:scale-105' : ''}`}>
                {/* Main card */}
                <div className={`relative h-full bg-white/80 backdrop-blur-xl rounded-3xl p-8 border-2 ${
                  plan.popular ? 'border-primary' : 'border-gray-200'
                } shadow-xl overflow-hidden flex flex-col`}>
                  
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Content */}
                  <div className="relative z-10 flex flex-col flex-1">
                    {/* Header */}
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold mb-2 text-gray-900">
                        {plan.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {plan.description}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="mb-8">
                      {billingCycle === 'upfront' ? (
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold text-gray-900">
                              €{plan.priceUpfront}
                            </span>
                            <span className="text-gray-600 text-sm">
                              one-time
                            </span>
                          </div>
                          <div className="mt-2 text-gray-600 text-sm">
                            + optional €{plan.maintenanceFee}/month maintenance
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold text-gray-900">
                              €{plan.priceSubscription}
                            </span>
                            <span className="text-gray-600 text-sm">
                              /month
                            </span>
                          </div>
                          <div className="mt-2 text-gray-500 text-xs">
                            12-month minimum commitment
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    {plan.baseline && (
                      <div className="flex items-center gap-2 mb-4">
                        <svg className="w-4 h-4 text-primary flex-shrink-0" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <span className="text-sm font-semibold text-gray-900">
                          {plan.baseline}
                        </span>
                      </div>
                    )}
                    <div className="space-y-3 mb-8">
                      {plan.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-start gap-3"
                        >
                          <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-gray-700">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <motion.button
                      onClick={openModal}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`mt-auto block w-full text-center px-6 py-4 rounded-full font-semibold transition-all ${
                        plan.popular
                          ? 'bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-dark'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                    >
                      Start Your Project
                    </motion.button>
                  </div>

                  {/* Corner decoration */}
                </div>

                {/* Card shadow/glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10`} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Compare link */}
        {showCompareLink && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center -mt-4 mb-12"
          >
            <a
              href="/pricing#compare"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
            >
              Compare all plans in detail
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </motion.div>
        )}

        {/* Maintenance explainer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-sm"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="font-mono text-xs font-semibold tracking-wider text-primary mb-3">
                // maintenance
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Why add monthly maintenance?
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                A website isn&apos;t finished at launch — software needs updating,
                content goes stale, and small changes always come up. Maintenance
                means your site stays fast, secure and current, and changes get
                done without hourly invoices or waiting in a queue.
              </p>
              <p className="text-gray-500 text-xs">
                Included in every Monthly Plan · optional add-on with Pay Upfront
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                'Security & software updates',
                'Backups & uptime monitoring',
                'Small content changes, done for you',
                'Priority help when something breaks',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2.5 bg-gray-50 rounded-xl px-4 py-3"
                >
                  <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-br from-gray-50 to-purple-50/30 rounded-3xl p-8 md:p-12 border border-gray-200"
        >
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">7-Day Delivery</h3>
              <p className="text-gray-600 text-sm">Guaranteed — or it's free</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">Quality Guarantee</h3>
              <p className="text-gray-600 text-sm">30 days free support and fixes</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">No Hidden Costs</h3>
              <p className="text-gray-600 text-sm">The price you see is the price you pay</p>
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">Not sure which plan is right for you?</p>
          <motion.button
            onClick={openModal}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition-colors"
          >
            Contact Us
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
