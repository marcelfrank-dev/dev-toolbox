'use client'

import { AdSenseUnit } from '@/components/Ads/AdSenseUnit'

export function ClipStackBanner() {
  const topBannerSlot = process.env.NEXT_PUBLIC_ADSENSE_TOP_BANNER_SLOT

  // If no slot is configured, don't render anything
  if (!topBannerSlot) {
    return null
  }

  return (
    <div className="flex items-center justify-center w-full px-6 pt-6">
      <div className="w-full max-w-[728px]">
        <AdSenseUnit
          slot={topBannerSlot}
          format="horizontal"
          responsive={true}
          className="rounded-lg overflow-hidden"
        />
      </div>
    </div>
  )
}
