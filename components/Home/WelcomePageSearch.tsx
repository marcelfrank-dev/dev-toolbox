'use client'

import { useState, useMemo, useEffect } from 'react'
import { Tool } from '@/tools/types'
import { ToolCard } from './ToolCard'

interface WelcomePageSearchProps {
  tools: Tool[]
  onToolClick: (tool: Tool) => void
  onSearchChange?: (hasSearch: boolean) => void
}

// Improved search function with fuzzy matching
function searchTools(tools: Tool[], query: string): Tool[] {
  if (!query.trim()) return []

  const normalizedQuery = query.toLowerCase().trim()
  const queryWords = normalizedQuery.split(/\s+/).filter(Boolean)

  return tools
    .map((tool) => {
      const name = tool.name.toLowerCase()
      const description = tool.description.toLowerCase()
      const keywords = tool.keywords.map((k) => k.toLowerCase()).join(' ')
      const searchableText = `${name} ${description} ${keywords}`

      // Calculate relevance score
      let score = 0

      // Exact match in name (highest priority)
      if (name.includes(normalizedQuery)) {
        score += 100
      }

      // All words match somewhere
      const allWordsMatch = queryWords.every((word) => searchableText.includes(word))
      if (allWordsMatch) {
        score += 50
      }

      // Word matches in name
      queryWords.forEach((word) => {
        if (name.includes(word)) score += 20
        if (description.includes(word)) score += 10
        if (keywords.includes(word)) score += 15
      })

      // Fuzzy matching - check if query is a substring of any word
      queryWords.forEach((word) => {
        const words = searchableText.split(/\s+/)
        words.forEach((textWord) => {
          if (textWord.includes(word) || word.includes(textWord)) {
            score += 5
          }
        })
      })

      return { tool, score }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.tool)
}

export function WelcomePageSearch({ tools, onToolClick, onSearchChange }: WelcomePageSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const searchResults = useMemo(() => {
    return searchTools(tools, searchQuery)
  }, [tools, searchQuery])

  const hasActiveSearch = searchQuery.trim().length > 0

  // Notify parent when search state changes
  useEffect(() => {
    onSearchChange?.(hasActiveSearch)
  }, [hasActiveSearch, onSearchChange])

  return (
    <div className="px-6 py-8">
      <div className="relative mx-auto max-w-2xl">
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
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground)]/50"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for tools... (e.g., 'json format', 'base64', 'color')"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-4 pl-12 pr-4 text-[var(--foreground)] placeholder-[var(--foreground)]/50 transition-colors focus:border-[var(--primary)]/50 focus:bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1.5 text-[var(--foreground)]/50 hover:bg-[var(--card)] hover:text-[var(--foreground)] transition-colors"
            aria-label="Clear search"
          >
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
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {hasActiveSearch && (
        <div className="mx-auto mt-6 max-w-4xl">
          {searchResults.length > 0 ? (
            <>
              <p className="mb-4 text-sm text-[var(--foreground)]/60">
                Found {searchResults.length} tool{searchResults.length !== 1 ? 's' : ''}
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {searchResults.slice(0, 12).map((tool) => (
                  <ToolCard key={tool.id} tool={tool} onClick={() => onToolClick(tool)} />
                ))}
              </div>
              {searchResults.length > 12 && (
                <p className="mt-4 text-center text-sm text-[var(--foreground)]/60">
                  Showing 12 of {searchResults.length} results. Use the sidebar to see all.
                </p>
              )}
            </>
          ) : (
            <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-8 text-center">
              <p className="text-[var(--foreground)]/70">No tools found matching &quot;{searchQuery}&quot;</p>
              <p className="mt-2 text-sm text-[var(--foreground)]/60">Try different keywords or browse by category below</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

