'use client'

import { useState, useCallback, useMemo } from 'react'
import { CopyButton } from '@/components/CopyButton'

export default function NumberBaseConverter() {
  const [input, setInput] = useState('')
  const [inputBase, setInputBase] = useState(10)
  const [error, setError] = useState('')

  const conversions = useMemo(() => {
    setError('')

    if (!input.trim()) {
      return null
    }

    try {
      // Validate input for the selected base
      const validChars = '0123456789abcdefghijklmnopqrstuvwxyz'.slice(0, inputBase)
      const cleanInput = input.toLowerCase().replace(/\s/g, '')

      for (const char of cleanInput) {
        if (!validChars.includes(char)) {
          throw new Error(`Invalid character '${char}' for base ${inputBase}`)
        }
      }

      const decimal = parseInt(cleanInput, inputBase)

      if (isNaN(decimal)) {
        throw new Error('Invalid number')
      }

      return {
        decimal: decimal.toString(10),
        binary: decimal.toString(2),
        octal: decimal.toString(8),
        hexadecimal: decimal.toString(16).toUpperCase(),
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion error')
      return null
    }
  }, [input, inputBase])

  const bases = [
    { value: 2, label: 'Binary (2)' },
    { value: 8, label: 'Octal (8)' },
    { value: 10, label: 'Decimal (10)' },
    { value: 16, label: 'Hexadecimal (16)' },
  ]

  const outputs = conversions
    ? [
        { label: 'Decimal (Base 10)', value: conversions.decimal, prefix: '' },
        { label: 'Binary (Base 2)', value: conversions.binary, prefix: '0b' },
        { label: 'Octal (Base 8)', value: conversions.octal, prefix: '0o' },
        { label: 'Hexadecimal (Base 16)', value: conversions.hexadecimal, prefix: '0x' },
      ]
    : []

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-zinc-400">Input Number</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a number..."
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">Input Base</label>
          <select
            value={inputBase}
            onChange={(e) => setInputBase(parseInt(e.target.value))}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-3 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
          >
            {bases.map((base) => (
              <option key={base.value} value={base.value}>
                {base.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-900/50 bg-red-900/20 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Outputs */}
      {conversions && (
        <div className="grid gap-4 sm:grid-cols-2">
          {outputs.map(({ label, value, prefix }) => (
            <div key={label} className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-400">{label}</span>
                <CopyButton text={prefix + value} label="" className="!px-2" />
              </div>
              <code className="text-lg text-emerald-400">
                <span className="text-zinc-600">{prefix}</span>
                {value}
              </code>
            </div>
          ))}
        </div>
      )}

      {/* Quick Reference */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4">
        <h3 className="mb-2 text-sm font-medium text-zinc-400">Quick Reference</h3>
        <div className="grid gap-2 text-sm text-zinc-500 sm:grid-cols-2">
          <div>
            <strong>Binary (Base 2):</strong> Uses digits 0-1
          </div>
          <div>
            <strong>Octal (Base 8):</strong> Uses digits 0-7
          </div>
          <div>
            <strong>Decimal (Base 10):</strong> Uses digits 0-9
          </div>
          <div>
            <strong>Hexadecimal (Base 16):</strong> Uses 0-9 and A-F
          </div>
        </div>
      </div>
    </div>
  )
}

