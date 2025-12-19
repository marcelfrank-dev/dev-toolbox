'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function formatShell(script: string): string {
  let formatted = script
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n')

  // Add blank lines after function definitions
  formatted = formatted.replace(/(\n\w+\(\)\s*\{)/g, '\n\n$1')
  
  // Add blank lines before if/for/while
  formatted = formatted.replace(/(\n)(if |for |while |case )/g, '\n\n$2')
  
  // Normalize spacing
  formatted = formatted.replace(/\n{3,}/g, '\n\n')
  
  return formatted.trim()
}

export default function ShellFormatter() {
  const [input, setInput] = useState('')
  const output = input ? formatShell(input) : ''

  const clear = () => setInput('')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="shell-input" className="text-sm font-medium text-zinc-300">
            Shell Script Input
          </label>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
        <textarea
          id="shell-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="#!/bin/bash&#10;echo 'Hello World'"
          className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="shell-output" className="text-sm font-medium text-zinc-300">
            Formatted Shell Script
          </label>
          <CopyButton text={output} />
        </div>
        <textarea
          id="shell-output"
          value={output}
          readOnly
          className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>
    </div>
  )
}

