'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function parseUrl(url: string): Record<string, string> {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : 'https://' + url)
    const params: Record<string, string> = {}
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value
    })

    return {
      protocol: urlObj.protocol,
      hostname: urlObj.hostname,
      port: urlObj.port || '(default)',
      pathname: urlObj.pathname,
      search: urlObj.search,
      hash: urlObj.hash,
      origin: urlObj.origin,
      href: urlObj.href,
      queryParams: Object.keys(params).length > 0 ? JSON.stringify(params, null, 2) : '(none)',
    }
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : 'Invalid URL',
    }
  }
}

export default function UrlParser() {
  const [input, setInput] = useState('')
  const parsed = input ? parseUrl(input) : null

  const clear = () => setInput('')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="url-input" className="text-sm font-medium text-zinc-300">
            URL
          </label>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
        <input
          id="url-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter URL to parse (e.g., https://example.com/path?key=value#hash)..."
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      {parsed && (
        <div className="flex flex-col gap-3">
          {parsed.error ? (
            <div className="rounded-lg border border-red-800 bg-red-900/20 p-4">
              <p className="text-sm text-red-400">{parsed.error}</p>
            </div>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(parsed)
                  .filter(([key]) => key !== 'queryParams')
                  .map(([key, value]) => (
                    <div key={key} className="flex flex-col gap-1 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
                      <span className="text-xs font-medium text-zinc-500 uppercase">{key}</span>
                      <code className="text-sm text-zinc-200">{value}</code>
                    </div>
                  ))}
              </div>
              {parsed.queryParams && parsed.queryParams !== '(none)' && (
                <div className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-300">Query Parameters</span>
                    <CopyButton text={parsed.queryParams} />
                  </div>
                  <pre className="overflow-x-auto rounded border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-200">
                    {parsed.queryParams}
                  </pre>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

