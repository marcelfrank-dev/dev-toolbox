'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

interface UnicodeChar {
  char: string
  code: number
  name: string
  category: string
}

function searchUnicode(query: string): UnicodeChar[] {
  const results: UnicodeChar[] = []
  const lowerQuery = query.toLowerCase()

  // Search through common Unicode ranges
  for (let code = 32; code <= 0x1ffff; code++) {
    try {
      const char = String.fromCodePoint(code)
      const name = getUnicodeName(code)

      if (
        name.toLowerCase().includes(lowerQuery) ||
        char.includes(query) ||
        code.toString(16).toLowerCase().includes(lowerQuery) ||
        code.toString().includes(query)
      ) {
        results.push({
          char,
          code,
          name,
          category: getCategory(code),
        })

        if (results.length >= 100) break
      }
    } catch {
      // Skip invalid code points
    }
  }

  return results
}

function getUnicodeName(code: number): string {
  // Simplified - in a real implementation, you'd use a Unicode database
  if (code >= 0x1f300 && code <= 0x1f9ff) return 'Emoji'
  if (code >= 0x2600 && code <= 0x26ff) return 'Misc Symbols'
  if (code >= 0x2700 && code <= 0x27bf) return 'Dingbats'
  if (code >= 0x1f600 && code <= 0x1f64f) return 'Emoticons'
  return `U+${code.toString(16).toUpperCase().padStart(4, '0')}`
}

function getCategory(code: number): string {
  if (code >= 0x1f300 && code <= 0x1f9ff) return 'Emoji'
  if (code >= 0x2600 && code <= 0x26ff) return 'Symbols'
  if (code >= 0x2700 && code <= 0x27bf) return 'Dingbats'
  if (code >= 0x1f600 && code <= 0x1f64f) return 'Emoticons'
  if (code >= 32 && code <= 126) return 'ASCII'
  return 'Other'
}

export default function UnicodeCharacterSearch() {
  const [query, setQuery] = useState('')
  const results = query ? searchUnicode(query) : []

  const clear = () => setQuery('')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="unicode-search" className="text-sm font-medium text-zinc-300">
            Search
          </label>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
        <input
          id="unicode-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, character, or code (e.g., 'smile', 'U+1F600', '😀')"
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      {results.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-300">
              Found {results.length} result{results.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="max-h-96 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-900/50">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-zinc-900">
                <tr className="border-b border-zinc-800">
                  <th className="p-3 text-left text-xs font-medium text-zinc-300">Char</th>
                  <th className="p-3 text-left text-xs font-medium text-zinc-300">Code</th>
                  <th className="p-3 text-left text-xs font-medium text-zinc-300">Name</th>
                  <th className="p-3 text-left text-xs font-medium text-zinc-300">Category</th>
                  <th className="p-3 text-left text-xs font-medium text-zinc-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="p-3 text-2xl">{item.char}</td>
                    <td className="p-3">
                      <code className="text-xs text-zinc-400">U+{item.code.toString(16).toUpperCase().padStart(4, '0')}</code>
                    </td>
                    <td className="p-3 text-xs text-zinc-300">{item.name}</td>
                    <td className="p-3 text-xs text-zinc-400">{item.category}</td>
                    <td className="p-3">
                      <CopyButton text={item.char} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {query && results.length === 0 && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-center">
          <p className="text-sm text-zinc-400">No results found</p>
        </div>
      )}
    </div>
  )
}

