'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function propertiesToJson(properties: string): string {
  const lines = properties.split('\n')
  const result: any = {}

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const equalIndex = trimmed.indexOf('=')
    if (equalIndex > 0) {
      const key = trimmed.substring(0, equalIndex).trim()
      let value = trimmed.substring(equalIndex + 1).trim()

      // Handle nested keys (key.subkey = value)
      const keys = key.split('.')
      let current = result
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {}
        }
        current = current[keys[i]]
      }

      // Try to parse as number or boolean
      if (value === 'true') {
        current[keys[keys.length - 1]] = true
      } else if (value === 'false') {
        current[keys[keys.length - 1]] = false
      } else if (!isNaN(Number(value)) && value !== '') {
        current[keys[keys.length - 1]] = Number(value)
      } else {
        current[keys[keys.length - 1]] = value
      }
    }
  }

  return JSON.stringify(result, null, 2)
}

function jsonToProperties(json: string): string {
  try {
    const obj = JSON.parse(json)
    let properties = ''

    function convertObject(obj: any, prefix: string = ''): void {
      for (const key in obj) {
        const value = obj[key]
        const fullKey = prefix ? `${prefix}.${key}` : key

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          convertObject(value, fullKey)
        } else {
          properties += `${fullKey}=${value}\n`
        }
      }
    }

    convertObject(obj)
    return properties.trim()
  } catch (e) {
    return 'Error: ' + (e instanceof Error ? e.message : 'Invalid JSON')
  }
}

export default function PropertiesJsonConverter() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'properties-to-json' | 'json-to-properties'>('properties-to-json')

  const output = input
    ? mode === 'properties-to-json'
      ? propertiesToJson(input)
      : jsonToProperties(input)
    : ''

  const clear = () => setInput('')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-zinc-300">Convert:</label>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('properties-to-json')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === 'properties-to-json'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}
          >
            Properties → JSON
          </button>
          <button
            onClick={() => setMode('json-to-properties')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === 'json-to-properties'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}
          >
            JSON → Properties
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="props-json-input" className="text-sm font-medium text-zinc-300">
            Input ({mode === 'properties-to-json' ? 'Properties' : 'JSON'})
          </label>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
        <textarea
          id="props-json-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'properties-to-json' ? 'key=value\nkey.subkey=value' : '{"key": "value", "key": {"subkey": "value"}}'}
          className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="props-json-output" className="text-sm font-medium text-zinc-300">
            Output ({mode === 'properties-to-json' ? 'JSON' : 'Properties'})
          </label>
          <CopyButton text={output} />
        </div>
        <textarea
          id="props-json-output"
          value={output}
          readOnly
          className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>
    </div>
  )
}

