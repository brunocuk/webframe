'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

// Fictional client used by the hero: an independent bike shop — at home in
// the NL/DK/UK/IE markets Webframe serves. Rendered as real DOM (not a
// screenshot) so the hero variants can build/reveal it piece by piece.
export const DEMO_SITE = {
  name: 'Northside Cycles',
  domain: 'northsidecycles.com',
  accent: '#0d5c44',
  pop: '#ff5a1f',
}

const SERIF = { fontFamily: 'Georgia, "Times New Roman", serif' }
const INK = '#151815'

function Reveal({ shown, placeholder, className, fromX = 0, fromY = 12, children }) {
  if (!shown && placeholder) {
    return (
      <div
        className={`${className} border-2 border-dashed border-gray-300/90 bg-gray-50/60 rounded-lg`}
        aria-hidden
      />
    )
  }
  return (
    <motion.div
      className={className}
      initial={false}
      animate={
        shown
          ? { opacity: 1, x: 0, y: 0, scale: 1 }
          : { opacity: 0, x: fromX, y: fromY, scale: 0.96 }
      }
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function MockSite({ show = {}, placeholders = false }) {
  const s = {
    nav: true,
    hero: true,
    cta: true,
    media: true,
    cards: true,
    underline: false,
    ...show,
  }
  const { accent, pop } = DEMO_SITE

  return (
    <div className="absolute inset-0 bg-[#faf9f6] p-5 xl:p-6 select-none">
      {/* Nav */}
      <Reveal shown={s.nav} className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          {/* Wheel mark */}
          <div className="w-4 h-4 rounded-full border-2 relative" style={{ borderColor: accent }}>
            <div className="absolute inset-[3.5px] rounded-full" style={{ backgroundColor: pop }} />
          </div>
          <span className="text-[11px] font-bold tracking-tight" style={{ color: INK }}>
            Northside Cycles
          </span>
        </div>
        <div className="flex items-center gap-3">
          {['Bikes', 'Repairs', 'About'].map((l) => (
            <span key={l} className="text-[9px] font-medium text-gray-500">
              {l}
            </span>
          ))}
          <span
            className="px-2.5 py-1 rounded-full text-[9px] font-semibold text-white"
            style={{ backgroundColor: accent }}
          >
            Book a service
          </span>
        </div>
      </Reveal>

      {/* Hero copy */}
      <Reveal shown={s.hero} className="mb-3.5">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[9px] tracking-tight" style={{ color: pop }}>
            ★★★★★
          </span>
          <span className="text-[8px] font-medium text-gray-500">
            4.9 · 1,200+ riders since 2011
          </span>
        </div>
        <h3 className="mb-2">
          <span
            className="block text-[21px] xl:text-[24px] font-bold uppercase leading-none tracking-tight"
            style={{ color: INK }}
          >
            Ride more,
          </span>
          <span
            className="block w-fit text-[23px] xl:text-[26px] leading-[1.05] italic relative"
            style={{ ...SERIF, color: INK }}
          >
            worry less.
            <svg
              className="absolute -bottom-1.5 left-0 w-full h-2"
              viewBox="0 0 100 8"
              preserveAspectRatio="none"
              aria-hidden
            >
              <motion.path
                d="M2 5 C 22 2, 55 7, 98 3"
                fill="none"
                stroke={pop}
                strokeWidth="3"
                strokeLinecap="round"
                initial={false}
                animate={{
                  pathLength: s.underline ? 1 : 0,
                  opacity: s.underline ? 1 : 0,
                }}
                transition={{ duration: 0.7, ease: 'easeInOut', delay: s.underline ? 0.5 : 0 }}
              />
            </svg>
          </span>
        </h3>
        <p className="text-[9.5px] leading-relaxed text-[#5b635c] max-w-[85%]">
          Independent shop &amp; workshop. Same-day repairs, honest advice, and
          city bikes built to last.
        </p>
      </Reveal>

      {/* CTAs */}
      <Reveal shown={s.cta} placeholder={placeholders} className="flex items-center gap-2.5 mb-4 h-8 w-[210px]" fromY={6}>
        <span
          className="px-3.5 py-2 rounded-full text-[10px] font-semibold text-white whitespace-nowrap"
          style={{ backgroundColor: accent }}
        >
          Book a service
        </span>
        <span className="text-[10px] font-semibold" style={{ color: INK }}>
          Browse bikes →
        </span>
      </Reveal>

      {/* Hero graphic — bike photo with a soft brand-green tint */}
      <Reveal
        shown={s.media}
        placeholder={placeholders}
        className="relative w-full h-28 xl:h-36 rounded-2xl overflow-hidden mb-3"
        fromX={36}
        fromY={-24}
      >
        <Image
          src="/images/northside-bike.webp"
          alt=""
          fill
          unoptimized
          className="object-cover"
          style={{ objectPosition: 'center 58%' }}
        />
        {/* Brand tint + soft light so the badges sit on-palette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(120deg, rgba(8,58,43,0.5) 0%, rgba(13,92,68,0.18) 55%, rgba(8,58,43,0.4) 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 15% 0%, rgba(255,255,255,0.1), transparent 55%)',
          }}
        />
        <div
          className="absolute bottom-2.5 left-2.5 px-2 py-1 bg-white/95 rounded-full text-[8px] font-semibold"
          style={{ color: accent }}
        >
          ⚡ Same-day repairs
        </div>
        <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded-full border border-white/30 text-[8px] font-medium text-white/90">
          E-bike specialists
        </div>
      </Reveal>

      {/* Service cards */}
      <Reveal shown={s.cards} className="grid grid-cols-3 gap-2 pt-1.5">
        {[
          { name: 'City bikes', price: 'from €649' },
          { name: 'Tune-up', price: '€39', hot: true },
          { name: 'E-bike check', price: '€59' },
        ].map(({ name, price, hot }) => (
          <div
            key={name}
            className={`relative rounded-xl px-2.5 py-2 ${
              hot ? 'text-white' : 'bg-white border border-[#e6e4dd] shadow-sm'
            }`}
            style={hot ? { backgroundColor: accent } : undefined}
          >
            {hot && (
              <span
                className="absolute -top-2 right-2 px-1.5 py-px rounded-full text-[7px] font-bold text-white"
                style={{ backgroundColor: pop }}
              >
                POPULAR
              </span>
            )}
            <div className="text-[9px] font-semibold" style={{ color: hot ? '#fff' : INK }}>
              {name}
            </div>
            <div
              className="text-[8px] font-medium"
              style={{ color: hot ? 'rgba(255,255,255,0.75)' : accent }}
            >
              {price}
            </div>
          </div>
        ))}
      </Reveal>
    </div>
  )
}

