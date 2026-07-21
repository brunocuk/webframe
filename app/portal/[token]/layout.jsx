import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { portalSignOut } from '../actions'
import PortalNav from './PortalNav'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Your Project - Webframe',
  robots: { index: false, follow: false },
}

export default async function PortalLayout({ children, params }) {
  const { token } = await params
  const supabase = getSupabaseAdmin()
  let project = null
  let openTickets = 0
  if (supabase) {
    const { data } = await supabase
      .from('webframe_projects')
      .select('id, name')
      .eq('portal_token', token)
      .maybeSingle()
    project = data
    if (project) {
      const { count } = await supabase
        .from('webframe_tickets')
        .select('id', { count: 'exact', head: true })
        .eq('project_id', project.id)
        .eq('status', 'open')
      openTickets = count || 0
    }
  }

  // Invalid tokens fall through to the page, which renders InvalidLink.
  if (!project) return children

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-10 md:grid md:grid-cols-[210px_minmax(0,1fr)] md:gap-10 md:items-start">
        {/* Sidebar */}
        <aside className="mb-6 md:mb-0 md:sticky md:top-10">
          <div className="mb-5 px-1">
            <div className="flex items-center justify-between md:block">
              <div>
                <span className="text-lg font-bold tracking-tight text-gray-900">
                  webframe
                </span>
                <div className="font-mono text-[10px] text-gray-400 md:mb-3">
                  // client portal
                </div>
              </div>
              <div className="md:border-t md:border-gray-200 md:pt-3">
                <div
                  className="text-xs font-semibold text-gray-900 truncate max-w-[160px] md:max-w-none"
                  title={project.name}
                >
                  {project.name}
                </div>
              </div>
            </div>
          </div>
          <PortalNav token={token} openTickets={openTickets} />
          <div className="hidden md:block mt-6 px-1">
            <form action={portalSignOut}>
              <button
                type="submit"
                className="text-xs font-semibold text-gray-400 hover:text-gray-900 transition-colors"
              >
                Log out
              </button>
            </form>
            <p className="mt-4 text-[11px] text-gray-400 leading-relaxed">
              Questions?{' '}
              <a href="mailto:hello@web-frame.eu" className="text-primary">
                hello@web-frame.eu
              </a>
            </p>
          </div>
        </aside>

        {/* Page content */}
        <main className="min-w-0 pb-16">{children}</main>
      </div>
    </div>
  )
}
