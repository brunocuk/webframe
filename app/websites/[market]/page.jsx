import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { MARKETS } from '@/lib/markets'
import BenefitsSection from '@/components/sections/BenefitsSection'
import PricingSection from '@/components/sections/PricingSection'
import CTASection from '@/components/sections/CTASection'

export function generateStaticParams() {
  return Object.keys(MARKETS).map((market) => ({ market }))
}

export async function generateMetadata({ params }) {
  const { market } = await params
  const data = MARKETS[market]
  if (!data) return {}
  return {
    title: `${data.title} | Webframe`,
    description: data.description,
    alternates: { canonical: `https://www.web-frame.eu/websites/${data.slug}` },
    openGraph: { title: data.title, description: data.description },
  }
}

export default async function MarketPage({ params }) {
  const { market } = await params
  const data = MARKETS[market]
  if (!data) notFound()

  return (
    <main className="bg-white">
      {/* Market hero */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="font-mono text-xs font-semibold tracking-wider text-primary mb-4">
            // webframe in {data.country}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
            Custom websites for {data.adjective} businesses.
            <br />
            <span className="italic font-light bg-gradient-to-r from-primary via-purple-600 to-blue-500 bg-clip-text text-transparent">
              Live in 7 days.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10">
            No templates, no page builders. A hand-coded website built around
            your business — whether you&apos;re in {data.cities} — launched on
            your own {data.tld} domain within a week.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#pricing"
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
            >
              See pricing
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition-all"
            >
              Book a free call
            </a>
          </div>
        </div>
      </section>

      {/* Market intro */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="prose-sm md:prose text-gray-600 space-y-4 text-lg leading-relaxed">
            <p>
              Webframe is a one-person studio building websites for small
              businesses across {data.country}. You work directly with the
              founder — one kickoff call, a fixed quote the same day, and a
              hand-coded site live within seven days of receiving your content.
            </p>
            <p>
              Every project includes custom design, mobile responsiveness, SEO
              foundations tuned for local search in {data.country}, and 30 days
              of free support after launch. The price you see is the price you
              pay — starting at €1,200 one-time, or from €149/month.
            </p>
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="min-h-[50vh]" />}>
        <BenefitsSection />
      </Suspense>

      <Suspense fallback={<div className="h-96 bg-white" />}>
        <PricingSection showCompareLink />
      </Suspense>

      <Suspense fallback={<div className="h-96 bg-black" />}>
        <CTASection />
      </Suspense>
    </main>
  )
}
