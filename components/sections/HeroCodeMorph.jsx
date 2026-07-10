'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import HeroCopy from './HeroCopy'
import MockSite, { DEMO_SITE } from './MockSite'

const COLORS = {
  tag: '#a78bfa',
  attr: '#7dd3fc',
  str: '#fcd34d',
  kw: '#f472b6',
  punct: '#6b7280',
  text: '#e5e7eb',
}

// Each line: tokens as [text, colorKey]; `flag` unlocks a preview element when the line completes
const LINES = [
  { tokens: [['// northsidecycles.com', 'punct']] },
  { tokens: [['import', 'kw'], [' ui ', 'text'], ['from', 'kw'], [' ', 'text'], ["'@webframe/ui'", 'str']] },
  { tokens: [['export function', 'kw'], [' Site', 'attr'], ['() {', 'punct']] },
  { tokens: [['  return', 'kw'], [' (', 'punct']] },
  { flag: 'nav', tokens: [['    <Nav', 'tag'], [' brand=', 'attr'], ['"Northside"', 'str'], [' />', 'tag']] },
  { tokens: [['    <Rating', 'tag'], [' score=', 'attr'], ['{4.9}', 'punct'], [' />', 'tag']] },
  { tokens: [['    <Hero>', 'tag']] },
  { tokens: [['      <h1>', 'tag'], ['Ride more,', 'text'], ['</h1>', 'tag']] },
  { tokens: [['      <em>', 'tag'], ['worry less.', 'text'], ['</em>', 'tag']] },
  { flag: 'hero', tokens: [['    </Hero>', 'tag']] },
  { tokens: [['    <Button', 'tag'], [' theme=', 'attr'], ['"green"', 'str'], ['>', 'tag']] },
  { tokens: [['      Book a service', 'text']] },
  { flag: 'cta', tokens: [['    </Button>', 'tag']] },
  { tokens: [['    <Figure>', 'tag']] },
  { tokens: [['      <Wheel', 'tag'], [' hub=', 'attr'], ['"orange"', 'str'], [' />', 'tag']] },
  { tokens: [['      <Route', 'tag'], [' dashed', 'attr'], [' />', 'tag']] },
  { flag: 'media', tokens: [['    </Figure>', 'tag']] },
  { tokens: [['    <Services', 'tag'], [' cols=', 'attr'], ['{3}', 'punct'], ['>', 'tag']] },
  { tokens: [['      {services.map(Card)}', 'text']] },
  { flag: 'cards', tokens: [['    </Services>', 'tag']] },
  { tokens: [['  )', 'punct']] },
  { flag: 'live', tokens: [['}', 'punct']] },
]

const lineLength = (line) => line.tokens.reduce((n, [t]) => n + t.length, 0)

function EditorLine({ line, chars }) {
  let remaining = chars
  return (
    <>
      {line.tokens.map(([text, color], i) => {
        if (remaining <= 0) return null
        const slice = text.slice(0, remaining)
        remaining -= text.length
        return (
          <span key={i} style={{ color: COLORS[color] }}>
            {slice}
          </span>
        )
      })}
    </>
  )
}

// Production hero — code-to-site morph: an editor types a client site into
// existence, pane by pane, ending on a deployed domain.
export default function HeroCodeMorph() {
  const prefersReduced = useReducedMotion()
  const [cycle, setCycle] = useState(0)
  const [pos, setPos] = useState({ line: 0, char: 0 })

  const totalLines = LINES.length
  const done = pos.line >= totalLines

  useEffect(() => {
    if (prefersReduced) return
    let timer
    if (done) {
      timer = setTimeout(() => {
        setPos({ line: 0, char: 0 })
        setCycle((c) => c + 1)
      }, 4200)
      return () => clearTimeout(timer)
    }
    const tick = () => {
      if (document.hidden) {
        timer = setTimeout(tick, 1000)
        return
      }
      setPos((p) => {
        const len = lineLength(LINES[p.line])
        if (p.char < len) return { ...p, char: p.char + 1 }
        return { line: p.line + 1, char: 0 }
      })
      timer = setTimeout(tick, 13)
    }
    timer = setTimeout(tick, 13)
    return () => clearTimeout(timer)
  }, [done, cycle, prefersReduced])

  // Reduced motion: show everything, fully typed
  const line = prefersReduced ? totalLines : pos.line
  const flagOn = useMemo(() => {
    const on = {}
    LINES.forEach((l, i) => {
      if (l.flag) on[l.flag] = i < line
    })
    return on
  }, [line])

  const live = !!flagOn.live
  const show = {
    nav: !!flagOn.nav,
    hero: !!flagOn.hero,
    cta: !!flagOn.cta,
    media: !!flagOn.media,
    cards: !!flagOn.cards,
    underline: live, // final flourish once the site is live
  }

  return (
    <section className="relative min-h-screen flex items-center px-6 pt-32 pb-20 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Split window: editor → live preview */}
      <div className="absolute right-6 xl:right-12 top-1/2 -translate-y-1/2 w-[500px] xl:w-[640px] hidden lg:block">
        <div className="absolute -inset-10 bg-primary/10 blur-3xl rounded-full -z-10" />

        <div className="relative bg-white rounded-2xl border border-gray-200/80 shadow-2xl shadow-gray-900/10 overflow-hidden">
          {/* Window chrome */}
          <div className="relative h-10 bg-gray-50 border-b border-gray-100 flex items-center px-3.5 gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
            </div>
            <span className="ml-1 px-2.5 py-1 bg-white border border-gray-200 rounded-md text-[10px] font-mono font-medium text-gray-600">
              northside-cycles.jsx
            </span>
            <span className="flex-1" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={live ? 'live' : 'building'}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className={`text-[10px] font-mono font-semibold whitespace-nowrap ${live ? 'text-green-600' : 'text-gray-400'}`}
              >
                {live ? `✓ live on ${DEMO_SITE.domain}` : '▸ building…'}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="flex h-[440px] xl:h-[480px]">
            {/* Editor pane */}
            <div className="w-[42%] bg-[#17141f] px-3 py-4 font-mono text-[9px] xl:text-[10px] leading-[1.9] overflow-hidden">
              {LINES.slice(0, Math.min(line + 1, totalLines)).map((l, i) => (
                <div key={`${cycle}-${i}`} className="flex whitespace-pre">
                  <span className="w-5 shrink-0 text-right pr-2 text-gray-600 select-none">
                    {i + 1}
                  </span>
                  <span>
                    {i < line ? (
                      <EditorLine line={l} chars={lineLength(l)} />
                    ) : (
                      <>
                        <EditorLine line={l} chars={pos.char} />
                        <span className="inline-block w-[6px] h-[11px] ml-px translate-y-[2px] bg-primary-light animate-pulse" />
                      </>
                    )}
                  </span>
                </div>
              ))}
            </div>

            {/* Live preview pane */}
            <div className="relative flex-1 bg-[#f7f7f3]">
              <MockSite show={show} />
              {!show.nav && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-mono text-gray-400">
                    preview
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs font-medium text-gray-400">
          Hand-coded, line by line — no templates, no page builders.
        </p>
      </div>

      {/* Copy — pointer-events-none so the empty right half doesn't block the window */}
      <div className="relative z-10 max-w-7xl mx-auto w-full pointer-events-none">
        <div className="max-w-3xl pointer-events-auto">
          <HeroCopy />
        </div>
      </div>
    </section>
  )
}
