'use client'

import { useActionState } from 'react'
import { motion } from 'framer-motion'
import { login } from './actions'

// Branded gate for the /admin CRM — same editor-window device as the
// Start Your Project modal: unlock the file, see the leads.
export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(login, null)

  return (
    <main className="relative min-h-screen bg-black flex items-center justify-center px-6 overflow-hidden">
      {/* Ambient glow */}
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full blur-3xl pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(75, 43, 255, 0.22) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 100%)',
        }}
        animate={{ x: ['-12%', '10%', '-12%'], y: ['-10%', '8%', '-10%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 24, stiffness: 260 }}
        className="relative w-full max-w-sm"
      >
        <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          {/* Editor chrome */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-[#161221] border-b border-white/5">
            <div className="flex items-center gap-1.5" aria-hidden>
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>
            <span className="font-mono text-[11px] text-white/60">crm.access</span>
            <span className="font-mono text-[10px] flex items-center gap-1.5">
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400" />
              <span className="text-white/50">locked</span>
            </span>
          </div>

          {/* Body */}
          <div className="bg-[#0d0a14] px-8 py-10">
            <div className="font-mono text-xs font-semibold tracking-wider text-primary-light mb-3 text-center">
              // webframe crm
            </div>
            <h1 className="text-2xl font-bold text-white text-center mb-8">
              Admin access
            </h1>

            <motion.form
              action={formAction}
              animate={state?.error ? { x: [0, -10, 10, -6, 6, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              <input
                type="email"
                name="email"
                placeholder="you@web-frame.eu"
                autoFocus
                required
                autoComplete="username"
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border-2 border-white/10 text-white text-center placeholder:text-white/30 focus:border-primary focus:outline-none transition-colors"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border-2 border-white/10 text-white text-center placeholder:text-white/30 focus:border-primary focus:outline-none transition-colors"
              />

              {state?.error && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-center">
                  {state.error}
                </p>
              )}

              <motion.button
                type="submit"
                disabled={isPending}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/30 hover:bg-primary-dark disabled:opacity-50 transition-all"
              >
                {isPending ? 'Unlocking…' : 'Unlock'}
              </motion.button>
            </motion.form>
          </div>
        </div>

        <p className="font-mono text-[11px] text-white/30 text-center mt-5">
          webframe · internal
        </p>
      </motion.div>
    </main>
  )
}
