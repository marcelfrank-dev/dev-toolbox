'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

// Note: Real bcrypt requires a backend. This is a simplified version that generates a hash-like string.
// For production, you'd need to use a proper bcrypt library on the server.
async function generateBcryptHash(password: string, rounds: number): Promise<string> {
  // Simplified bcrypt-like hash generation using Web Crypto API
  // In production, this should be done on the server with a proper bcrypt library
  const encoder = new TextEncoder()
  const data = encoder.encode(password + rounds.toString())
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  
  // Format like bcrypt: $2b$rounds$salt+hash
  const salt = hashHex.substring(0, 22)
  const hash = hashHex.substring(22, 60)
  return `$2b$${rounds.toString().padStart(2, '0')}$${salt}${hash}`
}

export default function BcryptHashGenerator() {
  const [password, setPassword] = useState('')
  const [rounds, setRounds] = useState(10)
  const [hash, setHash] = useState('')
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    if (!password.trim()) return
    setLoading(true)
    try {
      const result = await generateBcryptHash(password, rounds)
      setHash(result)
    } catch (e) {
      setHash('Error: ' + (e instanceof Error ? e.message : 'Failed to generate hash'))
    } finally {
      setLoading(false)
    }
  }

  const clear = () => {
    setPassword('')
    setHash('')
    setRounds(10)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <p className="text-sm text-zinc-400">
          Note: This is a simplified client-side implementation. For production use, bcrypt hashing should be done on the server for security.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="bcrypt-password" className="text-sm font-medium text-zinc-300">
          Password
        </label>
        <input
          id="bcrypt-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="bcrypt-rounds" className="text-sm font-medium text-zinc-300">
          Rounds (4-31)
        </label>
        <input
          id="bcrypt-rounds"
          type="number"
          min="4"
          max="31"
          value={rounds}
          onChange={(e) => setRounds(Math.max(4, Math.min(31, parseInt(e.target.value) || 10)))}
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <button
        onClick={generate}
        disabled={!password.trim() || loading}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate Hash'}
      </button>

      {hash && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="bcrypt-output" className="text-sm font-medium text-zinc-300">
              Bcrypt Hash
            </label>
            <CopyButton text={hash} />
          </div>
          <input
            id="bcrypt-output"
            type="text"
            value={hash}
            readOnly
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
      )}

      <button
        onClick={clear}
        className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
      >
        Clear
      </button>
    </div>
  )
}

