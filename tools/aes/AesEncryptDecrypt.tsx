'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

async function encryptAES(text: string, password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)

  // Derive key from password
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  )

  const salt = crypto.getRandomValues(new Uint8Array(16))
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  )

  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data)

  // Combine salt + iv + encrypted data
  const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength)
  combined.set(salt, 0)
  combined.set(iv, salt.length)
  combined.set(new Uint8Array(encrypted), salt.length + iv.length)

  // Convert to base64
  return btoa(String.fromCharCode(...combined))
}

async function decryptAES(encrypted: string, password: string): Promise<string> {
  try {
    const combined = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0))

    const salt = combined.slice(0, 16)
    const iv = combined.slice(16, 28)
    const ciphertext = combined.slice(28)

    const encoder = new TextEncoder()
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    )

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    )

    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext)
    const decoder = new TextDecoder()
    return decoder.decode(decrypted)
  } catch (e) {
    throw new Error('Decryption failed. Check your password and encrypted data.')
  }
}

export default function AesEncryptDecrypt() {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt')
  const [text, setText] = useState('')
  const [password, setPassword] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const process = async () => {
    if (!text.trim() || !password.trim()) return
    setLoading(true)
    setError('')
    try {
      if (mode === 'encrypt') {
        const encrypted = await encryptAES(text, password)
        setResult(encrypted)
      } else {
        const decrypted = await decryptAES(text, password)
        setResult(decrypted)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Operation failed')
      setResult('')
    } finally {
      setLoading(false)
    }
  }

  const clear = () => {
    setText('')
    setPassword('')
    setResult('')
    setError('')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-zinc-300">Mode:</label>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('encrypt')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === 'encrypt'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}
          >
            Encrypt
          </button>
          <button
            onClick={() => setMode('decrypt')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === 'decrypt'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}
          >
            Decrypt
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="aes-password" className="text-sm font-medium text-zinc-300">
          Password
        </label>
        <input
          id="aes-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="aes-text" className="text-sm font-medium text-zinc-300">
            {mode === 'encrypt' ? 'Plain Text' : 'Encrypted Data (Base64)'}
          </label>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
        <textarea
          id="aes-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={mode === 'encrypt' ? 'Enter text to encrypt...' : 'Enter base64 encrypted data...'}
          className="h-32 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <button
        onClick={process}
        disabled={!text.trim() || !password.trim() || loading}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Processing...' : mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
      </button>

      {error && (
        <div className="rounded-lg border border-red-800 bg-red-900/20 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {result && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="aes-result" className="text-sm font-medium text-zinc-300">
              {mode === 'encrypt' ? 'Encrypted Data' : 'Decrypted Text'}
            </label>
            <CopyButton text={result} />
          </div>
          <textarea
            id="aes-result"
            value={result}
            readOnly
            className="h-32 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
      )}
    </div>
  )
}

