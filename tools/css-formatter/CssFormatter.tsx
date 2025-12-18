'use client'

import { useState, useCallback } from 'react'
import { CopyButton } from '@/components/CopyButton'

export default function CssFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [indentSize, setIndentSize] = useState(2)
  const [sortProperties, setSortProperties] = useState(false)

  const format = useCallback(() => {
    if (!input.trim()) {
      setOutput('')
      return
    }

    const indent = ' '.repeat(indentSize)
    let result = ''
    let level = 0
    let inBlock = false
    let currentSelector = ''
    let currentProperties: string[] = []

    // Remove comments and normalize
    let css = input
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .trim()

    const flushBlock = () => {
      if (currentSelector && currentProperties.length > 0) {
        result += currentSelector.trim() + ' {\n'

        if (sortProperties) {
          currentProperties.sort((a, b) => {
            const propA = a.split(':')[0].trim()
            const propB = b.split(':')[0].trim()
            return propA.localeCompare(propB)
          })
        }

        currentProperties.forEach((prop) => {
          result += indent + prop.trim() + ';\n'
        })

        result += '}\n\n'
      }
      currentSelector = ''
      currentProperties = []
    }

    let buffer = ''
    for (let i = 0; i < css.length; i++) {
      const char = css[i]

      if (char === '{') {
        currentSelector = buffer.trim()
        buffer = ''
        inBlock = true
        continue
      }

      if (char === '}') {
        if (buffer.trim()) {
          currentProperties.push(buffer.trim())
        }
        flushBlock()
        buffer = ''
        inBlock = false
        continue
      }

      if (char === ';' && inBlock) {
        if (buffer.trim()) {
          currentProperties.push(buffer.trim())
        }
        buffer = ''
        continue
      }

      buffer += char
    }

    // Handle any remaining content
    if (buffer.trim()) {
      if (inBlock) {
        currentProperties.push(buffer.trim())
      }
      flushBlock()
    }

    setOutput(result.trim())
  }, [input, indentSize, sortProperties])

  const minify = useCallback(() => {
    if (!input.trim()) {
      setOutput('')
      return
    }

    const minified = input
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/\s*{\s*/g, '{') // Remove space around {
      .replace(/\s*}\s*/g, '}') // Remove space around }
      .replace(/\s*;\s*/g, ';') // Remove space around ;
      .replace(/\s*:\s*/g, ':') // Remove space around :
      .replace(/\s*,\s*/g, ',') // Remove space around ,
      .replace(/;}/g, '}') // Remove last semicolon in block
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
              checked={sortProperties}
              onChange={(e) => setSortProperties(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-sm text-zinc-300">Sort Properties A-Z</span>
          </label>
        </div>
      </div>

      {/* Input */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">CSS Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder=".class{color:red;margin:0;padding:10px}"
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

