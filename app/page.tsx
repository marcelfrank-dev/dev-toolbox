'use client'

import { useState, useEffect, useMemo } from 'react'
import { tools } from '@/tools/registry'
import { categories } from '@/tools/definitions'
import { Tool } from '@/tools/types'
import { ToolModal } from '@/components/ToolModal'
import { SearchBar } from '@/components/SearchBar'
import { CategoryFilter } from '@/components/CategoryFilter'
import { CategorySection } from '@/components/CategorySection'
import { ToolCard } from '@/components/ToolCard'
import { getToolFromUrl, setToolInUrl, updateMetaTags } from '@/lib/urlState'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [activeTool, setActiveTool] = useState<Tool | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle URL-based tool opening
  useEffect(() => {
    const toolId = getToolFromUrl()
    if (toolId) {
      const tool = tools.find((t) => t.id === toolId)
      if (tool) {
        setActiveTool(tool)
        updateMetaTags(tool)
      }
    }

    // Listen for popstate (back/forward navigation)
    const handlePopState = () => {
      const toolId = getToolFromUrl()
      if (toolId) {
        const tool = tools.find((t) => t.id === toolId)
        setActiveTool(tool || null)
        updateMetaTags(tool || null)
      } else {
        setActiveTool(null)
        updateMetaTags(null)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const openTool = (tool: Tool) => {
    setActiveTool(tool)
    setToolInUrl(tool.id)
    updateMetaTags(tool)
  }

  const closeTool = () => {
    setActiveTool(null)
    setToolInUrl(null)
    updateMetaTags(null)
  }

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      // Category filter
      if (selectedCategory && tool.category !== selectedCategory) {
        return false
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.keywords.some((k) => k.toLowerCase().includes(query))
        )
      }

      return true
    })
  }, [searchQuery, selectedCategory])

  // Group filtered tools by category
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

  const hasActiveFilters = searchQuery || selectedCategory

  return (
    <>
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm transition-all duration-300">
        <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-6'}`}>
          {/* Header */}
          <header className={`text-center transition-all duration-300 ${isScrolled ? 'mb-3' : 'mb-6'}`}>
            <h1 className={`font-bold tracking-tight text-zinc-100 transition-all duration-300 ${isScrolled ? 'mb-1 text-xl sm:text-2xl' : 'mb-2 text-3xl sm:text-4xl'}`}>
              Dev Toolbox
            </h1>
            {!isScrolled && (
              <>
                <p className="mx-auto max-w-2xl text-sm text-zinc-400 sm:text-base">
                  A collection of free, fast developer tools that run entirely in your browser.
                  No data ever leaves your machine.
                </p>
                {!hasActiveFilters && (
                  <p className="mt-2 text-sm text-zinc-500">
                    {tools.length} tools available across {categories.length} categories
                  </p>
                )}
              </>
            )}
          </header>

          {/* Search and Filter */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full sm:max-w-md">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
            <CategoryFilter
              categories={categories}
              selected={selectedCategory}
              onChange={setSelectedCategory}
            />
          </div>

          {/* Results Summary */}
          {hasActiveFilters && (
            <div className="mt-4 flex items-center justify-between text-sm text-zinc-400">
              <span>
                {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} found
                {selectedCategory && ` in ${selectedCategory}`}
                {searchQuery && ` matching "${searchQuery}"`}
              </span>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory(null)
                }}
                className="text-emerald-400 hover:text-emerald-300 underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {filteredTools.length > 0 ? (
          hasActiveFilters ? (
            // When filters are active, show flat grid
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} onClick={() => openTool(tool)} />
              ))}
            </div>
          ) : (
            // When no filters, show organized by category
            <div>
              {categories
                .filter((category) => toolsByCategory[category]?.length > 0)
                .map((category) => (
                  <CategorySection
                    key={category}
                    category={category}
                    tools={toolsByCategory[category] || []}
                    defaultExpanded={true}
                    onToolClick={openTool}
                  />
                ))}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/30 py-16">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-4 text-zinc-600"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p className="text-lg font-medium text-zinc-400">No tools found</p>
            <p className="mt-2 text-sm text-zinc-500">
              Try adjusting your search or category filter
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory(null)
              }}
              className="mt-6 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Tool Modal */}
      <ToolModal tool={activeTool} onClose={closeTool} />
    </>
  )
}
