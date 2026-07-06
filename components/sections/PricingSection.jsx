'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'
import { useContactModal } from '@/components/ContactModalProvider'

export default function PricingSection() {
  const { openModal } = useContactModal()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [billingCycle, setBillingCycle] = useState('upfront') // 'upfront' or 'subscription'

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small businesses that need a simple web presence.',
      priceUpfront: '1,200',
      maintenanceFee: '49',
      priceSubscription: '149',
      color: 'from-blue-500/20 to-cyan-500/20',
      popular: false,
      features: [
        { text: '1-2 pages', included: true },
        { text: 'Mobile responsive', included: true },
        { text: 'Basic SEO', included: true },
        { text: 'Contact form', included: true },
        { text: 'Google Analytics', included: false },
        { text: 'Integrations', included: false },
        { text: 'Animations & transitions', included: false },
        { text: 'Content revisions (1 revision)', included: true },
        { text: 'Blog section', included: false },
      ]
    },
    {
      name: 'Business',
      description: 'Best value for money — ideal for growing businesses.',
      priceUpfront: '2,400',
      maintenanceFee: '79',
      priceSubscription: '299',
      color: 'from-purple-500/20 to-pink-500/20',
      popular: true,
      features: [
        { text: '3-5 pages', included: true },
        { text: 'Mobile responsive', included: true },
        { text: 'Advanced SEO', included: true },
        { text: 'Google Analytics', included: true },
        { text: 'Integrations (calendar, forms, CRM)', included: true },
        { text: 'Animations & transitions', included: true },
        { text: 'Content revisions (2 revisions)', included: true },
        { text: 'Blog section', included: false },
      ]
    },
    {
      name: 'Premium',
      description: 'Complete online presence for serious brands.',
      priceUpfront: '3,900',
      maintenanceFee: '99',
      priceSubscription: '449',
      color: 'from-orange-500/20 to-red-500/20',
      popular: false,
      features: [
        { text: '5-10 pages', included: true },
        { text: 'Advanced SEO', included: true },
        { text: 'Google Analytics', included: true },
        { text: 'Blog section', included: true },
        { text: 'Advanced integrations (API, systems, CRM)', included: true },
        { text: 'Animations & transitions', included: true },
        { text: 'Priority support', included: true },
        { text: '3 months free maintenance', included: true },
        { text: 'Content revisions (3 revisions)', included: true },
      ]
    }
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
    <section id="pricing" className="py-32 px-6 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full"
          >
            <span className="text-sm font-semibold text-primary">Transparent Pricing</span>
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Choose Your <span className="italic font-light bg-gradient-to-r from-primary to-purple-600 bg-clip-text pr-2 text-transparent">Plan</span>
          </h2>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            No hidden costs. No surprises. Just clean, simple pricing.
          </p>

          {/* Billing Toggle */}
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
          className="grid md:grid-cols-3 gap-8 mb-20"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -12, transition: { duration: 0.3 } }}
              className="group relative"
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-20">
                  <div className="px-4 py-1.5 bg-gradient-to-r from-primary to-purple-600 text-white rounded-full text-xs font-bold shadow-lg">
                    MOST POPULAR
                  </div>
                </div>
              )}

              {/* Card */}
              <div className={`relative h-full ${plan.popular ? 'md:scale-105' : ''}`}>
                {/* Main card */}
                <div className={`relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border-2 ${
                  plan.popular ? 'border-primary' : 'border-gray-200'
                } shadow-xl overflow-hidden h-full flex flex-col`}>
                  
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full">
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
                            + €{plan.maintenanceFee}/month maintenance
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
                    <div className="space-y-4 mb-8 flex-grow">
                      {plan.features.map((feature, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-start gap-3"
                        >
                          {feature.included ? (
                            <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          )}
                          <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400 line-through'}`}>
                            {feature.text}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <motion.button
                      onClick={openModal}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`block w-full text-center px-6 py-4 rounded-xl font-semibold transition-all ${
                        plan.popular
                          ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/30'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                    >
                      Start Your Project
                    </motion.button>
                  </div>

                  {/* Corner decoration */}
                  <div className="absolute top-4 right-4 w-16 h-16 border-2 border-gray-200 rounded-full opacity-50" />
                  <div className="absolute bottom-4 left-4 w-10 h-10 border-2 border-gray-200 rounded-full opacity-50" />
                </div>

                {/* Card shadow/glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10`} />
              </div>
            </motion.div>
          ))}
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
              <h3 className="text-lg font-bold mb-2 text-gray-900">Fast Delivery</h3>
              <p className="text-gray-600 text-sm">All websites delivered within 7 days</p>
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
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-4">Not sure which plan is right for you?</p>
          <motion.button
            onClick={openModal}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-xl font-semibold hover:bg-gray-900 hover:text-white transition-colors"
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
