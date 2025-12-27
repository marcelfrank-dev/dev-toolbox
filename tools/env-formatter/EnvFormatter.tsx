'use client'

import { useState, useMemo } from 'react'
import { CopyButton } from '@/components/CopyButton'

export default function EnvFormatter() {
  const [input, setInput] = useState('')
  const [sortAlphabetically, setSortAlphabetically] = useState(true)
  const [removeDuplicates, setRemoveDuplicates] = useState(true)
  const [addComments, setAddComments] = useState(false)

  const formatted = useMemo(() => {
    if (!input.trim()) return ''

    let lines = input.split('\n').map((line) => line.trim()).filter((line) => line.length > 0)

    // Remove duplicates (keep first occurrence)
    if (removeDuplicates) {
      const seen = new Set<string>()
      lines = lines.filter((line) => {
        // Extract key from line (before = or #)
        const key = line.split(/[=#]/)[0].trim()
        if (key && seen.has(key)) {
          return false
        }
        if (key) seen.add(key)
        return true
      })
    }

    // Separate comments and variables
    const variables: string[] = []
    const comments: string[] = []
    const sections: { comment?: string; vars: string[] }[] = []

    lines.forEach((line) => {
      if (line.startsWith('#')) {
        comments.push(line)
        if (variables.length > 0) {
          sections.push({ vars: [...variables] })
          variables.length = 0
        }
        sections.push({ comment: line, vars: [] })
      } else {
        variables.push(line)
      }
    })

    if (variables.length > 0) {
      sections.push({ vars: variables })
    }

    // Sort variables alphabetically if enabled
    sections.forEach((section) => {
      if (sortAlphabetically && section.vars.length > 0) {
        section.vars.sort((a, b) => {
          const keyA = a.split('=')[0].trim().toLowerCase()
          const keyB = b.split('=')[0].trim().toLowerCase()
          return keyA.localeCompare(keyB)
        })
      }
    })

    // Build output
    let output = ''
    sections.forEach((section, idx) => {
      if (section.comment) {
        output += section.comment + '\n'
      }
      if (section.vars.length > 0) {
        output += section.vars.join('\n')
        if (idx < sections.length - 1) {
          output += '\n'
        }
      }
    })

    // Add section comment if enabled and no comments exist
    if (addComments && comments.length === 0 && variables.length > 0) {
      output = '# Environment Variables\n' + output
    }

    return output.trim()
  }, [input, sortAlphabetically, removeDuplicates, addComments])

  const clear = () => {
    setInput('')
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-300">Input (.env file)</label>
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
            placeholder="KEY1=value1&#10;KEY2=value2&#10;# Comment"
            className="h-96 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>

        {/* Output */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-300">Formatted Output</label>
            <CopyButton text={formatted} />
          </div>
          <textarea
            readOnly
            value={formatted}
            className="h-96 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
      </div>

      {/* Options */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <h3 className="mb-4 text-sm font-semibold text-zinc-300">Formatting Options</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={sortAlphabetically}
              onChange={(e) => setSortAlphabetically(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
            />
            <span className="text-sm text-zinc-300">Sort alphabetically</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={removeDuplicates}
              onChange={(e) => setRemoveDuplicates(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
            />
            <span className="text-sm text-zinc-300">Remove duplicates</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={addComments}
              onChange={(e) => setAddComments(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
            />
            <span className="text-sm text-zinc-300">Add section comment (if no comments exist)</span>
          </label>
        </div>
      </div>
    </div>
  )
}

