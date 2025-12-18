'use client'

import { useState, useCallback } from 'react'
import { CopyButton } from '@/components/CopyButton'

type HashAlgorithm = 'SHA-256' | 'SHA-384' | 'SHA-512' | 'SHA-1' | 'MD5'

export default function HashGenerator() {
  const [input, setInput] = useState('')
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA-256')
  const [output, setOutput] = useState('')
  const [uppercase, setUppercase] = useState(false)

  const generateHash = useCallback(async () => {
    if (!input) {
      setOutput('')
      return
    }

    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(input)

      if (algorithm === 'MD5') {
        // MD5 is not supported by Web Crypto API, use a simple implementation
        setOutput('MD5 not available in browser (use SHA-256 instead)')
        return
      }

      const hashBuffer = await crypto.subtle.digest(algorithm, data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      let hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

      if (uppercase) {
        hashHex = hashHex.toUpperCase()
      }

      setOutput(hashHex)
    } catch (error) {
      setOutput('Error generating hash')
    }
  }, [input, algorithm, uppercase])

  return (
    <div className="space-y-6">
      {/* Algorithm Selection */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="mb-2 block text-sm font-medium text-zinc-400">Algorithm</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as HashAlgorithm)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
          >
            <option value="SHA-256">SHA-256</option>
            <option value="SHA-384">SHA-384</option>
            <option value="SHA-512">SHA-512</option>
            <option value="SHA-1">SHA-1 (deprecated)</option>
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-sm text-zinc-300">Uppercase</span>
          </label>
        </div>
      </div>

      {/* Input */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">Input Text</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to hash..."
          className="h-32 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={generateHash}
        disabled={!input}
        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Generate Hash
      </button>

      {/* Output */}
      {output && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-400">Hash Output ({algorithm})</label>
            <CopyButton text={output} />
          </div>
          <div className="rounded-lg border border-zinc-700 bg-zinc-900/50 p-4">
            <code className="break-all font-mono text-sm text-emerald-400">{output}</code>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4 text-sm text-zinc-500">
        <p>
          Hash functions create a fixed-size output from any input. They are one-way functions - you
          cannot reverse a hash to get the original input. Use <strong>SHA-256</strong> or{' '}
          <strong>SHA-512</strong> for security-sensitive applications.
        </p>
      </div>
    </div>
  )
}

