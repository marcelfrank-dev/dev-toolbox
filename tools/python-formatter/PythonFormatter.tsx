'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function formatPython(code: string): string {
  // Basic Python formatting - normalize indentation and spacing
  const lines = code.split('\n')
  const formatted: string[] = []
  let indentLevel = 0
  const indentSize = 4

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      formatted.push('')
      continue
    }

    // Decrease indent for dedent keywords
    if (trimmed.startsWith('elif ') || trimmed.startsWith('else:') || trimmed.startsWith('except ') || trimmed.startsWith('finally:')) {
      indentLevel = Math.max(0, indentLevel - 1)
    }

    // Add line with proper indentation
    formatted.push(' '.repeat(indentLevel * indentSize) + trimmed)

    // Increase indent for indent keywords
    if (trimmed.endsWith(':') && !trimmed.startsWith('#') && !trimmed.startsWith('"""') && !trimmed.startsWith("'''")) {
      indentLevel++
    }
  }

  return formatted.join('\n')
}

export default function PythonFormatter() {
  const [input, setInput] = useState('')
  const output = input ? formatPython(input) : ''

  const clear = () => setInput('')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="python-input" className="text-sm font-medium text-zinc-300">
            Python Code Input
          </label>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
        <textarea
          id="python-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="def hello():&#10;    print('Hello')"
          className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <p className="text-sm text-zinc-400">
          Note: This is a basic formatter. For full Black-style formatting, use a dedicated Python formatter library.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="python-output" className="text-sm font-medium text-zinc-300">
            Formatted Python Code
          </label>
          <CopyButton text={output} />
        </div>
        <textarea
          id="python-output"
          value={output}
          readOnly
          className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>
    </div>
  )
}

