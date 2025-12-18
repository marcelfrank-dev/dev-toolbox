'use client'

import { useState, useCallback } from 'react'
import { CopyButton } from '@/components/CopyButton'

export default function SqlFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [uppercase, setUppercase] = useState(true)
  const [indentSize, setIndentSize] = useState(2)

  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN',
    'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER', 'FULL', 'CROSS', 'ON',
    'GROUP', 'BY', 'HAVING', 'ORDER', 'ASC', 'DESC', 'LIMIT', 'OFFSET',
    'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE',
    'TABLE', 'INDEX', 'VIEW', 'DROP', 'ALTER', 'ADD', 'COLUMN',
    'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'UNIQUE', 'CHECK',
    'DEFAULT', 'NULL', 'AS', 'DISTINCT', 'ALL', 'UNION', 'INTERSECT',
    'EXCEPT', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'EXISTS', 'IS',
    'TRUE', 'FALSE', 'COALESCE', 'NULLIF', 'CAST', 'CONVERT'
  ]

  const newLineKeywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 
    'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'CROSS JOIN',
    'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'UNION', 'INTERSECT', 'EXCEPT']

  const format = useCallback(() => {
    if (!input.trim()) {
      setOutput('')
      return
    }

    const indent = ' '.repeat(indentSize)
    let sql = input

    // Normalize whitespace
    sql = sql.replace(/\s+/g, ' ').trim()

    // Format keywords
    if (uppercase) {
      keywords.forEach((kw) => {
        const regex = new RegExp(`\\b${kw}\\b`, 'gi')
        sql = sql.replace(regex, kw)
      })
    } else {
      keywords.forEach((kw) => {
        const regex = new RegExp(`\\b${kw}\\b`, 'gi')
        sql = sql.replace(regex, kw.toLowerCase())
      })
    }

    // Add newlines before major keywords
    newLineKeywords.forEach((kw) => {
      const regex = new RegExp(`\\s+(${uppercase ? kw : kw.toLowerCase()})\\b`, 'g')
      sql = sql.replace(regex, `\n${uppercase ? kw : kw.toLowerCase()}`)
    })

    // Indent wrapped lines
    const lines = sql.split('\n')
    const result: string[] = []
    let level = 0

    lines.forEach((line, index) => {
      const trimmed = line.trim()
      const upperLine = trimmed.toUpperCase()

      // Decrease indent for closing parentheses
      if (trimmed.startsWith(')')) {
        level = Math.max(0, level - 1)
      }

      // Add indentation
      let currentIndent = indent.repeat(level)

      // Add extra indent for continuation keywords
      if (upperLine.startsWith('AND') || upperLine.startsWith('OR')) {
        currentIndent += indent
      }

      result.push(currentIndent + trimmed)

      // Increase indent for opening parentheses
      const openCount = (line.match(/\(/g) || []).length
      const closeCount = (line.match(/\)/g) || []).length
      level += openCount - closeCount
      level = Math.max(0, level)
    })

    setOutput(result.join('\n'))
  }, [input, uppercase, indentSize])

  const minify = useCallback(() => {
    if (!input.trim()) {
      setOutput('')
      return
    }

    const minified = input
      .replace(/\s+/g, ' ')
      .replace(/\s*,\s*/g, ',')
      .replace(/\s*\(\s*/g, '(')
      .replace(/\s*\)\s*/g, ')')
      .trim()

    setOutput(minified)
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
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-sm text-zinc-300">Uppercase Keywords</span>
          </label>
        </div>
      </div>

      {/* Input */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">SQL Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="select * from users where id = 1 and name like '%john%'"
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
    </div>
  )
}

