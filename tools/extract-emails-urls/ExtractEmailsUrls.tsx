'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
const URL_REGEX = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/gi

function extractEmails(text: string): string[] {
  const matches = text.match(EMAIL_REGEX) || []
  return [...new Set(matches)]
}

function extractUrls(text: string): string[] {
  const matches = text.match(URL_REGEX) || []
  return [...new Set(matches)]
}

export default function ExtractEmailsUrls() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'emails' | 'urls' | 'both'>('both')

  const emails = input ? extractEmails(input) : []
  const urls = input ? extractUrls(input) : []

  const output =
    mode === 'emails'
      ? emails.join('\n')
      : mode === 'urls'
        ? urls.join('\n')
        : [...emails, ...urls].join('\n')

  const clear = () => setInput('')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="extract-input" className="text-sm font-medium text-zinc-300">
            Input Text
          </label>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
        <textarea
          id="extract-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text containing emails and/or URLs..."
          className="h-32 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-zinc-300">Extract:</label>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('emails')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === 'emails'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}
          >
            Emails ({emails.length})
          </button>
          <button
            onClick={() => setMode('urls')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === 'urls'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}
          >
            URLs ({urls.length})
          </button>
          <button
            onClick={() => setMode('both')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === 'both'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}
          >
            Both ({emails.length + urls.length})
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="extract-output" className="text-sm font-medium text-zinc-300">
            Extracted {mode === 'emails' ? 'Emails' : mode === 'urls' ? 'URLs' : 'Items'}
          </label>
          <CopyButton text={output} />
        </div>
        <textarea
          id="extract-output"
          value={output}
          readOnly
          className="h-32 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>
    </div>
  )
}

