'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

// NanoID generator (simplified version)
function generateNanoID(size: number = 21): string {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'
  let id = ''
  for (let i = 0; i < size; i++) {
    id += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return id
}

export default function NanoIdGenerator() {
  const [size, setSize] = useState(21)
  const [count, setCount] = useState(1)
  const [output, setOutput] = useState('')

  const generate = () => {
    const ids: string[] = []
    for (let i = 0; i < count; i++) {
      ids.push(generateNanoID(size))
    }
    setOutput(ids.join('\n'))
  }

  const clear = () => {
    setSize(21)
    setCount(1)
    setOutput('')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="nanoid-size" className="text-sm font-medium text-zinc-300">
            Size
          </label>
          <input
            id="nanoid-size"
            type="number"
            min="1"
            max="100"
            value={size}
            onChange={(e) => setSize(Math.max(1, Math.min(100, parseInt(e.target.value) || 21)))}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="nanoid-count" className="text-sm font-medium text-zinc-300">
            Count
          </label>
          <input
            id="nanoid-count"
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={generate}
          className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
        >
          Generate NanoID{count > 1 ? 's' : ''}
        </button>
        <button
          onClick={clear}
          className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
        >
          Clear
        </button>
      </div>

      {output && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="nanoid-output" className="text-sm font-medium text-zinc-300">
              Generated NanoID{count > 1 ? 's' : ''}
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            id="nanoid-output"
            value={output}
            readOnly
            className="h-32 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
      )}
    </div>
  )
}

