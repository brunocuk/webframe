import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import InvalidLink from '../InvalidLink'
import NewTicket from './NewTicket'
import TicketThread from './TicketThread'

export const dynamic = 'force-dynamic'

export default async function PortalSupportPage({ params }) {
  const { token } = await params
  const supabase = getSupabaseAdmin()
  if (!supabase) return <InvalidLink />

  const { data: project } = await supabase
    .from('webframe_projects')
    .select('id, name')
    .eq('portal_token', token)
    .maybeSingle()
  if (!project) return <InvalidLink />

  const { data: tickets } = await supabase
    .from('webframe_tickets')
    .select('*, webframe_ticket_messages(*)')
    .eq('project_id', project.id)
    .order('updated_at', { ascending: false })
    .order('created_at', {
      referencedTable: 'webframe_ticket_messages',
      ascending: true,
    })

  const list = tickets || []

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mb-1">
          Support
        </h1>
        <p className="text-sm text-gray-600">
          Questions, tweaks, something not right? Open a ticket — you&apos;ll
          hear back within 24 hours, usually much faster.
        </p>
      </div>

      <NewTicket token={token} hasTickets={list.length > 0} />

      {list.length > 0 && (
        <div className="space-y-4 mt-6">
          {list.map((ticket) => (
            <TicketThread
              key={ticket.id}
              token={token}
              ticket={ticket}
              messages={ticket.webframe_ticket_messages || []}
            />
          ))}
        </div>
      )}
    </>
  )
}
