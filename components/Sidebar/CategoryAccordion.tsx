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
  // Auto-expand if search is active and has matches
  useEffect(() => {
    if (searchQuery && tools.length > 0 && !isExpanded) {
      onToggle()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, tools.length, isExpanded])

  if (tools.length === 0) return null

  return (
    <div className="border-b border-white/5">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-3 py-3 text-left transition-colors hover:bg-white/5"
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
        className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="space-y-1 px-3 pb-3">
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

