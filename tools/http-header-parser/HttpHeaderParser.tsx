'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function parseHeaders(headerText: string): Record<string, string> {
  const headers: Record<string, string> = {}
  const lines = headerText.split('\n')

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const colonIndex = trimmed.indexOf(':')
    if (colonIndex === -1) continue

    const key = trimmed.substring(0, colonIndex).trim()
    const value = trimmed.substring(colonIndex + 1).trim()
    headers[key] = value
  }

  return headers
}

export default function HttpHeaderParser() {
  const [input, setInput] = useState('')
  const parsed = input ? parseHeaders(input) : null

  const clear = () => setInput('')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="header-input" className="text-sm font-medium text-zinc-300">
            HTTP Headers
          </label>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
        <textarea
          id="header-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Content-Type: application/json&#10;Authorization: Bearer token&#10;User-Agent: MyApp/1.0"
          className="h-32 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      {parsed && Object.keys(parsed).length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-300">Parsed Headers</span>
            <CopyButton text={JSON.stringify(parsed, null, 2)} />
          </div>
          <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900/50">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="p-3 text-left text-sm font-medium text-zinc-300">Header</th>
                  <th className="p-3 text-left text-sm font-medium text-zinc-300">Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(parsed).map(([key, value], i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="p-3">
                      <code className="text-sm text-emerald-400">{key}</code>
                    </td>
                    <td className="p-3 text-sm text-zinc-300">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

