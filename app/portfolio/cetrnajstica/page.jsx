import { Suspense } from 'react'
import PortfolioHero from '@/components/portfolio/TemplateHero'
import TemplateFeaturesSection from '@/components/portfolio/TemplateFeaturesSection'
import PortfolioCTASection from '@/components/portfolio/TemplateCTASection'

export const metadata = {
  title: 'Četrnajstica Pizza - Webframe Portfolio',
  description: 'Authentic Neapolitan pizza restaurant website serving Zagreb\'s finest wood-fired pies.',
}

export default function CetrnajsticaPortfolioPage() {
  const projectData = {
    name: 'Četrnajstica',
    tagline: 'Authentic Neapolitan pizza in Zagreb',
    description: 'A warm and inviting website for an authentic pizza restaurant serving Zagreb\'s finest wood-fired Neapolitan pies.',
    category: 'Food & Hospitality',
    color: 'from-red-500 to-orange-500',
    image: '/images/portfolio/cetrnajstica.webp',
    liveUrl: null, // TODO: add live URL when available
    features: [
      {
        title: 'Menu Display',
        description: 'Mouth-watering presentation of pizza selection and specials.',
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3H21V21H3V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 9H15M9 15H15M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        title: 'Warm Aesthetic',
        description: 'Cozy design that captures the restaurant\'s authentic atmosphere.',
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
      {
        title: 'Location & Hours',
        description: 'Easy to find with clear opening hours and directions.',
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
      {
        title: 'Mobile Friendly',
        description: 'Quick access to menu and contact info on any device.',
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 18H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ),
      },
    ],
  }

  return (
    <main className="bg-white">
      <Suspense fallback={<div className="min-h-[50vh]" />}>
        <PortfolioHero project={projectData} />
      </Suspense>

      <Suspense fallback={<div className="min-h-[50vh]" />}>
        <TemplateFeaturesSection features={projectData.features} color={projectData.color} />
      </Suspense>

      <Suspense fallback={<div className="min-h-[50vh]" />}>
        <PortfolioCTASection projectName={projectData.name} color={projectData.color} />
      </Suspense>
    </main>
  )
}
