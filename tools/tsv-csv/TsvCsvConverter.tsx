'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function tsvToCsv(tsv: string): string {
  return tsv
    .split('\n')
    .map((line) => {
      const fields = line.split('\t')
      return fields.map((field) => {
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (field.includes(',') || field.includes('"') || field.includes('\n')) {
          return '"' + field.replace(/"/g, '""') + '"'
        }
        return field
      }).join(',')
    })
    .join('\n')
}

function csvToTsv(csv: string): string {
  const lines: string[] = []
  let currentLine: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i]
    const nextChar = csv[i + 1]

    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"'
      i++ // Skip next quote
    } else if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      currentLine.push(current)
      current = ''
    } else if (char === '\n' && !inQuotes) {
      currentLine.push(current)
      lines.push(currentLine.join('\t'))
      currentLine = []
      current = ''
    } else {
      current += char
    }
  }

  if (current || currentLine.length > 0) {
    currentLine.push(current)
    lines.push(currentLine.join('\t'))
  }

  return lines.join('\n')
}

export default function TsvCsvConverter() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'tsv-to-csv' | 'csv-to-tsv'>('tsv-to-csv')

  const output = input
    ? mode === 'tsv-to-csv'
      ? tsvToCsv(input)
      : csvToTsv(input)
    : ''

  const clear = () => setInput('')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-zinc-300">Convert:</label>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('tsv-to-csv')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === 'tsv-to-csv'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}
          >
            TSV → CSV
          </button>
          <button
            onClick={() => setMode('csv-to-tsv')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === 'csv-to-tsv'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}
          >
            CSV → TSV
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="tsv-csv-input" className="text-sm font-medium text-zinc-300">
            Input ({mode === 'tsv-to-csv' ? 'TSV' : 'CSV'})
          </label>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
        <textarea
          id="tsv-csv-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'tsv-to-csv' ? 'Tab-separated values...' : 'Comma-separated values...'}
          className="h-32 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="tsv-csv-output" className="text-sm font-medium text-zinc-300">
            Output ({mode === 'tsv-to-csv' ? 'CSV' : 'TSV'})
          </label>
          <CopyButton text={output} />
        </div>
        <textarea
          id="tsv-csv-output"
          value={output}
          readOnly
          className="h-32 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>
    </div>
  )
}

