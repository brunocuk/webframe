'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function TemplatePerfectForSection({ perfectFor, included }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left: Perfect For */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Perfect For
              </h2>
              <p className="text-xl text-gray-600">
                Ideal choice for these industries and use cases
              </p>
            </motion.div>

            <motion.div
              ref={ref}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="space-y-6"
            >
              {perfectFor.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  custom={index}
                  className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200"
                >
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right: What's Included */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                What You Get
              </h2>
              <p className="text-xl text-gray-600">
                Complete package for a successful online presence
              </p>
            </motion.div>

            {/* Pages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-8"
            >
              <h3 className="text-lg font-bold mb-4 text-gray-900">Pages</h3>
              <div className="flex flex-wrap gap-2">
                {included.pages.map((page, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
                  >
                    {page}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Sections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <h3 className="text-lg font-bold mb-4 text-gray-900">Sections</h3>
              <div className="space-y-2">
                {included.sections.map((section, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2"
                  >
                    <svg className="w-5 h-5 text-primary flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{section}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Technical */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-lg font-bold mb-4 text-gray-900">Technical Details</h3>
              <div className="space-y-2">
                {included.technical.map((tech, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2"
                  >
                    <svg className="w-5 h-5 text-primary flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{tech}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
