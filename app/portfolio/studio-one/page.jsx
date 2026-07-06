import { Suspense } from 'react'
import PortfolioHero from '@/components/portfolio/TemplateHero'
import TemplateFeaturesSection from '@/components/portfolio/TemplateFeaturesSection'
import PortfolioCTASection from '@/components/portfolio/TemplateCTASection'

export const metadata = {
  title: 'Studio One by Nina - Webframe Portfolio',
  description: 'Premium hair salon website delivering beauty and confidence through expert styling and keratin treatments.',
}

export default function StudioOnePortfolioPage() {
  const projectData = {
    name: 'Studio One',
    tagline: 'Premium hair salon in Zagreb',
    description: 'A sophisticated website for a premium hair salon specializing in Cocochoco keratin treatments and Brendia Pro extensions.',
    category: 'Beauty & Wellness',
    color: 'from-amber-600 to-yellow-500',
    image: '/images/portfolio/studioonebynina.png',
    features: [
      {
        title: 'Elegant Design',
        description: 'Luxurious aesthetic that reflects the premium salon experience.',
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
      {
        title: 'Service Showcase',
        description: 'Beautiful presentation of treatments and services offered.',
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 5C4 4.44772 4.44772 4 5 4H9.58579C9.851 4 10.1054 4.10536 10.2929 4.29289L12 6H19C19.5523 6 20 6.44772 20 7V18C20 18.5523 19.5523 19 19 19H5C4.44772 19 4 18.5523 4 18V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
      {
        title: 'Mobile Optimized',
        description: 'Perfect experience on all devices for clients on the go.',
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 18H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        title: 'Click-to-Call',
        description: 'Easy appointment booking with integrated call buttons.',
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 16.92V19.92C22 20.48 21.56 20.93 21 20.97C20.29 21.03 19.59 21.01 18.9 20.91C16.14 20.52 13.5 19.42 11.28 17.73C9.22 16.17 7.53 14.17 6.29 11.88C5.05 9.57 4.31 7.01 4.04 4.37C4.01 3.81 4.45 3.34 5 3.28L8.01 3.02C8.51 2.98 8.97 3.3 9.11 3.78L9.83 6.38C9.95 6.82 9.8 7.28 9.44 7.55L8.09 8.54C8.78 10.17 9.88 11.64 11.28 12.81C12.68 13.98 14.36 14.79 16.16 15.17L17.47 13.82C17.74 13.54 18.15 13.45 18.52 13.58L21.1 14.63C21.56 14.83 21.87 15.31 21.87 15.84L22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
    ],
  }

  return (
    <main className="bg-white">
      <Suspense fallback={<div>Loading...</div>}>
        <PortfolioHero project={projectData} />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <TemplateFeaturesSection features={projectData.features} color={projectData.color} />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <PortfolioCTASection projectName={projectData.name} color={projectData.color} />
      </Suspense>
    </main>
  )
}
