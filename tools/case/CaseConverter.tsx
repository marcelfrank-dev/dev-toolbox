'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function toWords(str: string): string[] {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
}

function toCamelCase(str: string): string {
  const words = toWords(str)
  return words
    .map((word, i) => (i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join('')
}

function toPascalCase(str: string): string {
  return toWords(str)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

function toSnakeCase(str: string): string {
  return toWords(str).join('_')
}

function toKebabCase(str: string): string {
  return toWords(str).join('-')
}

function toConstantCase(str: string): string {
  return toWords(str).join('_').toUpperCase()
}

export default function CaseConverter() {
  const [input, setInput] = useState('')

  const cases = [
    { name: 'camelCase', fn: toCamelCase },
    { name: 'PascalCase', fn: toPascalCase },
    { name: 'snake_case', fn: toSnakeCase },
    { name: 'kebab-case', fn: toKebabCase },
    { name: 'CONSTANT_CASE', fn: toConstantCase },
  ]

  const clear = () => setInput('')

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="case-input" className="text-sm font-medium text-zinc-300">
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
          id="case-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text like 'hello world', 'helloWorld', or 'hello_world'"
          className="h-24 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cases.map(({ name, fn }) => {
          const result = input ? fn(input) : ''
          return (
            <div
              key={name}
              className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-400">{name}</span>
                <CopyButton text={result} />
              </div>
              <code className="min-h-[2rem] font-mono text-sm text-zinc-200">
                {result || <span className="text-zinc-600">—</span>}
              </code>
            </div>
          )
        })}
      </div>
    </div>
  )
}

