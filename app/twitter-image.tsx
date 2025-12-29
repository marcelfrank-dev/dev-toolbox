import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Tiny Dev Tools - 85+ Free Online Developer Utilities'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              'radial-gradient(circle at 25% 25%, rgba(16, 185, 129, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
            display: 'flex',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
          }}
        >
          {/* Icon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100px',
              height: '100px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              marginBottom: '28px',
              boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)',
            }}
          >
            <svg
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 800,
              color: 'white',
              margin: 0,
              textAlign: 'center',
              letterSpacing: '-2px',
            }}
          >
            Tiny Dev Tools
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '26px',
              color: '#a1a1aa',
              margin: '12px 0 0 0',
              textAlign: 'center',
            }}
          >
            85+ Free Online Developer Utilities
          </p>

          {/* Footer */}
          <p
            style={{
              fontSize: '18px',
              color: '#71717a',
              margin: '32px 0 0 0',
              textAlign: 'center',
            }}
          >
            tiny-dev-tools.vercel.app
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

