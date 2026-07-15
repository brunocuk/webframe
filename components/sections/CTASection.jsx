'use client'

import { motion } from 'framer-motion'
import { useContactModal } from '@/components/ContactModalProvider'

export default function CTASection() {
  const { openModal } = useContactModal()
  const benefits = [
    { text: '7-day delivery' },
    { text: 'Custom-built websites' },
    { text: '100% satisfaction' },
    { text: 'Transparent pricing' },
  ]

  return (
    <section id="contact" className="relative py-28 md:py-36 flex items-center justify-center overflow-hidden bg-black">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(75, 43, 255, 0.22) 0%, rgba(139, 92, 246, 0.12) 50%, transparent 100%)',
          }}
          animate={{
            x: ['-15%', '0%', '-15%'],
            y: ['-8%', '8%', '-8%'],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 mb-10 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="font-mono text-sm text-white/80">
            yourbusiness.com — live in 7 days
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white"
        >
          You&apos;ve seen the work.
          <br />
          Let&apos;s build{' '}
          <span className="italic font-light text-primary-light">yours.</span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto"
        >
          Tell us about your business on a free 15-minute call —
          and be live within a week.
        </motion.p>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
            >
              <div className="px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 hover:border-white/20 transition-all hover:bg-white/10">
                <span className="text-white/90 text-sm font-medium">
                  {benefit.text}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <motion.button
            onClick={openModal}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black rounded-full font-semibold overflow-hidden"
          >
            <span className="relative z-10">Start Your Project</span>
            <motion.svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-10"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.3 }}
            >
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </motion.svg>

            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
          </motion.button>

          <motion.a
            href="mailto:hello@web-frame.eu"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-full font-semibold hover:bg-white/10 hover:border-white/20 transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.5 6.5L10 11.5L17.5 6.5M3.5 4.5H16.5C17.0523 4.5 17.5 4.94772 17.5 5.5V14.5C17.5 15.0523 17.0523 15.5 16.5 15.5H3.5C2.94772 15.5 2.5 15.0523 2.5 14.5V5.5C2.5 4.94772 2.94772 4.5 3.5 4.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Contact Us
          </motion.a>
        </motion.div>

        {/* Contact Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          {/* Email */}
          <motion.a
            href="mailto:hello@web-frame.eu"
            whileHover={{ y: -5 }}
            className="group relative bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:border-primary/50 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
            <div className="relative z-10">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 6.5L10 11.5L17.5 6.5M3.5 4.5H16.5C17.0523 4.5 17.5 4.94772 17.5 5.5V14.5C17.5 15.0523 17.0523 15.5 16.5 15.5H3.5C2.94772 15.5 2.5 15.0523 2.5 14.5V5.5C2.5 4.94772 2.94772 4.5 3.5 4.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">Email</h3>
              <p className="text-gray-400 text-sm">hello@web-frame.eu</p>
            </div>
          </motion.a>

          {/* Response Time */}
          <motion.div
            whileHover={{ y: -5 }}
            className="group relative bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:border-primary/50 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
            <div className="relative z-10">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 5V10L13 13M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">Response Time</h3>
              <p className="text-gray-400 text-sm">Within 24 hours</p>
            </div>
          </motion.div>

          {/* Location */}
          <motion.div
            whileHover={{ y: -5 }}
            className="group relative bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:border-primary/50 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
            <div className="relative z-10">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 2C6.13401 2 3 5.13401 3 9C3 13.5 10 18 10 18C10 18 17 13.5 17 9C17 5.13401 13.866 2 10 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 11C11.1046 11 12 10.1046 12 9C12 7.89543 11.1046 7 10 7C8.89543 7 8 7.89543 8 9C8 10.1046 8.89543 11 10 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">Serving</h3>
              <p className="text-gray-400 text-sm">NL, DK, IE & UK</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
