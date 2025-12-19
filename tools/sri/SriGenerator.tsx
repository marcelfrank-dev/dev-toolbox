'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

async function generateSRI(content: string, algorithm: 'sha256' | 'sha384' | 'sha512'): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(content)
  const hashBuffer = await crypto.subtle.digest(algorithm.toUpperCase() as AlgorithmIdentifier, data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  const base64 = btoa(String.fromCharCode(...hashArray))
  return `${algorithm}-${base64}`
}

export default function SriGenerator() {
  const [content, setContent] = useState('')
  const [algorithm, setAlgorithm] = useState<'sha256' | 'sha384' | 'sha512'>('sha384')
  const [sri, setSri] = useState('')
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    if (!content.trim()) return
    setLoading(true)
    try {
      const result = await generateSRI(content, algorithm)
      setSri(result)
    } catch (e) {
      setSri('Error: ' + (e instanceof Error ? e.message : 'Failed to generate'))
    } finally {
      setLoading(false)
    }
  }

  const clear = () => {
    setContent('')
    setSri('')
    setAlgorithm('sha384')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="sri-algorithm" className="text-sm font-medium text-zinc-300">
          Algorithm
        </label>
        <select
          id="sri-algorithm"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value as 'sha256' | 'sha384' | 'sha512')}
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        >
          <option value="sha256">SHA-256</option>
          <option value="sha384">SHA-384</option>
          <option value="sha512">SHA-512</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="sri-content" className="text-sm font-medium text-zinc-300">
            Content (script or style)
          </label>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
        <textarea
          id="sri-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste your JavaScript or CSS content here..."
          className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <button
        onClick={generate}
        disabled={!content.trim() || loading}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate SRI Hash'}
      </button>

      {sri && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="sri-output" className="text-sm font-medium text-zinc-300">
              SRI Hash
            </label>
            <CopyButton text={sri} />
          </div>
          <input
            id="sri-output"
            type="text"
            value={sri}
            readOnly
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
            <p className="mb-2 text-xs font-medium text-zinc-300">Usage:</p>
            <code className="block text-xs text-zinc-400">
              &lt;script src="..." integrity="{sri}" crossorigin="anonymous"&gt;&lt;/script&gt;
            </code>
          </div>
        </div>
      )}
    </div>
  )
}

