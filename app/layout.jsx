import './globals.css'
import SiteChrome from '@/components/SiteChrome'
import ContactModalProvider from '@/components/ContactModalProvider'

export const metadata = {
  title: 'Webframe - Custom-Built Websites for Your Business',
  description: 'Professional custom-built websites delivered in 7 days. Tell us your vision, we build it tailored to you. Serving NL, DK, IE & UK.',
  openGraph: {
    title: 'Webframe - Custom-Built Websites',
    description: 'Professional custom-built websites delivered in 7 days. Tailored to your business.',
    type: 'website',
    locale: 'en_GB',
    siteName: 'Webframe',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ContactModalProvider>
          <SiteChrome>{children}</SiteChrome>
        </ContactModalProvider>
      </body>
    </html>
  )
}
