'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function formatToml(toml: string): string {
  let formatted = toml
  const lines = formatted.split('\n')
  const formattedLines: string[] = []
  let indentLevel = 0

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      formattedLines.push('')
      continue
    }

    // Decrease indent for closing brackets
    if (trimmed.startsWith(']') || trimmed.startsWith('}')) {
      indentLevel = Math.max(0, indentLevel - 1)
    }

    // Add indented line
    formattedLines.push('  '.repeat(indentLevel) + trimmed)

    // Increase indent for opening brackets or table headers
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      indentLevel++
    }
  }

  return formattedLines.join('\n')
}

export default function TomlFormatter() {
  const [input, setInput] = useState('')
  const output = input ? formatToml(input) : ''

  const clear = () => setInput('')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="toml-input" className="text-sm font-medium text-zinc-300">
            TOML Input
          </label>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
        <textarea
          id="toml-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="[section]&#10;key = 'value'"
          className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="toml-output" className="text-sm font-medium text-zinc-300">
            Formatted TOML
          </label>
          <CopyButton text={output} />
        </div>
        <textarea
          id="toml-output"
          value={output}
          readOnly
          className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>
    </div>
  )
}

