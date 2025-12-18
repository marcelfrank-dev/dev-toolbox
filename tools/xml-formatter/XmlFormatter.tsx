'use client'

import { useState, useCallback } from 'react'
import { CopyButton } from '@/components/CopyButton'

export default function XmlFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [indentSize, setIndentSize] = useState(2)
  const [error, setError] = useState('')

  const format = useCallback(() => {
    setError('')

    if (!input.trim()) {
      setOutput('')
      return
    }

    try {
      const indent = ' '.repeat(indentSize)
      let result = ''
      let level = 0

      // Remove existing whitespace between tags
      const xml = input.replace(/>\s+</g, '><').trim()

      let i = 0
      while (i < xml.length) {
        // Find start of tag
        if (xml[i] === '<') {
          const tagEnd = xml.indexOf('>', i)
          if (tagEnd === -1) {
            throw new Error('Invalid XML: unclosed tag')
          }

          const tag = xml.slice(i, tagEnd + 1)
          const tagName = tag.match(/<\/?([^\s/>]+)/)?.[1]

          // Check tag type
          const isClosing = tag.startsWith('</')
          const isSelfClosing = tag.endsWith('/>')
          const isDeclaration = tag.startsWith('<?') || tag.startsWith('<!')

          if (isClosing && !isDeclaration) {
            level = Math.max(0, level - 1)
          }

          // Add newline and indent (except for first element)
          if (result) {
            result += '\n' + indent.repeat(level)
          }

          result += tag

          if (!isClosing && !isSelfClosing && !isDeclaration) {
            level++
          }

          i = tagEnd + 1
        } else {
          // Text content
          let textEnd = xml.indexOf('<', i)
          if (textEnd === -1) textEnd = xml.length

          const text = xml.slice(i, textEnd).trim()
          if (text) {
            result += text
          }

          i = textEnd
        }
      }

      setOutput(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid XML')
      setOutput('')
    }
  }, [input, indentSize])

  const minify = useCallback(() => {
    setError('')

    if (!input.trim()) {
      setOutput('')
      return
    }

    try {
      // Remove whitespace between tags and trim
      const minified = input
        .replace(/>\s+</g, '><')
        .replace(/\s+/g, ' ')
        .trim()

      setOutput(minified)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid XML')
      setOutput('')
    }
  }, [input])

  const validate = useCallback(() => {
    setError('')
    setOutput('')

    if (!input.trim()) {
      return
    }

    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(input, 'application/xml')
      const parseError = doc.querySelector('parsererror')

      if (parseError) {
        setError('Invalid XML: ' + parseError.textContent)
      } else {
        setOutput('✓ Valid XML')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid XML')
    }
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
      </div>

      {/* Input */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">XML Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="<root><item>content</item></root>"
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
        <button
          onClick={validate}
          disabled={!input.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Validate
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-900/50 bg-red-900/20 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Output */}
      {output && !error && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-400">Output</label>
            {output !== '✓ Valid XML' && <CopyButton text={output} />}
          </div>
          {output === '✓ Valid XML' ? (
            <div className="rounded-lg border border-emerald-900/50 bg-emerald-900/20 p-4 text-sm text-emerald-400">
              {output}
            </div>
          ) : (
            <textarea
              value={output}
              readOnly
              className="h-48 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-emerald-400 focus:outline-none"
            />
          )}
        </div>
      )}
    </div>
  )
}

