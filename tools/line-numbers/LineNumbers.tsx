'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function addLineNumbers(text: string, startAt: number, format: string): string {
  const lines = text.split('\n')
  return lines
    .map((line, index) => {
      const lineNum = startAt + index
      const formatted = format.replace('{n}', lineNum.toString())
      return `${formatted}${line}`
    })
    .join('\n')
}

function removeLineNumbers(text: string): string {
  return text
    .split('\n')
    .map((line) => line.replace(/^\s*\d+\s*[:\-\.]?\s*/, ''))
    .join('\n')
}

export default function LineNumbers() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'add' | 'remove'>('add')
  const [startAt, setStartAt] = useState(1)
  const [format, setFormat] = useState('{n}: ')

  const output =
    input && mode === 'add'
      ? addLineNumbers(input, startAt, format)
      : input && mode === 'remove'
        ? removeLineNumbers(input)
        : ''

  const clear = () => {
    setInput('')
    setStartAt(1)
    setFormat('{n}: ')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="linenums-input" className="text-sm font-medium text-zinc-300">
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
          id="linenums-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to add or remove line numbers..."
          className="h-32 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-zinc-300">Mode:</label>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('add')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === 'add'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}
          >
            Add
          </button>
          <button
            onClick={() => setMode('remove')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === 'remove'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}
          >
            Remove
          </button>
        </div>
      </div>

      {mode === 'add' && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="start-at" className="text-sm font-medium text-zinc-300">
              Start At
            </label>
            <input
              id="start-at"
              type="number"
              min="0"
              value={startAt}
              onChange={(e) => setStartAt(Math.max(0, parseInt(e.target.value) || 0))}
              className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="line-format" className="text-sm font-medium text-zinc-300">
              Format (use {'{n}'} for number)
            </label>
            <input
              id="line-format"
              type="text"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              placeholder="{n}: "
              className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            />
            <div className="flex gap-2 text-xs text-zinc-500">
              <button
                onClick={() => setFormat('{n}: ')}
                className="hover:text-zinc-300"
              >
                {'{n}'}: 
              </button>
              <button
                onClick={() => setFormat('{n}. ')}
                className="hover:text-zinc-300"
              >
                {'{n}'}. 
              </button>
              <button
                onClick={() => setFormat('{n} - ')}
                className="hover:text-zinc-300"
              >
                {'{n}'} - 
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="linenums-output" className="text-sm font-medium text-zinc-300">
            Output
          </label>
          <CopyButton text={output} />
        </div>
        <textarea
          id="linenums-output"
          value={output}
          readOnly
          className="h-32 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>
    </div>
  )
}

