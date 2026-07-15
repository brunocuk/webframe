import crypto from 'crypto'
import { PROJECT_STAGES } from './projectStages'

export { PROJECT_STAGES }

export const DEFAULT_CHECKLIST = [
  'Logo & brand assets',
  'Text for your pages',
  'Images & photos',
  'Anything else (optional)',
]

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
    DEFAULT_CHECKLIST.map((label) => ({ project_id: project.id, label }))
  )
  if (itemsError) throw new Error(`Checklist creation failed: ${itemsError.message}`)

  return { project, created: true }
}
