'use client'

import { useState, useCallback } from 'react'
import { CopyButton } from '@/components/CopyButton'

export default function DuplicateRemover() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [caseSensitive, setCaseSensitive] = useState(true)
  const [trimLines, setTrimLines] = useState(true)
  const [preserveOrder, setPreserveOrder] = useState(true)
  const [stats, setStats] = useState({ original: 0, unique: 0, removed: 0 })

  const removeDuplicates = useCallback(() => {
    let lines = input.split('\n')
    const originalCount = lines.length

    if (trimLines) {
      lines = lines.map((line) => line.trim())
    }

    const seen = new Set<string>()
    const result: string[] = []

    for (const line of lines) {
      const key = caseSensitive ? line : line.toLowerCase()

      if (!seen.has(key)) {
        seen.add(key)
        result.push(line)
      }
    }

    if (!preserveOrder) {
      result.sort((a, b) => {
        const aVal = caseSensitive ? a : a.toLowerCase()
        const bVal = caseSensitive ? b : b.toLowerCase()
        return aVal.localeCompare(bVal)
      })
    }

    setOutput(result.join('\n'))
    setStats({
      original: originalCount,
      unique: result.length,
      removed: originalCount - result.length,
    })
  }, [input, caseSensitive, trimLines, preserveOrder])

  const findDuplicatesOnly = useCallback(() => {
    let lines = input.split('\n')

    if (trimLines) {
      lines = lines.map((line) => line.trim())
    }

    const counts = new Map<string, number>()

    for (const line of lines) {
      const key = caseSensitive ? line : line.toLowerCase()
      counts.set(key, (counts.get(key) || 0) + 1)
    }

    const duplicates: string[] = []
    for (const [key, count] of counts) {
      if (count > 1) {
        duplicates.push(`${key} (×${count})`)
      }
    }

    setOutput(duplicates.length > 0 ? duplicates.join('\n') : 'No duplicates found')
    setStats({
      original: lines.length,
      unique: counts.size,
      removed: lines.length - counts.size,
    })
  }, [input, caseSensitive, trimLines])

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="flex flex-wrap gap-4">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
          />
          <span className="text-sm text-zinc-300">Case Sensitive</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={trimLines}
            onChange={(e) => setTrimLines(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
          />
          <span className="text-sm text-zinc-300">Trim Whitespace</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={preserveOrder}
            onChange={(e) => setPreserveOrder(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
          />
          <span className="text-sm text-zinc-300">Preserve Order</span>
        </label>
      </div>

      {/* Input */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">
          Input ({input.split('\n').length} lines)
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter lines (one per line)..."
          className="h-40 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={removeDuplicates}
          disabled={!input}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Remove Duplicates
        </button>
        <button
          onClick={findDuplicatesOnly}
          disabled={!input}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Find Duplicates
        </button>
      </div>

      {/* Stats */}
      {output && (
        <div className="flex gap-4 text-sm">
          <span className="text-zinc-400">Original: {stats.original}</span>
          <span className="text-emerald-400">Unique: {stats.unique}</span>
          <span className="text-red-400">Removed: {stats.removed}</span>
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
            className="h-40 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-emerald-400 focus:outline-none"
          />
        </div>
      )}
    </div>
  )
}

