'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const navigation = [
    { label: 'Portfolio', href: '/#portfolio' },
    { label: 'Process', href: '/#process' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'FAQ', href: '/#faq' },
  ]

  const socials = [
    { 
      name: 'LinkedIn', 
      href: '#',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    { 
      name: 'Twitter', 
      href: '#',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
    { 
      name: 'Instagram', 
      href: '#',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
  ]

  return (
    <footer className="relative bg-black overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(75, 43, 255, 0.15) 0%, transparent 70%)',
          }}
          animate={{
            x: ['-10%', '10%', '-10%'],
            y: ['-10%', '10%', '-10%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
          }}
          animate={{
            x: ['10%', '-10%', '10%'],
            y: ['10%', '-10%', '10%'],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Main Content - Split Layout */}
        <div className="grid lg:grid-cols-2 gap-16 mb-16">
          {/* Left: Brand & CTA */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-white">Let's Build</span>
                <br />
                <span className="italic font-light bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text pr-2 text-transparent">
                  Something Great
                </span>
              </h3>

              <p className="text-gray-400 mb-8 text-lg max-w-md">
                Ready to transform your online presence? Let's start the conversation.
              </p>

              <motion.a
                href="/#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Let's Talk
                <motion.svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </motion.svg>
              </motion.a>
            </motion.div>
          </div>

          {/* Right: Navigation & Contact */}
          <div className="grid sm:grid-cols-2 gap-12">
            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">
                Navigation
              </h4>
              <ul className="space-y-4">
                {navigation.map((item, index) => (
                  <li key={index}>
                    <a 
                      href={item.href}
                      className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                    >
                      <motion.span
                        className="w-0 h-px bg-primary group-hover:w-4 transition-all duration-300"
                      />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">
                Contact
              </h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="mailto:hello@web-frame.eu"
                    className="text-gray-400 hover:text-white transition-colors block"
                  >
                    hello@web-frame.eu
                  </a>
                </li>
                <li className="text-gray-400">
                  Serving NL, DK, IE & UK
                </li>
              </ul>

              {/* Social Media */}
              <div className="flex gap-3 mt-8">
                {socials.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    whileHover={{ y: -3 }}
                    className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white flex items-center justify-center transition-all"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-8 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>© {currentYear}</span>
              <span className="text-white/20">•</span>
              <span className="font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Webframe
              </span>
              <span className="text-white/20">•</span>
              <span>Progmatiq vl. Bruno Čukić</span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm">
              <Link href="/privacy-policy" className="text-gray-500 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms-of-service" className="text-gray-500 hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/cookies-policy" className="text-gray-500 hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
