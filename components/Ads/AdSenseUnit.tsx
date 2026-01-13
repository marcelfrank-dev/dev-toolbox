'use client'

import { useEffect, useRef, useState } from 'react'

interface AdSenseUnitProps {
    slot: string
    format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle'
    responsive?: boolean
    className?: string
}

declare global {
    interface Window {
        adsbygoogle: unknown[]
    }
}

export function AdSenseUnit({
    slot,
    format = 'auto',
    responsive = true,
    className = '',
}: AdSenseUnitProps) {
    const adRef = useRef<HTMLModElement>(null)
    const [adError, setAdError] = useState(false)

    useEffect(() => {
        // Check if publisher ID is configured
        const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID
        if (!publisherId || !slot) {
            setAdError(true)
            return
        }

        try {
            // Initialize the ad
            ; (window.adsbygoogle = window.adsbygoogle || []).push({})
        } catch {
            setAdError(true)
        }
    }, [slot])

    // Don't render anything if there's an error or no slot configured
    if (adError || !slot) {
        return null
    }

    const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID

    return (
        <div className={`ad-container ${className}`}>
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={{
                    display: 'block',
                    minHeight: responsive ? '90px' : 'auto',
                }}
                data-ad-client={publisherId}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive ? 'true' : 'false'}
            />
        </div>
    )
}
