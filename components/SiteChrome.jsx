'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SmoothScroll from '@/components/SmoothScroll'
import CookieConsent from '@/components/CookieConsent'

// Marketing chrome (header, footer, smooth scroll, cookie banner) wraps the
// public site only — the /admin CRM and the client portal render bare.
export default function SiteChrome({ children }) {
  const pathname = usePathname()
  const bare = pathname.startsWith('/admin') || pathname.startsWith('/portal')

  if (bare) return children

  return (
    <>
      <SmoothScroll>
        <Header />
        {children}
        <Footer />
      </SmoothScroll>
      <CookieConsent />
    </>
  )
}
