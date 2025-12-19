'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function truncateText(text: string, maxLength: number, ellipsis: string, mode: 'chars' | 'words'): string {
  if (mode === 'chars') {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + ellipsis
  } else {
    const words = text.split(/\s+/)
    if (words.length <= maxLength) return text
    return words.slice(0, maxLength).join(' ') + ellipsis
  }
}

export default function TextTruncator() {
  const [input, setInput] = useState('')
  const [maxLength, setMaxLength] = useState(100)
  const [ellipsis, setEllipsis] = useState('...')
  const [mode, setMode] = useState<'chars' | 'words'>('chars')

  const output = input ? truncateText(input, maxLength, ellipsis, mode) : ''

  const clear = () => {
    setInput('')
    setMaxLength(100)
    setEllipsis('...')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="truncate-input" className="text-sm font-medium text-zinc-300">
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
          id="truncate-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to truncate..."
          className="h-32 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="max-length" className="text-sm font-medium text-zinc-300">
            Max Length
          </label>
          <input
            id="max-length"
            type="number"
            min="1"
            value={maxLength}
            onChange={(e) => setMaxLength(Math.max(1, parseInt(e.target.value) || 1))}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="ellipsis" className="text-sm font-medium text-zinc-300">
            Ellipsis
          </label>
          <input
            id="ellipsis"
            type="text"
            value={ellipsis}
            onChange={(e) => setEllipsis(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-zinc-300">Mode:</label>
          <div className="flex gap-2">
            <button
              onClick={() => setMode('chars')}
              className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                mode === 'chars'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
              }`}
            >
              Characters
            </button>
            <button
              onClick={() => setMode('words')}
              className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                mode === 'words'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
              }`}
            >
              Words
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="truncate-output" className="text-sm font-medium text-zinc-300">
            Truncated Output
          </label>
          <CopyButton text={output} />
        </div>
        <textarea
          id="truncate-output"
          value={output}
          readOnly
          className="h-24 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>
    </div>
  )
}

