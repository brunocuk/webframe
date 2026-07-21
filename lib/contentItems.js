// Client-safe helpers for content checklist items (no Node imports) —
// shared by the portal cards, the portal server actions, the admin panel,
// and the follow-up cron so "done" means the same thing everywhere.

export const MAX_UPLOAD_MB = 50

export const isImageFile = (nameOrPath) =>
  /\.(png|jpe?g|gif|webp|avif|heic|heif)$/i.test(nameOrPath || '')

// An item counts as done when the client uploaded files, typed a note,
// or explicitly skipped an optional item.
export function isItemDone(item) {
  const files = Array.isArray(item.files) ? item.files : []
  if (files.length > 0) return true
  if (typeof item.note === 'string' && item.note.trim()) return true
  return Boolean(item.optional && item.skipped)
}

export function isContentComplete(items) {
  return items.length > 0 && items.every(isItemDone)
}
