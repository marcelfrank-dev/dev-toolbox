'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { Tool } from '@/tools/types'
import { categories } from '@/tools/definitions'
import { SidebarSearch } from './SidebarSearch'
import { CategoryAccordion } from './CategoryAccordion'
import { ThemeToggle } from '../Theme/ThemeToggle'

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
        const initial = Array.isArray(parsed) && parsed.length > 0 ? [parsed[0]] : []
        setExpandedCategories(new Set(initial))
      } catch {
        // Ignore parse errors
      }
    } else if (categories.length > 0) {
      // Default: expand only the first category
      setExpandedCategories(new Set([categories[0]]))
    }
  }, [])

  // Save expanded categories to localStorage (only the first one)
  useEffect(() => {
    const categoriesArray = Array.from(expandedCategories)
    if (categoriesArray.length > 0) {
      localStorage.setItem('sidebar-expanded-categories', JSON.stringify([categoriesArray[0]]))
    }
  }, [expandedCategories])

  // Improved search with fuzzy matching
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return tools

    const normalizedQuery = searchQuery.toLowerCase().trim()
    const queryWords = normalizedQuery.split(/\s+/).filter(Boolean)

    return tools
      .map((tool) => {
        const name = tool.name.toLowerCase()
        const description = tool.description.toLowerCase()
        const keywords = tool.keywords.map((k) => k.toLowerCase()).join(' ')
        const searchableText = `${name} ${description} ${keywords}`

        // Check if all words match somewhere (fuzzy matching)
        const allWordsMatch = queryWords.every((word) => searchableText.includes(word))
        if (allWordsMatch) return { tool, score: 1 }

        // Check individual word matches
        const hasMatch =
          name.includes(normalizedQuery) ||
          description.includes(normalizedQuery) ||
          keywords.includes(normalizedQuery) ||
          queryWords.some((word) => searchableText.includes(word))

        return hasMatch ? { tool, score: 1 } : null
      })
      .filter((item): item is { tool: Tool; score: number } => item !== null)
      .map((item) => item.tool)
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
      const next = new Set<string>()
      if (!prev.has(category)) {
        next.add(category)
      }
      return next
    })
  }

  // Auto-expand first matching category during search
  useEffect(() => {
    if (searchQuery.trim()) {
      const firstMatch = categories.find((cat) => (toolsByCategory[cat]?.length || 0) > 0)
      if (firstMatch) {
        setExpandedCategories(new Set([firstMatch]))
      }
    }
  }, [searchQuery, toolsByCategory])

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
          className="fixed inset-0 z-40 bg-[var(--background)]/80 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed left-0 top-0 z-50 h-full w-72 transform border-r border-[var(--border)] bg-[var(--card)] backdrop-blur-2xl transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) lg:relative lg:z-auto lg:translate-x-0 ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
          } lg:backdrop-blur-xl`}
        aria-label="Navigation"
      >
        <div className="flex h-full flex-col">
          {/* Desktop Theme Toggle */}
          <div className="hidden lg:flex items-center justify-end px-4 pt-4 pb-2">
            <ThemeToggle size="sm" />
          </div>

          {/* Mobile Header (Search and Title) */}
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-4 lg:hidden">
            <h2 className="text-lg font-bold text-[var(--foreground)]">Navigation</h2>
            <button
              onClick={onMobileClose}
              className="rounded-lg p-2 text-[var(--foreground)]/50 transition-colors hover:bg-[var(--foreground)]/10 hover:text-[var(--foreground)]"
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
                <path d="M18 6L6 18M6 6l12 12" />
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
          <nav className="flex min-h-0 flex-1 flex-col px-2 overflow-hidden">
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
                <p className="text-sm text-[var(--foreground)]/60">No tools found</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-xs text-[var(--secondary)] hover:text-[var(--secondary)]/80 transition-colors"
                >
                  Clear
                </button>
              </div>
            )}
          </nav>

        </div>
      </aside>
    </>
  )
}

