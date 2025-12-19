'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function formatMarkdown(markdown: string): string {
  let formatted = markdown

  // Normalize line endings
  formatted = formatted.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  // Ensure blank lines around headers
  formatted = formatted.replace(/(^|\n)(#{1,6}\s+[^\n]+)(\n|$)/g, '\n\n$2\n\n')
  formatted = formatted.replace(/\n{3,}/g, '\n\n')

  // Ensure blank lines around lists
  formatted = formatted.replace(/(^|\n)([-*+]|\d+\.)\s+[^\n]+(\n|$)/g, '\n$1$2 $3\n')
  formatted = formatted.replace(/\n{3,}/g, '\n\n')

  // Ensure blank lines around code blocks
  formatted = formatted.replace(/(```[^\n]*\n[\s\S]*?```)/g, '\n\n$1\n\n')
  formatted = formatted.replace(/\n{3,}/g, '\n\n')

  // Trim excessive blank lines
  formatted = formatted.replace(/\n{3,}/g, '\n\n')
  formatted = formatted.trim()

  return formatted
}

export default function MarkdownFormatter() {
  const [input, setInput] = useState('')
  const output = input ? formatMarkdown(input) : ''

  const clear = () => setInput('')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="md-format-input" className="text-sm font-medium text-zinc-300">
            Markdown Input
          </label>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
        <textarea
          id="md-format-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="# Title&#10;&#10;Some markdown text..."
          className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="md-format-output" className="text-sm font-medium text-zinc-300">
            Formatted Markdown
          </label>
          <CopyButton text={output} />
        </div>
        <textarea
          id="md-format-output"
          value={output}
          readOnly
          className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>
    </div>
  )
}

