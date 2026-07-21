import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { CONTENT_GUIDE, UPLOADS_BUCKET } from '@/lib/portal'
import { isImageFile } from '@/lib/contentItems'
import { buildDeadline, formatDateLong } from '@/lib/projectTime'
import InvalidLink from '../InvalidLink'
import UploadItem from '../UploadItem'

export const dynamic = 'force-dynamic'

const GUIDE_STEPS = [
  {
    title: 'Send it rough',
    description:
      'Notes, phone photos, half-written docs — all fine. Polishing is our job, not yours.',
  },
  {
    title: 'Drop it in',
    description:
      'Drag files onto a card, tap to upload, or just type it as a note. You can add, remove or edit anytime.',
  },
  {
    title: 'We take it from there',
    description:
      'Once your content is in, the 7-day build starts. Missing something? Send what you have — we’ll work around it.',
  },
]

export default async function PortalContentPage({ params }) {
  const { token } = await params
  const supabase = getSupabaseAdmin()
  if (!supabase) return <InvalidLink />

  const { data: project } = await supabase
    .from('webframe_projects')
    .select('*, webframe_content_items(*)')
    .eq('portal_token', token)
    .maybeSingle()
  if (!project) return <InvalidLink />

  const items = (project.webframe_content_items || []).sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  )
  const contentDone = project.stage !== 'content'
  const liveBy = project.content_completed_at
    ? formatDateLong(buildDeadline(project))
    : null

  // Signed preview URLs for uploaded images (private bucket) so the cards
  // can show thumbnails. Valid for an hour, which outlives any page visit.
  const imagePaths = items.flatMap((item) =>
    (Array.isArray(item.files) ? item.files : [])
      .map((file) => file.path)
      .filter((path) => path && isImageFile(path))
  )
  const thumbs = {}
  if (imagePaths.length > 0) {
    const { data: signed } = await supabase.storage
      .from(UPLOADS_BUCKET)
      .createSignedUrls(imagePaths, 3600)
    for (const entry of signed || []) {
      if (entry.signedUrl) thumbs[entry.path] = entry.signedUrl
    }
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mb-1">
          Your content
        </h1>
        <p className="text-sm text-gray-600">
          {contentDone
            ? 'Content received — you can still add or swap files if something changes.'
            : 'Everything we need to build your site, in one place.'}
        </p>
      </div>

      {contentDone ? (
        /* Completion banner */
        project.stage !== 'live' && (
          <div className="bg-green-50 rounded-3xl border border-green-200 p-6 md:p-8 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              That&apos;s everything — we&apos;re on it 🎉
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Your content is in and the 7-day build has started.
              {liveBy && (
                <>
                  {' '}
                  On track to be live by <strong className="text-gray-900">{liveBy}</strong>.
                </>
              )}{' '}
              We&apos;ll send you a preview link as soon as there&apos;s something to see.
            </p>
          </div>
        )
      ) : (
        /* Content guide */
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8 mb-8">
          <div className="font-mono text-xs font-semibold tracking-wider text-primary mb-4">
            // how this works
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {GUIDE_STEPS.map((step, i) => (
              <div key={step.title}>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-mono text-xs text-gray-400">
                    0{i + 1}
                  </span>
                  <h3 className="text-sm font-semibold text-gray-900">{step.title}</h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <UploadItem
            key={item.id}
            token={token}
            item={item}
            guide={CONTENT_GUIDE[item.label]}
            thumbs={thumbs}
          />
        ))}
      </div>
    </>
  )
}
