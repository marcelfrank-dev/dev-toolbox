'use client'

import { useState, useCallback } from 'react'
import { CopyButton } from '@/components/CopyButton'

type Mode = 'json-to-yaml' | 'yaml-to-json'

export default function JsonYamlConverter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<Mode>('json-to-yaml')
  const [error, setError] = useState('')

  // Simple YAML serializer (handles basic cases)
  const jsonToYaml = (obj: unknown, indent = 0): string => {
    const spaces = '  '.repeat(indent)

    if (obj === null) return 'null'
    if (obj === undefined) return 'null'
    if (typeof obj === 'boolean') return obj ? 'true' : 'false'
    if (typeof obj === 'number') return String(obj)
    if (typeof obj === 'string') {
      if (obj.includes('\n') || obj.includes(':') || obj.includes('#')) {
        return `"${obj.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`
      }
      return obj
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]'
      return obj
        .map((item) => {
          const val = jsonToYaml(item, indent + 1)
          if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
            const lines = val.split('\n')
            return `${spaces}- ${lines[0]}\n${lines.slice(1).map((l) => spaces + '  ' + l).join('\n')}`
          }
          return `${spaces}- ${val}`
        })
        .join('\n')
    }

    if (typeof obj === 'object') {
      const entries = Object.entries(obj as Record<string, unknown>)
      if (entries.length === 0) return '{}'
      return entries
        .map(([key, value]) => {
          const val = jsonToYaml(value, indent + 1)
          if (typeof value === 'object' && value !== null) {
            return `${spaces}${key}:\n${val}`
          }
          return `${spaces}${key}: ${val}`
        })
        .join('\n')
    }

    return String(obj)
  }

  // Simple YAML parser (handles basic cases)
  const yamlToJson = (yaml: string): unknown => {
    const lines = yaml.split('\n')
    const result: unknown[] = []
    const stack: Array<{ indent: number; obj: Record<string, unknown> | unknown[]; key?: string }> = []

    let currentIndent = 0
    let root: unknown = undefined

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmed = line.trim()

      if (!trimmed || trimmed.startsWith('#')) continue

      const indent = line.search(/\S/)
      const isArrayItem = trimmed.startsWith('- ')

      // Parse value
      const parseValue = (val: string): unknown => {
        val = val.trim()
        if (val === '' || val === 'null' || val === '~') return null
        if (val === 'true') return true
        if (val === 'false') return false
        if (/^-?\d+$/.test(val)) return parseInt(val, 10)
        if (/^-?\d+\.\d+$/.test(val)) return parseFloat(val)
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          return val.slice(1, -1)
        }
        if (val === '[]') return []
        if (val === '{}') return {}
        return val
      }

      if (isArrayItem) {
        const value = parseValue(trimmed.slice(2))

        // Pop stack to find correct parent
        while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
          stack.pop()
        }

        if (stack.length === 0) {
          if (!Array.isArray(root)) root = []
          ;(root as unknown[]).push(value)
        } else {
          const parent = stack[stack.length - 1]
          if (parent.key && typeof parent.obj === 'object' && !Array.isArray(parent.obj)) {
            if (!Array.isArray(parent.obj[parent.key])) {
              parent.obj[parent.key] = []
            }
            ;(parent.obj[parent.key] as unknown[]).push(value)
          } else if (Array.isArray(parent.obj)) {
            parent.obj.push(value)
          }
        }
      } else {
        const colonIndex = trimmed.indexOf(':')
        if (colonIndex === -1) continue

        const key = trimmed.slice(0, colonIndex).trim()
        const rawValue = trimmed.slice(colonIndex + 1).trim()

        // Pop stack to find correct parent
        while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
          stack.pop()
        }

        let targetObj: Record<string, unknown>

        if (stack.length === 0) {
          if (root === undefined) root = {}
          targetObj = root as Record<string, unknown>
        } else {
          const parent = stack[stack.length - 1]
          if (parent.key && typeof parent.obj === 'object' && !Array.isArray(parent.obj)) {
            if (parent.obj[parent.key] === undefined) {
              parent.obj[parent.key] = {}
            }
            targetObj = parent.obj[parent.key] as Record<string, unknown>
          } else {
            targetObj = parent.obj as Record<string, unknown>
          }
        }

        if (rawValue) {
          targetObj[key] = parseValue(rawValue)
        } else {
          // Value is on next lines
          targetObj[key] = {}
          stack.push({ indent, obj: targetObj, key })
        }
      }
    }

    return root
  }

  const convert = useCallback(() => {
    setError('')
    if (!input.trim()) {
      setOutput('')
      return
    }

    try {
      if (mode === 'json-to-yaml') {
        const parsed = JSON.parse(input)
        setOutput(jsonToYaml(parsed))
      } else {
        const parsed = yamlToJson(input)
        setOutput(JSON.stringify(parsed, null, 2))
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion error')
      setOutput('')
    }
  }, [input, mode])

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('json-to-yaml')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === 'json-to-yaml'
              ? 'bg-emerald-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          JSON → YAML
        </button>
        <button
          onClick={() => setMode('yaml-to-json')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === 'yaml-to-json'
              ? 'bg-emerald-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          YAML → JSON
        </button>
      </div>

      {/* Input */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">
          {mode === 'json-to-yaml' ? 'JSON Input' : 'YAML Input'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'json-to-yaml' ? '{"key": "value"}' : 'key: value'}
          className="h-48 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
        />
      </div>

      {/* Convert Button */}
      <button
        onClick={convert}
        disabled={!input.trim()}
        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Convert
      </button>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-900/50 bg-red-900/20 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Output */}
      {output && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-400">
              {mode === 'json-to-yaml' ? 'YAML Output' : 'JSON Output'}
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            value={output}
            readOnly
            className="h-48 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-emerald-400 focus:outline-none"
          />
        </div>
      )}

      {/* Note */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4 text-sm text-zinc-500">
        <p>
          Note: This is a basic converter that handles common YAML/JSON structures. For complex YAML
          features (anchors, multi-line strings, etc.), consider using a dedicated library.
        </p>
      </div>
    </div>
  )
}

