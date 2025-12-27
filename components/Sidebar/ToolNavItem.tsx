'use client'

import { Tool } from '@/tools/types'

interface ToolNavItemProps {
  tool: Tool
  isActive: boolean
  onClick: () => void
  searchQuery?: string
}

export function ToolNavItem({ tool, isActive, onClick, searchQuery }: ToolNavItemProps) {
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-emerald-500/20 text-emerald-400">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    )
  }

  return (
    <button
      onClick={onClick}
      data-tool-id={tool.id}
      className={`group w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
        isActive
          ? 'bg-emerald-600/20 text-emerald-400'
          : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className="font-medium">{highlightMatch(tool.name, searchQuery || '')}</div>
      {tool.description && (
        <div className="mt-0.5 truncate text-xs text-zinc-500 group-hover:text-zinc-400">
          {tool.description}
        </div>
      )}
    </button>
  )
}

