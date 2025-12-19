'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

export default function TextRepeater() {
  const [input, setInput] = useState('')
  const [count, setCount] = useState(1)
  const [separator, setSeparator] = useState('\n')

  const output = input ? input.split('\n').map((line) => line.repeat(count)).join(separator) : ''

  const clear = () => {
    setInput('')
    setCount(1)
    setSeparator('\n')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="repeater-input" className="text-sm font-medium text-zinc-300">
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
          id="repeater-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to repeat..."
          className="h-32 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="repeat-count" className="text-sm font-medium text-zinc-300">
            Repeat Count
          </label>
          <input
            id="repeat-count"
            type="number"
            min="1"
            max="1000"
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(1000, parseInt(e.target.value) || 1)))}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="repeat-separator" className="text-sm font-medium text-zinc-300">
            Separator
          </label>
          <select
            id="repeat-separator"
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          >
            <option value="\n">Newline</option>
            <option value=" ">Space</option>
            <option value="">None</option>
            <option value=",">Comma</option>
            <option value=", ">Comma + Space</option>
            <option value=" - ">Dash</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="repeater-output" className="text-sm font-medium text-zinc-300">
            Repeated Output
          </label>
          <CopyButton text={output} />
        </div>
        <textarea
          id="repeater-output"
          value={output}
          readOnly
          className="h-32 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>
    </div>
  )
}

