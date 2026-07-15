// Minimal Revolut Merchant API client — shared ninefold Revolut Business
// account; webframe payments land there alongside ninefold's. Server-only.
const BASE = 'https://merchant.revolut.com/api'

function headers() {
  const key = process.env.REVOLUT_MERCHANT_SECRET_KEY
  if (!key) throw new Error('REVOLUT_MERCHANT_SECRET_KEY is not configured')
  return {
    Authorization: `Bearer ${key}`,
    'Revolut-Api-Version': process.env.REVOLUT_API_VERSION || '2024-09-01',
    'Content-Type': 'application/json',
  }
}

// Creates a payment order and returns { id, checkoutUrl }. Amount in EUR.
export async function createOrder({ amountEur, description, customerEmail }) {
  const response = await fetch(`${BASE}/orders`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      amount: Math.round(amountEur * 100),
      currency: 'EUR',
      description,
      customer: customerEmail ? { email: customerEmail } : undefined,
    }),
  })
  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Revolut order creation failed (${response.status}): ${body}`)
  }
  const order = await response.json()
  return { id: order.id, checkoutUrl: order.checkout_url }
}

async function api(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, { ...options, headers: headers() })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(`Revolut ${path} failed (${response.status}): ${JSON.stringify(body)}`)
  }
  return body
}

async function findOrCreateCustomer({ email, name }) {
  const list = await api('/customers')
  const customers = Array.isArray(list) ? list : list.customers || []
  const existing = customers.find(
    (c) => c.email?.toLowerCase() === email.toLowerCase()
  )
  if (existing) return existing
  return api('/customers', {
    method: 'POST',
    body: JSON.stringify({ email, full_name: name || undefined }),
  })
}

// Finds (or creates) the canonical monthly plan for a tier at the given
// price. Price changes produce a new plan rather than mutating the old one,
// so running subscriptions keep their original terms.
async function ensureMonthlyPlan(planName, amountEur) {
  const amount = Math.round(amountEur * 100)
  const name = `Webframe ${planName} — Monthly`
  const list = await api('/subscription-plans')
  const plans = Array.isArray(list) ? list : list.subscription_plans || []
  const existing = plans.find(
    (p) =>
      p.name === name &&
      p.state === 'active' &&
      p.variations?.[0]?.phases?.[0]?.amount === amount &&
      p.variations?.[0]?.phases?.[0]?.currency === 'EUR'
  )
  if (existing) return existing.variations[0].id

  const created = await api('/subscription-plans', {
    method: 'POST',
    body: JSON.stringify({
      name,
      variations: [
        {
          name: 'monthly',
          phases: [{ ordinal: 0, cycle_duration: 'P1M', amount, currency: 'EUR' }],
        },
      ],
    }),
  })
  return created.variations[0].id
}

// Creates a pending subscription and returns the hosted checkout link for
// its setup order. The customer pays once there; their payment method is
// saved and Revolut auto-charges every cycle after.
export async function createSubscriptionLink({ email, name, planName, amountEur }) {
  const customer = await findOrCreateCustomer({ email, name })
  const variationId = await ensureMonthlyPlan(planName, amountEur)
  const subscription = await api('/subscriptions', {
    method: 'POST',
    body: JSON.stringify({
      customer_id: customer.id,
      plan_variation_id: variationId,
    }),
  })
  return {
    id: subscription.setup_order_id,
    checkoutUrl: subscription.setup_order_checkout_url,
  }
}

export async function cancelOrder(orderId) {
  const response = await fetch(`${BASE}/orders/${orderId}/cancel`, {
    method: 'POST',
    headers: headers(),
  })
  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Revolut order cancel failed (${response.status}): ${body}`)
  }
  return response.json()
}
