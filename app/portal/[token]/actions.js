'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { UPLOADS_BUCKET } from '@/lib/portal'
import { MAX_UPLOAD_MB, isContentComplete } from '@/lib/contentItems'
import { notifyWhatsApp } from '@/lib/notify'

const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024
const MAX_NOTE_LENGTH = 10000

async function resolveItem(supabase, token, itemId) {
  const { data: project } = await supabase
    .from('webframe_projects')
    .select('id, name, portal_token, stage, content_completed_at')
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

// Once every checklist item is done (files, note, or skipped), flip the
// project into the build stage exactly once and start the 7-day clock.
async function maybeCompleteContent(supabase, project) {
  if (project.stage !== 'content' || project.content_completed_at) return
  const { data: items } = await supabase
    .from('webframe_content_items')
    .select('*')
    .eq('project_id', project.id)
  if (!isContentComplete(items || [])) return

  const { error } = await supabase
    .from('webframe_projects')
    .update({ stage: 'build', content_completed_at: new Date().toISOString() })
    .eq('id', project.id)
    .eq('stage', 'content')
  if (error) {
    console.error('Content completion update failed:', error)
    return
  }
  notifyWhatsApp(`✅ Content complete — ${project.name}. The 7-day clock starts now.`)
}

// Step 1 of an upload: hand the client a one-time signed URL that uploads
// straight to Supabase Storage (bypasses serverless body-size limits).
export async function requestUpload(token, itemId, filename, size) {
  const supabase = getSupabaseAdmin()
  if (!supabase) return { error: 'Uploads are not available right now.' }

  if (Number(size) > MAX_UPLOAD_BYTES) {
    return {
      error: `Files up to ${MAX_UPLOAD_MB} MB only — for video or other big files, paste a WeTransfer or Drive link in a note instead.`,
    }
  }

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
  await maybeCompleteContent(supabase, project)
  revalidatePath(`/portal/${token}`, 'layout')
  return { ok: true }
}

// Remove a previously uploaded file from the checklist item and storage.
export async function removeUpload(token, itemId, path) {
  const supabase = getSupabaseAdmin()
  if (!supabase) return { error: 'Uploads are not available right now.' }

  const { project, item } = await resolveItem(supabase, token, itemId)
  if (!project || !item) return { error: 'This link is no longer valid.' }
  if (typeof path !== 'string' || !path.startsWith(`${project.id}/${item.id}/`)) {
    return { error: 'Invalid file reference.' }
  }

  const existing = Array.isArray(item.files) ? item.files : []
  const files = existing.filter((file) => file.path !== path)
  if (files.length === existing.length) return { ok: true }

  const { error } = await supabase
    .from('webframe_content_items')
    .update({ files, updated_at: new Date().toISOString() })
    .eq('id', item.id)
  if (error) {
    console.error('Upload removal failed:', error)
    return { error: 'Could not remove the file — please try again.' }
  }

  // Best effort: an orphaned storage object is harmless, so a failure here
  // shouldn't surface to the client after the record is already updated.
  const { error: storageError } = await supabase.storage
    .from(UPLOADS_BUCKET)
    .remove([path])
  if (storageError) console.error('Storage delete failed:', storageError)

  revalidatePath(`/portal/${token}`, 'layout')
  return { ok: true }
}

// Save (or clear) the client-typed note on a checklist item.
export async function saveNote(token, itemId, note) {
  const supabase = getSupabaseAdmin()
  if (!supabase) return { error: 'Saving is not available right now.' }

  const { project, item } = await resolveItem(supabase, token, itemId)
  if (!project || !item) return { error: 'This link is no longer valid.' }

  const trimmed = String(note || '').trim().slice(0, MAX_NOTE_LENGTH)
  const { error } = await supabase
    .from('webframe_content_items')
    .update({ note: trimmed || null, updated_at: new Date().toISOString() })
    .eq('id', item.id)
  if (error) {
    console.error('Note save failed:', error)
    return { error: 'Could not save the note — please try again.' }
  }

  if (trimmed && !item.note) {
    notifyWhatsApp(`📝 Note added — ${project.name}: ${item.label}`)
  }
  await maybeCompleteContent(supabase, project)
  revalidatePath(`/portal/${token}`, 'layout')
  return { ok: true }
}

// --- Support tickets --------------------------------------------------------

async function resolveProject(supabase, token) {
  const { data: project } = await supabase
    .from('webframe_projects')
    .select('id, name, portal_token')
    .eq('portal_token', token)
    .maybeSingle()
  return project
}

export async function createTicket(token, subject, body) {
  const supabase = getSupabaseAdmin()
  if (!supabase) return { error: 'Support is not available right now.' }

  const project = await resolveProject(supabase, token)
  if (!project) return { error: 'This link is no longer valid.' }

  const cleanSubject = String(subject || '').trim().slice(0, 120)
  const cleanBody = String(body || '').trim().slice(0, 5000)
  if (!cleanSubject || !cleanBody) {
    return { error: 'Add a subject and a message.' }
  }

  const { data: ticket, error } = await supabase
    .from('webframe_tickets')
    .insert({ project_id: project.id, subject: cleanSubject })
    .select()
    .single()
  if (error) {
    console.error('Ticket create failed:', error)
    return { error: 'Could not create the ticket — please try again.' }
  }

  const { error: messageError } = await supabase
    .from('webframe_ticket_messages')
    .insert({ ticket_id: ticket.id, sender: 'client', body: cleanBody })
  if (messageError) {
    console.error('Ticket message failed:', messageError)
    return { error: 'Could not save the message — please try again.' }
  }

  notifyWhatsApp(`🎫 New ticket — ${project.name}: ${cleanSubject}`)
  revalidatePath(`/portal/${token}`, 'layout')
  return { ok: true }
}

export async function replyTicket(token, ticketId, body) {
  const supabase = getSupabaseAdmin()
  if (!supabase) return { error: 'Support is not available right now.' }

  const project = await resolveProject(supabase, token)
  if (!project) return { error: 'This link is no longer valid.' }

  const cleanBody = String(body || '').trim().slice(0, 5000)
  if (!cleanBody) return { error: 'Write a message first.' }

  const { data: ticket } = await supabase
    .from('webframe_tickets')
    .select('*')
    .eq('id', ticketId)
    .eq('project_id', project.id)
    .maybeSingle()
  if (!ticket) return { error: 'This ticket no longer exists.' }

  const { error } = await supabase
    .from('webframe_ticket_messages')
    .insert({ ticket_id: ticket.id, sender: 'client', body: cleanBody })
  if (error) {
    console.error('Ticket reply failed:', error)
    return { error: 'Could not send the reply — please try again.' }
  }

  // A client reply reopens a closed ticket.
  await supabase
    .from('webframe_tickets')
    .update({ status: 'open', updated_at: new Date().toISOString() })
    .eq('id', ticket.id)

  notifyWhatsApp(`💬 Ticket reply — ${project.name}: ${ticket.subject}`)
  revalidatePath(`/portal/${token}`, 'layout')
  return { ok: true }
}

// Mark an optional checklist item as "nothing to send" (or undo that).
export async function setSkipped(token, itemId, skipped) {
  const supabase = getSupabaseAdmin()
  if (!supabase) return { error: 'Saving is not available right now.' }

  const { project, item } = await resolveItem(supabase, token, itemId)
  if (!project || !item) return { error: 'This link is no longer valid.' }
  if (!item.optional) return { error: 'This item is required.' }

  const { error } = await supabase
    .from('webframe_content_items')
    .update({ skipped: Boolean(skipped), updated_at: new Date().toISOString() })
    .eq('id', item.id)
  if (error) {
    console.error('Skip update failed:', error)
    return { error: 'Could not update — please try again.' }
  }

  await maybeCompleteContent(supabase, project)
  revalidatePath(`/portal/${token}`, 'layout')
  return { ok: true }
}
