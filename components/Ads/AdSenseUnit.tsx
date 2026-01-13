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
    const containerRef = useRef<HTMLDivElement>(null)
    const [adError, setAdError] = useState(false)
    const [allowInteraction, setAllowInteraction] = useState(false)

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

    // Handle scroll events to disable pointer events during scroll
    useEffect(() => {
        let scrollTimeout: NodeJS.Timeout

        const handleScroll = () => {
            // Disable interaction during scroll
            setAllowInteraction(false)

            // Re-enable after scrolling stops
            clearTimeout(scrollTimeout)
            scrollTimeout = setTimeout(() => {
                setAllowInteraction(true)
            }, 150)
        }

        // Enable interaction after initial load
        const enableTimeout = setTimeout(() => {
            setAllowInteraction(true)
        }, 1000)

        window.addEventListener('scroll', handleScroll, true)
        window.addEventListener('touchmove', handleScroll, true)

        return () => {
            window.removeEventListener('scroll', handleScroll, true)
            window.removeEventListener('touchmove', handleScroll, true)
            clearTimeout(scrollTimeout)
            clearTimeout(enableTimeout)
        }
    }, [])

    // Don't render anything if there's an error or no slot configured
    if (adError || !slot) {
        return null
    }

    const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID

    return (
        <div
            ref={containerRef}
            className={`ad-container ${className}`}
            style={{
                pointerEvents: allowInteraction ? 'auto' : 'none',
            }}
        >
            <ins
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
