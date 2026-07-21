'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { requestLoginCode, verifyLoginCode } from './actions'

export default function LoginForm() {
  const router = useRouter()
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const handleEmail = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const result = await requestLoginCode(email)
    setBusy(false)
    if (result.error) return setError(result.error)
    setStep('code')
  }

  const handleCode = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const result = await verifyLoginCode(email, code)
    if (result.error) {
      setBusy(false)
      return setError(result.error)
    }
    router.push(`/portal/${result.token}`)
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
      {step === 'email' ? (
        <form onSubmit={handleEmail}>
          <h1 className="text-xl font-bold text-gray-900 mb-1">Log in</h1>
          <p className="text-sm text-gray-600 mb-5">
            Enter the email you used with us and we&apos;ll send you a 6-digit
            code. No password needed.
          </p>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Email
          </label>
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@yourbusiness.com"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/40 mb-4"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full py-2.5 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {busy ? 'Sending…' : 'Email me a code'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleCode}>
          <h1 className="text-xl font-bold text-gray-900 mb-1">Check your email</h1>
          <p className="text-sm text-gray-600 mb-5">
            If <strong className="text-gray-900">{email}</strong> has a portal,
            a 6-digit code is on its way. It expires in 10 minutes.
          </p>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Code
          </label>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="123456"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-center font-mono text-xl tracking-[0.4em] text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/40 mb-4"
          />
          <button
            type="submit"
            disabled={busy || code.length !== 6}
            className="w-full py-2.5 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {busy ? 'Checking…' : 'Open my portal'}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep('email')
              setCode('')
              setError(null)
            }}
            className="w-full mt-3 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
          >
            Use a different email
          </button>
        </form>
      )}
      {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
    </div>
  )
}
