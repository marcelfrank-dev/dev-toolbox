'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function jsonToRustStruct(json: string, structName: string = 'Root'): string {
  try {
    const obj = JSON.parse(json)
    
    function generateStruct(obj: any, name: string, indent: number = 0): string {
      const spaces = '    '.repeat(indent)
      let result = `${spaces}#[derive(Serialize, Deserialize)]\n${spaces}pub struct ${name} {\n`

      if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
        for (const key in obj) {
          const value = obj[key]
          const rustKey = key
          const rustType = getRustType(value, rustKey, indent + 1)
          result += `${spaces}    pub ${rustKey}: ${rustType},\n`
        }
      } else if (Array.isArray(obj) && obj.length > 0) {
        const itemType = getRustType(obj[0], 'Item', indent + 1)
        return `${spaces}pub type ${name} = Vec<${itemType}>;\n`
      }

      result += `${spaces}}\n`
      return result
    }

    function getRustType(value: any, name: string, indent: number): string {
      if (value === null || value === undefined) {
        return 'Option<serde_json::Value>'
      }
      if (typeof value === 'string') {
        return 'String'
      }
      if (typeof value === 'number') {
        return Number.isInteger(value) ? 'i64' : 'f64'
      }
      if (typeof value === 'boolean') {
        return 'bool'
      }
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return 'Vec<serde_json::Value>'
        }
        const itemType = getRustType(value[0], name + 'Item', indent)
        return `Vec<${itemType}>`
      }
      if (typeof value === 'object') {
        const structName = name.charAt(0).toUpperCase() + name.slice(1)
        return structName
      }
      return 'serde_json::Value'
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return `pub type ${structName} = Vec<serde_json::Value>;\n`
      }
      const itemType = getRustType(obj[0], 'Item', 0)
      return `pub type ${structName} = Vec<${itemType}>;\n`
    }

    return generateStruct(obj, structName)
  } catch (e) {
    return 'Error: ' + (e instanceof Error ? e.message : 'Invalid JSON')
  }
}

export default function JsonToRustStruct() {
  const [input, setInput] = useState('')
  const [structName, setStructName] = useState('Root')
  const output = input ? jsonToRustStruct(input, structName) : ''

  const clear = () => {
    setInput('')
    setStructName('Root')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="rust-struct-name" className="text-sm font-medium text-zinc-300">
          Struct Name
        </label>
        <input
          id="rust-struct-name"
          type="text"
          value={structName}
          onChange={(e) => setStructName(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="json-rust-input" className="text-sm font-medium text-zinc-300">
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
          id="json-rust-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name": "John", "age": 30}'
          className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="json-rust-output" className="text-sm font-medium text-zinc-300">
            Rust Struct
          </label>
          <CopyButton text={output} />
        </div>
        <textarea
          id="json-rust-output"
          value={output}
          readOnly
          className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>
    </div>
  )
}

