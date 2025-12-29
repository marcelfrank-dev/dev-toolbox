'use client'

import { useEffect, useRef } from 'react'

interface AdPlacementProps {
  position: '1593654749' | '1190330064'
  className?: string
}

const ENABLE_AD_PLACEHOLDERS = process.env.NEXT_PUBLIC_ENABLE_AD_PLACEHOLDERS === 'true'
const ADSENSE_PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID

export function AdPlacement({ position, className = '' }: AdPlacementProps) {
  const adRef = useRef<HTMLDivElement>(null)

  const getAdDimensions = () => {
    switch (position) {
      case '1593654749': // Top Banner / In-Content
        return '728x90'
      case '1190330064': // Sidebar
        return '300x250'
      default:
        return '728x90'
    }
  }

  const getAdSlotId = () => {
    // Use the position directly as it's the AdSense slot ID
    return position
  }

  // Load AdSense ads when enabled
  useEffect(() => {
    if (!ADSENSE_PUBLISHER_ID || !adRef.current) return

    // Check if AdSense script is already loaded
    if (typeof window !== 'undefined') {
      const adsbygoogle = (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle
      if (adsbygoogle) {
        try {
          // Push ad to AdSense
          adsbygoogle.push({})
        } catch (e) {
          console.error('AdSense error:', e)
        }
      }
    }
  }, [position])

  // Show placeholder if enabled and no AdSense
  if (ENABLE_AD_PLACEHOLDERS && !ADSENSE_PUBLISHER_ID) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/30 ${className}`}
        style={{ minHeight: position === '1190330064' ? '250px' : '90px' }}
      >
        <div className="text-center">
          <p className="text-xs text-zinc-600">Ad Space</p>
          <p className="mt-1 text-xs text-zinc-700">{getAdDimensions()}</p>
        </div>
      </div>
    )
  }

  // Render actual AdSense ad
  if (ADSENSE_PUBLISHER_ID) {
    return (
      <div
        ref={adRef}
        className={`ad-container ${className}`}
        style={{ minHeight: position === '1190330064' ? '250px' : '90px' }}
      >
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={ADSENSE_PUBLISHER_ID}
          data-ad-slot={getAdSlotId()}
          data-ad-format={position === '1190330064' ? 'rectangle' : 'horizontal'}
          data-full-width-responsive="true"
        />
      </div>
    )
  }

  // Default: return nothing if ads are disabled
  return null
}

