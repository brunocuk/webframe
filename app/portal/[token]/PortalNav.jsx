'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ICONS = {
  overview: (
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  ),
  content: (
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
  ),
  invoices: (
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
    </svg>
  ),
  support: (
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
    </svg>
  ),
}

export default function PortalNav({ token, openTickets = 0 }) {
  const pathname = usePathname()
  const base = `/portal/${token}`
  const links = [
    { href: base, label: 'Overview', icon: 'overview' },
    { href: `${base}/content`, label: 'Content', icon: 'content' },
    { href: `${base}/invoices`, label: 'Invoices', icon: 'invoices' },
    { href: `${base}/support`, label: 'Support', icon: 'support', badge: openTickets },
  ]

  return (
    <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible -mx-1 px-1">
      {links.map((link) => {
        const active =
          link.href === base ? pathname === base : pathname.startsWith(link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
              active
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-white hover:text-gray-900'
            }`}
          >
            {ICONS[link.icon]}
            {link.label}
            {link.badge > 0 && (
              <span
                className={`ml-auto min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${
                  active ? 'bg-white text-gray-900' : 'bg-primary text-white'
                }`}
              >
                {link.badge}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
