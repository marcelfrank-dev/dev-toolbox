'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function jsonToTypeScript(json: string, interfaceName: string = 'Root'): string {
  try {
    const obj = JSON.parse(json)
    
    function generateType(obj: any, name: string, indent: number = 0): string {
      const spaces = '  '.repeat(indent)
      let result = `${spaces}interface ${name} {\n`

      if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
        for (const key in obj) {
          const value = obj[key]
          const optional = value === null || value === undefined ? '?' : ''
          const type = getType(value, key, indent + 1)
          result += `${spaces}  ${key}${optional}: ${type}\n`
        }
      } else if (Array.isArray(obj) && obj.length > 0) {
        const itemType = getType(obj[0], 'Item', indent + 1)
        return `${spaces}type ${name} = ${itemType}[]\n`
      }

      result += `${spaces}}\n`
      return result
    }

    function getType(value: any, name: string, indent: number): string {
      if (value === null || value === undefined) {
        return 'null'
      }
      if (typeof value === 'string') {
        return 'string'
      }
      if (typeof value === 'number') {
        return 'number'
      }
      if (typeof value === 'boolean') {
        return 'boolean'
      }
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return 'any[]'
        }
        const itemType = getType(value[0], name + 'Item', indent)
        return `${itemType}[]`
      }
      if (typeof value === 'object') {
        const interfaceName = name.charAt(0).toUpperCase() + name.slice(1)
        return interfaceName
      }
      return 'any'
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return `type ${interfaceName} = any[]\n`
      }
      const itemType = getType(obj[0], 'Item', 0)
      return `type ${interfaceName} = ${itemType}[]\n`
    }

    return generateType(obj, interfaceName)
  } catch (e) {
    return 'Error: ' + (e instanceof Error ? e.message : 'Invalid JSON')
  }
}

export default function JsonToTypeScript() {
  const [input, setInput] = useState('')
  const [interfaceName, setInterfaceName] = useState('Root')
  const output = input ? jsonToTypeScript(input, interfaceName) : ''

  const clear = () => {
    setInput('')
    setInterfaceName('Root')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="interface-name" className="text-sm font-medium text-zinc-300">
          Interface Name
        </label>
        <input
          id="interface-name"
          type="text"
          value={interfaceName}
          onChange={(e) => setInterfaceName(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="json-ts-input" className="text-sm font-medium text-zinc-300">
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
          id="json-ts-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name": "John", "age": 30, "active": true}'
          className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="json-ts-output" className="text-sm font-medium text-zinc-300">
            TypeScript Interface
          </label>
          <CopyButton text={output} />
        </div>
        <textarea
          id="json-ts-output"
          value={output}
          readOnly
          className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>
    </div>
  )
}

