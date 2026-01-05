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

        {/* Grid pattern overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
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
              width: '120px',
              height: '120px',
              borderRadius: '60px',
              background: '#09090b',
              border: '2px solid rgba(16, 185, 129, 0.5)',
              marginBottom: '32px',
              boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)',
              position: 'relative',
            }}
          >
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.8))' }}
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 800,
              color: 'white',
              margin: 0,
              textAlign: 'center',
              letterSpacing: '-2px',
              textShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}
          >
            Tiny Dev Tools
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '28px',
              color: '#a1a1aa',
              margin: '16px 0 0 0',
              textAlign: 'center',
              fontWeight: 500,
            }}
          >
            170+ Free Online Developer Utilities
          </p>

          {/* Tool badges */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginTop: '40px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              maxWidth: '900px',
            }}
          >
            {[
              'JSON Formatter',
              'Base64',
              'UUID Generator',
              'Hash Generator',
              'Regex Tester',
              'Color Converter',
              '+170 utility tools',
            ].map((tool) => (
              <div
                key={tool}
                style={{
                  padding: '8px 20px',
                  borderRadius: '20px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#d4d4d8',
                  fontSize: '18px',
                }}
              >
                {tool}
              </div>
            ))}
          </div>

          {/* Footer tagline */}
          <p
            style={{
              fontSize: '20px',
              color: '#71717a',
              margin: '48px 0 0 0',
              textAlign: 'center',
            }}
          >
            All tools run locally in your browser • No data sent to servers
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

