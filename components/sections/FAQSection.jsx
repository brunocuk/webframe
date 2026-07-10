'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import SectionHeader from './SectionHeader'

export default function FAQSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: '0px 0px -60px 0px',
  })

  const [openIndex, setOpenIndex] = useState(0) // First item open by default

  const faqs = [
    {
      question: 'How long does it take to build my website?',
      answer: 'All websites are delivered within 7 days after we receive your content (text, images, logo). This timeline is guaranteed for all packages.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      question: 'What if I need e-commerce functionality?',
      answer: 'Webframe focuses on modern presentation websites and does not include webshop functionality. For e-commerce projects, we offer custom solutions through our development team.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      question: 'Can I upgrade my package later?',
      answer: 'Yes. You can upgrade your package at any time — add pages, features, or integrations. You only pay the difference between packages.',
      color: 'from-orange-500 to-red-500',
    },
    {
      question: 'Are the websites mobile responsive?',
      answer: 'Absolutely. Every website is optimised for mobile, tablet, and desktop devices. We test all key screen sizes to ensure a seamless user experience.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      question: 'What\'s the difference between Pay Upfront and Monthly Plan?',
      answer: 'Pay Upfront: You own the website outright with a one-time payment, plus an optional monthly maintenance fee for ongoing support. Monthly Plan: Lower initial commitment with a 12-month minimum subscription that includes everything.',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      question: 'Can I edit the content myself after launch?',
      answer: 'Yes. On the Business package you publish blog posts yourself through a simple editor, and on Premium you edit all of your site\'s content through a custom CMS. For anything beyond that, use the maintenance package or request a one-off change.',
      color: 'from-pink-500 to-rose-500',
    },
    {
      question: 'What if I\'m not satisfied?',
      answer: 'All packages include revisions. If you\'re still not satisfied after revisions, we offer a 100% refund within the first 14 days of the project.',
      color: 'from-amber-500 to-orange-500',
    },
    {
      question: 'Do I need to have content ready before we start?',
      answer: 'It\'s helpful to have basic content, but not required. You\'ll receive a content preparation guide, and we can write copy for an additional fee if needed.',
      color: 'from-teal-500 to-cyan-500',
    },
  ];
  

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <section id="faq" className="py-20 px-6 bg-gradient-to-br from-gray-50 via-white to-purple-50/30 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <SectionHeader
          eyebrow="// faq"
          title="Questions, answered."
          sub="The most common questions about our services, process, and pricing."
        />

        {/* FAQ Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="space-y-4"
          >
            {faqs.slice(0, 4).map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                index={index}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                variants={itemVariants}
              />
            ))}
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="space-y-4"
          >
            {faqs.slice(4).map((faq, index) => (
              <FAQItem
                key={index + 4}
                faq={faq}
                index={index + 4}
                isOpen={openIndex === index + 4}
                onClick={() => setOpenIndex(openIndex === index + 4 ? -1 : index + 4)}
                variants={itemVariants}
              />
            ))}
          </motion.div>
        </div>

        {/* Still have questions CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12"
        >
          <div className="relative bg-gray-900 rounded-3xl p-12 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 text-center text-white">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Still have questions?
              </h3>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Our team is here to answer all your questions and help you choose the right package for your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-xl"
                >
                  Contact Us
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.a>
                <motion.a
                  href="mailto:hello@web-frame.eu"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-full font-semibold hover:bg-white/20 transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5 6.5L10 11.5L17.5 6.5M3.5 4.5H16.5C17.0523 4.5 17.5 4.94772 17.5 5.5V14.5C17.5 15.0523 17.0523 15.5 16.5 15.5H3.5C2.94772 15.5 2.5 15.0523 2.5 14.5V5.5C2.5 4.94772 2.94772 4.5 3.5 4.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Send Email
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// FAQ Item Component
function FAQItem({ faq, index, isOpen, onClick, variants }) {
  return (
    <motion.div
      variants={variants}
      className="group"
    >
      <motion.button
        onClick={onClick}
        className="w-full text-left relative"
      >
        {/* Card */}
        <div className={`relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 transition-all duration-300 ${
          isOpen
            ? 'border-primary shadow-xl shadow-primary/10'
            : 'border-gray-200 hover:border-gray-300'
        }`}>

          {/* Accent line */}
          <div className={`absolute top-0 left-0 h-full w-1 rounded-l-2xl bg-primary transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`} />
          
          {/* Content */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className={`text-lg font-bold transition-colors duration-300 ${
                isOpen ? 'text-primary' : 'text-gray-900'
              }`}>
                {faq.question}
              </h3>
            </div>
            
            {/* Animated Icon */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              isOpen
                ? 'bg-primary text-white rotate-180'
                : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
            }`}>
              <motion.svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </motion.svg>
            </div>
          </div>

          {/* Answer */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <motion.p
                  initial={{ y: -10 }}
                  animate={{ y: 0 }}
                  exit={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 text-gray-600 leading-relaxed pl-4 border-l-2 border-gray-200"
                >
                  {faq.answer}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.button>
    </motion.div>
  )
}
