'use client'

import { useState, useCallback } from 'react'
import { CopyButton } from '@/components/CopyButton'

export default function HtmlFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [indentSize, setIndentSize] = useState(2)
  const [useTabs, setUseTabs] = useState(false)

  const format = useCallback(() => {
    if (!input.trim()) {
      setOutput('')
      return
    }

    const indent = useTabs ? '\t' : ' '.repeat(indentSize)
    let result = ''
    let level = 0
    let inTag = false
    let inQuote = ''
    let tagContent = ''

    const selfClosingTags = [
      'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
      'link', 'meta', 'param', 'source', 'track', 'wbr'
    ]

    const inlineTags = [
      'a', 'abbr', 'b', 'bdo', 'br', 'cite', 'code', 'dfn', 'em',
      'i', 'kbd', 'mark', 'q', 's', 'samp', 'small', 'span', 'strong',
      'sub', 'sup', 'u', 'var'
    ]

    // Normalize whitespace
    let html = input.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

    for (let i = 0; i < html.length; i++) {
      const char = html[i]

      if (inQuote) {
        tagContent += char
        if (char === inQuote) {
          inQuote = ''
        }
        continue
      }

      if (char === '"' || char === "'") {
        inQuote = char
        tagContent += char
        continue
      }

      if (char === '<') {
        // Output any buffered text
        if (tagContent.trim()) {
          result += tagContent.trim()
        }
        tagContent = '<'
        inTag = true
        continue
      }

      if (char === '>') {
        tagContent += '>'
        inTag = false

        const tagMatch = tagContent.match(/<\/?([a-zA-Z][a-zA-Z0-9]*)/i)
        const tagName = tagMatch ? tagMatch[1].toLowerCase() : ''
        const isClosing = tagContent.startsWith('</')
        const isSelfClosing = selfClosingTags.includes(tagName) || tagContent.endsWith('/>')

        if (isClosing) {
          level = Math.max(0, level - 1)
        }

        // Add newline and indent before tag (except for first tag)
        if (result) {
          result += '\n' + indent.repeat(level)
        } else {
          result += indent.repeat(level)
        }

        result += tagContent

        if (!isClosing && !isSelfClosing) {
          level++
        }

        tagContent = ''
        continue
      }

      tagContent += char
    }

    // Output remaining content
    if (tagContent.trim()) {
      result += tagContent.trim()
    }

    setOutput(result)
  }, [input, indentSize, useTabs])

  const minify = useCallback(() => {
    if (!input.trim()) {
      setOutput('')
      return
    }

    // Remove comments, extra whitespace, newlines
    const minified = input
      .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/>\s+</g, '><') // Remove whitespace between tags
      .replace(/\s+>/g, '>') // Remove whitespace before >
      .replace(/<\s+/g, '<') // Remove whitespace after <
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
            disabled={useTabs}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none disabled:opacity-50"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={useTabs}
              onChange={(e) => setUseTabs(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-sm text-zinc-300">Use Tabs</span>
          </label>
        </div>
      </div>

      {/* Input */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">HTML Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="<html><head><title>Page</title></head><body><h1>Hello</h1></body></html>"
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

