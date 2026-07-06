'use client'

import { motion } from 'framer-motion'

export default function PortfolioCTASection({ projectName, color }) {
  return (
    <section className="py-32 px-6 bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Ready to build something{' '}
            <span className={`italic font-light bg-gradient-to-r ${color} bg-clip-text pr-2 text-transparent`}>
              like this?
            </span>
          </h2>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Choose your package and start your project. Your website can be online in 7 days.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <motion.a
              href="/#pricing"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-black text-white rounded-xl font-semibold text-lg hover:bg-gray-900 transition-colors shadow-lg"
            >
              Start Your Project
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.a>

            <motion.a
              href="/#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-xl font-semibold text-lg hover:bg-gray-900 hover:text-white transition-all"
            >
              Book a Call
            </motion.a>
          </div>

          {/* Guarantees */}
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-6 bg-white rounded-2xl border border-gray-200"
            >
              <div className="text-3xl mb-3">⚡</div>
              <div className="font-semibold text-gray-900 mb-1">7-Day Delivery</div>
              <div className="text-sm text-gray-600">Guaranteed speed</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-6 bg-white rounded-2xl border border-gray-200"
            >
              <div className="text-3xl mb-3">✓</div>
              <div className="font-semibold text-gray-900 mb-1">30-Day Support</div>
              <div className="text-sm text-gray-600">Free fixes included</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="p-6 bg-white rounded-2xl border border-gray-200"
            >
              <div className="text-3xl mb-3">€</div>
              <div className="font-semibold text-gray-900 mb-1">Fixed Price</div>
              <div className="text-sm text-gray-600">No hidden costs</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
