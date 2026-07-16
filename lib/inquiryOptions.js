// Shared lead-qualification options for the Start Your Project modal and the
// /contact page form. Question 1 tells us the job shape (and whether existing
// material exists); question 2 maps straight onto the Starter / Business /
// Complete tiers so a quote is half-prepared before the first call.

export const PROJECT_TYPES = [
  { value: 'new-site', label: 'A brand-new website' },
  { value: 'redesign', label: 'Redesign my current site' },
  { value: 'shop', label: 'An online shop' },
  { value: 'other', label: 'Something else' },
]

export const PROJECT_SIZES = [
  { value: '1-2', label: '1–2 pages' },
  { value: 'upto5', label: 'Up to 5 pages' },
  { value: '5-10', label: '5–10+ pages' },
  { value: 'unsure', label: 'Not sure — advise me' },
]

export const labelFor = (options, value) =>
  options.find((o) => o.value === value)?.label || 'Not specified'

// Pipeline stages for the /admin CRM — must match the check constraint in
// supabase/webframe_leads.sql.
export const LEAD_STATUSES = ['new', 'contacted', 'quoted', 'won', 'lost']

// Prices per plan (EUR) — keep in sync with PricingSection.
export const PLAN_PRICES = { Starter: 1200, Business: 2400, Complete: 3900 }
export const PLAN_PRICES_MONTHLY = { Starter: 149, Business: 299, Complete: 449 }

// Plan choices for inquiry forms when the visitor didn't arrive from a
// specific plan card.
export const PLAN_OPTIONS = [
  { value: 'Starter', label: 'Starter — €1,200' },
  { value: 'Business', label: 'Business — €2,400' },
  { value: 'Complete', label: 'Complete — €3,900' },
  { value: 'unsure', label: 'Not sure — advise me' },
]
