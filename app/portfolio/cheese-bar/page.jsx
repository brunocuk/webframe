import { Suspense } from 'react'
import PortfolioHero from '@/components/portfolio/TemplateHero'
import TemplateFeaturesSection from '@/components/portfolio/TemplateFeaturesSection'
import TemplateMockupsSection from '@/components/portfolio/TemplateMockupsSection'
import PortfolioCTASection from '@/components/portfolio/TemplateCTASection'

export const metadata = {
  title: 'Cheese Bar Zagreb - Webframe Portfolio',
  description: 'Artisan cheese and Croatian wine bar website in the heart of Zagreb.',
}

export default function CheeseBarPortfolioPage() {
  const projectData = {
    name: 'Cheese Bar',
    tagline: 'Where taste reigns supreme',
    description: 'An editorial-style website for Zagreb\'s premier artisan cheese and Croatian wine destination.',
    category: 'Food & Hospitality',
    color: 'from-amber-500 to-orange-500',
    image: '/images/portfolio/cheese-bar/hero.png',
    mockups: [
      {
        title: 'Desktop View',
        description: 'Full homepage experience',
        type: 'desktop',
        image: '/images/portfolio/cheese-bar/hero.png',
      },
      {
        title: 'Mobile View',
        description: 'On-the-go browsing',
        type: 'mobile',
        image: '/images/portfolio/cheese-bar/mobile.png',
      },
      {
        title: 'Menu Page',
        description: 'Cheese & wine selection',
        type: 'interior',
        image: '/images/portfolio/cheese-bar/interior.png',
      },
    ],
    features: [
      {
        title: 'Editorial Design',
        description: 'Magazine-inspired layout that tells the story of artisan cheese.',
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20M4 19.5C4 20.163 4.26339 20.7989 4.73223 21.2678C5.20107 21.7366 5.83696 22 6.5 22H20V2H6.5C5.83696 2 5.20107 2.26339 4.73223 2.73223C4.26339 3.20107 4 3.83696 4 4.5V19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
      {
        title: 'Menu Showcase',
        description: 'Appetizing presentation of cheese boards and wine selection.',
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3H21V21H3V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 9H15M9 15H15M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        title: 'Multi-Language',
        description: 'Seamless Croatian and English language support for tourists.',
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 5H15M9 3V5M10.048 14.5C10.048 16.433 8.433 18 6.524 18C4.615 18 3 16.433 3 14.5C3 12.567 4.615 11 6.524 11C8.433 11 10.048 12.567 10.048 14.5ZM12.5 7L17 11.5M21 8L12.5 16.5L9 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
      {
        title: 'Location Integration',
        description: 'Easy-to-find with integrated maps and directions.',
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
        <TemplateMockupsSection mockups={projectData.mockups} name={projectData.name} color={projectData.color} />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <PortfolioCTASection projectName={projectData.name} color={projectData.color} />
      </Suspense>
    </main>
  )
}
