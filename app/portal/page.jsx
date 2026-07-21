import { redirect } from 'next/navigation'
import { getPortalSessionToken } from '@/lib/portalAuth'
import LoginForm from './LoginForm'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Client Login - Webframe',
  robots: { index: false, follow: false },
}

export default async function PortalLoginPage() {
  const token = await getPortalSessionToken()
  if (token) redirect(`/portal/${token}`)

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-lg font-bold tracking-tight text-gray-900 mb-1">
            webframe
          </div>
          <div className="font-mono text-xs text-gray-400">// client portal</div>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-xs text-gray-500 leading-relaxed">
          Not a client yet?{' '}
          <a href="/" className="text-primary font-semibold">
            See what we build
          </a>{' '}
          — hand-coded websites, live in 7 days.
        </p>
      </div>
    </main>
  )
}
