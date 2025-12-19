'use client'

import { useState, useEffect } from 'react'
import { Tool } from '@/tools/types'
import { ToolCard } from '@/components/ToolCard'

interface CategorySectionProps {
  category: string
  tools: Tool[]
  defaultExpanded?: boolean
  onToolClick: (tool: Tool) => void
}

const categoryIcons: Record<string, string> = {
  JSON: '📄',
  Encoding: '🔐',
  Text: '📝',
  Web: '🌐',
  Security: '🔒',
  Generator: '⚡',
  Formatter: '✨',
  Converter: '🔄',
  Utility: '🛠️',
  Hash: '🔑',
}

export function CategorySection({
  category,
  tools,
  defaultExpanded = true,
  onToolClick,
}: CategorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  // Sync expanded state when defaultExpanded or tools change
  useEffect(() => {
    setIsExpanded(defaultExpanded)
  }, [defaultExpanded, tools.length])

  if (tools.length === 0) return null

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mb-4 flex w-full items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/30 px-5 py-4 transition-all hover:border-zinc-700 hover:bg-zinc-900/50"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{categoryIcons[category] || '📦'}</span>
          <div className="text-left">
            <h2 className="text-lg font-semibold text-zinc-100">{category}</h2>
            <p className="text-sm text-zinc-500">{tools.length} tool{tools.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-zinc-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isExpanded && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onClick={() => onToolClick(tool)} />
          ))}
        </div>
      )}
    </div>
  )
}

