'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [indentation, setIndentation] = useState(2)

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, indentation))
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON')
      setOutput('')
    }
  }

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON')
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
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="indent" className="text-sm text-zinc-400">
            Indent:
          </label>
          <select
            id="indent"
            value={indentation}
            onChange={(e) => setIndentation(Number(e.target.value))}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-200"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={0}>Tab</option>
          </select>
        </div>
        <button
          onClick={formatJson}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
        >
          Format
        </button>
        <button
          onClick={minifyJson}
          className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-600"
        >
          Minify
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
          <label htmlFor="json-input" className="text-sm font-medium text-zinc-300">
            Input JSON
          </label>
          <textarea
            id="json-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            className="h-64 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-300">Output</label>
            <CopyButton text={output} />
          </div>
          {error ? (
            <div className="flex h-64 items-center justify-center rounded-lg border border-red-900/50 bg-red-950/20 p-4">
              <p className="text-sm text-red-400">❌ {error}</p>
            </div>
          ) : (
            <textarea
              readOnly
              value={output}
              placeholder="Formatted JSON will appear here"
              className="h-64 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900/50 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600"
            />
          )}
        </div>
      </div>
    </div>
  )
}

