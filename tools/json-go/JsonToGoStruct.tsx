'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function jsonToGoStruct(json: string, structName: string = 'Root'): string {
  try {
    const obj = JSON.parse(json)
    
    function generateStruct(obj: any, name: string, indent: number = 0): string {
      const spaces = '  '.repeat(indent)
      let result = `${spaces}type ${name} struct {\n`

      if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
        for (const key in obj) {
          const value = obj[key]
          const goKey = key.charAt(0).toUpperCase() + key.slice(1)
          const goType = getGoType(value, goKey, indent + 1)
          const jsonTag = `\`json:"${key}"\``
          result += `${spaces}  ${goKey} ${goType} ${jsonTag}\n`
        }
      } else if (Array.isArray(obj) && obj.length > 0) {
        const itemType = getGoType(obj[0], 'Item', indent + 1)
        return `${spaces}type ${name} []${itemType}\n`
      }

      result += `${spaces}}\n`
      return result
    }

    function getGoType(value: any, name: string, indent: number): string {
      if (value === null || value === undefined) {
        return 'interface{}'
      }
      if (typeof value === 'string') {
        return 'string'
      }
      if (typeof value === 'number') {
        return Number.isInteger(value) ? 'int' : 'float64'
      }
      if (typeof value === 'boolean') {
        return 'bool'
      }
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return '[]interface{}'
        }
        const itemType = getGoType(value[0], name + 'Item', indent)
        return `[]${itemType}`
      }
      if (typeof value === 'object') {
        const structName = name.charAt(0).toUpperCase() + name.slice(1)
        return structName
      }
      return 'interface{}'
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return `type ${structName} []interface{}\n`
      }
      const itemType = getGoType(obj[0], 'Item', 0)
      return `type ${structName} []${itemType}\n`
    }

    return generateStruct(obj, structName)
  } catch (e) {
    return 'Error: ' + (e instanceof Error ? e.message : 'Invalid JSON')
  }
}

export default function JsonToGoStruct() {
  const [input, setInput] = useState('')
  const [structName, setStructName] = useState('Root')
  const output = input ? jsonToGoStruct(input, structName) : ''

  const clear = () => {
    setInput('')
    setStructName('Root')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="go-struct-name" className="text-sm font-medium text-zinc-300">
          Struct Name
        </label>
        <input
          id="go-struct-name"
          type="text"
          value={structName}
          onChange={(e) => setStructName(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="json-go-input" className="text-sm font-medium text-zinc-300">
            JSON Input
          </label>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
        <textarea
          id="json-go-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name": "John", "age": 30}'
          className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="json-go-output" className="text-sm font-medium text-zinc-300">
            Go Struct
          </label>
          <CopyButton text={output} />
        </div>
        <textarea
          id="json-go-output"
          value={output}
          readOnly
          className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>
    </div>
  )
}

