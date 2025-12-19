'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function ShuffleLines() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  const shuffle = () => {
    if (!input) return
    const lines = input.split('\n').filter((line) => line.trim())
    const shuffled = shuffleArray(lines)
    setOutput(shuffled.join('\n'))
  }

  const clear = () => {
    setInput('')
    setOutput('')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="shuffle-input" className="text-sm font-medium text-zinc-300">
            Input Text (one line per item)
          </label>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
        <textarea
          id="shuffle-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              e.preventDefault()
              shuffle()
            }
          }}
          placeholder="Enter text with one item per line..."
          className="h-32 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <button
        onClick={shuffle}
        disabled={!input.trim()}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Shuffle Lines (Ctrl+Enter)
      </button>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="shuffle-output" className="text-sm font-medium text-zinc-300">
            Shuffled Output
          </label>
          <CopyButton text={output} />
        </div>
        <textarea
          id="shuffle-output"
          value={output}
          readOnly
          className="h-32 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>
    </div>
  )
}

