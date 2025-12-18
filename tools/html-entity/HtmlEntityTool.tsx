'use client'

import { useState, useCallback } from 'react'
import { CopyButton } from '@/components/CopyButton'

type Mode = 'encode' | 'decode'

export default function HtmlEntityTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<Mode>('encode')

  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  }

  const encode = useCallback((text: string) => {
    return text.replace(/[&<>"'`=/]/g, (char) => htmlEntities[char] || char)
  }, [])

  const decode = useCallback((text: string) => {
    const textarea = document.createElement('textarea')
    textarea.innerHTML = text
    return textarea.value
  }, [])

  const handleConvert = useCallback(() => {
    if (!input) {
      setOutput('')
      return
    }
    setOutput(mode === 'encode' ? encode(input) : decode(input))
  }, [input, mode, encode, decode])

  const handleSwap = useCallback(() => {
    setInput(output)
    setOutput(input)
    setMode(mode === 'encode' ? 'decode' : 'encode')
  }, [input, output, mode])

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('encode')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === 'encode'
              ? 'bg-emerald-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          Encode
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === 'decode'
              ? 'bg-emerald-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          Decode
        </button>
      </div>

      {/* Input */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">
          {mode === 'encode' ? 'Plain Text' : 'HTML Entities'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter HTML entities to decode...'}
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
          {mode === 'encode' ? 'Encode' : 'Decode'}
        </button>
        <button
          onClick={handleSwap}
          disabled={!output}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ↔ Swap
        </button>
      </div>

      {/* Output */}
      {output && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-400">
              {mode === 'encode' ? 'HTML Entities' : 'Plain Text'}
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

      {/* Common Entities Reference */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4">
        <h3 className="mb-2 text-sm font-medium text-zinc-400">Common HTML Entities</h3>
        <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
          {Object.entries(htmlEntities).map(([char, entity]) => (
            <div key={char} className="flex items-center gap-2 text-zinc-500">
              <code className="text-zinc-300">{char}</code>
              <span>→</span>
              <code className="text-emerald-400">{entity}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

