'use client'

import { useState, useEffect } from 'react'

export function ClipStackBanner() {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Try to preload the image to detect if it's blocked
  useEffect(() => {
    const img = new Image()
    img.onload = () => setImageLoaded(true)
    img.onerror = () => setImageError(true)
    // Use a more neutral path
    img.src = '/clipstack-promo.jpg'
  }, [])

  if (imageError) {
    // If image is blocked, show a text-based fallback
    return (
      <div className="flex items-center justify-center w-full px-6 pt-6">
        <a
          href="https://apps.apple.com/de/app/clipstack-clip-shortcuts/id6747712458"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full max-w-[728px] rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-center text-white transition-opacity hover:opacity-90"
        >
          <div className="text-lg font-bold">ClipStack - Your Productivity Booster!</div>
          <div className="text-sm mt-1">Available for macOS</div>
        </a>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center w-full px-6 pt-6">
      <a
        href="https://apps.apple.com/de/app/clipstack-clip-shortcuts/id6747712458"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full max-w-[728px] transition-opacity hover:opacity-90"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/clipstack-promo.jpg"
          alt="ClipStack - your productivity booster! for MacOS"
          width={728}
          height={90}
          className="w-full h-auto rounded-lg"
          loading="lazy"
          onError={() => setImageError(true)}
          onLoad={() => setImageLoaded(true)}
          style={{ display: imageLoaded ? 'block' : 'none' }}
        />
      </a>
    </div>
  )
}

