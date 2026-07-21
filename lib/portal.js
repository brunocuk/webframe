import crypto from 'crypto'
import { PROJECT_STAGES } from './projectStages'

export { PROJECT_STAGES }

export const DEFAULT_CHECKLIST = [
  { label: 'Logo & brand assets', optional: false },
  { label: 'Text for your pages', optional: false },
  { label: 'Images & photos', optional: false },
  { label: 'Anything else (optional)', optional: true },
]

// Per-item guidance shown on the portal upload cards, keyed by checklist
// label. Items without an entry (custom labels) simply render without tips.
export const CONTENT_GUIDE = {
  'Logo & brand assets': {
    hint: 'Your logo, plus brand colours or fonts if you have them.',
    tips: [
      'SVG or high-resolution PNG is ideal — but any format works',
      'No digital file? A sharp photo of a business card or sign is fine',
      'Brand colours or fonts? A note or screenshot is enough',
    ],
  },
  'Text for your pages': {
    hint: 'The words for your site — rough notes are fine, we polish.',
    tips: [
      'A Word doc, PDF or plain text file — whatever you write in',
      'Cover the basics: what you do, who it’s for, how to reach you',
      'Bullet points beat blank pages — don’t aim for perfect prose',
    ],
  },
  'Images & photos': {
    hint: 'Photos of your work, team, space or products.',
    tips: [
      'Send originals straight from your phone or camera — don’t resize',
      '5–10 good photos beat 50 average ones',
      'Short on photos? Tell us — we can fill gaps with quality stock',
    ],
  },
  'Anything else (optional)': {
    hint: 'Anything that helps us get your business right.',
    tips: [
      'Links to websites you like (pasted into a text file is fine)',
      'Price lists, menus, certificates, testimonials',
      'Nothing extra? Skip this one — it’s optional',
    ],
  },
}

export const UPLOADS_BUCKET = 'webframe-uploads'

export function siteUrl() {
  return process.env.SITE_URL || 'https://www.web-frame.eu'
}

export function portalUrl(token) {
  return `${siteUrl()}/portal/${token}`
}

// Creates a project (magic token + default checklist) for a lead.
// Returns the existing project instead if one is already attached.
export async function ensureProjectForLead(supabase, lead, quoteId = null) {
  const { data: existing } = await supabase
    .from('webframe_projects')
    .select('*')
    .eq('lead_id', lead.id)
    .maybeSingle()
  if (existing) return { project: existing, created: false }

  const token = crypto.randomBytes(24).toString('base64url')
  const { data: project, error } = await supabase
    .from('webframe_projects')
    .insert({
      lead_id: lead.id,
      quote_id: quoteId,
      name: lead.business || lead.name || lead.email,
      portal_token: token,
    })
    .select()
    .single()
  if (error) throw new Error(`Project creation failed: ${error.message}`)

  const { error: itemsError } = await supabase.from('webframe_content_items').insert(
    DEFAULT_CHECKLIST.map(({ label, optional }) => ({
      project_id: project.id,
      label,
      optional,
    }))
  )
  if (itemsError) throw new Error(`Checklist creation failed: ${itemsError.message}`)

  return { project, created: true }
}
