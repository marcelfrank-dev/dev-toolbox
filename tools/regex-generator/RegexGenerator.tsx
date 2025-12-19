'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function generateRegex(examples: string[], negativeExamples: string[]): string {
  if (examples.length === 0) return ''

  // Simple regex generation - find common patterns
  const first = examples[0]
  let pattern = ''

  // Check if all examples match a simple pattern
  if (examples.every((ex) => /^\d+$/.test(ex))) {
    pattern = '\\d+'
  } else if (examples.every((ex) => /^[a-zA-Z]+$/.test(ex))) {
    pattern = '[a-zA-Z]+'
  } else if (examples.every((ex) => /^[a-zA-Z0-9]+$/.test(ex))) {
    pattern = '[a-zA-Z0-9]+'
  } else {
    // Find common prefix and suffix
    let prefix = ''
    let suffix = ''

    for (let i = 0; i < first.length; i++) {
      if (examples.every((ex) => ex[i] === first[i])) {
        prefix += escapeRegexChar(first[i])
      } else {
        break
      }
    }

    for (let i = 1; i <= first.length; i++) {
      const char = first[first.length - i]
      if (examples.every((ex) => ex[ex.length - i] === char)) {
        suffix = escapeRegexChar(char) + suffix
      } else {
        break
      }
    }

    const middle = first.slice(prefix.length, first.length - suffix.length)
    if (middle) {
      pattern = prefix + escapeRegex(middle) + suffix
    } else {
      pattern = prefix + suffix
    }
  }

  return pattern
}

function escapeRegexChar(char: string): string {
  return /[.*+?^${}()|[\]\\]/.test(char) ? '\\' + char : char
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export default function RegexGenerator() {
  const [examples, setExamples] = useState(['example1', 'example2', 'example3'])
  const [negativeExamples, setNegativeExamples] = useState(['bad1', 'bad2'])
  const [newExample, setNewExample] = useState('')
  const [newNegative, setNewNegative] = useState('')

  const regex = generateRegex(examples, negativeExamples)

  const addExample = () => {
    if (newExample.trim()) {
      setExamples([...examples, newExample.trim()])
      setNewExample('')
    }
  }

  const removeExample = (index: number) => {
    setExamples(examples.filter((_, i) => i !== index))
  }

  const addNegative = () => {
    if (newNegative.trim()) {
      setNegativeExamples([...negativeExamples, newNegative.trim()])
      setNewNegative('')
    }
  }

  const removeNegative = (index: number) => {
    setNegativeExamples(negativeExamples.filter((_, i) => i !== index))
  }

  const testRegex = (text: string): boolean => {
    try {
      const re = new RegExp(regex)
      return re.test(text)
    } catch {
      return false
    }
  }

  const clear = () => {
    setExamples(['example1', 'example2', 'example3'])
    setNegativeExamples(['bad1', 'bad2'])
    setNewExample('')
    setNewNegative('')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-300">Positive Examples (should match)</label>
        <div className="flex flex-col gap-2">
          {examples.map((ex, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={ex}
                onChange={(e) => {
                  const newExamples = [...examples]
                  newExamples[i] = e.target.value
                  setExamples(newExamples)
                }}
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 p-2 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
              />
              <button
                onClick={() => removeExample(i)}
                className="rounded-lg bg-zinc-800 px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-700"
              >
                ×
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              type="text"
              value={newExample}
              onChange={(e) => setNewExample(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addExample()
                }
              }}
              placeholder="Add example..."
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 p-2 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            />
            <button
              onClick={addExample}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-300">Negative Examples (should not match)</label>
        <div className="flex flex-col gap-2">
          {negativeExamples.map((ex, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={ex}
                onChange={(e) => {
                  const newNegatives = [...negativeExamples]
                  newNegatives[i] = e.target.value
                  setNegativeExamples(newNegatives)
                }}
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 p-2 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
              />
              <button
                onClick={() => removeNegative(i)}
                className="rounded-lg bg-zinc-800 px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-700"
              >
                ×
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              type="text"
              value={newNegative}
              onChange={(e) => setNewNegative(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addNegative()
                }
              }}
              placeholder="Add negative example..."
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 p-2 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            />
            <button
              onClick={addNegative}
              className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {regex && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="regex-output" className="text-sm font-medium text-zinc-300">
              Generated Regex
            </label>
            <CopyButton text={regex} />
          </div>
          <input
            id="regex-output"
            type="text"
            value={regex}
            readOnly
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-lg text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
            <p className="mb-2 text-xs font-medium text-zinc-300">Test Results:</p>
            <div className="flex flex-col gap-1 text-xs">
              {examples.map((ex, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className={testRegex(ex) ? 'text-emerald-400' : 'text-red-400'}>
                    {testRegex(ex) ? '✓' : '✗'}
                  </span>
                  <code className="text-zinc-300">{ex}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={clear}
        className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
      >
        Reset
      </button>
    </div>
  )
}

