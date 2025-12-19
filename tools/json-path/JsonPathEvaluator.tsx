'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function evaluateJsonPath(json: string, path: string): string {
  try {
    const obj = JSON.parse(json)
    
    // Simple JSONPath implementation
    if (path === '$' || path === '') {
      return JSON.stringify(obj, null, 2)
    }

    // Handle $.
    if (path.startsWith('$.')) {
      path = path.substring(2)
    } else if (path.startsWith('$')) {
      path = path.substring(1)
    }

    // Navigate through the path
    const parts = path.split('.')
    let current: any = obj

    for (const part of parts) {
      // Handle array indices [0]
      if (part.includes('[') && part.includes(']')) {
        const bracketIndex = part.indexOf('[')
        const key = part.substring(0, bracketIndex)
        const indexStr = part.substring(bracketIndex + 1, part.indexOf(']'))
        const index = parseInt(indexStr)

        if (key) {
          current = current[key]
        }
        if (Array.isArray(current) && !isNaN(index)) {
          current = current[index]
        } else {
          return 'Error: Invalid array index'
        }
      } else {
        current = current[part]
      }

      if (current === undefined) {
        return 'Error: Path not found'
      }
    }

    return JSON.stringify(current, null, 2)
  } catch (e) {
    return 'Error: ' + (e instanceof Error ? e.message : 'Invalid JSON or path')
  }
}

export default function JsonPathEvaluator() {
  const [json, setJson] = useState('{"user": {"name": "John", "age": 30}}')
  const [path, setPath] = useState('$.user.name')
  const output = json && path ? evaluateJsonPath(json, path) : ''

  const clear = () => {
    setJson('')
    setPath('')
  }

  const examples = [
    { path: '$.user.name', desc: 'Access nested property' },
    { path: '$.items[0]', desc: 'Access array element' },
    { path: '$', desc: 'Root object' },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="jsonpath-json" className="text-sm font-medium text-zinc-300">
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
          id="jsonpath-json"
          value={json}
          onChange={(e) => setJson(e.target.value)}
          placeholder='{"user": {"name": "John"}}'
          className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="jsonpath-path" className="text-sm font-medium text-zinc-300">
          JSONPath Expression
        </label>
        <input
          id="jsonpath-path"
          type="text"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="$.user.name"
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
          <p className="mb-2 text-xs font-medium text-zinc-300">Examples:</p>
          <div className="flex flex-col gap-1">
            {examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => setPath(ex.path)}
                className="text-left text-xs text-zinc-400 hover:text-zinc-200"
              >
                <code className="text-emerald-400">{ex.path}</code> - {ex.desc}
              </button>
            ))}
          </div>
        </div>
      </div>

      {output && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="jsonpath-output" className="text-sm font-medium text-zinc-300">
              Result
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            id="jsonpath-output"
            value={output}
            readOnly
            className="h-32 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
      )}
    </div>
  )
}

