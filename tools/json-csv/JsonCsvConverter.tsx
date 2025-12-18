'use client'

import { useState, useCallback } from 'react'
import { CopyButton } from '@/components/CopyButton'

type Mode = 'json-to-csv' | 'csv-to-json'

export default function JsonCsvConverter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<Mode>('json-to-csv')
  const [delimiter, setDelimiter] = useState(',')
  const [includeHeaders, setIncludeHeaders] = useState(true)
  const [error, setError] = useState('')

  const jsonToCsv = useCallback((jsonStr: string): string => {
    const data = JSON.parse(jsonStr)

    if (!Array.isArray(data)) {
      throw new Error('JSON must be an array of objects')
    }

    if (data.length === 0) {
      return ''
    }

    // Flatten nested objects
    const flatten = (obj: Record<string, unknown>, prefix = ''): Record<string, string> => {
      const result: Record<string, string> = {}

      for (const [key, value] of Object.entries(obj)) {
        const newKey = prefix ? `${prefix}.${key}` : key

        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
          Object.assign(result, flatten(value as Record<string, unknown>, newKey))
        } else {
          result[newKey] = value === null ? '' : String(value)
        }
      }

      return result
    }

    const flattenedData = data.map((item) =>
      typeof item === 'object' && item !== null ? flatten(item as Record<string, unknown>) : { value: String(item) }
    )

    // Get all unique headers
    const headers = [...new Set(flattenedData.flatMap((item) => Object.keys(item)))]

    // Escape CSV field
    const escapeField = (field: string): string => {
      if (field.includes(delimiter) || field.includes('"') || field.includes('\n')) {
        return `"${field.replace(/"/g, '""')}"`
      }
      return field
    }

    // Build CSV
    const rows: string[] = []

    if (includeHeaders) {
      rows.push(headers.map(escapeField).join(delimiter))
    }

    for (const item of flattenedData) {
      const row = headers.map((header) => escapeField(item[header] || ''))
      rows.push(row.join(delimiter))
    }

    return rows.join('\n')
  }, [delimiter, includeHeaders])

  const csvToJson = useCallback((csvStr: string): string => {
    const lines = csvStr.split('\n').filter((line) => line.trim())

    if (lines.length === 0) {
      return '[]'
    }

    // Parse CSV line
    const parseLine = (line: string): string[] => {
      const result: string[] = []
      let current = ''
      let inQuotes = false

      for (let i = 0; i < line.length; i++) {
        const char = line[i]

        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"'
            i++
          } else {
            inQuotes = !inQuotes
          }
        } else if (char === delimiter && !inQuotes) {
          result.push(current)
          current = ''
        } else {
          current += char
        }
      }

      result.push(current)
      return result
    }

    const headers = parseLine(lines[0])
    const dataLines = includeHeaders ? lines.slice(1) : lines

    const result = dataLines.map((line) => {
      const values = parseLine(line)
      const obj: Record<string, string | number | boolean | null> = {}

      headers.forEach((header, index) => {
        let value: string | number | boolean | null = values[index] || ''

        // Try to parse numbers and booleans
        if (value === '') {
          value = null
        } else if (value === 'true') {
          value = true
        } else if (value === 'false') {
          value = false
        } else if (!isNaN(Number(value)) && value !== '') {
          value = Number(value)
        }

        obj[header] = value
      })

      return obj
    })

    return JSON.stringify(result, null, 2)
  }, [delimiter, includeHeaders])

  const convert = useCallback(() => {
    setError('')

    if (!input.trim()) {
      setOutput('')
      return
    }

    try {
      if (mode === 'json-to-csv') {
        setOutput(jsonToCsv(input))
      } else {
        setOutput(csvToJson(input))
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion error')
      setOutput('')
    }
  }, [input, mode, jsonToCsv, csvToJson])

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('json-to-csv')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              mode === 'json-to-csv'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            JSON → CSV
          </button>
          <button
            onClick={() => setMode('csv-to-json')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              mode === 'csv-to-json'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            CSV → JSON
          </button>
        </div>

        <select
          value={delimiter}
          onChange={(e) => setDelimiter(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
        >
          <option value=",">Comma (,)</option>
          <option value=";">Semicolon (;)</option>
          <option value="	">Tab</option>
        </select>

        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={includeHeaders}
            onChange={(e) => setIncludeHeaders(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
          />
          <span className="text-sm text-zinc-300">
            {mode === 'json-to-csv' ? 'Include headers' : 'First row is headers'}
          </span>
        </label>
      </div>

      {/* Input */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">
          {mode === 'json-to-csv' ? 'JSON Input (array of objects)' : 'CSV Input'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === 'json-to-csv'
              ? '[{"name": "John", "age": 30}, {"name": "Jane", "age": 25}]'
              : 'name,age\nJohn,30\nJane,25'
          }
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
              {mode === 'json-to-csv' ? 'CSV Output' : 'JSON Output'}
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
    </div>
  )
}

