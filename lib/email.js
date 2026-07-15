// Transactional email via Resend (shared ninefold account). Server-only.
// Sending from hello@web-frame.eu requires the web-frame.eu domain to be
// verified in Resend — until then sends will fail and callers must surface
// the payment link for manual delivery.

const FROM = process.env.EMAIL_FROM || 'Bruno at Webframe <hello@web-frame.eu>'

export async function sendEmail({ to, subject, html, replyTo }) {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY is not configured')
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to,
      subject,
      html,
      reply_to: replyTo || 'hello@web-frame.eu',
    }),
  })
  const result = await response.json()
  if (!response.ok) {
    throw new Error(`Resend failed (${response.status}): ${result?.message || 'unknown error'}`)
  }
  return result
}

// --- Templates -------------------------------------------------------------

const wrap = (body) => `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f4f4f7;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;padding:32px 16px;">
      <div style="background:#0d0a14;border-radius:16px 16px 0 0;padding:20px 32px;">
        <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.02em;">webframe</span>
        <span style="color:#b573ff;font-family:ui-monospace,Menlo,monospace;font-size:11px;margin-left:10px;">// custom websites in 7 days</span>
      </div>
      <div style="background:#ffffff;border-radius:0 0 16px 16px;padding:32px;">
        ${body}
      </div>
      <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:20px;">
        Webframe · hello@web-frame.eu · web-frame.eu
      </p>
    </div>
  </body>
</html>`

const button = (href, label) => `
  <a href="${href}" style="display:inline-block;background:#4b2bff;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:14px 28px;border-radius:999px;margin:8px 0;">
    ${label}
  </a>`

export function quoteEmailHtml({ name, plan, amountEur, paymentMode, paymentLink }) {
  const first = name ? name.split(' ')[0] : 'there'
  const amount = `€${Number(amountEur).toLocaleString('en-IE')}`
  const modeLine =
    paymentMode === 'deposit'
      ? `<p style="color:#374151;font-size:15px;line-height:1.6;">This is a <strong>50% deposit</strong> to book your build week — the balance is due before your site goes live.</p>`
      : paymentMode === 'balance'
        ? `<p style="color:#374151;font-size:15px;line-height:1.6;">This is your <strong>final balance</strong> — once received, your site goes live on your domain.</p>`
        : paymentMode === 'monthly'
          ? `<p style="color:#374151;font-size:15px;line-height:1.6;">This is a <strong>monthly plan</strong> (12-month minimum, as quoted). Paying the first month books your build week and sets up automatic monthly billing.</p>`
          : ''
  return wrap(`
    <h1 style="color:#111827;font-size:22px;margin:0 0 16px;">Your fixed quote — ${plan} plan</h1>
    <p style="color:#374151;font-size:15px;line-height:1.6;">Hi ${first},</p>
    <p style="color:#374151;font-size:15px;line-height:1.6;">
      As promised: a hand-coded custom website on the <strong>${plan}</strong> plan,
      live within 7 days of receiving your content.
    </p>
    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:20px 24px;margin:20px 0;">
      <span style="font-family:ui-monospace,Menlo,monospace;font-size:11px;color:#6b7280;">${paymentMode === 'balance' ? 'balance due' : paymentMode === 'deposit' ? '50% deposit' : paymentMode === 'monthly' ? 'per month' : 'total'}</span>
      <div style="color:#111827;font-size:32px;font-weight:700;">${amount}${paymentMode === 'monthly' ? '<span style="font-size:16px;color:#6b7280;font-weight:500;">/month</span>' : ''}</div>
    </div>
    ${modeLine}
    ${button(paymentLink, paymentMode === 'balance' ? 'Pay balance — go live' : paymentMode === 'monthly' ? 'Start your plan & book your week' : 'Pay securely & book your week')}
    <p style="color:#6b7280;font-size:13px;line-height:1.6;margin-top:20px;">
      Payment is processed securely by Revolut. The price is fixed — no surprises after.
      Questions? Just reply to this email.
    </p>
    <p style="color:#374151;font-size:15px;">— Bruno</p>
  `)
}

export function quoteReminderEmailHtml({ name, plan, amountEur, paymentLink }) {
  const first = name ? name.split(' ')[0] : 'there'
  const amount = `€${Number(amountEur).toLocaleString('en-IE')}`
  return wrap(`
    <h1 style="color:#111827;font-size:22px;margin:0 0 16px;">Your build slot is still open</h1>
    <p style="color:#374151;font-size:15px;line-height:1.6;">Hi ${first},</p>
    <p style="color:#374151;font-size:15px;line-height:1.6;">
      Just a gentle nudge — your fixed quote for the <strong>${plan}</strong> plan
      (${amount}) is still waiting, and so is your build week. Once payment lands,
      you're 7 days of content-in away from a live site.
    </p>
    ${button(paymentLink, 'Pay securely & book your week')}
    <p style="color:#6b7280;font-size:13px;line-height:1.6;margin-top:20px;">
      Changed your mind, or have questions first? Just reply — no hard feelings
      either way.
    </p>
    <p style="color:#374151;font-size:15px;">— Bruno</p>
  `)
}

export function contentNudgeEmailHtml({ name, portalUrl }) {
  const first = name ? name.split(' ')[0] : 'there'
  return wrap(`
    <h1 style="color:#111827;font-size:22px;margin:0 0 16px;">Your build week is waiting on your content</h1>
    <p style="color:#374151;font-size:15px;line-height:1.6;">Hi ${first},</p>
    <p style="color:#374151;font-size:15px;line-height:1.6;">
      Everything on our side is ready to go — we're just missing your content.
      The 7-day clock starts the moment it lands, so the sooner it's in, the
      sooner you're live.
    </p>
    <p style="color:#374151;font-size:15px;line-height:1.6;">
      Rough is absolutely fine: bullet points instead of polished text, phone
      photos instead of a photoshoot. We polish.
    </p>
    ${portalUrl ? button(portalUrl, 'Upload your content') : ''}
    <p style="color:#6b7280;font-size:13px;line-height:1.6;margin-top:20px;">
      Stuck on what to write? Reply to this email and we'll figure it out together.
    </p>
    <p style="color:#374151;font-size:15px;">— Bruno</p>
  `)
}

export function onboardingEmailHtml({ name, portalUrl }) {
  const first = name ? name.split(' ')[0] : 'there'
  const portalBlock = portalUrl
    ? `
    <p style="color:#374151;font-size:15px;line-height:1.6;">
      Your personal client portal is ready — upload your content there and
      follow the build in real time:
    </p>
    ${button(portalUrl, 'Open your client portal')}
    <p style="color:#6b7280;font-size:13px;line-height:1.6;">
      This link is personal to your project — no password needed. Keep it handy.
    </p>`
    : `
    <p style="color:#374151;font-size:15px;line-height:1.6;">
      Reply to this email with your text, images and logo. Rough is fine; we polish.
    </p>`
  return wrap(`
    <h1 style="color:#111827;font-size:22px;margin:0 0 16px;">Payment received — you're in! 🎉</h1>
    <p style="color:#374151;font-size:15px;line-height:1.6;">Hi ${first},</p>
    <p style="color:#374151;font-size:15px;line-height:1.6;">
      Your build slot is booked. Here's what happens next:
    </p>
    <ol style="color:#374151;font-size:15px;line-height:1.8;padding-left:20px;">
      <li><strong>Content in</strong> — send your text, images and logo.</li>
      <li><strong>We build</strong> — design and code, written for your business. You'll get a preview link.</li>
      <li><strong>You're live</strong> — final approval, then launch on your domain, with 30 days of free support.</li>
    </ol>
    ${portalBlock}
    <p style="color:#374151;font-size:15px;line-height:1.6;">
      The 7-day clock starts the moment your content lands.
    </p>
    <p style="color:#374151;font-size:15px;">— Bruno</p>
  `)
}
