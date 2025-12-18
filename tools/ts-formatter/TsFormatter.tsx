'use client'

import { useState, useCallback } from 'react'
import { CopyButton } from '@/components/CopyButton'
import { useToast } from '@/components/Toast'

export default function TsFormatter() {
  const { showToast } = useToast()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [indentSize, setIndentSize] = useState(2)

  const format = useCallback(() => {
    if (!input.trim()) {
      setOutput('')
      return
    }

    try {
      // Simple TypeScript formatter - similar to JS but handles types
      const indent = ' '.repeat(indentSize)
      let result = ''
      let level = 0
      let inString = ''
      let inComment = false
      let inLineComment = false

      const code = input

      for (let i = 0; i < code.length; i++) {
        const char = code[i]
        const next = code[i + 1]
        const prev = code[i - 1]

        // Handle string literals
        if (!inComment && !inLineComment && (char === '"' || char === "'" || char === '`')) {
          if (!inString) {
            inString = char
          } else if (inString === char && prev !== '\\') {
            inString = ''
          }
          result += char
          continue
        }

        if (inString) {
          result += char
          continue
        }

        // Handle comments
        if (char === '/' && next === '*' && !inLineComment) {
          inComment = true
          result += char
          continue
        }
        if (char === '*' && next === '/' && inComment) {
          inComment = false
          result += '*/'
          i++
          continue
        }
        if (char === '/' && next === '/' && !inComment) {
          inLineComment = true
          result += char
          continue
        }
        if (inLineComment && char === '\n') {
          inLineComment = false
          result += '\n' + indent.repeat(level)
          continue
        }

        if (inComment || inLineComment) {
          result += char
          continue
        }

        // Handle braces and brackets
        if (char === '{' || char === '[') {
          result += char + '\n' + indent.repeat(++level)
          continue
        }
        if (char === '}' || char === ']') {
          result += '\n' + indent.repeat(--level) + char
          continue
        }
        if (char === ';') {
          result += char + '\n' + indent.repeat(level)
          continue
        }
        if (char === ',') {
          result += char + ' '
          continue
        }
        if (char === '\n') {
          result += '\n' + indent.repeat(level)
          continue
        }

        result += char
      }

      setOutput(result.trim())
      showToast('TypeScript formatted successfully!', 'success')
    } catch (error) {
      showToast('Error formatting TypeScript', 'error')
    }
  }, [input, indentSize, showToast])

  const minify = useCallback(() => {
    if (!input.trim()) {
      setOutput('')
      return
    }

    try {
      const minified = input
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
        .replace(/\/\/.*/g, '') // Remove line comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .replace(/\s*([{}[\]();,=+\-*/])\s*/g, '$1') // Remove spaces around operators
        .trim()

      setOutput(minified)
      showToast('TypeScript minified successfully!', 'success')
    } catch (error) {
      showToast('Error minifying TypeScript', 'error')
    }
  }, [input, showToast])

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="flex items-center gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">Indent Size</label>
          <input
            type="number"
            min={1}
            max={8}
            value={indentSize}
            onChange={(e) => setIndentSize(parseInt(e.target.value) || 2)}
            className="w-24 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Input */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">TypeScript Code</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your TypeScript code here..."
          className="h-64 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={format}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
        >
          Format
        </button>
        <button
          onClick={minify}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
        >
          Minify
        </button>
      </div>

      {/* Output */}
      {output && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-400">Formatted Code</label>
            <CopyButton text={output} />
          </div>
          <textarea
            value={output}
            readOnly
            className="h-64 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
          />
        </div>
      )}
    </div>
  )
}

