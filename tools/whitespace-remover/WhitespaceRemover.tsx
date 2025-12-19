'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function removeWhitespace(text: string, options: { spaces: boolean; tabs: boolean; newlines: boolean; leadingTrailing: boolean }): string {
  let result = text

  if (options.leadingTrailing) {
    result = result.split('\n').map((line) => line.trim()).join('\n')
  }

  if (options.newlines) {
    result = result.replace(/\n+/g, ' ')
  }

  if (options.tabs) {
    result = result.replace(/\t+/g, ' ')
  }

  if (options.spaces) {
    result = result.replace(/ +/g, ' ')
  }

  if (options.leadingTrailing) {
    result = result.trim()
  }

  return result
}

export default function WhitespaceRemover() {
  const [input, setInput] = useState('')
  const [options, setOptions] = useState({
    spaces: false,
    tabs: false,
    newlines: false,
    leadingTrailing: false,
  })

  const output = input ? removeWhitespace(input, options) : ''

  const clear = () => {
    setInput('')
    setOptions({ spaces: false, tabs: false, newlines: false, leadingTrailing: false })
  }

  const toggleOption = (key: keyof typeof options) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="whitespace-input" className="text-sm font-medium text-zinc-300">
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
          id="whitespace-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text with whitespace to clean..."
          className="h-32 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-300">Remove Options:</label>
        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={options.spaces}
              onChange={() => toggleOption('spaces')}
              className="rounded border-zinc-700 bg-zinc-900 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
            />
            <span className="text-sm text-zinc-400">Multiple Spaces</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={options.tabs}
              onChange={() => toggleOption('tabs')}
              className="rounded border-zinc-700 bg-zinc-900 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
            />
            <span className="text-sm text-zinc-400">Tabs</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={options.newlines}
              onChange={() => toggleOption('newlines')}
              className="rounded border-zinc-700 bg-zinc-900 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
            />
            <span className="text-sm text-zinc-400">Newlines</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={options.leadingTrailing}
              onChange={() => toggleOption('leadingTrailing')}
              className="rounded border-zinc-700 bg-zinc-900 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
            />
            <span className="text-sm text-zinc-400">Leading/Trailing</span>
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="whitespace-output" className="text-sm font-medium text-zinc-300">
            Cleaned Output
          </label>
          <CopyButton text={output} />
        </div>
        <textarea
          id="whitespace-output"
          value={output}
          readOnly
          className="h-32 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>
    </div>
  )
}

