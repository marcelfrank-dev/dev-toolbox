'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

interface DecodedJwt {
  header: Record<string, unknown>
  payload: Record<string, unknown>
}

function decodeJwt(token: string): DecodedJwt {
  const parts = token.split('.')
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format: expected 3 parts separated by dots')
  }

  const decodeBase64Url = (str: string): string => {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
    return atob(padded)
  }

  try {
    const header = JSON.parse(decodeBase64Url(parts[0]))
    const payload = JSON.parse(decodeBase64Url(parts[1]))
    return { header, payload }
  } catch {
    throw new Error('Failed to decode JWT: invalid base64 or JSON')
  }
}

export default function JwtDecoder() {
  const [input, setInput] = useState('')
  const [decoded, setDecoded] = useState<DecodedJwt | null>(null)
  const [error, setError] = useState<string | null>(null)

  const decode = () => {
    try {
      const result = decodeJwt(input.trim())
      setDecoded(result)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to decode JWT')
      setDecoded(null)
    }
  }

  const clear = () => {
    setInput('')
    setDecoded(null)
    setError(null)
  }

  const formatTimestamp = (ts: number): string => {
    return new Date(ts * 1000).toLocaleString()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-amber-900/50 bg-amber-950/20 p-3">
        <p className="text-sm text-amber-400">
          ⚠️ This tool only decodes JWTs. It does <strong>not</strong> verify signatures.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={decode}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
        >
          Decode
        </button>
        <button
          onClick={clear}
          className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
        >
          Clear
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="jwt-input" className="text-sm font-medium text-zinc-300">
          JWT Token
        </label>
        <textarea
          id="jwt-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your JWT here (eyJhbGciOiJIUzI1NiIs...)"
          className="h-24 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-xs text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-900/50 bg-red-950/20 p-4">
          <p className="text-sm text-red-400">❌ {error}</p>
        </div>
      )}

      {decoded && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-300">Header</span>
              <CopyButton text={JSON.stringify(decoded.header, null, 2)} />
            </div>
            <pre className="overflow-auto rounded-lg border border-zinc-700 bg-zinc-900/50 p-4 font-mono text-sm text-zinc-200">
              {JSON.stringify(decoded.header, null, 2)}
            </pre>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-300">Payload</span>
              <CopyButton text={JSON.stringify(decoded.payload, null, 2)} />
            </div>
            <pre className="overflow-auto rounded-lg border border-zinc-700 bg-zinc-900/50 p-4 font-mono text-sm text-zinc-200">
              {JSON.stringify(decoded.payload, null, 2)}
            </pre>
            {typeof decoded.payload.exp === 'number' && (
              <p className="text-xs text-zinc-500">
                Expires: {formatTimestamp(decoded.payload.exp)}
              </p>
            )}
            {typeof decoded.payload.iat === 'number' && (
              <p className="text-xs text-zinc-500">
                Issued: {formatTimestamp(decoded.payload.iat)}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

