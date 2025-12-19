'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function validateJsonSchema(json: string, schema: string): { valid: boolean; errors: string[] } {
  try {
    const data = JSON.parse(json)
    const schemaObj = JSON.parse(schema)
    const errors: string[] = []

    function validate(data: any, schema: any, path: string = ''): void {
      if (schema.type) {
        const actualType = Array.isArray(data) ? 'array' : typeof data
        if (actualType !== schema.type) {
          errors.push(`Type mismatch at ${path || 'root'}: expected ${schema.type}, got ${actualType}`)
        }
      }

      if (schema.properties && typeof data === 'object' && !Array.isArray(data)) {
        for (const key in schema.properties) {
          const propSchema = schema.properties[key]
          const propPath = path ? `${path}.${key}` : key
          if (data[key] !== undefined) {
            validate(data[key], propSchema, propPath)
          } else if (schema.required && schema.required.includes(key)) {
            errors.push(`Missing required property: ${propPath}`)
          }
        }
      }

      if (schema.items && Array.isArray(data)) {
        data.forEach((item, i) => {
          validate(item, schema.items, `${path}[${i}]`)
        })
      }
    }

    validate(data, schemaObj)
    return { valid: errors.length === 0, errors }
  } catch (e) {
    return {
      valid: false,
      errors: [e instanceof Error ? e.message : 'Invalid JSON or schema'],
    }
  }
}

export default function JsonSchemaValidator() {
  const [json, setJson] = useState('{"name": "John", "age": 30}')
  const [schema, setSchema] = useState(
    JSON.stringify(
      {
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'number' },
        },
        required: ['name'],
      },
      null,
      2
    )
  )
  const result = json && schema ? validateJsonSchema(json, schema) : null

  const clear = () => {
    setJson('')
    setSchema(
      JSON.stringify(
        {
          type: 'object',
          properties: {},
        },
        null,
        2
      )
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="schema-json" className="text-sm font-medium text-zinc-300">
              JSON Data
            </label>
            <button
              onClick={clear}
              className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
            >
              Clear
            </button>
          </div>
          <textarea
            id="schema-json"
            value={json}
            onChange={(e) => setJson(e.target.value)}
            placeholder='{"name": "John", "age": 30}'
            className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="schema-schema" className="text-sm font-medium text-zinc-300">
            JSON Schema
          </label>
          <textarea
            id="schema-schema"
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
            placeholder='{"type": "object", "properties": {...}}'
            className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
      </div>

      {result && (
        <div
          className={`flex flex-col gap-2 rounded-lg border p-4 ${
            result.valid
              ? 'border-emerald-800 bg-emerald-900/20'
              : 'border-red-800 bg-red-900/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${result.valid ? 'text-emerald-400' : 'text-red-400'}`}>
              {result.valid ? '✓ Valid' : '✗ Invalid'}
            </span>
          </div>
          {result.errors.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-zinc-300">Errors:</span>
              <ul className="list-inside list-disc space-y-1 text-xs text-zinc-400">
                {result.errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

