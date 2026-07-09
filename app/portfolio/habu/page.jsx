import { Suspense } from 'react'
import PortfolioHero from '@/components/portfolio/TemplateHero'
import TemplateFeaturesSection from '@/components/portfolio/TemplateFeaturesSection'
import PortfolioCTASection from '@/components/portfolio/TemplateCTASection'

export const metadata = {
  title: 'Habu Offices - Webframe Portfolio',
  description: 'Premium serviced office spaces and coworking website in the heart of Split.',
}

export default function HabuPortfolioPage() {
  const projectData = {
    name: 'Habu',
    tagline: 'Premium workspaces in Split',
    description: 'A professional website for a modern business building offering serviced offices and coworking spaces in Split.',
    category: 'Business & Real Estate',
    color: 'from-slate-600 to-slate-800',
    image: '/images/portfolio/habu.webp',
    liveUrl: null, // TODO: add live URL when available
    features: [
      {
        title: 'Space Showcase',
        description: 'Virtual tour and gallery of available office spaces.',
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 21V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V21M19 21H21M19 21H14M5 21H3M5 21H10M14 21V16C14 15.4477 13.5523 15 13 15H11C10.4477 15 10 15.4477 10 16V21M14 21H10M9 7H10M9 11H10M14 7H15M14 11H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
      {
        title: 'Inquiry Forms',
        description: 'Streamlined contact forms for office space inquiries.',
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
      {
        title: 'Amenities Display',
        description: 'Clear presentation of building features and services.',
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
      {
        title: 'Professional Design',
        description: 'Corporate aesthetic that appeals to business clients.',
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
