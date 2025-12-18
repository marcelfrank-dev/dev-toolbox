'use client'

import { useState, useCallback } from 'react'
import { CopyButton } from '@/components/CopyButton'

type HmacAlgorithm = 'SHA-256' | 'SHA-384' | 'SHA-512' | 'SHA-1'
type OutputFormat = 'hex' | 'base64'

export default function HmacGenerator() {
  const [message, setMessage] = useState('')
  const [secret, setSecret] = useState('')
  const [algorithm, setAlgorithm] = useState<HmacAlgorithm>('SHA-256')
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('hex')
  const [output, setOutput] = useState('')

  const generateHmac = useCallback(async () => {
    if (!message || !secret) {
      setOutput('')
      return
    }

    try {
      const encoder = new TextEncoder()
      const keyData = encoder.encode(secret)
      const messageData = encoder.encode(message)

      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: algorithm },
        false,
        ['sign']
      )

      const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData)
      const signatureArray = Array.from(new Uint8Array(signature))

      let result: string
      if (outputFormat === 'hex') {
        result = signatureArray.map((b) => b.toString(16).padStart(2, '0')).join('')
      } else {
        result = btoa(String.fromCharCode(...signatureArray))
      }

      setOutput(result)
    } catch (error) {
      setOutput('Error generating HMAC')
    }
  }, [message, secret, algorithm, outputFormat])

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">Algorithm</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as HmacAlgorithm)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
          >
            <option value="SHA-256">HMAC-SHA256</option>
            <option value="SHA-384">HMAC-SHA384</option>
            <option value="SHA-512">HMAC-SHA512</option>
            <option value="SHA-1">HMAC-SHA1</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">Output Format</label>
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
          >
            <option value="hex">Hexadecimal</option>
            <option value="base64">Base64</option>
          </select>
        </div>
      </div>

      {/* Secret Key */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">Secret Key</label>
        <input
          type="text"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="Enter your secret key..."
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
        />
      </div>

      {/* Message */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message to sign..."
          className="h-32 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={generateHmac}
        disabled={!message || !secret}
        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Generate HMAC
      </button>

      {/* Output */}
      {output && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-400">
              HMAC Output ({algorithm}, {outputFormat})
            </label>
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
          HMAC (Hash-based Message Authentication Code) combines a cryptographic hash function with a
          secret key to verify both data integrity and authenticity. Commonly used for API
          authentication and message signing.
        </p>
      </div>
    </div>
  )
}

