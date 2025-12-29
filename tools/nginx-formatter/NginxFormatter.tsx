'use client'

import { useState, useCallback } from 'react'
import { CopyButton } from '@/components/CopyButton'

function formatNginxConfig(input: string, indentSize: number): string {
  const lines = input.replace(/\r\n?/g, '\n').split('\n')
  const indentUnit = ' '.repeat(indentSize)
  let level = 0
  const result: string[] = []

  for (let rawLine of lines) {
    const line = rawLine.trim()
    if (!line) {
      result.push('')
      continue
    }

    const closes = (line.startsWith('}') || line.startsWith('};')) ? 1 : 0
    if (closes) {
      level = Math.max(0, level - 1)
    }

    const indent = indentUnit.repeat(level)
    result.push(indent + line)

    const openBraces = (line.match(/\{/g) || []).length
    const closeBraces = (line.match(/\}/g) || []).length
    const delta = openBraces - closeBraces
    if (delta > 0) {
      level += delta
    }
  }

  return result.join('\n')
}

export default function NginxFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [indentSize, setIndentSize] = useState(2)

  const format = useCallback(() => {
    if (!input.trim()) {
      setOutput('')
      return
    }
    setOutput(formatNginxConfig(input, indentSize))
  }, [input, indentSize])

  const clear = () => {
    setInput('')
    setOutput('')
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-300">Nginx Config (input)</label>
            <button
              onClick={clear}
              className="text-xs text-zinc-500 hover:text-zinc-300"
            >
              Clear
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="server {\n    listen 80;\n    server_name example.com;\n    location / {\n        proxy_pass http://localhost:3000;\n    }\n}"
            className="h-80 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>

        {/* Output */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-300">Formatted Output</label>
            <CopyButton text={output} />
          </div>
          <textarea
            readOnly
            value={output}
            className="h-80 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
      </div>

      {/* Options & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-zinc-300">Indent size</label>
          <input
            type="number"
            min={2}
            max={8}
            value={indentSize}
            onChange={(e) => setIndentSize(Math.min(8, Math.max(2, Number(e.target.value) || 2)))}
            className="w-20 rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-sm text-zinc-200"
          />
        </div>
        <button
          onClick={format}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
        >
          Format
        </button>
      </div>
    </div>
  )
}
