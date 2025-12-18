'use client'

import { useState, useMemo } from 'react'
import { CopyButton } from '@/components/CopyButton'

interface Match {
  value: string
  index: number
  groups: string[]
}

export default function RegexTester() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [testString, setTestString] = useState('')
  const [error, setError] = useState('')

  const result = useMemo(() => {
    setError('')

    if (!pattern || !testString) {
      return { matches: [], highlighted: testString }
    }

    try {
      const regex = new RegExp(pattern, flags)
      const matches: Match[] = []
      let match

      if (flags.includes('g')) {
        while ((match = regex.exec(testString)) !== null) {
          matches.push({
            value: match[0],
            index: match.index,
            groups: match.slice(1),
          })
          // Prevent infinite loop for zero-width matches
          if (match.index === regex.lastIndex) {
            regex.lastIndex++
          }
        }
      } else {
        match = regex.exec(testString)
        if (match) {
          matches.push({
            value: match[0],
            index: match.index,
            groups: match.slice(1),
          })
        }
      }

      // Create highlighted string
      let highlighted = testString
      let offset = 0
      const highlights: Array<{ start: number; end: number }> = []

      matches.forEach((m) => {
        highlights.push({ start: m.index, end: m.index + m.value.length })
      })

      // Sort by start index in reverse to insert from end
      highlights.sort((a, b) => b.start - a.start)

      return { matches, highlighted, highlights }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid regex')
      return { matches: [], highlighted: testString, highlights: [] }
    }
  }, [pattern, flags, testString])

  const flagOptions = [
    { value: 'g', label: 'global', description: 'Match all occurrences' },
    { value: 'i', label: 'case insensitive', description: 'Ignore case' },
    { value: 'm', label: 'multiline', description: '^ and $ match line boundaries' },
    { value: 's', label: 'dotAll', description: '. matches newlines' },
    { value: 'u', label: 'unicode', description: 'Enable unicode support' },
  ]

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ''))
    } else {
      setFlags(flags + flag)
    }
  }

  const commonPatterns = [
    { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
    { name: 'URL', pattern: 'https?:\\/\\/[\\w\\-]+(\\.[\\w\\-]+)+[/#?]?.*' },
    { name: 'Phone', pattern: '\\+?[\\d\\s\\-().]{10,}' },
    { name: 'IP Address', pattern: '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}' },
    { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}' },
  ]

  return (
    <div className="space-y-6">
      {/* Pattern Input */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-zinc-400">Regular Expression</label>
          <CopyButton text={pattern} label="Copy Pattern" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter regex pattern..."
            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
          />
          <span className="text-zinc-500">/{flags}</span>
        </div>
      </div>

      {/* Flags */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">Flags</label>
        <div className="flex flex-wrap gap-2">
          {flagOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => toggleFlag(opt.value)}
              title={opt.description}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                flags.includes(opt.value)
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {opt.value} <span className="text-xs opacity-70">({opt.label})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Common Patterns */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">Common Patterns</label>
        <div className="flex flex-wrap gap-2">
          {commonPatterns.map((p) => (
            <button
              key={p.name}
              onClick={() => setPattern(p.pattern)}
              className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-700"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Test String */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">Test String</label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Enter text to test against..."
          className="h-32 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-900/50 bg-red-900/20 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Results */}
      {pattern && testString && !error && (
        <div className="space-y-4">
          {/* Match Count */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400">
              Found <span className="font-bold text-emerald-400">{result.matches.length}</span> match
              {result.matches.length !== 1 ? 'es' : ''}
            </span>
          </div>

          {/* Highlighted Text */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-400">Highlighted Matches</label>
            <div className="rounded-lg border border-zinc-700 bg-zinc-900/50 p-4 font-mono text-sm whitespace-pre-wrap break-all">
              {result.highlights && result.highlights.length > 0 ? (
                (() => {
                  const parts: React.ReactElement[] = []
                  let lastEnd = 0
                  const sortedHighlights = [...result.highlights].sort((a, b) => a.start - b.start)

                  sortedHighlights.forEach((h, i) => {
                    if (h.start > lastEnd) {
                      parts.push(
                        <span key={`text-${i}`} className="text-zinc-400">
                          {testString.slice(lastEnd, h.start)}
                        </span>
                      )
                    }
                    parts.push(
                      <mark key={`match-${i}`} className="bg-emerald-500/30 text-emerald-300 rounded px-0.5">
                        {testString.slice(h.start, h.end)}
                      </mark>
                    )
                    lastEnd = h.end
                  })

                  if (lastEnd < testString.length) {
                    parts.push(
                      <span key="text-end" className="text-zinc-400">
                        {testString.slice(lastEnd)}
                      </span>
                    )
                  }

                  return parts
                })()
              ) : (
                <span className="text-zinc-500">{testString}</span>
              )}
            </div>
          </div>

          {/* Match Details */}
          {result.matches.length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-400">Match Details</label>
              <div className="max-h-48 overflow-auto rounded-lg border border-zinc-700 bg-zinc-900/50">
                {result.matches.map((match, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 border-b border-zinc-800 px-4 py-2 last:border-b-0"
                  >
                    <span className="text-xs text-zinc-500">#{i + 1}</span>
                    <code className="text-sm text-emerald-400">&quot;{match.value}&quot;</code>
                    <span className="text-xs text-zinc-500">@ index {match.index}</span>
                    {match.groups.length > 0 && (
                      <span className="text-xs text-zinc-500">
                        Groups: {match.groups.map((g, j) => `$${j + 1}="${g}"`).join(', ')}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

