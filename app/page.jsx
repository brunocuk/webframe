import { Suspense } from 'react'
import HeroSection from '@/components/sections/HeroSection'
import BenefitsSection from '@/components/sections/BenefitsSection'
import HowItWorksSection from '@/components/sections/HowItWorksSection'
import TemplatesSection from '@/components/sections/TemplatesSection'
import PricingSection from '@/components/sections/PricingSection'
import FAQSection from '@/components/sections/FAQSection'
import CTASection from '@/components/sections/CTASection'

export default function HomePage() {
  return (
    <main className="bg-white">
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <HeroSection />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <BenefitsSection />
      </Suspense>
      
      <Suspense fallback={<div className="h-96 bg-white" />}>
        <HowItWorksSection />
      </Suspense>
      
      <Suspense fallback={<div className="h-96 bg-gray-50" />}>
        <TemplatesSection />
      </Suspense>
      
      <Suspense fallback={<div className="h-96 bg-white" />}>
        <PricingSection />
      </Suspense>
      
      <Suspense fallback={<div className="h-96 bg-gray-50" />}>
        <FAQSection />
      </Suspense>
      
      <Suspense fallback={<div className="h-96 bg-white" />}>
        <CTASection />
      </Suspense>
    </main>
  )
}
