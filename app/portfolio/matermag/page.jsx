import { Suspense } from 'react'
import PortfolioHero from '@/components/portfolio/TemplateHero'
import TemplateFeaturesSection from '@/components/portfolio/TemplateFeaturesSection'
import PortfolioCTASection from '@/components/portfolio/TemplateCTASection'

export const metadata = {
  title: 'Matermag - Webframe Portfolio',
  description: 'Digital magazine empowering modern mothers with lifestyle, health, and parenting content.',
}

export default function MatermagPortfolioPage() {
  const projectData = {
    name: 'Matermag',
    tagline: 'Digital magazine for modern moms',
    description: 'A vibrant digital magazine platform empowering modern mothers with lifestyle, health, and parenting content.',
    category: 'Media & Publishing',
    color: 'from-pink-500 to-rose-400',
    image: '/images/portfolio/matermag.webp',
    liveUrl: 'https://matermag.hr',
    features: [
      {
        title: 'Editorial Layout',
        description: 'Magazine-style design optimized for reading and engagement.',
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20M4 19.5C4 20.163 4.26339 20.7989 4.73223 21.2678C5.20107 21.7366 5.83696 22 6.5 22H20V2H6.5C5.83696 2 5.20107 2.26339 4.73223 2.73223C4.26339 3.20107 4 3.83696 4 4.5V19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
      {
        title: 'Content Categories',
        description: 'Organized sections for lifestyle, health, parenting, and more.',
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4V6.58579C21 6.851 20.8946 7.10536 20.7071 7.29289L14.2929 13.7071C14.1054 13.8946 14 14.149 14 14.4142V17L10 21V14.4142C10 14.149 9.89464 13.8946 9.70711 13.7071L3.29289 7.29289C3.10536 7.10536 3 6.851 3 6.58579V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
      {
        title: 'Newsletter Integration',
        description: 'Built-in subscription system for email updates.',
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
      {
        title: 'Fast & Responsive',
        description: 'Optimized for quick loading and perfect mobile reading.',
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
