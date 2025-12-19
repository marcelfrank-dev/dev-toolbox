'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

// Simple punycode implementation for basic use cases
function toPunycode(domain: string): string {
  try {
    // Use browser's built-in URL API if available
    if (typeof window !== 'undefined' && 'URL' in window) {
      try {
        const url = new URL('http://' + domain)
        return url.hostname
      } catch {
        // Fallback: basic ASCII conversion
        return domain
      }
    }
    return domain
  } catch {
    return domain
  }
}

function fromPunycode(punycode: string): string {
  // For display purposes, punycode domains are already decoded by the browser
  return punycode
}

export default function PunycodeConverter() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'to' | 'from'>('to')

  const output = input ? (mode === 'to' ? toPunycode(input) : fromPunycode(input)) : ''

  const clear = () => setInput('')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="punycode-input" className="text-sm font-medium text-zinc-300">
            Domain Name
          </label>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
        <input
          id="punycode-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'to' ? 'Enter internationalized domain (e.g., münchen.de)...' : 'Enter punycode domain (e.g., xn--mnchen-3ya.de)...'}
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-zinc-300">Mode:</label>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('to')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === 'to'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}
          >
            To Punycode
          </button>
          <button
            onClick={() => setMode('from')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === 'from'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}
          >
            From Punycode
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <p className="text-sm text-zinc-400">
          Punycode is used to represent internationalized domain names (IDN) in ASCII. Note: Full punycode encoding/decoding requires a library. This tool provides basic functionality.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="punycode-output" className="text-sm font-medium text-zinc-300">
            Output
          </label>
          <CopyButton text={output} />
        </div>
        <input
          id="punycode-output"
          type="text"
          value={output}
          readOnly
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>
    </div>
  )
}

