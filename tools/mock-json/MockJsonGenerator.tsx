'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function generateMockData(schema: string, count: number): string {
  try {
    const parsed = JSON.parse(schema)
    const items: any[] = []

    for (let i = 0; i < count; i++) {
      items.push(generateItem(parsed, i))
    }

    return JSON.stringify(items, null, 2)
  } catch (e) {
    return 'Error: ' + (e instanceof Error ? e.message : 'Invalid schema')
  }
}

function generateItem(schema: any, index: number): any {
  if (typeof schema === 'string') {
    if (schema === 'name') return `Name ${index + 1}`
    if (schema === 'email') return `user${index + 1}@example.com`
    if (schema === 'id') return index + 1
    return schema
  }

  if (typeof schema === 'number') {
    return schema + index
  }

  if (typeof schema === 'boolean') {
    return index % 2 === 0
  }

  if (Array.isArray(schema)) {
    return schema.map((item) => generateItem(item, index))
  }

  if (typeof schema === 'object' && schema !== null) {
    const result: any = {}
    for (const key in schema) {
      result[key] = generateItem(schema[key], index)
    }
    return result
  }

  return null
}

export default function MockJsonGenerator() {
  const [schema, setSchema] = useState('{"id": 1, "name": "John", "email": "john@example.com"}')
  const [count, setCount] = useState(5)
  const output = schema ? generateMockData(schema, count) : ''

  const clear = () => {
    setSchema('{"id": 1, "name": "John", "email": "john@example.com"}')
    setCount(5)
  }

  const examples = [
    { name: 'User', schema: '{"id": 1, "name": "John", "email": "john@example.com", "active": true}' },
    { name: 'Product', schema: '{"id": 1, "name": "Product", "price": 99.99, "inStock": true}' },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="mock-count" className="text-sm font-medium text-zinc-300">
          Count
        </label>
        <input
          id="mock-count"
          type="number"
          min="1"
          max="100"
          value={count}
          onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <p className="mb-2 text-sm font-medium text-zinc-300">Examples:</p>
        <div className="flex flex-col gap-1">
          {examples.map((ex, i) => (
            <button
              key={i}
              onClick={() => setSchema(ex.schema)}
              className="text-left text-xs text-zinc-400 hover:text-zinc-200"
            >
              <strong className="text-zinc-300">{ex.name}:</strong> <code className="text-emerald-400">{ex.schema}</code>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="mock-schema" className="text-sm font-medium text-zinc-300">
            Schema (JSON template)
          </label>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
        <textarea
          id="mock-schema"
          value={schema}
          onChange={(e) => setSchema(e.target.value)}
          placeholder='{"id": 1, "name": "John"}'
          className="h-32 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      {output && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="mock-output" className="text-sm font-medium text-zinc-300">
              Generated Mock Data
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            id="mock-output"
            value={output}
            readOnly
            className="h-64 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
      )}
    </div>
  )
}

