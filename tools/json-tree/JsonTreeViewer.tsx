'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

interface TreeNode {
  key: string
  value: any
  type: string
  children?: TreeNode[]
}

function parseJsonToTree(json: string): TreeNode | null {
  try {
    const obj = JSON.parse(json)
    return objectToTree(obj, 'root')
  } catch {
    return null
  }
}

function objectToTree(obj: any, key: string): TreeNode {
  if (obj === null) {
    return { key, value: 'null', type: 'null' }
  }

  const type = Array.isArray(obj) ? 'array' : typeof obj

  if (type === 'object') {
    const children: TreeNode[] = []
    for (const k in obj) {
      children.push(objectToTree(obj[k], k))
    }
    return { key, value: `{${children.length} keys}`, type: 'object', children }
  }

  if (type === 'array') {
    const children: TreeNode[] = obj.map((item: any, i: number) => objectToTree(item, i.toString()))
    return { key, value: `[${obj.length} items]`, type: 'array', children }
  }

  return { key, value: String(obj), type }
}

function TreeNodeComponent({ node, level = 0 }: { node: TreeNode; level?: number }) {
  const [expanded, setExpanded] = useState(level < 2)

  const hasChildren = node.children && node.children.length > 0
  const indent = level * 20

  return (
    <div className="select-none">
      <div
        className="flex items-center gap-2 py-1 hover:bg-zinc-800/50"
        style={{ paddingLeft: `${indent}px` }}
      >
        {hasChildren && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-zinc-400 hover:text-zinc-200"
          >
            {expanded ? '▼' : '▶'}
          </button>
        )}
        {!hasChildren && <span className="w-4" />}
        <span className="text-sm font-medium text-emerald-400">{node.key}:</span>
        <span className={`text-sm ${
          node.type === 'string' ? 'text-zinc-200' :
          node.type === 'number' ? 'text-blue-400' :
          node.type === 'boolean' ? 'text-purple-400' :
          'text-zinc-400'
        }`}>
          {node.value}
        </span>
        <span className="text-xs text-zinc-600">({node.type})</span>
      </div>
      {hasChildren && expanded && (
        <div>
          {node.children!.map((child, i) => (
            <TreeNodeComponent key={i} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function JsonTreeViewer() {
  const [input, setInput] = useState('')
  const tree = input ? parseJsonToTree(input) : null

  const clear = () => setInput('')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="json-tree-input" className="text-sm font-medium text-zinc-300">
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
          id="json-tree-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"key": "value", "nested": {"subkey": 123}}'
          className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      {tree ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-300">Tree View</label>
            <CopyButton text={JSON.stringify(JSON.parse(input), null, 2)} />
          </div>
          <div className="max-h-96 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
            <TreeNodeComponent node={tree} />
          </div>
        </div>
      ) : input ? (
        <div className="rounded-lg border border-red-800 bg-red-900/20 p-4">
          <p className="text-sm text-red-400">Invalid JSON</p>
        </div>
      ) : null}
    </div>
  )
}

