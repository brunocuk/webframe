import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { PROJECT_STAGES } from '@/lib/portal'
import UploadItem from './UploadItem'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Your Project - Webframe',
  robots: { index: false, follow: false },
}

function InvalidLink() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="font-mono text-xs font-semibold tracking-wider text-primary mb-3">
          // client portal
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          This link isn&apos;t valid.
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          The portal link may have been copied incompletely. Check the link in
          your onboarding email, or write to{' '}
          <a href="mailto:hello@web-frame.eu" className="text-primary font-semibold">
            hello@web-frame.eu
          </a>{' '}
          and we&apos;ll sort it out.
        </p>
      </div>
    </main>
  )
}

export default async function PortalPage({ params }) {
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
  const stageIndex = Math.max(
    PROJECT_STAGES.findIndex((s) => s.value === project.stage),
    0
  )
  const currentStage = PROJECT_STAGES[stageIndex]
  const progress = ((stageIndex + 1) / PROJECT_STAGES.length) * 100

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 px-6 py-16 md:py-20">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-bold tracking-tight text-gray-900">
              webframe
            </span>
            <span className="font-mono text-xs text-gray-400">// client portal</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-2">
            {project.name}
          </h1>
          <p className="text-gray-600">
            Hand-coded and live within 7 days of your content — here&apos;s
            where things stand.
          </p>
        </div>

        {/* Stage timeline — echoes the 7-day rail on the homepage */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8 mb-10">
          <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden mb-5">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {PROJECT_STAGES.map((stage, i) => (
              <div key={stage.value} className={i > stageIndex ? 'opacity-40' : ''}>
                <div className="flex items-center gap-1.5 mb-1">
                  {i < stageIndex ? (
                    <svg className="w-4 h-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        i === stageIndex ? 'bg-primary animate-pulse' : 'bg-gray-300'
                      }`}
                    />
                  )}
                  <span
                    className={`text-sm font-semibold ${
                      i === stageIndex ? 'text-primary' : 'text-gray-900'
                    }`}
                  >
                    {stage.label}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{stage.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Content checklist */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Your content</h2>
          <p className="text-sm text-gray-600">
            {project.stage === 'content'
              ? 'Upload everything below — rough is fine, we polish. The 7-day clock starts once your content is in.'
              : 'Content received — you can still add files if something changes.'}
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {items.map((item) => (
            <UploadItem key={item.id} token={token} item={item} />
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          Questions? Write to{' '}
          <a href="mailto:hello@web-frame.eu" className="text-primary font-semibold">
            hello@web-frame.eu
          </a>{' '}
          — you&apos;ll hear back within 24 hours.
        </p>
      </div>
    </main>
  )
}
