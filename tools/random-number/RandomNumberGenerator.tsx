'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

export default function RandomNumberGenerator() {
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(100)
  const [count, setCount] = useState(1)
  const [output, setOutput] = useState('')

  const generate = () => {
    const numbers: number[] = []
    for (let i = 0; i < count; i++) {
      const num = Math.floor(Math.random() * (max - min + 1)) + min
      numbers.push(num)
    }
    setOutput(numbers.join('\n'))
  }

  const clear = () => {
    setMin(0)
    setMax(100)
    setCount(1)
    setOutput('')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="min" className="text-sm font-medium text-zinc-300">
            Minimum
          </label>
          <input
            id="min"
            type="number"
            value={min}
            onChange={(e) => setMin(parseInt(e.target.value) || 0)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="max" className="text-sm font-medium text-zinc-300">
            Maximum
          </label>
          <input
            id="max"
            type="number"
            value={max}
            onChange={(e) => setMax(parseInt(e.target.value) || 100)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="count" className="text-sm font-medium text-zinc-300">
            Count
          </label>
          <input
            id="count"
            type="number"
            min="1"
            max="1000"
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(1000, parseInt(e.target.value) || 1)))}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={generate}
          className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
        >
          Generate
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
            <label htmlFor="random-output" className="text-sm font-medium text-zinc-300">
              Generated Numbers
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            id="random-output"
            value={output}
            readOnly
            className="h-32 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
      )}
    </div>
  )
}

