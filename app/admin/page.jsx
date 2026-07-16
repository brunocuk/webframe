import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { getAdminRole } from '@/lib/adminRole'
import { LEAD_STATUSES } from '@/lib/inquiryOptions'
import { UPLOADS_BUCKET } from '@/lib/portal'
import StatusSelect from './StatusSelect'
import QuotePanel from './QuotePanel'
import ProjectPanel from './ProjectPanel'
import AddLead from './AddLead'
import CallTime from './CallTime'
import { logout } from './login/actions'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Leads - Webframe Admin',
  robots: { index: false, follow: false },
}

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

function Hint({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
      <h2 className="font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-sm text-gray-600">{children}</p>
    </div>
  )
}

export default async function AdminLeadsPage() {
  const role = (await getAdminRole()) || 'sales'
  const isOwner = role === 'owner'
  const supabase = getSupabaseAdmin()

  let leads = null
  let loadError = null
  if (supabase) {
    const { data, error } = await supabase
      .from('webframe_leads')
      .select('*, webframe_quotes(*), webframe_projects(*, webframe_content_items(*))')
      .order('created_at', { ascending: false })
      .order('created_at', { referencedTable: 'webframe_quotes', ascending: false })
    leads = data
    loadError = error
  }

  // Signed download URLs (1 h) for every uploaded client file, keyed by path.
  const fileLinks = {}
  if (supabase && leads) {
    const paths = leads.flatMap((lead) =>
      (lead.webframe_projects || []).flatMap((project) =>
        (project.webframe_content_items || []).flatMap((item) =>
          (item.files || []).map((file) => file.path)
        )
      )
    )
    if (paths.length > 0) {
      const { data: signed } = await supabase.storage
        .from(UPLOADS_BUCKET)
        .createSignedUrls(paths, 3600)
      for (const entry of signed || []) {
        if (entry.signedUrl) fileLinks[entry.path] = entry.signedUrl
      }
    }
  }

  const counts = Object.fromEntries(LEAD_STATUSES.map((s) => [s, 0]))
  for (const lead of leads || []) {
    if (counts[lead.status] !== undefined) counts[lead.status] += 1
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="font-mono text-xs font-semibold tracking-wider text-primary mb-2">
            // webframe crm
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Leads
              {!isOwner && (
                <span className="ml-3 align-middle px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-full text-[11px] font-semibold text-amber-700">
                  sales access
                </span>
              )}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <AddLead />
              {LEAD_STATUSES.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600"
                >
                  {s} <span className="font-bold text-gray-900">{counts[s]}</span>
                </span>
              ))}
              <form action={logout}>
                <button
                  type="submit"
                  className="px-3 py-1 rounded-full border border-gray-200 bg-white text-xs font-medium text-gray-500 hover:text-gray-900 hover:border-gray-400 transition-colors"
                >
                  Log out
                </button>
              </form>
            </div>
          </div>
        </div>

        {!supabase && (
          <Hint title="Supabase is not configured">
            Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment,
            then reload this page.
          </Hint>
        )}

        {loadError && (
          <Hint title="Couldn't load leads">
            {loadError.message}. If the table doesn&apos;t exist yet, run{' '}
            <code className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">
              supabase/webframe_leads.sql
            </code>{' '}
            in the Supabase SQL editor.
          </Hint>
        )}

        {leads && leads.length === 0 && (
          <Hint title="No leads yet">
            New inquiries from the site will appear here the moment they arrive.
          </Hint>
        )}

        {leads && leads.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
            <table className="w-full min-w-[1180px] border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-200 font-mono text-[11px] tracking-wider text-gray-500 uppercase">
                  <th className="px-5 py-3.5 font-semibold">Received</th>
                  <th className="px-5 py-3.5 font-semibold">Lead</th>
                  <th className="px-5 py-3.5 font-semibold">Project</th>
                  <th className="px-5 py-3.5 font-semibold">Business</th>
                  <th className="px-5 py-3.5 font-semibold">Message</th>
                  <th className="px-5 py-3.5 font-semibold">Source</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold">Quote</th>
                  <th className="px-5 py-3.5 font-semibold">Project</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-t border-gray-100 align-top">
                    <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">
                      {dateFormat.format(new Date(lead.created_at))}
                    </td>
                    <td className="px-5 py-4">
                      {lead.name && (
                        <div className="text-sm font-semibold text-gray-900">{lead.name}</div>
                      )}
                      <a
                        href={`mailto:${lead.email}`}
                        className="text-sm text-primary hover:text-primary-dark transition-colors"
                      >
                        {lead.email}
                      </a>
                      <div className="mt-1">
                        <CallTime leadId={lead.id} callAt={lead.call_at} />
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700">
                      <div>{lead.project_type || '—'}</div>
                      {lead.project_size && (
                        <div className="text-xs text-gray-500">{lead.project_size}</div>
                      )}
                      {lead.plan && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-purple-50 border border-primary/20 rounded-full text-[10px] font-semibold text-primary">
                          {lead.plan}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700">
                      {lead.business || '—'}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 max-w-xs">
                      <div className="line-clamp-3" title={lead.message || undefined}>
                        {lead.message || '—'}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-[10px] px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                        {lead.source || 'unknown'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusSelect id={lead.id} status={lead.status} />
                    </td>
                    <td className="px-5 py-4">
                      <QuotePanel
                        leadId={lead.id}
                        quotes={lead.webframe_quotes}
                        defaultPlan={lead.plan}
                        readOnly={!isOwner}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <ProjectPanel
                        lead={lead}
                        project={lead.webframe_projects?.[0] || null}
                        fileLinks={fileLinks}
                        readOnly={!isOwner}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
