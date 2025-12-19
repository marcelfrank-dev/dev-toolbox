'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

// Simple barcode pattern generator (visual representation)
function generateBarcodePattern(text: string, format: 'code128' | 'ean13'): string {
  // This is a simplified visual representation
  // Real barcodes would use proper encoding libraries
  let pattern = ''
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const code = char.charCodeAt(0)
    // Generate a simple pattern based on character code
    const bars = (code % 8) + 1
    pattern += '█'.repeat(bars) + ' '
  }
  
  return pattern.trim()
}

export default function BarcodeGenerator() {
  const [input, setInput] = useState('123456789012')
  const [format, setFormat] = useState<'code128' | 'ean13'>('code128')
  const pattern = input ? generateBarcodePattern(input, format) : ''

  const clear = () => {
    setInput('')
    setFormat('code128')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="barcode-input" className="text-sm font-medium text-zinc-300">
            Data
          </label>
          <input
            id="barcode-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="123456789012"
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="barcode-format" className="text-sm font-medium text-zinc-300">
            Format
          </label>
          <select
            id="barcode-format"
            value={format}
            onChange={(e) => setFormat(e.target.value as 'code128' | 'ean13')}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          >
            <option value="code128">Code 128</option>
            <option value="ean13">EAN-13</option>
          </select>
        </div>
      </div>

      {pattern && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-300">Barcode Pattern</label>
            <CopyButton text={pattern} />
          </div>
          <div className="rounded-lg border border-zinc-800 bg-white p-8">
            <div className="flex items-center justify-center">
              <div className="font-mono text-4xl leading-none text-black">{pattern}</div>
            </div>
            <div className="mt-4 text-center font-mono text-sm text-zinc-600">{input}</div>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <p className="text-sm text-zinc-400">
          Note: This is a simplified visual representation. For production use, integrate a proper barcode generation library.
        </p>
      </div>

      <button
        onClick={clear}
        className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
      >
        Clear
      </button>
    </div>
  )
}

