'use client'

import { useState, useCallback } from 'react'
import { CopyButton } from '@/components/CopyButton'

type EscapeType = 'javascript' | 'json' | 'html' | 'url' | 'sql' | 'csv'

export default function StringEscape() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [escapeType, setEscapeType] = useState<EscapeType>('javascript')
  const [mode, setMode] = useState<'escape' | 'unescape'>('escape')

  const escapeJavaScript = (str: string) => {
    return str
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t')
  }

  const unescapeJavaScript = (str: string) => {
    return str
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\\\/g, '\\')
  }

  const escapeJSON = (str: string) => {
    return JSON.stringify(str).slice(1, -1)
  }

  const unescapeJSON = (str: string) => {
    try {
      return JSON.parse(`"${str}"`)
    } catch {
      return str
    }
  }

  const escapeHTML = (str: string) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }

  const unescapeHTML = (str: string) => {
    const textarea = document.createElement('textarea')
    textarea.innerHTML = str
    return textarea.value
  }

  const escapeURL = (str: string) => {
    return encodeURIComponent(str)
  }

  const unescapeURL = (str: string) => {
    try {
      return decodeURIComponent(str)
    } catch {
      return str
    }
  }

  const escapeSQL = (str: string) => {
    return str.replace(/'/g, "''").replace(/\\/g, '\\\\')
  }

  const unescapeSQL = (str: string) => {
    return str.replace(/''/g, "'").replace(/\\\\/g, '\\')
  }

  const escapeCSV = (str: string) => {
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const unescapeCSV = (str: string) => {
    if (str.startsWith('"') && str.endsWith('"')) {
      return str.slice(1, -1).replace(/""/g, '"')
    }
    return str
  }

  const handleConvert = useCallback(() => {
    if (!input) {
      setOutput('')
      return
    }

    const escapers: Record<EscapeType, { escape: (s: string) => string; unescape: (s: string) => string }> = {
      javascript: { escape: escapeJavaScript, unescape: unescapeJavaScript },
      json: { escape: escapeJSON, unescape: unescapeJSON },
      html: { escape: escapeHTML, unescape: unescapeHTML },
      url: { escape: escapeURL, unescape: unescapeURL },
      sql: { escape: escapeSQL, unescape: unescapeSQL },
      csv: { escape: escapeCSV, unescape: unescapeCSV },
    }

    const fn = mode === 'escape' ? escapers[escapeType].escape : escapers[escapeType].unescape
    setOutput(fn(input))
  }, [input, escapeType, mode])

  const types: { value: EscapeType; label: string }[] = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'json', label: 'JSON' },
    { value: 'html', label: 'HTML' },
    { value: 'url', label: 'URL' },
    { value: 'sql', label: 'SQL' },
    { value: 'csv', label: 'CSV' },
  ]

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="mb-2 block text-sm font-medium text-zinc-400">Type</label>
          <select
            value={escapeType}
            onChange={(e) => setEscapeType(e.target.value as EscapeType)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
          >
            {types.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-2">
          <button
            onClick={() => setMode('escape')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              mode === 'escape'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            Escape
          </button>
          <button
            onClick={() => setMode('unescape')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              mode === 'unescape'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            Unescape
          </button>
        </div>
      </div>

      {/* Input */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Enter text to ${mode}...`}
          className="h-32 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
        />
      </div>

      {/* Convert Button */}
      <button
        onClick={handleConvert}
        disabled={!input}
        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {mode === 'escape' ? 'Escape' : 'Unescape'}
      </button>

      {/* Output */}
      {output && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-400">Output</label>
            <CopyButton text={output} />
          </div>
          <textarea
            value={output}
            readOnly
            className="h-32 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-emerald-400 focus:outline-none"
          />
        </div>
      )}

      {/* Examples */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4 text-sm text-zinc-500">
        <h3 className="mb-2 font-medium text-zinc-400">Examples by type:</h3>
        <ul className="space-y-1">
          <li>
            <strong>JavaScript/JSON:</strong> Escapes quotes, newlines, tabs
          </li>
          <li>
            <strong>HTML:</strong> Converts &lt;, &gt;, &amp;, quotes to entities
          </li>
          <li>
            <strong>URL:</strong> Percent-encodes special characters
          </li>
          <li>
            <strong>SQL:</strong> Doubles single quotes
          </li>
          <li>
            <strong>CSV:</strong> Quotes fields with commas/quotes
          </li>
        </ul>
      </div>
    </div>
  )
}

