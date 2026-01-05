'use client'

import { useEffect } from 'react'
import { Tool } from '@/tools/types'
import { ToolNavItem } from './ToolNavItem'

interface CategoryAccordionProps {
  category: string
  tools: Tool[]
  isExpanded: boolean
  onToggle: () => void
  activeToolId: string | null
  onToolClick: (tool: Tool) => void
  searchQuery?: string
}

export function CategoryAccordion({
  category,
  tools,
  isExpanded,
  onToggle,
  activeToolId,
  onToolClick,
  searchQuery,
}: CategoryAccordionProps) {

  if (tools.length === 0) return null

  return (
    <div className={`flex flex-col border-b border-white/5 ${isExpanded ? 'flex-1 min-h-0' : ''}`}>
      <button
        onClick={onToggle}
        className="flex w-full shrink-0 items-center justify-between px-3 py-3 text-left transition-colors hover:bg-white/5"
        aria-expanded={isExpanded}
      >
        <span className="text-sm font-semibold text-white/90">{category}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/50">({tools.length})</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-white/40 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </button>
      <div
        className={`flex-1 min-h-0 overflow-y-auto px-3 pb-3 transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'hidden opacity-0'
          }`}
      >
        <div className="space-y-1">
          {tools.map((tool) => (
            <ToolNavItem
              key={tool.id}
              tool={tool}
              isActive={activeToolId === tool.id}
              onClick={() => onToolClick(tool)}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

