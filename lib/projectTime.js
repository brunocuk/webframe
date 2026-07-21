// Client-safe build/support window math (no Node imports) — shared by the
// portal overview, the admin clients dashboard, and the follow-up cron.

export const BUILD_DAYS = 7
export const SUPPORT_DAYS = 30

const DAY_MS = 24 * 60 * 60 * 1000

// 7-day build deadline, counted from the moment content was complete.
export function buildDeadline(project) {
  if (!project?.content_completed_at) return null
  return new Date(new Date(project.content_completed_at).getTime() + BUILD_DAYS * DAY_MS)
}

// End of the 30-day free support window after going live.
export function supportEnds(project) {
  if (!project?.live_at) return null
  return new Date(new Date(project.live_at).getTime() + SUPPORT_DAYS * DAY_MS)
}

export function formatDateLong(date) {
  return new Date(date).toLocaleDateString('en-IE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function formatDateShort(date) {
  return new Date(date).toLocaleDateString('en-IE', { day: 'numeric', month: 'short' })
}

// "3d 14h" / "5h 12m" / "-8h" style remaining-time label.
export function timeLeftLabel(deadline, now = Date.now()) {
  const ms = new Date(deadline).getTime() - now
  const abs = Math.abs(ms)
  const days = Math.floor(abs / DAY_MS)
  const hours = Math.floor((abs % DAY_MS) / (60 * 60 * 1000))
  const minutes = Math.floor((abs % (60 * 60 * 1000)) / (60 * 1000))
  const label = days > 0 ? `${days}d ${hours}h` : hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  return ms < 0 ? `${label} over` : `${label} left`
}
