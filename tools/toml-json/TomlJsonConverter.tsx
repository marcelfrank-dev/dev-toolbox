'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function tomlToJson(toml: string): string {
  try {
    // Simple TOML to JSON converter
    const lines = toml.split('\n')
    const result: any = {}
    let currentSection: any = result

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue

      // Section header
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        const sectionName = trimmed.slice(1, -1)
        result[sectionName] = {}
        currentSection = result[sectionName]
        continue
      }

      // Key-value pair
      const equalIndex = trimmed.indexOf('=')
      if (equalIndex > 0) {
        const key = trimmed.substring(0, equalIndex).trim()
        let value = trimmed.substring(equalIndex + 1).trim()

        // Remove quotes
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1)
        }

        // Try to parse as number or boolean
        if (value === 'true') {
          currentSection[key] = true
        } else if (value === 'false') {
          currentSection[key] = false
        } else if (!isNaN(Number(value)) && value !== '') {
          currentSection[key] = Number(value)
        } else {
          currentSection[key] = value
        }
      }
    }

    return JSON.stringify(result, null, 2)
  } catch (e) {
    return 'Error: ' + (e instanceof Error ? e.message : 'Invalid TOML')
  }
}

function jsonToToml(json: string): string {
  try {
    const obj = JSON.parse(json)
    let toml = ''

    function convertValue(value: any): string {
      if (typeof value === 'string') {
        return `"${value}"`
      }
      if (typeof value === 'number') {
        return value.toString()
      }
      if (typeof value === 'boolean') {
        return value.toString()
      }
      if (Array.isArray(value)) {
        return '[' + value.map(convertValue).join(', ') + ']'
      }
      return JSON.stringify(value)
    }

    for (const key in obj) {
      const value = obj[key]
      if (typeof value === 'object' && !Array.isArray(value)) {
        toml += `[${key}]\n`
        for (const subKey in value) {
          toml += `${subKey} = ${convertValue(value[subKey])}\n`
        }
        toml += '\n'
      } else {
        toml += `${key} = ${convertValue(value)}\n`
      }
    }

    return toml.trim()
  } catch (e) {
    return 'Error: ' + (e instanceof Error ? e.message : 'Invalid JSON')
  }
}

export default function TomlJsonConverter() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'toml-to-json' | 'json-to-toml'>('toml-to-json')

  const output = input
    ? mode === 'toml-to-json'
      ? tomlToJson(input)
      : jsonToToml(input)
    : ''

  const clear = () => setInput('')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-zinc-300">Convert:</label>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('toml-to-json')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === 'toml-to-json'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}
          >
            TOML → JSON
          </button>
          <button
            onClick={() => setMode('json-to-toml')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === 'json-to-toml'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}
          >
            JSON → TOML
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="toml-json-input" className="text-sm font-medium text-zinc-300">
            Input ({mode === 'toml-to-json' ? 'TOML' : 'JSON'})
          </label>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
        <textarea
          id="toml-json-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'toml-to-json' ? '[section]\nkey = "value"' : '{"section": {"key": "value"}}'}
          className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="toml-json-output" className="text-sm font-medium text-zinc-300">
            Output ({mode === 'toml-to-json' ? 'JSON' : 'TOML'})
          </label>
          <CopyButton text={output} />
        </div>
        <textarea
          id="toml-json-output"
          value={output}
          readOnly
          className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>
    </div>
  )
}

