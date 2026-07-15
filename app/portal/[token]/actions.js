'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { UPLOADS_BUCKET } from '@/lib/portal'
import { notifyWhatsApp } from '@/lib/notify'

async function resolveItem(supabase, token, itemId) {
  const { data: project } = await supabase
    .from('webframe_projects')
    .select('id, name, portal_token')
    .eq('portal_token', token)
    .maybeSingle()
  if (!project) return {}
  const { data: item } = await supabase
    .from('webframe_content_items')
    .select('*')
    .eq('id', itemId)
    .eq('project_id', project.id)
    .maybeSingle()
  return { project, item }
}

const sanitize = (filename) =>
  filename.replace(/[^\w.\-()\s]/g, '_').slice(0, 120)

// Step 1 of an upload: hand the client a one-time signed URL that uploads
// straight to Supabase Storage (bypasses serverless body-size limits).
export async function requestUpload(token, itemId, filename) {
  const supabase = getSupabaseAdmin()
  if (!supabase) return { error: 'Uploads are not available right now.' }

  const { project, item } = await resolveItem(supabase, token, itemId)
  if (!project || !item) return { error: 'This link is no longer valid.' }

  const path = `${project.id}/${item.id}/${Date.now()}-${sanitize(filename)}`
  const { data, error } = await supabase.storage
    .from(UPLOADS_BUCKET)
    .createSignedUploadUrl(path)
  if (error) {
    console.error('Signed upload URL failed:', error)
    return { error: 'Could not start the upload — please try again.' }
  }
  return { url: data.signedUrl, path: data.path }
}

// Step 2: record the completed upload on the checklist item.
export async function confirmUpload(token, itemId, { path, name, size }) {
  const supabase = getSupabaseAdmin()
  if (!supabase) return { error: 'Uploads are not available right now.' }

  const { project, item } = await resolveItem(supabase, token, itemId)
  if (!project || !item) return { error: 'This link is no longer valid.' }
  if (typeof path !== 'string' || !path.startsWith(`${project.id}/${item.id}/`)) {
    return { error: 'Invalid upload reference.' }
  }

  const files = [
    ...(Array.isArray(item.files) ? item.files : []),
    { path, name: sanitize(String(name || 'file')), size: Number(size) || null },
  ]
  const { error } = await supabase
    .from('webframe_content_items')
    .update({ files, updated_at: new Date().toISOString() })
    .eq('id', item.id)
  if (error) {
    console.error('Upload confirm failed:', error)
    return { error: 'Upload could not be saved — please try again.' }
  }

  notifyWhatsApp(`📦 Content uploaded — ${project.name}: ${item.label} (${name})`)
  revalidatePath(`/portal/${token}`)
  return { ok: true }
}
