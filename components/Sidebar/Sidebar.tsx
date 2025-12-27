'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { Tool } from '@/tools/types'
import { categories } from '@/tools/definitions'
import { SidebarSearch } from './SidebarSearch'
import { CategoryAccordion } from './CategoryAccordion'

interface SidebarProps {
  tools: Tool[]
  activeToolId: string | null
  onToolClick: (tool: Tool) => void
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar({ tools, activeToolId, onToolClick, isMobileOpen, onMobileClose }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Load expanded categories from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-expanded-categories')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setExpandedCategories(new Set(parsed))
      } catch {
        // Ignore parse errors
      }
    } else {
      // Default: expand all categories
      setExpandedCategories(new Set(categories))
    }
  }, [])

  // Save expanded categories to localStorage
  useEffect(() => {
    if (expandedCategories.size > 0) {
      localStorage.setItem('sidebar-expanded-categories', JSON.stringify([...expandedCategories]))
    }
  }, [expandedCategories])

  // Filter tools based on search
  const filteredTools = useMemo(() => {
    if (!searchQuery) return tools

    const query = searchQuery.toLowerCase()
    return tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.keywords.some((k) => k.toLowerCase().includes(query))
    )
  }, [tools, searchQuery])

  // Group tools by category
  const toolsByCategory = useMemo(() => {
    const grouped: Record<string, Tool[]> = {}
    filteredTools.forEach((tool) => {
      if (!grouped[tool.category]) {
        grouped[tool.category] = []
      }
      grouped[tool.category].push(tool)
    })
    return grouped
  }, [filteredTools])

  // Auto-scroll to active tool
  useEffect(() => {
    if (activeToolId && sidebarRef.current) {
      const activeElement = sidebarRef.current.querySelector(`[data-tool-id="${activeToolId}"]`)
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }, [activeToolId])

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }

  // Keyboard shortcut: Cmd/Ctrl + K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        const searchInput = sidebarRef.current?.querySelector('input[type="text"]') as HTMLInputElement
        searchInput?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed left-0 top-0 z-50 h-full w-72 transform border-r border-zinc-800 bg-zinc-900 transition-transform duration-300 lg:relative lg:z-auto lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        aria-label="Navigation"
      >
        <div className="flex h-full flex-col">
          {/* Mobile close button */}
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3 lg:hidden">
            <h2 className="text-lg font-bold text-zinc-100">Dev Toolbox</h2>
            <button
              onClick={onMobileClose}
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              aria-label="Close sidebar"
            >
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
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="px-4">
            <SidebarSearch
              value={searchQuery}
              onChange={setSearchQuery}
              resultsCount={searchQuery ? filteredTools.length : undefined}
            />
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-2">
            {categories
              .filter((category) => toolsByCategory[category]?.length > 0)
              .map((category) => (
                <CategoryAccordion
                  key={category}
                  category={category}
                  tools={toolsByCategory[category] || []}
                  isExpanded={expandedCategories.has(category)}
                  onToggle={() => toggleCategory(category)}
                  activeToolId={activeToolId}
                  onToolClick={(tool) => {
                    onToolClick(tool)
                    onMobileClose?.()
                  }}
                  searchQuery={searchQuery}
                />
              ))}
            {filteredTools.length === 0 && searchQuery && (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-zinc-500">No tools found</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-xs text-emerald-400 hover:text-emerald-300"
                >
                  Clear search
                </button>
              </div>
            )}
          </nav>
        </div>
      </aside>
    </>
  )
}

