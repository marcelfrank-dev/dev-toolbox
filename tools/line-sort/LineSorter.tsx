'use client'

import { useState, useCallback } from 'react'
import { CopyButton } from '@/components/CopyButton'

type SortType = 'alphabetical' | 'numeric' | 'length' | 'random'

export default function LineSorter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [sortType, setSortType] = useState<SortType>('alphabetical')
  const [reverse, setReverse] = useState(false)
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [removeBlanks, setRemoveBlanks] = useState(false)

  const sort = useCallback(() => {
    let lines = input.split('\n')

    if (removeBlanks) {
      lines = lines.filter((line) => line.trim())
    }

    const compareFn = (a: string, b: string): number => {
      const aVal = caseSensitive ? a : a.toLowerCase()
      const bVal = caseSensitive ? b : b.toLowerCase()

      switch (sortType) {
        case 'alphabetical':
          return aVal.localeCompare(bVal)
        case 'numeric':
          const numA = parseFloat(a) || 0
          const numB = parseFloat(b) || 0
          return numA - numB
        case 'length':
          return a.length - b.length
        case 'random':
          return Math.random() - 0.5
        default:
          return 0
      }
    }

    lines.sort(compareFn)

    if (reverse && sortType !== 'random') {
      lines.reverse()
    }

    setOutput(lines.join('\n'))
  }, [input, sortType, reverse, caseSensitive, removeBlanks])

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[150px]">
          <label className="mb-2 block text-sm font-medium text-zinc-400">Sort Type</label>
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value as SortType)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
          >
            <option value="alphabetical">Alphabetical (A-Z)</option>
            <option value="numeric">Numeric</option>
            <option value="length">By Length</option>
            <option value="random">Random Shuffle</option>
          </select>
        </div>
        <div className="flex flex-wrap items-end gap-4">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={reverse}
              onChange={(e) => setReverse(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-sm text-zinc-300">Reverse</span>
          </label>
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
              checked={removeBlanks}
              onChange={(e) => setRemoveBlanks(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-sm text-zinc-300">Remove Blank Lines</span>
          </label>
        </div>
      </div>

      {/* Input */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">
          Input ({input.split('\n').length} lines)
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter lines to sort (one per line)..."
          className="h-40 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
        />
      </div>

      {/* Sort Button */}
      <button
        onClick={sort}
        disabled={!input}
        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Sort Lines
      </button>

      {/* Output */}
      {output && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-400">
              Output ({output.split('\n').length} lines)
            </label>
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

