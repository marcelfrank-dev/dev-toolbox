'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function findReplace(text: string, find: string, replace: string, useRegex: boolean, caseSensitive: boolean): string {
  if (!find) return text

  try {
    if (useRegex) {
      const flags = caseSensitive ? 'g' : 'gi'
      const regex = new RegExp(find, flags)
      return text.replace(regex, replace)
    } else {
      if (caseSensitive) {
        return text.split(find).join(replace)
      } else {
        const regex = new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
        return text.replace(regex, replace)
      }
    }
  } catch (e) {
    return text
  }
}

export default function FindReplace() {
  const [input, setInput] = useState('')
  const [find, setFind] = useState('')
  const [replace, setReplace] = useState('')
  const [useRegex, setUseRegex] = useState(false)
  const [caseSensitive, setCaseSensitive] = useState(false)

  const output = input && find ? findReplace(input, find, replace, useRegex, caseSensitive) : input

  const clear = () => {
    setInput('')
    setFind('')
    setReplace('')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="find-input" className="text-sm font-medium text-zinc-300">
            Input Text
          </label>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
        <textarea
          id="find-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to search and replace..."
          className="h-32 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="find-text" className="text-sm font-medium text-zinc-300">
            Find
          </label>
          <input
            id="find-text"
            type="text"
            value={find}
            onChange={(e) => setFind(e.target.value)}
            placeholder="Text or regex pattern to find..."
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="replace-text" className="text-sm font-medium text-zinc-300">
            Replace
          </label>
          <input
            id="replace-text"
            type="text"
            value={replace}
            onChange={(e) => setReplace(e.target.value)}
            placeholder="Replacement text..."
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={useRegex}
            onChange={(e) => setUseRegex(e.target.checked)}
            className="rounded border-zinc-700 bg-zinc-900 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
          />
          <span className="text-sm text-zinc-400">Use Regex</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="rounded border-zinc-700 bg-zinc-900 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
          />
          <span className="text-sm text-zinc-400">Case Sensitive</span>
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="find-output" className="text-sm font-medium text-zinc-300">
            Output
          </label>
          <CopyButton text={output} />
        </div>
        <textarea
          id="find-output"
          value={output}
          readOnly
          className="h-32 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>
    </div>
  )
}

