import { MARKETS } from '@/lib/markets'

const BASE = 'https://www.web-frame.eu'

const PORTFOLIO_SLUGS = [
  'adriatic-padel',
  'cetrnajstica',
  'cheese-bar',
  'habu',
  'matermag',
  'studio-one',
]

export default function sitemap() {
  return [
    { url: BASE, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/pricing`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/contact`, changeFrequency: 'monthly', priority: 0.8 },
    ...Object.values(MARKETS).map((market) => ({
      url: `${BASE}/websites/${market.slug}`,
      changeFrequency: 'monthly',
      priority: 0.8,
    })),
    ...PORTFOLIO_SLUGS.map((slug) => ({
      url: `${BASE}/portfolio/${slug}`,
      changeFrequency: 'monthly',
      priority: 0.6,
    })),
    { url: `${BASE}/privacy-policy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/terms-of-service`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/cookies-policy`, changeFrequency: 'yearly', priority: 0.2 },
  ]
}
