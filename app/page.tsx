'use client'

import { useState, useEffect, useMemo } from 'react'
import { tools } from '@/tools/registry'
import { categories } from '@/tools/definitions'
import { Tool } from '@/tools/types'
import { ToolCard } from '@/components/ToolCard'
import { ToolModal } from '@/components/ToolModal'
import { SearchBar } from '@/components/SearchBar'
import { CategoryFilter } from '@/components/CategoryFilter'
import { getToolFromUrl, setToolInUrl, updateDocumentTitle } from '@/lib/urlState'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [activeTool, setActiveTool] = useState<Tool | null>(null)

  // Handle URL-based tool opening
  useEffect(() => {
    const toolId = getToolFromUrl()
    if (toolId) {
      const tool = tools.find((t) => t.id === toolId)
      if (tool) {
        setActiveTool(tool)
        updateDocumentTitle(tool.name)
      }
    }

    // Listen for popstate (back/forward navigation)
    const handlePopState = () => {
      const toolId = getToolFromUrl()
      if (toolId) {
        const tool = tools.find((t) => t.id === toolId)
        setActiveTool(tool || null)
        updateDocumentTitle(tool?.name || null)
      } else {
        setActiveTool(null)
        updateDocumentTitle(null)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const openTool = (tool: Tool) => {
    setActiveTool(tool)
    setToolInUrl(tool.id)
    updateDocumentTitle(tool.name)
  }

  const closeTool = () => {
    setActiveTool(null)
    setToolInUrl(null)
    updateDocumentTitle(null)
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

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">
            Dev Toolbox
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-zinc-400">
            A collection of free, fast developer tools that run entirely in your browser.
            No data ever leaves your machine.
          </p>
        </header>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-md">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
        </div>

        {/* Tools Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} onClick={() => openTool(tool)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/30 py-16">
            <p className="text-lg text-zinc-500">No tools found</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory(null)
              }}
              className="mt-4 text-sm text-zinc-400 underline hover:text-zinc-200"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Tool Modal */}
      <ToolModal tool={activeTool} onClose={closeTool} />
    </>
  )
}
