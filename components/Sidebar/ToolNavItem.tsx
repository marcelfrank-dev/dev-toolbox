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
      className={`group w-full rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 ${isActive
        ? 'bg-primary/20 text-primary-foreground shadow-[0_0_15px_rgba(139,92,246,0.3)]'
        : 'text-white/60 hover:bg-white/10 hover:text-white'
        }`}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className="font-medium">{highlightMatch(tool.name, searchQuery || '')}</div>
      {tool.description && (
        <div className={`mt-0.5 truncate text-xs transition-colors ${isActive ? 'text-primary-foreground/70' : 'text-white/50 group-hover:text-white/80'}`}>
          {tool.description}
        </div>
      )}
    </button>
  )
}

