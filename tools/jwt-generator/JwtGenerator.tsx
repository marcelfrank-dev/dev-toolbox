'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'
import { useToast } from '@/components/Toast'

type Algorithm = 'HS256' | 'HS384' | 'HS512' | 'RS256'

export default function JwtGenerator() {
  const { showToast } = useToast()
  const [header, setHeader] = useState('{"typ":"JWT","alg":"HS256"}')
  const [payload, setPayload] = useState('{"sub":"1234567890","name":"John Doe","iat":1516239022}')
  const [secret, setSecret] = useState('your-secret-key')
  const [algorithm, setAlgorithm] = useState<Algorithm>('HS256')
  const [token, setToken] = useState('')

  const base64UrlEncode = (str: string): string => {
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
  }

  const generateToken = async () => {
    try {
      // Validate JSON
      JSON.parse(header)
      JSON.parse(payload)

      const encodedHeader = base64UrlEncode(header)
      const encodedPayload = base64UrlEncode(payload)
      const unsignedToken = `${encodedHeader}.${encodedPayload}`

      // For HS256, we can generate a signature using Web Crypto API
      if (algorithm.startsWith('HS')) {
        const encoder = new TextEncoder()
        const keyData = encoder.encode(secret)
        const messageData = encoder.encode(unsignedToken)

        const key = await crypto.subtle.importKey(
          'raw',
          keyData,
          { name: 'HMAC', hash: algorithm === 'HS256' ? 'SHA-256' : algorithm === 'HS384' ? 'SHA-384' : 'SHA-512' },
          false,
          ['sign']
        )

        const signature = await crypto.subtle.sign('HMAC', key, messageData)
        const signatureArray = Array.from(new Uint8Array(signature))
        const signatureBase64 = btoa(String.fromCharCode(...signatureArray))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, '')

        setToken(`${unsignedToken}.${signatureBase64}`)
        showToast('JWT generated successfully!', 'success')
      } else {
        // RS256 would require a private key - for now, show unsigned token
        setToken(`${unsignedToken}.<signature>`)
        showToast('Note: RS256 signature requires a private key. Token shown without signature.', 'info')
      }
    } catch (error) {
      showToast('Invalid JSON in header or payload', 'error')
    }
  }

  return (
    <div className="space-y-6">
      {/* Algorithm Selection */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">Algorithm</label>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
        >
          <option value="HS256">HS256 (HMAC SHA-256)</option>
          <option value="HS384">HS384 (HMAC SHA-384)</option>
          <option value="HS512">HS512 (HMAC SHA-512)</option>
          <option value="RS256">RS256 (RSA SHA-256)</option>
        </select>
      </div>

      {/* Header */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">Header (JSON)</label>
        <textarea
          value={header}
          onChange={(e) => setHeader(e.target.value)}
          placeholder='{"typ":"JWT","alg":"HS256"}'
          className="h-24 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
        />
      </div>

      {/* Payload */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">Payload (JSON)</label>
        <textarea
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          placeholder='{"sub":"1234567890","name":"John Doe","iat":1516239022}'
          className="h-32 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
        />
      </div>

      {/* Secret/Key */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">
          {algorithm.startsWith('HS') ? 'Secret Key' : 'Private Key (PEM)'}
        </label>
        <input
          type="text"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder={algorithm.startsWith('HS') ? 'your-secret-key' : '-----BEGIN PRIVATE KEY-----...'}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 font-mono text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={generateToken}
        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
      >
        Generate JWT
      </button>

      {/* Generated Token */}
      {token && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-400">Generated JWT</label>
            <CopyButton text={token} />
          </div>
          <div className="rounded-lg border border-zinc-700 bg-zinc-900/50 p-4">
            <code className="break-all font-mono text-sm text-emerald-400">{token}</code>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4 text-sm text-zinc-500">
        <p>
          <strong className="text-zinc-400">Note:</strong> This tool generates JWTs for testing purposes. For production
          use, ensure you use secure key management and proper validation.
        </p>
      </div>
    </div>
  )
}

