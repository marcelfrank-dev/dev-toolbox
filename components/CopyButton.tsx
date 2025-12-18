'use client'

import { copyToClipboard } from '@/lib/clipboard'
import { useToast } from './Toast'

interface CopyButtonProps {
  text: string
  className?: string
  label?: string
}

export function CopyButton({ text, className = '', label = 'Copy' }: CopyButtonProps) {
  const { showToast } = useToast()

  const handleCopy = async () => {
    const success = await copyToClipboard(text)
    if (success) {
      showToast('Copied to clipboard!', 'success')
    } else {
      showToast('Failed to copy', 'error')
    }
  }

  return (
    <button
      onClick={handleCopy}
      disabled={!text}
      className={`inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      aria-label="Copy to clipboard"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      {label}
    </button>
  )
}
