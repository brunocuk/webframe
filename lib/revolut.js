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
