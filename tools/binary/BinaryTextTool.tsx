'use client'

import { useState, useCallback } from 'react'
import { CopyButton } from '@/components/CopyButton'

type Mode = 'text-to-binary' | 'binary-to-text'

export default function BinaryTextTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<Mode>('text-to-binary')
  const [spaced, setSpaced] = useState(true)
  const [error, setError] = useState('')

  const textToBinary = useCallback(
    (text: string) => {
      const binaryArray = Array.from(text).map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
      return spaced ? binaryArray.join(' ') : binaryArray.join('')
    },
    [spaced]
  )

  const binaryToText = useCallback((binary: string) => {
    // Remove spaces and validate
    const cleaned = binary.replace(/\s/g, '')

    if (!/^[01]*$/.test(cleaned)) {
      throw new Error('Invalid binary input (only 0 and 1 allowed)')
    }

    if (cleaned.length % 8 !== 0) {
      throw new Error('Binary string length must be a multiple of 8')
    }

    const bytes = cleaned.match(/.{8}/g) || []
    return bytes.map((byte) => String.fromCharCode(parseInt(byte, 2))).join('')
  }, [])

  const handleConvert = useCallback(() => {
    setError('')
    if (!input) {
      setOutput('')
      return
    }

    try {
      if (mode === 'text-to-binary') {
        setOutput(textToBinary(input))
      } else {
        setOutput(binaryToText(input))
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion error')
      setOutput('')
    }
  }, [input, mode, textToBinary, binaryToText])

  const handleSwap = useCallback(() => {
    setInput(output)
    setOutput(input)
    setMode(mode === 'text-to-binary' ? 'binary-to-text' : 'text-to-binary')
    setError('')
  }, [input, output, mode])

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setMode('text-to-binary')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === 'text-to-binary'
              ? 'bg-emerald-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          Text → Binary
        </button>
        <button
          onClick={() => setMode('binary-to-text')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === 'binary-to-text'
              ? 'bg-emerald-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          Binary → Text
        </button>

        {mode === 'text-to-binary' && (
          <label className="ml-auto flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={spaced}
              onChange={(e) => setSpaced(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-sm text-zinc-300">Space between bytes</span>
          </label>
        )}
      </div>

      {/* Input */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">
          {mode === 'text-to-binary' ? 'Text' : 'Binary'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === 'text-to-binary'
              ? 'Enter text...'
              : 'Enter binary (e.g., 01001000 01101001)...'
          }
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
              {mode === 'text-to-binary' ? 'Binary' : 'Text'}
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

      {/* Info */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4 text-sm text-zinc-500">
        <p>
          Each character is represented as an 8-bit binary number. For example, &apos;A&apos; (ASCII 65) becomes{' '}
          <code className="text-emerald-400">01000001</code>.
        </p>
      </div>
    </div>
  )
}

