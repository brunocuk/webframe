// Client-safe project stage constants (no Node imports) — shared by the
// portal timeline, the admin ProjectPanel, and server code via lib/portal.js.
export const PROJECT_STAGES = [
  { value: 'content', label: 'Content in', description: 'Send us your text, images and logo.' },
  { value: 'build', label: 'We build', description: 'Design and code, written for your business.' },
  { value: 'review', label: 'Your review', description: 'Preview link — tell us what to tweak.' },
  { value: 'live', label: 'Live', description: 'On your domain, with 30 days of free support.' },
]
