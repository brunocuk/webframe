'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function PortfolioSection() {
  const sectionRef = useRef(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  const projects = [
    {
      id: 1,
      name: 'Studio One',
      slug: 'studio-one',
      description: 'Premium hair salon delivering beauty and confidence through expert styling and keratin treatments',
      category: 'Beauty & Wellness',
      bgImage: '/images/portfolio/studioonebynina.webp',
      primaryColor: 'from-amber-600 to-yellow-500',
    },
    {
      id: 2,
      name: 'Cheese Bar',
      slug: 'cheese-bar',
      description: 'Artisan cheese and Croatian wine bar in the heart of Zagreb',
      category: 'Food & Hospitality',
      bgImage: '/images/portfolio/cheesebar.webp',
      primaryColor: 'from-amber-500 to-orange-500',
    },
    {
      id: 3,
      name: 'Adriatic Padel',
      slug: 'adriatic-padel',
      description: 'Modern padel center bringing the fastest-growing sport to the Adriatic coast in Trogir',
      category: 'Sports & Recreation',
      bgImage: '/images/portfolio/adriaticpadelklub.webp',
      primaryColor: 'from-blue-500 to-cyan-500',
    },
    {
      id: 4,
      name: 'Habu',
      slug: 'habu',
      description: 'Premium serviced office spaces and coworking in the heart of Split',
      category: 'Business & Real Estate',
      bgImage: '/images/portfolio/habu.webp',
      primaryColor: 'from-slate-600 to-slate-800',
    },
    {
      id: 5,
      name: 'Četrnajstica',
      slug: 'cetrnajstica',
      description: 'Authentic Neapolitan pizza restaurant serving Zagreb\'s finest wood-fired pies',
      category: 'Food & Hospitality',
      bgImage: '/images/portfolio/cetrnajstica.webp',
      primaryColor: 'from-red-500 to-orange-500',
    },
    {
      id: 6,
      name: 'Matermag',
      slug: 'matermag',
      description: 'Digital magazine empowering modern mothers with lifestyle, health, and parenting content',
      category: 'Media & Publishing',
      bgImage: '/images/portfolio/matermag.webp',
      primaryColor: 'from-pink-500 to-rose-400',
    },
  ]

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Horizontal scroll with GSAP ScrollTrigger alternative
  useEffect(() => {
    if (isMobile) return

    const section = sectionRef.current
    if (!section) return

    const handleScroll = () => {
      const rect = section.getBoundingClientRect()
      const sectionHeight = section.offsetHeight
      const windowHeight = window.innerHeight
      
      // Calculate progress through the section
      if (rect.top <= 0 && rect.bottom >= windowHeight) {
        const progress = Math.abs(rect.top) / (sectionHeight - windowHeight)
        const clampedProgress = Math.max(0, Math.min(1, progress))
        
        // Move the horizontal container
        const container = section.querySelector('.horizontal-container')
        if (container) {
          const maxScroll = container.scrollWidth - window.innerWidth
          container.style.transform = `translateX(-${clampedProgress * maxScroll}px)`
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile])

  // Auto-slide on mobile (paused once the user swipes)
  const [userInteracted, setUserInteracted] = useState(false)
  const touchStartX = useRef(null)

  useEffect(() => {
    if (!isMobile || userInteracted) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % projects.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isMobile, userInteracted, projects.length])

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(delta) < 40) return
    setUserInteracted(true)
    setCurrentSlide((prev) =>
      delta < 0
        ? (prev + 1) % projects.length
        : (prev - 1 + projects.length) % projects.length
    )
  }

  // Calculate height needed for horizontal scroll
  const scrollHeight = `${300}vh` // 3x viewport height for smooth scroll

  return (
    <>
      {/* Desktop: Horizontal Scroll */}
      <div 
        ref={sectionRef}
        className="hidden md:block relative bg-black"
        style={{ height: scrollHeight }}
        id="portfolio"
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="horizontal-container flex h-full transition-transform duration-100 ease-linear will-change-transform">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="flex-shrink-0 h-full relative"
                style={{ width: '70vw' }}
              >
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                  <Image
                    src={project.bgImage}
                    alt={`${project.name} — ${project.category} website by Webframe`}
                    fill
                    sizes="70vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-black/15" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.primaryColor} opacity-10 mix-blend-overlay`} />
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-between p-12 lg:p-16">
                  {/* Top: Category */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                      <span className="text-sm font-medium text-white">
                        {project.category}
                      </span>
                    </div>
                  </motion.div>

                  {/* Center: Main Content */}
                  <div className="max-w-2xl">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <h3 className="text-7xl lg:text-8xl font-bold text-white mb-6">
                        {project.name}
                      </h3>
                      <p className="text-2xl text-gray-300 mb-8 leading-relaxed">
                        {project.description}
                      </p>

                      <Link href={`/portfolio/${project.slug}`}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
                        >
                          View Case Study
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="group-hover:translate-x-1 transition-transform"
                          >
                            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </motion.button>
                      </Link>
                    </motion.div>
                  </div>

                  {/* Bottom: Progress Indicator */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex items-center gap-4"
                  >
                    <span className="text-white/60 text-sm font-medium">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 h-0.5 bg-white/20 rounded-full overflow-hidden max-w-xs">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${project.primaryColor}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.6 }}
                      />
                    </div>
                    <span className="text-white/60 text-sm font-medium">
                      {String(projects.length).padStart(2, '0')}
                    </span>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: Auto-sliding Carousel */}
      <section className="block md:hidden py-20 px-6 bg-black">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="font-mono text-xs font-semibold tracking-wider mb-4 text-primary-light">
            {'// case studies'}
          </div>

          <h2 className="text-4xl font-bold text-white mb-4">
            Our Work
          </h2>

          <p className="text-gray-400">
            Swipe to browse
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div
            className="relative h-[500px] rounded-3xl overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                className="absolute inset-0"
                initial={{ opacity: 0, x: 100 }}
                animate={{
                  opacity: currentSlide === index ? 1 : 0,
                  x: currentSlide === index ? 0 : currentSlide > index ? -100 : 100,
                  scale: currentSlide === index ? 1 : 0.9,
                }}
                transition={{ duration: 0.5 }}
              >
                {/* Background */}
                <div className="absolute inset-0">
                  <Image
                    src={project.bgImage}
                    alt={`${project.name} — ${project.category} website by Webframe`}
                    fill
                    sizes="100vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-black/25" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.primaryColor} opacity-10 mix-blend-overlay`} />
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-between p-8">
                  <div className="inline-block self-start px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                    <span className="text-xs font-medium text-white">
                      {project.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-5xl font-bold text-white mb-4">
                      {project.name}
                    </h3>
                    <p className="text-lg text-gray-300 mb-6">
                      {project.description}
                    </p>

                    <Link
                      href={`/portfolio/${project.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-semibold"
                    >
                      View Case Study
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Slide indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {projects.map((project, index) => (
              <button
                key={project.id}
                onClick={() => {
                  setUserInteracted(true)
                  setCurrentSlide(index)
                }}
                aria-label={`Go to slide ${index + 1}: ${project.name}`}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === index ? 'w-6 bg-white' : 'w-2 bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
