'use client'

import { useState, useCallback } from 'react'
import { CopyButton } from '@/components/CopyButton'

type Mode = 'text-to-hex' | 'hex-to-text'
type HexFormat = 'plain' | 'spaced' | 'prefixed'

export default function HexAsciiTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<Mode>('text-to-hex')
  const [hexFormat, setHexFormat] = useState<HexFormat>('plain')
  const [error, setError] = useState('')

  const textToHex = useCallback(
    (text: string) => {
      const hexArray = Array.from(text).map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))

      switch (hexFormat) {
        case 'spaced':
          return hexArray.join(' ')
        case 'prefixed':
          return hexArray.map((h) => '0x' + h).join(' ')
        default:
          return hexArray.join('')
      }
    },
    [hexFormat]
  )

  const hexToText = useCallback((hex: string) => {
    // Remove common prefixes and separators
    const cleaned = hex.replace(/0x/gi, '').replace(/[\s,]/g, '')

    if (!/^[0-9a-fA-F]*$/.test(cleaned)) {
      throw new Error('Invalid hexadecimal input')
    }

    if (cleaned.length % 2 !== 0) {
      throw new Error('Hex string must have even length')
    }

    const bytes = cleaned.match(/.{2}/g) || []
    return bytes.map((byte) => String.fromCharCode(parseInt(byte, 16))).join('')
  }, [])

  const handleConvert = useCallback(() => {
    setError('')
    if (!input) {
      setOutput('')
      return
    }

    try {
      if (mode === 'text-to-hex') {
        setOutput(textToHex(input))
      } else {
        setOutput(hexToText(input))
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion error')
      setOutput('')
    }
  }, [input, mode, textToHex, hexToText])

  const handleSwap = useCallback(() => {
    setInput(output)
    setOutput(input)
    setMode(mode === 'text-to-hex' ? 'hex-to-text' : 'text-to-hex')
    setError('')
  }, [input, output, mode])

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setMode('text-to-hex')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === 'text-to-hex'
              ? 'bg-emerald-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          Text → Hex
        </button>
        <button
          onClick={() => setMode('hex-to-text')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === 'hex-to-text'
              ? 'bg-emerald-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          Hex → Text
        </button>

        {mode === 'text-to-hex' && (
          <select
            value={hexFormat}
            onChange={(e) => setHexFormat(e.target.value as HexFormat)}
            className="ml-auto rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
          >
            <option value="plain">Plain (48656c6c6f)</option>
            <option value="spaced">Spaced (48 65 6c 6c 6f)</option>
            <option value="prefixed">0x Prefixed (0x48 0x65...)</option>
          </select>
        )}
      </div>

      {/* Input */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">
          {mode === 'text-to-hex' ? 'ASCII Text' : 'Hexadecimal'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'text-to-hex' ? 'Enter text...' : 'Enter hex (e.g., 48656c6c6f or 48 65 6c 6c 6f)...'}
          className="h-32 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleConvert}
          disabled={!input}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Convert
        </button>
        <button
          onClick={handleSwap}
          disabled={!output}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ↔ Swap
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-900/50 bg-red-900/20 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Output */}
      {output && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-400">
              {mode === 'text-to-hex' ? 'Hexadecimal' : 'ASCII Text'}
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            value={output}
            readOnly
            className="h-32 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-emerald-400 focus:outline-none"
          />
        </div>
      )}
    </div>
  )
}

