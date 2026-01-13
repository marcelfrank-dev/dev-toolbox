'use client'

import { useEffect } from 'react'

export function AdBlockDismissal() {
    useEffect(() => {
        // Function to remove the adblock modal
        const removeAdBlockModal = () => {
            const modal = document.querySelector('.fc-ab-root')
            if (modal) {
                modal.remove()
                // Optional: Remove the hash from the URL to clean it up
                if (window.location.hash === '#dismiss-adblock') {
                    history.replaceState(null, '', window.location.pathname + window.location.search)
                }
            }
        }

        // Check on initial load
        if (window.location.hash === '#dismiss-adblock' || window.location.search.includes('dismiss-adblock')) {
            removeAdBlockModal()

            // Also set up a mutation observer in case the modal is injected after load
            // This ensures we catch it even if it loads late
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length) {
                        removeAdBlockModal()
                    }
                })
            })

            observer.observe(document.body, { childList: true, subtree: false })

            // Cleanup observer after 10 seconds to avoid indefinite monitoring
            setTimeout(() => observer.disconnect(), 10000)
        }

        // Listen for hash changes (in case the button doesn't trigger a reload but just a hash change)
        const handleHashChange = () => {
            if (window.location.hash === '#dismiss-adblock') {
                removeAdBlockModal()
            }
        }

        window.addEventListener('hashchange', handleHashChange)
        return () => window.removeEventListener('hashchange', handleHashChange)
    }, [])

    return null
}
