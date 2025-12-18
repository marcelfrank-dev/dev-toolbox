'use client'

import { useState, useCallback } from 'react'
import { CopyButton } from '@/components/CopyButton'

export default function JsFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [indentSize, setIndentSize] = useState(2)
  const [useSemicolons, setUseSemicolons] = useState(true)

  const format = useCallback(() => {
    if (!input.trim()) {
      setOutput('')
      return
    }

    const indent = ' '.repeat(indentSize)
    let result = ''
    let level = 0
    let inString = ''
    let inComment = false
    let inLineComment = false
    let newLine = true

    const js = input

    for (let i = 0; i < js.length; i++) {
      const char = js[i]
      const next = js[i + 1]
      const prev = js[i - 1]

      // Handle string literals
      if (!inComment && !inLineComment && (char === '"' || char === "'" || char === '`')) {
        if (!inString) {
          inString = char
        } else if (inString === char && prev !== '\\') {
          inString = ''
        }
        result += char
        newLine = false
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
        newLine = true
        continue
      }

      if (inComment || inLineComment) {
        result += char
        continue
      }

      // Skip whitespace
      if (/\s/.test(char)) {
        if (!newLine && result && !/\s$/.test(result)) {
          result += ' '
        }
        continue
      }

      // Opening braces
      if (char === '{' || char === '[' || char === '(') {
        result += char
        if (char !== '(') {
          level++
          result += '\n' + indent.repeat(level)
          newLine = true
        } else {
          newLine = false
        }
        continue
      }

      // Closing braces
      if (char === '}' || char === ']' || char === ')') {
        if (char !== ')') {
          level = Math.max(0, level - 1)
          result = result.trimEnd() + '\n' + indent.repeat(level)
        }
        result += char
        newLine = false
        continue
      }

      // Semicolons
      if (char === ';') {
        if (useSemicolons) {
          result += ';'
        }
        result += '\n' + indent.repeat(level)
        newLine = true
        continue
      }

      // Commas
      if (char === ',') {
        result += ','
        // Add newline after comma in objects/arrays
        const lastOpen = result.lastIndexOf('{')
        const lastClose = result.lastIndexOf('}')
        if (lastOpen > lastClose) {
          result += '\n' + indent.repeat(level)
          newLine = true
        } else {
          result += ' '
          newLine = false
        }
        continue
      }

      // Operators
      if (/[=+\-*/<>!&|?:]/.test(char)) {
        if (!/\s$/.test(result)) {
          result += ' '
        }
        result += char
        // Handle multi-char operators
        if (['==', '!=', '<=', '>=', '&&', '||', '=>', '++', '--', '+=', '-=', '*=', '/='].some(
          op => op.startsWith(char) && op[1] === next
        )) {
          result += next
          i++
        }
        result += ' '
        newLine = false
        continue
      }

      result += char
      newLine = false
    }

    setOutput(result.trim())
  }, [input, indentSize, useSemicolons])

  const minify = useCallback(() => {
    if (!input.trim()) {
      setOutput('')
      return
    }

    let inString = ''
    let inComment = false
    let inLineComment = false
    let result = ''

    for (let i = 0; i < input.length; i++) {
      const char = input[i]
      const next = input[i + 1]
      const prev = input[i - 1]

      // Handle strings
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
        i++
        continue
      }
      if (char === '*' && next === '/' && inComment) {
        inComment = false
        i++
        continue
      }
      if (char === '/' && next === '/' && !inComment) {
        inLineComment = true
        continue
      }
      if (inLineComment && char === '\n') {
        inLineComment = false
        continue
      }

      if (inComment || inLineComment) continue

      // Collapse whitespace
      if (/\s/.test(char)) {
        // Keep one space if needed between identifiers
        if (result && /[a-zA-Z0-9_$]$/.test(result) && next && /[a-zA-Z0-9_$]/.test(next)) {
          result += ' '
        }
        continue
      }

      result += char
    }

    setOutput(result)
  }, [input])

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">Indent Size</label>
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(parseInt(e.target.value))}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={useSemicolons}
              onChange={(e) => setUseSemicolons(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-sm text-zinc-300">Include Semicolons</span>
          </label>
        </div>
      </div>

      {/* Input */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">JavaScript Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='function hello(){console.log("Hello, World!")}'
          className="h-48 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={format}
          disabled={!input.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Format / Beautify
        </button>
        <button
          onClick={minify}
          disabled={!input.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Minify
        </button>
      </div>

      {/* Output */}
      {output && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-400">Output</label>
            <CopyButton text={output} />
          </div>
          <textarea
            value={output}
            readOnly
            className="h-48 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-emerald-400 focus:outline-none"
          />
        </div>
      )}

      {/* Note */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4 text-sm text-zinc-500">
        <p>
          Note: This is a basic formatter. For production use with complex JS/TS code, consider using
          Prettier or a similar tool.
        </p>
      </div>
    </div>
  )
}

