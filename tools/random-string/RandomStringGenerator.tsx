'use client'

import { useState, useMemo } from 'react'
import { CopyButton } from '@/components/CopyButton'

export default function RandomStringGenerator() {
  const [length, setLength] = useState(16)
  const [count, setCount] = useState(1)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(false)
  const [customChars, setCustomChars] = useState('')
  const [useCustomChars, setUseCustomChars] = useState(false)
  const [generatedStrings, setGeneratedStrings] = useState<string[]>([])

  const characterSets = useMemo(() => {
    if (useCustomChars && customChars) {
      return customChars.split('')
    }

    const sets: string[] = []
    if (includeUppercase) sets.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
    if (includeLowercase) sets.push('abcdefghijklmnopqrstuvwxyz')
    if (includeNumbers) sets.push('0123456789')
    if (includeSymbols) sets.push('!@#$%^&*()_+-=[]{}|;:,.<>?')

    return sets.join('').split('')
  }, [includeUppercase, includeLowercase, includeNumbers, includeSymbols, customChars, useCustomChars])

  const generateString = () => {
    if (characterSets.length === 0) {
      alert('Please select at least one character set or provide custom characters')
      return
    }

    const strings: string[] = []
    for (let i = 0; i < count; i++) {
      let result = ''
      for (let j = 0; j < length; j++) {
        const randomIndex = Math.floor(Math.random() * characterSets.length)
        result += characterSets[randomIndex]
      }
      strings.push(result)
    }
    setGeneratedStrings(strings)
  }

  const clear = () => {
    setGeneratedStrings([])
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Controls */}
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">Length</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="256"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="flex-1"
              />
              <input
                type="number"
                min="1"
                max="256"
                value={length}
                onChange={(e) => setLength(Math.max(1, Math.min(256, parseInt(e.target.value) || 1)))}
                className="w-20 rounded-lg border border-zinc-700 bg-zinc-900 p-2 text-sm text-zinc-200"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">Count</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="50"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="flex-1"
              />
              <input
                type="number"
                min="1"
                max="50"
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                className="w-20 rounded-lg border border-zinc-700 bg-zinc-900 p-2 text-sm text-zinc-200"
              />
            </div>
          </div>

          <div>
            <label className="mb-4 block text-sm font-medium text-zinc-300">Character Sets</label>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={(e) => setIncludeUppercase(e.target.checked)}
                  disabled={useCustomChars}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50"
                />
                <span className="text-sm text-zinc-300">Uppercase (A-Z)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeLowercase}
                  onChange={(e) => setIncludeLowercase(e.target.checked)}
                  disabled={useCustomChars}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50"
                />
                <span className="text-sm text-zinc-300">Lowercase (a-z)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  disabled={useCustomChars}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50"
                />
                <span className="text-sm text-zinc-300">Numbers (0-9)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  disabled={useCustomChars}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50"
                />
                <span className="text-sm text-zinc-300">Symbols (!@#$%...)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={useCustomChars}
                onChange={(e) => setUseCustomChars(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
              />
              <span className="text-sm font-medium text-zinc-300">Use Custom Characters</span>
            </label>
            {useCustomChars && (
              <input
                type="text"
                value={customChars}
                onChange={(e) => setCustomChars(e.target.value)}
                placeholder="Enter custom characters..."
                className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
              />
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={generateString}
              className="flex-1 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
            >
              Generate
            </button>
            {generatedStrings.length > 0 && (
              <button
                onClick={clear}
                className="rounded-lg bg-zinc-800 px-4 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Output */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-300">Generated Strings</h3>
            {generatedStrings.length > 0 && (
              <CopyButton text={generatedStrings.join('\n')} />
            )}
          </div>
          {generatedStrings.length > 0 ? (
            <div className="space-y-2">
              {generatedStrings.map((str, idx) => (
                <div
                  key={idx}
                  className="group flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 p-3"
                >
                  <code className="flex-1 break-all font-mono text-sm text-zinc-200">{str}</code>
                  <CopyButton text={str} className="ml-2 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/30">
              <p className="text-sm text-zinc-500">Click "Generate" to create random strings</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

