'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

// ULID generator (simplified version)
function generateULID(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  const base32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
  
  // Encode timestamp (48 bits)
  let ulid = ''
  let ts = timestamp
  for (let i = 0; i < 10; i++) {
    ulid = base32[ts % 32] + ulid
    ts = Math.floor(ts / 32)
  }
  
  // Add random part (80 bits)
  for (let i = 0; i < 16; i++) {
    ulid += base32[Math.floor(Math.random() * 32)]
  }
  
  return ulid
}

export default function UlidGenerator() {
  const [count, setCount] = useState(1)
  const [output, setOutput] = useState('')

  const generate = () => {
    const ulids: string[] = []
    for (let i = 0; i < count; i++) {
      ulids.push(generateULID())
    }
    setOutput(ulids.join('\n'))
  }

  const clear = () => {
    setCount(1)
    setOutput('')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="ulid-count" className="text-sm font-medium text-zinc-300">
          Count
        </label>
        <input
          id="ulid-count"
          type="number"
          min="1"
          max="100"
          value={count}
          onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={generate}
          className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
        >
          Generate ULID{count > 1 ? 's' : ''}
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
            <label htmlFor="ulid-output" className="text-sm font-medium text-zinc-300">
              Generated ULID{count > 1 ? 's' : ''}
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            id="ulid-output"
            value={output}
            readOnly
            className="h-32 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
      )}
    </div>
  )
}

