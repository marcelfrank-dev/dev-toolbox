'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function formatPhp(code: string): string {
  // Basic PHP formatting
  let formatted = code

  // Normalize line endings
  formatted = formatted.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  // Add spaces around operators
  formatted = formatted.replace(/([^\s])([=+\-*/%])([^\s=])/g, '$1 $2 $3')
  formatted = formatted.replace(/([^\s])([=+\-*/%])([^\s=])/g, '$1 $2 $3')

  // Add spaces after commas
  formatted = formatted.replace(/,(?!\s)/g, ', ')

  // Add spaces around braces
  formatted = formatted.replace(/\{([^\s])/g, '{ $1')
  formatted = formatted.replace(/([^\s])\}/g, '$1 }')

  // Normalize blank lines
  formatted = formatted.replace(/\n{3,}/g, '\n\n')

  return formatted.trim()
}

export default function PhpFormatter() {
  const [input, setInput] = useState('')
  const output = input ? formatPhp(input) : ''

  const clear = () => setInput('')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="php-input" className="text-sm font-medium text-zinc-300">
            PHP Code Input
          </label>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
        <textarea
          id="php-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="<?php&#10;echo 'Hello World';"
          className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="php-output" className="text-sm font-medium text-zinc-300">
            Formatted PHP Code
          </label>
          <CopyButton text={output} />
        </div>
        <textarea
          id="php-output"
          value={output}
          readOnly
          className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>
    </div>
  )
}

