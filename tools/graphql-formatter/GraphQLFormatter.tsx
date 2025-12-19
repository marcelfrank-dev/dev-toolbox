'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function formatGraphQL(query: string): string {
  let formatted = query.trim()

  // Basic GraphQL formatting
  // Add newlines after opening braces
  formatted = formatted.replace(/\{/g, '{\n  ')
  
  // Add newlines before closing braces
  formatted = formatted.replace(/\}/g, '\n}')
  
  // Add newlines after fields
  formatted = formatted.replace(/([a-zA-Z_][a-zA-Z0-9_]*\s*[:\{])/g, '$1\n  ')
  
  // Clean up excessive newlines
  formatted = formatted.replace(/\n{3,}/g, '\n\n')
  
  // Fix indentation
  const lines = formatted.split('\n')
  const formattedLines: string[] = []
  let indent = 0
  
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      formattedLines.push('')
      continue
    }
    
    if (trimmed.startsWith('}')) {
      indent = Math.max(0, indent - 1)
    }
    
    formattedLines.push('  '.repeat(indent) + trimmed)
    
    if (trimmed.endsWith('{')) {
      indent++
    }
  }

  return formattedLines.join('\n')
}

export default function GraphQLFormatter() {
  const [input, setInput] = useState('')
  const output = input ? formatGraphQL(input) : ''

  const clear = () => setInput('')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="graphql-input" className="text-sm font-medium text-zinc-300">
            GraphQL Query/Mutation Input
          </label>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
        <textarea
          id="graphql-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="query { user { name email } }"
          className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="graphql-output" className="text-sm font-medium text-zinc-300">
            Formatted GraphQL
          </label>
          <CopyButton text={output} />
        </div>
        <textarea
          id="graphql-output"
          value={output}
          readOnly
          className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>
    </div>
  )
}

