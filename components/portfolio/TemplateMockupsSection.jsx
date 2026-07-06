'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function TemplateMockupsSection({ mockups, name, color }) {
  if (!mockups || mockups.length === 0) return null

  return (
    <section className="py-32 px-6 bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Responsive on Every Device
          </h2>
          <p className="text-xl text-gray-600">
            Designed to look perfect on desktop, tablet, and mobile
          </p>
        </motion.div>

        {/* Mockups Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {mockups.map((mockup, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              {/* Mockup Card */}
              <div className={`relative rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-white ${
                mockup.type === 'mobile' ? 'max-w-[280px] mx-auto' : ''
              }`}>
                {/* Browser Chrome for desktop/interior */}
                {mockup.type !== 'mobile' && (
                  <div className="h-10 bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                  </div>
                )}

                {/* Phone notch for mobile */}
                {mockup.type === 'mobile' && (
                  <div className="h-8 bg-black flex items-center justify-center">
                    <div className="w-20 h-5 bg-black rounded-b-xl"></div>
                  </div>
                )}

                {/* Image */}
                <div className={`relative ${
                  mockup.type === 'mobile' ? 'aspect-[9/16]' : 'aspect-[4/3]'
                } bg-gray-100`}>
                  {mockup.image ? (
                    <Image
                      src={mockup.image}
                      alt={mockup.title}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${color || 'from-gray-200 to-gray-300'} opacity-30 flex items-center justify-center`}>
                      <span className="text-gray-400">{mockup.title}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Label */}
              <div className="text-center mt-4">
                <h3 className="font-semibold text-gray-900">{mockup.title}</h3>
                {mockup.description && (
                  <p className="text-sm text-gray-500 mt-1">{mockup.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
