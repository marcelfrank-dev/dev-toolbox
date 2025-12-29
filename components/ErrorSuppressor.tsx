'use client'

import { useEffect } from 'react'

/**
 * Suppresses harmless errors from browser extensions (especially ad blockers)
 * that interfere with message passing but don't affect functionality
 */
export function ErrorSuppressor() {
  useEffect(() => {
    // Suppress the common browser extension error
    const originalError = window.console.error
    const originalUnhandledRejection = window.onunhandledrejection

    // Filter out the specific extension error
    window.console.error = (...args: unknown[]) => {
      const message = args[0]?.toString() || ''
      // Suppress the message channel error from browser extensions
      if (
        message.includes('message channel closed') ||
        message.includes('asynchronous response') ||
        message.includes('listener indicated')
      ) {
        // Silently ignore - this is from browser extensions, not our code
        return
      }
      // Log other errors normally
      originalError.apply(window.console, args)
    }

    // Also handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const message = event.reason?.toString() || ''
      if (
        message.includes('message channel closed') ||
        message.includes('asynchronous response') ||
        message.includes('listener indicated')
      ) {
        // Prevent the error from showing in console
        event.preventDefault()
        return
      }
    })

    // Cleanup on unmount
    return () => {
      window.console.error = originalError
      if (originalUnhandledRejection) {
        window.onunhandledrejection = originalUnhandledRejection
      }
    }
  }, [])

  return null
}

