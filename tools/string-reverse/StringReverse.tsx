'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function reverseString(text: string): string {
  return text.split('').reverse().join('')
}

function reverseWords(text: string): string {
  return text.split(/\s+/).reverse().join(' ')
}

function reverseLines(text: string): string {
  return text.split('\n').reverse().join('\n')
}

export default function StringReverse() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'string' | 'words' | 'lines'>('string')

  const output =
    input && mode === 'string'
      ? reverseString(input)
      : input && mode === 'words'
        ? reverseWords(input)
        : input && mode === 'lines'
          ? reverseLines(input)
          : ''

  const clear = () => setInput('')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="reverse-input" className="text-sm font-medium text-zinc-300">
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
          id="reverse-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to reverse..."
          className="h-32 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-zinc-300">Reverse Mode:</label>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('string')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === 'string'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}
          >
            Characters
          </button>
          <button
            onClick={() => setMode('words')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === 'words'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}
          >
            Words
          </button>
          <button
            onClick={() => setMode('lines')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === 'lines'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}
          >
            Lines
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="reverse-output" className="text-sm font-medium text-zinc-300">
            Reversed Output
          </label>
          <CopyButton text={output} />
        </div>
        <textarea
          id="reverse-output"
          value={output}
          readOnly
          className="h-32 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>
    </div>
  )
}

