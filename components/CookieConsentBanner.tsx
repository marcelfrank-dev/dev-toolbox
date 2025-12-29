'use client'

import { useEffect, useState } from 'react'

const ENABLE_COOKIE_CONSENT =
  process.env.NEXT_PUBLIC_ENABLE_COOKIE_CONSENT === 'true'

type ConsentState = 'accepted' | 'rejected' | 'unset'

export function CookieConsentBanner() {
  const [consent, setConsent] = useState<ConsentState>('unset')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!ENABLE_COOKIE_CONSENT) return

    const stored = window.localStorage.getItem('cookie-consent')
    if (stored === 'accepted' || stored === 'rejected') {
      setConsent(stored)
    }
    setMounted(true)
  }, [])

  const handleConsent = (value: ConsentState) => {
    setConsent(value)
    window.localStorage.setItem('cookie-consent', value)
  }

  if (!ENABLE_COOKIE_CONSENT || !mounted || consent !== 'unset') {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="pointer-events-auto max-w-2xl rounded-xl border border-zinc-800 bg-zinc-900/95 p-4 shadow-lg backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-zinc-200">
            <p className="font-medium text-zinc-100">Cookie notice</p>
            <p className="mt-1 text-xs text-zinc-400">
              Dev Toolbox currently does not use tracking cookies. This banner is a placeholder
              for future monetization/ads and can be enabled or disabled via feature flag.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => handleConsent('rejected')}
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:border-zinc-600 hover:text-zinc-100"
            >
              Dismiss
            </button>
            <button
              type="button"
              onClick={() => handleConsent('accepted')}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


