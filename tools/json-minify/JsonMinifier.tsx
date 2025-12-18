'use client'

import { useState, useCallback, useMemo } from 'react'
import { CopyButton } from '@/components/CopyButton'

export default function JsonMinifier() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const stats = useMemo(() => {
    const originalSize = new TextEncoder().encode(input).length
    const minifiedSize = new TextEncoder().encode(output).length
    const saved = originalSize - minifiedSize
    const percent = originalSize > 0 ? Math.round((saved / originalSize) * 100) : 0

    return { originalSize, minifiedSize, saved, percent }
  }, [input, output])

  const minify = useCallback(() => {
    setError('')

    if (!input.trim()) {
      setOutput('')
      return
    }

    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON')
      setOutput('')
    }
  }, [input])

  const beautify = useCallback(() => {
    setError('')

    if (!input.trim()) {
      setOutput('')
      return
    }

    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, 2))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON')
      setOutput('')
    }
  }, [input])

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">
          JSON Input ({formatBytes(stats.originalSize)})
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{\n  "key": "value",\n  "array": [1, 2, 3]\n}'
          className="h-48 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={minify}
          disabled={!input.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Minify
        </button>
        <button
          onClick={beautify}
          disabled={!input.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Beautify
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-900/50 bg-red-900/20 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Stats */}
      {output && (
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-3">
            <div className="text-lg font-bold text-zinc-300">{formatBytes(stats.originalSize)}</div>
            <div className="text-xs text-zinc-500">Original</div>
          </div>
          <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-3">
            <div className="text-lg font-bold text-emerald-400">{formatBytes(stats.minifiedSize)}</div>
            <div className="text-xs text-zinc-500">Result</div>
          </div>
          <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-3">
            <div className="text-lg font-bold text-emerald-400">{formatBytes(stats.saved)}</div>
            <div className="text-xs text-zinc-500">Saved</div>
          </div>
          <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-3">
            <div className="text-lg font-bold text-emerald-400">{stats.percent}%</div>
            <div className="text-xs text-zinc-500">Reduction</div>
          </div>
        </div>
      )}

      {/* Output */}
      {output && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-400">Output</label>
            <CopyButton text={output} />
          </div>
          <textarea
            value={output}
            readOnly
            className="h-48 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-emerald-400 focus:outline-none"
          />
        </div>
      )}
    </div>
  )
}

