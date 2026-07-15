import { Suspense } from 'react'
import PricingSection from '@/components/sections/PricingSection'
import ComparePlansSection from '@/components/sections/ComparePlansSection'
import FAQSection from '@/components/sections/FAQSection'
import CTASection from '@/components/sections/CTASection'

export const metadata = {
  title: 'Pricing - Webframe | Custom Websites from €1,200 or €149/month',
  description:
    'Simple, honest pricing for hand-coded custom websites. Three plans, pay upfront or monthly, delivered in 7 days. Compare everything that\'s included — no hidden costs.',
}

export default function PricingPage() {
  return (
    <main className="bg-white">
      {/* Page hero */}
      <section className="pt-32 pb-4 px-6 bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="font-mono text-xs font-semibold tracking-wider text-primary mb-4">
            // pricing
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 mb-4">
            Simple, honest pricing.
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Three plans, two ways to pay, one promise: the price you see is the
            price you pay. Every plan is hand-coded and live within a week.
          </p>
        </div>
      </section>

      <Suspense fallback={<div className="h-96 bg-white" />}>
        <PricingSection showHeader={false} showCompareLink={false} />
      </Suspense>

      <Suspense fallback={<div className="h-96 bg-gray-50" />}>
        <ComparePlansSection />
      </Suspense>

      <Suspense fallback={<div className="h-96 bg-gray-50" />}>
        <FAQSection />
      </Suspense>

      <Suspense fallback={<div className="h-96 bg-black" />}>
        <CTASection />
      </Suspense>
    </main>
  )
}
