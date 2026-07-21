'use client'

import { useEffect, useState } from 'react'
import { timeLeftLabel } from '@/lib/projectTime'

// Live-updating time-left badge. Renders a static placeholder until mounted
// so the server and client markup can't disagree.
export default function Countdown({ deadline, className = '' }) {
  const [now, setNow] = useState(null)

  useEffect(() => {
    setNow(Date.now())
    const timer = setInterval(() => setNow(Date.now()), 30 * 1000)
    return () => clearInterval(timer)
  }, [])

  if (!deadline) return null
  if (!now) return <span className={className}>…</span>

  const ms = new Date(deadline).getTime() - now
  const tone =
    ms < 0
      ? 'text-red-600'
      : ms < 2 * 24 * 60 * 60 * 1000
        ? 'text-amber-600'
        : 'text-green-600'

  return (
    <span className={`${tone} ${className}`}>{timeLeftLabel(deadline, now)}</span>
  )
}
