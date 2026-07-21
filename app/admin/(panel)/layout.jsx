import { getAdminRole } from '@/lib/adminRole'
import { logout } from '@/app/admin/login/actions'
import AdminNav from './AdminNav'

export const dynamic = 'force-dynamic'

export default async function AdminPanelLayout({ children }) {
  const role = (await getAdminRole()) || 'sales'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 md:py-8 md:grid md:grid-cols-[200px_minmax(0,1fr)] md:gap-8 md:items-start">
        {/* Sidebar */}
        <aside className="mb-6 md:mb-0 md:sticky md:top-8">
          <div className="mb-5 px-1 flex items-center justify-between md:block">
            <div>
              <span className="text-lg font-bold tracking-tight text-gray-900">
                webframe
              </span>
              <div className="font-mono text-[10px] text-gray-400">// admin</div>
            </div>
            <span
              className={`inline-block md:mt-3 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                role === 'owner'
                  ? 'bg-purple-50 border border-primary/30 text-primary'
                  : 'bg-amber-50 border border-amber-200 text-amber-700'
              }`}
            >
              {role}
            </span>
          </div>
          <AdminNav />
          <div className="hidden md:block mt-6 px-1">
            <form action={logout}>
              <button
                type="submit"
                className="text-xs font-semibold text-gray-400 hover:text-gray-900 transition-colors"
              >
                Log out
              </button>
            </form>
          </div>
        </aside>

        {/* Page content */}
        <main className="min-w-0 pb-16">{children}</main>
      </div>
    </div>
  )
}
