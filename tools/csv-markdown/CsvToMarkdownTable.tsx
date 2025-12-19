'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function csvToMarkdown(csv: string): string {
  const lines = csv.split('\n').filter((line) => line.trim())
  if (lines.length === 0) return ''

  const rows = lines.map((line) => {
    // Simple CSV parsing (handles quoted fields)
    const fields: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        fields.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    fields.push(current.trim())
    return fields
  })

  if (rows.length === 0) return ''

  const maxCols = Math.max(...rows.map((r) => r.length))
  const markdownRows: string[] = []

  // Header
  const header = rows[0]
  markdownRows.push('| ' + header.map((h) => h || '').join(' | ') + ' |')
  markdownRows.push('| ' + header.map(() => '---').join(' | ') + ' |')

  // Body
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    const paddedRow = [...row, ...Array(maxCols - row.length).fill('')]
    markdownRows.push('| ' + paddedRow.map((cell) => cell || '').join(' | ') + ' |')
  }

  return markdownRows.join('\n')
}

export default function CsvToMarkdownTable() {
  const [input, setInput] = useState('')
  const output = input ? csvToMarkdown(input) : ''

  const clear = () => setInput('')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="csv-input" className="text-sm font-medium text-zinc-300">
            CSV Input
          </label>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
        <textarea
          id="csv-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Name,Age,City&#10;John,30,New York&#10;Jane,25,London"
          className="h-32 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="markdown-output" className="text-sm font-medium text-zinc-300">
            Markdown Table
          </label>
          <CopyButton text={output} />
        </div>
        <textarea
          id="markdown-output"
          value={output}
          readOnly
          className="h-32 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>
    </div>
  )
}

