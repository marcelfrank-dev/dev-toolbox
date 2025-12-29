'use client'

export function ClipStackBanner() {
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
          src="/ClipStack-banner-728x90.jpg"
          alt="ClipStack - your productivity booster! for MacOS"
          width={728}
          height={90}
          className="w-full h-auto rounded-lg"
          loading="lazy"
          onError={(e) => {
            // Silently handle if image is blocked by ad blocker
            const target = e.target as HTMLImageElement
            if (target) {
              target.style.display = 'none'
            }
          }}
        />
      </a>
    </div>
  )
}

