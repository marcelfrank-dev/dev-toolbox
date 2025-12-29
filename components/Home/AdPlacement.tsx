'use client'

import { useEffect, useRef, useState } from 'react'

interface AdPlacementProps {
  position: '1593654749' | '1190330064'
  className?: string
}

const ENABLE_AD_PLACEHOLDERS = process.env.NEXT_PUBLIC_ENABLE_AD_PLACEHOLDERS === 'true'
const ADSENSE_PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID

export function AdPlacement({ position, className = '' }: AdPlacementProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const [adSenseAvailable, setAdSenseAvailable] = useState<boolean | null>(null)

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

  // Initialize AdSense ad immediately after element is rendered
  useEffect(() => {
    if (!ADSENSE_PUBLISHER_ID || !adRef.current) {
      setAdSenseAvailable(false)
      return
    }

    // Check if AdSense script is available (might be blocked by ad blocker)
    const checkAdSenseAvailable = () => {
      if (typeof window === 'undefined') return false
      // Check if adsbygoogle exists (script loaded)
      return typeof (window as Window & { adsbygoogle?: unknown }).adsbygoogle !== 'undefined'
    }

    // Initialize adsbygoogle array if it doesn't exist (as per AdSense docs)
    if (typeof window !== 'undefined') {
      if (!(window as Window & { adsbygoogle?: unknown[] }).adsbygoogle) {
        ;(window as Window & { adsbygoogle?: unknown[] }).adsbygoogle = []
      }
    }

    // Wait for AdSense script to load, then initialize ad
    let retryCount = 0
    const maxRetries = 100 // 10 seconds max wait time (increased for slower connections)

    const initializeAd = () => {
      if (typeof window === 'undefined' || !adRef.current) return

      // Check if script is available
      if (checkAdSenseAvailable()) {
        setAdSenseAvailable(true)

        const adsbygoogle = (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle

        if (adsbygoogle && Array.isArray(adsbygoogle)) {
          try {
            // Push ad to AdSense - this initializes the ad
            // This matches the official AdSense code: (adsbygoogle = window.adsbygoogle || []).push({})
            adsbygoogle.push({})
          } catch (error) {
            // Silently handle errors - ad blockers may cause this
            console.debug('AdSense ad initialization failed:', error)
            setAdSenseAvailable(false)
          }
        }
      } else if (retryCount < maxRetries) {
        // If script not loaded yet, wait a bit and retry
        retryCount++
        setTimeout(initializeAd, 100)
      } else {
        // Script failed to load (likely blocked by ad blocker)
        setAdSenseAvailable(false)
      }
    }

    // Start initialization immediately (script should be in head)
    initializeAd()
  }, [position])


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
    // Don't render ad container if AdSense is confirmed to be unavailable
    if (adSenseAvailable === false) {
      return null
    }

    const slotId = getAdSlotId()
    
    // Use fixed dimensions as per AdSense recommendations
    const adStyle = position === '1190330064' 
      ? { display: 'inline-block', width: '300px', height: '250px' }
      : { display: 'inline-block', width: '728px', height: '90px' }
    
    return (
      <div
        ref={adRef}
        className={`ad-container ${className}`}
        style={{ minHeight: position === '1190330064' ? '250px' : '90px' }}
      >
        <ins
          className="adsbygoogle"
          style={adStyle}
          data-ad-client={ADSENSE_PUBLISHER_ID}
          data-ad-slot={slotId}
        />
      </div>
    )
  }

  // Default: return nothing if ads are disabled
  return null
}

