'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function evaluateJq(json: string, query: string): string {
  try {
    const obj = JSON.parse(json)
    
    // Simple jq-like query implementation
    if (query === '.' || query === '') {
      return JSON.stringify(obj, null, 2)
    }

    // Handle .key
    if (query.startsWith('.')) {
      query = query.substring(1)
    }

    // Handle array indexing [0]
    if (query.includes('[') && query.includes(']')) {
      const bracketIndex = query.indexOf('[')
      const key = query.substring(0, bracketIndex)
      const indexStr = query.substring(bracketIndex + 1, query.indexOf(']'))
      const index = parseInt(indexStr)

      let current: any = obj
      if (key) {
        current = current[key]
      }
      if (Array.isArray(current) && !isNaN(index)) {
        return JSON.stringify(current[index], null, 2)
      }
      return 'Error: Invalid array index'
    }

    // Handle .key1.key2
    const parts = query.split('.')
    let current: any = obj

    for (const part of parts) {
      if (part === '') continue
      current = current[part]
      if (current === undefined) {
        return 'Error: Path not found'
      }
    }

    return JSON.stringify(current, null, 2)
  } catch (e) {
    return 'Error: ' + (e instanceof Error ? e.message : 'Invalid JSON or query')
  }
}

export default function JsonJq() {
  const [json, setJson] = useState('{"user": {"name": "John", "items": [1, 2, 3]}}')
  const [query, setQuery] = useState('.user.name')
  const output = json && query ? evaluateJq(json, query) : ''

  const clear = () => {
    setJson('')
    setQuery('')
  }

  const examples = [
    { query: '.user.name', desc: 'Access nested property' },
    { query: '.user.items[0]', desc: 'Access array element' },
    { query: '.', desc: 'Root object' },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="jq-json" className="text-sm font-medium text-zinc-300">
            JSON Input
          </label>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
        <textarea
          id="jq-json"
          value={json}
          onChange={(e) => setJson(e.target.value)}
          placeholder='{"user": {"name": "John"}}'
          className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="jq-query" className="text-sm font-medium text-zinc-300">
          jq Query
        </label>
        <input
          id="jq-query"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder=".user.name"
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
          <p className="mb-2 text-xs font-medium text-zinc-300">Examples:</p>
          <div className="flex flex-col gap-1">
            {examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => setQuery(ex.query)}
                className="text-left text-xs text-zinc-400 hover:text-zinc-200"
              >
                <code className="text-emerald-400">{ex.query}</code> - {ex.desc}
              </button>
            ))}
          </div>
        </div>
      </div>

      {output && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="jq-output" className="text-sm font-medium text-zinc-300">
              Result
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            id="jq-output"
            value={output}
            readOnly
            className="h-32 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
      )}
    </div>
  )
}

