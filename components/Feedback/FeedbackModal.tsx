'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface FeedbackModalProps {
    isOpen: boolean
    onClose: () => void
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
    const [summary, setSummary] = useState('')
    const [description, setDescription] = useState('')
    const modalRef = useRef<HTMLDivElement>(null)

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            }
        },
        [onClose]
    )

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'hidden'
            modalRef.current?.focus()
        } else {
            document.body.style.overflow = ''
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
        }
    }, [isOpen, handleKeyDown])

    if (!isOpen) return null

    const handleSend = () => {
        const email = 'tdt@mf-development.de'
        const subject = encodeURIComponent(`Feedback: ${summary}`)
        const body = encodeURIComponent(description)
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
        onClose()
    }

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-modal-title"
        >
            <div
                ref={modalRef}
                tabIndex={-1}
                className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl focus:outline-none animate-enter"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
                    <h2 id="feedback-modal-title" className="text-xl font-semibold text-zinc-100">
                        Request a Tool
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                        aria-label="Close modal"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-4 p-6">
                    <div>
                        <label htmlFor="summary" className="mb-2 block text-sm font-medium text-zinc-300">
                            Summary
                        </label>
                        <input
                            id="summary"
                            type="text"
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            placeholder="Briefly describe the tool or issue"
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="mb-2 block text-sm font-medium text-zinc-300">
                            Description
                        </label>
                        <textarea
                            id="description"
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tell us more about what you need..."
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end border-t border-zinc-800 px-6 py-4">
                    <button
                        onClick={handleSend}
                        disabled={!summary.trim() || !description.trim()}
                        className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                        Send Feedback
                    </button>
                </div>
            </div>
        </div>
    )
}
