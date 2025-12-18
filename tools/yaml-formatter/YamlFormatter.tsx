'use client'

import { useState, useCallback } from 'react'
import { CopyButton } from '@/components/CopyButton'
import { useToast } from '@/components/Toast'

export default function YamlFormatter() {
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
      const lines = input.split('\n')
      const formatted: string[] = []
      const indent = ' '.repeat(indentSize)
      let currentIndent = 0
      let inArray = false

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line || line.startsWith('#')) {
          if (line) formatted.push(indent.repeat(currentIndent) + line)
          continue
        }

        // Check if line is array item
        if (line.startsWith('-')) {
          formatted.push(indent.repeat(currentIndent) + line)
          inArray = true
          continue
        }

        // Check if line has key-value
        const colonIndex = line.indexOf(':')
        if (colonIndex > 0) {
          const key = line.substring(0, colonIndex).trim()
          const value = line.substring(colonIndex + 1).trim()

          // Check if next line is indented (nested)
          const nextLine = i < lines.length - 1 ? lines[i + 1].trim() : ''
          const isNested = nextLine && !nextLine.startsWith('-') && (nextLine.includes(':') || nextLine.startsWith('|') || nextLine.startsWith('>'))

          if (value === '' && isNested) {
            formatted.push(indent.repeat(currentIndent) + key + ':')
            currentIndent++
            inArray = false
          } else {
            formatted.push(indent.repeat(currentIndent) + key + ': ' + value)
            inArray = false
          }
        } else {
          formatted.push(indent.repeat(currentIndent) + line)
        }
      }

      setOutput(formatted.join('\n'))
      showToast('YAML formatted successfully!', 'success')
    } catch (error) {
      showToast('Error formatting YAML', 'error')
    }
  }, [input, indentSize, showToast])

  const minify = useCallback(() => {
    if (!input.trim()) {
      setOutput('')
      return
    }

    try {
      const minified = input
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#'))
        .join(' ')

      setOutput(minified)
      showToast('YAML minified successfully!', 'success')
    } catch (error) {
      showToast('Error minifying YAML', 'error')
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
        <label className="mb-2 block text-sm font-medium text-zinc-400">YAML</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your YAML here..."
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
            <label className="text-sm font-medium text-zinc-400">Formatted YAML</label>
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

