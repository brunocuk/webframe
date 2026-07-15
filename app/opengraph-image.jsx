import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Webframe — Your Custom Website. In 7 Days.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background: 'linear-gradient(135deg, #0d0a14 0%, #161221 60%, #1e1533 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              border: '5px solid #4b2bff',
              display: 'flex',
            }}
          />
          <div style={{ color: '#ffffff', fontSize: 40, fontWeight: 700 }}>webframe</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              color: '#ffffff',
              fontSize: 92,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -3,
            }}
          >
            Your Custom Website.
          </div>
          <div
            style={{
              fontSize: 92,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -3,
              background: 'linear-gradient(90deg, #7c5cff, #b573ff, #60a5fa)',
              backgroundClip: 'text',
              color: 'transparent',
              fontStyle: 'italic',
            }}
          >
            In 7 Days.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 28 }}>
            Hand-coded. No templates. Fixed pricing.
          </div>
          <div
            style={{
              color: '#b573ff',
              fontSize: 24,
              fontFamily: 'monospace',
            }}
          >
            web-frame.eu
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
