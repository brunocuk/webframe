'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function HowItWorksSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const steps = [
    {
      number: '01',
      title: 'Share Your Vision',
      description: 'Tell us about your business, goals, and design preferences. We\'ll understand your needs and propose the perfect approach.',
      icon: (
        <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M3 9H21M9 21V9" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      color: 'from-blue-500/20 to-cyan-500/20',
      features: ['Free consultation', 'Custom approach', 'Clear proposal']
    },
    {
      number: '02',
      title: 'Provide Your Content',
      description: 'Send us your text, images, logo, and all necessary information. We organise and optimise everything for you.',
      icon: (
        <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2V8H20M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: 'from-purple-500/20 to-pink-500/20',
      features: ['Simple process', 'Fast communication', 'Content guide']
    },
    {
      number: '03',
      title: 'We Build Custom',
      description: 'Our team creates your custom website, integrates content, optimises performance, and tests on all devices.',
      icon: (
        <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: 'from-orange-500/20 to-red-500/20',
      features: ['Professional development', 'SEO optimisation', 'Quality testing']
    },
    {
      number: '04',
      title: 'Launch Your Site',
      description: 'After your final approval, we launch your site and hand over everything you need to manage and maintain it.',
      icon: (
        <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: 'from-green-500/20 to-emerald-500/20',
      features: ['Hosting included', 'Management training', '30 days support']
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
    <section id="process" className="py-32 px-6 bg-gradient-to-br from-gray-50 via-white to-purple-50/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full"
          >
            <span className="text-sm font-semibold text-primary">How it works</span>
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Simple <span className="italic font-light bg-gradient-to-r from-primary to-purple-600 bg-clip-text pr-2 text-transparent">Process</span>
          </h2>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            4 clear steps from idea to launch. Transparent and efficient.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-8 mb-20"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative"
            >
              {/* Glassmorphic Card */}
              <div className="relative h-full">
                {/* Main card */}
                <div className={`relative bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl overflow-hidden h-full`}>
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Number & Icon */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <motion.div
                          className="text-primary"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          {step.icon}
                        </motion.div>
                        <div className="text-6xl font-black text-gray-100 group-hover:text-primary/20 transition-colors">
                          {step.number}
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-3xl font-bold mb-4 text-gray-900">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2">
                      {step.features.map((feature, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-2"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span className="text-sm text-gray-700 font-medium">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Corner decoration */}
                  <div className="absolute top-4 right-4 w-12 h-12 border-2 border-primary/20 rounded-full" />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-2 border-purple-500/20 rounded-full" />
                </div>

                {/* Card shadow/glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10`} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Timeline visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20 shadow-xl"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Your Timeline</h3>
            <div className="px-4 py-2 bg-primary/10 rounded-full">
              <span className="text-sm font-semibold text-primary">7 Days Total</span>
            </div>
          </div>

          {/* Timeline bar */}
          <div className="relative">
            {/* Background bar */}
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-primary via-purple-600 to-blue-500"
              />
            </div>

            {/* Timeline markers */}
            <div className="flex justify-between mt-4">
              {['Day 1', 'Day 3', 'Day 5', 'Day 7'].map((day, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.2 }}
                  className="text-center"
                >
                  <div className="text-sm font-semibold text-gray-900">{day}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {i === 0 && 'Kickoff'}
                    {i === 1 && 'Development'}
                    {i === 2 && 'Testing'}
                    {i === 3 && 'Launch'}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-6">Ready to start your project?</p>
          <motion.a
            href="#pricing"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-xl font-semibold text-lg hover:bg-gray-900 transition-colors shadow-lg"
          >
            View Pricing
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}