'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function generateApiKey(length: number, format: 'hex' | 'base64' | 'alphanumeric'): string {
  const chars = {
    hex: '0123456789abcdef',
    base64: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
    alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  }

  const alphabet = chars[format]
  let key = ''
  for (let i = 0; i < length; i++) {
    key += alphabet[Math.floor(Math.random() * alphabet.length)]
  }

  return key
}

export default function ApiKeyGenerator() {
  const [length, setLength] = useState(32)
  const [format, setFormat] = useState<'hex' | 'base64' | 'alphanumeric'>('alphanumeric')
  const [count, setCount] = useState(1)
  const [output, setOutput] = useState('')

  const generate = () => {
    const keys: string[] = []
    for (let i = 0; i < count; i++) {
      keys.push(generateApiKey(length, format))
    }
    setOutput(keys.join('\n'))
  }

  const clear = () => {
    setLength(32)
    setFormat('alphanumeric')
    setCount(1)
    setOutput('')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="api-length" className="text-sm font-medium text-zinc-300">
            Length
          </label>
          <input
            id="api-length"
            type="number"
            min="8"
            max="256"
            value={length}
            onChange={(e) => setLength(Math.max(8, Math.min(256, parseInt(e.target.value) || 32)))}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="api-format" className="text-sm font-medium text-zinc-300">
            Format
          </label>
          <select
            id="api-format"
            value={format}
            onChange={(e) => setFormat(e.target.value as 'hex' | 'base64' | 'alphanumeric')}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          >
            <option value="alphanumeric">Alphanumeric</option>
            <option value="hex">Hexadecimal</option>
            <option value="base64">Base64-like</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="api-count" className="text-sm font-medium text-zinc-300">
            Count
          </label>
          <input
            id="api-count"
            type="number"
            min="1"
            max="20"
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={generate}
          className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
        >
          Generate API Key{count > 1 ? 's' : ''}
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
            <label htmlFor="api-output" className="text-sm font-medium text-zinc-300">
              Generated API Key{count > 1 ? 's' : ''}
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            id="api-output"
            value={output}
            readOnly
            className="h-32 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
      )}
    </div>
  )
}

