'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

async function generateRSAKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt']
  )

  const publicKeyJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey)
  const privateKeyJwk = await crypto.subtle.exportKey('jwk', keyPair.privateKey)

  return {
    publicKey: JSON.stringify(publicKeyJwk, null, 2),
    privateKey: JSON.stringify(privateKeyJwk, null, 2),
  }
}

export default function RsaKeyGenerator() {
  const [publicKey, setPublicKey] = useState('')
  const [privateKey, setPrivateKey] = useState('')
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    setLoading(true)
    try {
      const keys = await generateRSAKeyPair()
      setPublicKey(keys.publicKey)
      setPrivateKey(keys.privateKey)
    } catch (e) {
      setPublicKey('Error: ' + (e instanceof Error ? e.message : 'Failed to generate keys'))
      setPrivateKey('')
    } finally {
      setLoading(false)
    }
  }

  const clear = () => {
    setPublicKey('')
    setPrivateKey('')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <p className="text-sm text-zinc-400">
          Generates RSA key pairs using Web Crypto API. Keys are exported in JWK (JSON Web Key) format.
        </p>
      </div>

      <button
        onClick={generate}
        disabled={loading}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate Key Pair'}
      </button>

      {publicKey && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="rsa-public" className="text-sm font-medium text-zinc-300">
              Public Key (JWK)
            </label>
            <CopyButton text={publicKey} />
          </div>
          <textarea
            id="rsa-public"
            value={publicKey}
            readOnly
            className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-xs text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
      )}

      {privateKey && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="rsa-private" className="text-sm font-medium text-zinc-300">
              Private Key (JWK) - Keep Secret!
            </label>
            <CopyButton text={privateKey} />
          </div>
          <textarea
            id="rsa-private"
            value={privateKey}
            readOnly
            className="h-48 w-full resize-none rounded-lg border border-red-800 bg-red-900/10 p-4 font-mono text-xs text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
          <p className="text-xs text-red-400">⚠️ Never share your private key!</p>
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

