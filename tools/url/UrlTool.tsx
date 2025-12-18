'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

export default function UrlTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const encode = () => {
    try {
      setOutput(encodeURIComponent(input))
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Encoding failed')
      setOutput('')
    }
  }

  const decode = () => {
    try {
      setOutput(decodeURIComponent(input))
      setError(null)
    } catch (e) {
      setError('Invalid URL-encoded string')
      setOutput('')
    }
  }

  const encodeAll = () => {
    try {
      setOutput(encodeURI(input))
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Encoding failed')
      setOutput('')
    }
  }

  const clear = () => {
    setInput('')
    setOutput('')
    setError(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={encode}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
        >
          Encode Component
        </button>
        <button
          onClick={encodeAll}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
        >
          Encode URI
        </button>
        <button
          onClick={decode}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
        >
          Decode
        </button>
        <button
          onClick={clear}
          className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
        >
          Clear
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="url-input" className="text-sm font-medium text-zinc-300">
            Input
          </label>
          <textarea
            id="url-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text or URL to encode/decode"
            className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-300">Output</label>
            <CopyButton text={output} />
          </div>
          {error ? (
            <div className="flex h-48 items-center justify-center rounded-lg border border-red-900/50 bg-red-950/20 p-4">
              <p className="text-sm text-red-400">❌ {error}</p>
            </div>
          ) : (
            <textarea
              readOnly
              value={output}
              placeholder="Result will appear here"
              className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900/50 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600"
            />
          )}
        </div>
      </div>
    </div>
  )
}

