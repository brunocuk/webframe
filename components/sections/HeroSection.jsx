'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { useContactModal } from '../ContactModalProvider'

export default function HeroSection() {
  const { openModal } = useContactModal()
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const sectionRef = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  })
  
  const cardsY = useTransform(scrollYProgress, [0, 1], [0, 150])

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      setMousePosition({ x, y })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Portfolio cards data
  const projects = [
    {
      id: 1,
      name: 'Tech',
      color: 'from-blue-500/20 to-cyan-500/20',
      position: { x: 100, y: -50, rotate: -8 }
    },
    {
      id: 2,
      name: 'Business',
      color: 'from-indigo-500/20 to-purple-500/20',
      position: { x: 50, y: 0, rotate: 4 }
    },
    {
      id: 3,
      name: 'Creative',
      color: 'from-pink-500/20 to-rose-500/20',
      position: { x: 150, y: 50, rotate: -6 }
    },
  ]

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center px-6 pt-32 pb-20 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      {/* Subtle grid */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Glassmorphic Cards Stack */}
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none hidden lg:block"
        style={{ y: cardsY }}
      >
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className="absolute w-[400px] h-[500px]"
            initial={{
              x: project.position.x,
              y: project.position.y,
              rotate: project.position.rotate,
              opacity: 0,
              scale: 0.8
            }}
            animate={{
              x: project.position.x + (mousePosition.x - 50) * (0.02 * (index + 1)),
              y: project.position.y + (mousePosition.y - 50) * (0.02 * (index + 1)),
              rotate: project.position.rotate,
              opacity: 1,
              scale: 1
            }}
            transition={{
              x: { type: 'spring', stiffness: 50, damping: 30 },
              y: { type: 'spring', stiffness: 50, damping: 30 },
              opacity: { duration: 0.8, delay: 0.5 + index * 0.2 },
              scale: { duration: 0.8, delay: 0.5 + index * 0.2 }
            }}
            whileHover={{
              scale: 1.05,
              rotate: 0,
              z: 50,
              transition: { duration: 0.3 }
            }}
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Card */}
            <div className="w-full h-full relative group cursor-pointer">
              {/* Glass effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.color} backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden`}>
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Mock browser chrome */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-white/10 backdrop-blur-sm border-b border-white/10 flex items-center px-4 gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400/60" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400/60" />
                  <div className="w-2 h-2 rounded-full bg-green-400/60" />
                </div>

                {/* Mock content */}
                <div className="absolute top-12 left-6 right-6 space-y-3">
                  {/* Header bar */}
                  <div className="h-3 bg-white/30 rounded-full w-1/2" />

                  {/* Content blocks */}
                  <div className="space-y-2 mt-6">
                    <div className="h-2 bg-white/20 rounded-full w-full" />
                    <div className="h-2 bg-white/20 rounded-full w-4/5" />
                    <div className="h-2 bg-white/20 rounded-full w-3/5" />
                  </div>

                  {/* Image placeholder */}
                  <div className="mt-6 h-32 bg-white/20 rounded-2xl" />

                  {/* More content */}
                  <div className="space-y-2 mt-4">
                    <div className="h-2 bg-white/20 rounded-full w-full" />
                    <div className="h-2 bg-white/20 rounded-full w-5/6" />
                  </div>
                </div>

                {/* Badge */}
                <div className="absolute bottom-6 left-6">
                  <div className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-900">
                    {project.name}
                  </div>
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.color.replace('/20', '/40')} blur-2xl`} />
                </div>
              </div>

              {/* Shadow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 blur-3xl -z-10 opacity-50 group-hover:opacity-80 transition-opacity" />
            </div>
          </motion.div>
        ))}

        {/* Ambient light orbs */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-white/60 backdrop-blur-sm border border-primary/20 rounded-full"
          >
            <span className="px-2 py-0.5 bg-primary text-white text-xs font-bold rounded-full">
              Custom
            </span>
            <span className="text-sm font-medium text-gray-700">
              Built for Your Business
            </span>
          </motion.div>

          {/* Subheadline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg font-medium text-gray-600 mb-6"
          >
            From vision to launch
          </motion.div>

          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[0.9] tracking-tight"
          >
            Your Custom Website.
            <br />
            <span className="italic font-light bg-gradient-to-r from-primary via-purple-600 to-blue-500 bg-clip-text text-transparent">
              In 7 Days.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl leading-relaxed"
          >
            Tell us your vision, we build it custom.
            Professional. Fast. Tailored to you.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              {/* Primary CTA - Book Call */}
              <motion.button
                onClick={openModal}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center gap-3 px-4 py-3 bg-white rounded-full border-2 border-gray-200 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                  <div className="w-full h-full bg-gradient-to-br from-primary to-purple-600" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-bold text-gray-900">Book a free call</div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span>Available today</span>
                  </div>
                </div>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-400 group-hover:text-primary transition-colors"
                >
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>

              {/* Secondary CTA - View Portfolio */}
              <motion.a
                href="#portfolio"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition-all"
              >
                View Our Work
              </motion.a>
            </motion.div>

          {/* Guarantees - Social Proof Alternative */}
          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 items-start"
            >
              {/* Guarantee 1 */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-primary" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">7-Day Delivery</p>
                  <p className="text-xs text-gray-600">Guaranteed or free</p>
                </div>
              </div>

              {/* Guarantee 2 */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-primary" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Your Website</p>
                  <p className="text-xs text-gray-600">Full control & flexibility</p>
                </div>
              </div>

              {/* Guarantee 3 */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-primary" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.364 5.636L16.95 7.05C17.6262 8.02485 18.0014 9.18736 18.0253 10.3838C18.0491 11.5803 17.7205 12.7579 17.082 13.7618C16.4436 14.7657 15.5253 15.5503 14.4413 16.0141C13.3573 16.4779 12.1583 16.5997 11.0028 16.3644C9.84735 16.1292 8.78711 15.5473 7.96243 14.6948C7.13774 13.8423 6.58915 12.7598 6.38859 11.5974C6.18804 10.435 6.34411 9.24064 6.83853 8.17117C7.33295 7.10169 8.14409 6.20844 9.164 5.607L10.586 7.029C9.94813 7.47048 9.44623 8.08616 9.13836 8.80091C8.83049 9.51567 8.72968 10.3001 8.84786 11.0672C8.96604 11.8343 9.29844 12.5533 9.80638 13.1416C10.3143 13.7299 10.9778 14.1634 11.7192 14.3918C12.4606 14.6202 13.2503 14.6343 13.9991 14.4325C14.748 14.2306 15.4262 13.8211 15.9551 13.2511C16.4839 12.6811 16.8422 11.9739 16.9889 11.2113C17.1356 10.4487 17.0652 9.66064 16.786 8.936L18.364 5.636Z" fill="currentColor"/>
                    <path d="M12 2V6M12 2L10 4M12 2L14 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">30-Day Support</p>
                  <p className="text-xs text-gray-600">Free revisions included</p>
                </div>
              </div>
            </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-gray-400 font-medium">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-gray-300 rounded-full flex items-start justify-center p-2"
        >
          <motion.div 
            className="w-1.5 h-1.5 bg-gray-400 rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>

      {/* Floating CTA */}
      <motion.button
        onClick={openModal}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        whileHover={{ scale: 1.05 }}
        className="fixed bottom-8 right-8 z-40 hidden lg:flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-xl shadow-xl shadow-primary/10 rounded-full font-semibold text-sm border border-gray-200 hover:border-primary/50 transition-all cursor-pointer"
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Start Your Project
      </motion.button>
    </section>
  )
}
