'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

interface AdPlacementProps {
  position: '1593654749' | '1190330064'
  className?: string
  slot?: 'top-banner' | 'in-content' // For horizontal ads: distinguish between top banner and in-content
}

const ENABLE_AD_PLACEHOLDERS = process.env.NEXT_PUBLIC_ENABLE_AD_PLACEHOLDERS === 'true'
const ADSENSE_PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID

export function AdPlacement({ position, className = '', slot }: AdPlacementProps) {
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

    // Wait for AdSense script to load, then initialize ad
    let retryCount = 0
    const maxRetries = 50 // 5 seconds max wait time

    const initializeAd = () => {
      if (typeof window === 'undefined') return

      // Initialize adsbygoogle array if it doesn't exist
      if (!(window as Window & { adsbygoogle?: unknown[] }).adsbygoogle) {
        ;(window as Window & { adsbygoogle?: unknown[] }).adsbygoogle = []
      }

      const adsbygoogle = (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle

      if (adsbygoogle && Array.isArray(adsbygoogle)) {
        try {
          // Push ad to AdSense - this initializes the ad
          adsbygoogle.push({})
        } catch (e) {
          console.error('AdSense initialization error:', e)
        }
      } else if (retryCount < maxRetries) {
        // If script not loaded yet, wait a bit and retry
        retryCount++
        setTimeout(initializeAd, 100)
      } else {
        console.warn('AdSense script failed to load after maximum retries')
      }
    }

    // Start initialization after a short delay to ensure script is loaded
    setTimeout(initializeAd, 100)
  }, [position])

  // Show ClipStack custom ad in top banner slot (always show, even with AdSense)
  if (position === '1593654749' && slot === 'top-banner') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <a
          href="https://apps.apple.com/de/app/clipstack-clip-shortcuts/id6747712458"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full max-w-[728px] transition-opacity hover:opacity-90"
        >
          <Image
            src="/ClipStack-ad-728x90.jpg"
            alt="ClipStack - your productivity booster! for MacOS"
            width={728}
            height={90}
            className="w-full h-auto rounded-lg"
            priority={false}
          />
        </a>
      </div>
    )
  }

  // Show placeholder if enabled and no AdSense (for sidebar or other positions)
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

  // Render actual AdSense ad (for in-content or when AdSense is configured)
  if (ADSENSE_PUBLISHER_ID) {
    const slotId = getAdSlotId()
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
          data-ad-slot={slotId}
          data-ad-format={position === '1190330064' ? 'rectangle' : 'horizontal'}
          data-full-width-responsive="true"
        />
      </div>
    )
  }

  // Default: return nothing if ads are disabled
  return null
}

