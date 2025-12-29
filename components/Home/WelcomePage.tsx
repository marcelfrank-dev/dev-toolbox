'use client'

import { useState } from 'react'
import { Tool } from '@/tools/types'
import { categories } from '@/tools/definitions'
import { HeroSection } from './HeroSection'
import { AdPlacement } from './AdPlacement'
import { WelcomePageSearch } from './WelcomePageSearch'
import { CategorySection } from './CategorySection'

interface WelcomePageProps {
  tools: Tool[]
  onToolClick: (tool: Tool) => void
}

export function WelcomePage({ tools, onToolClick }: WelcomePageProps) {
  const [hasActiveSearch, setHasActiveSearch] = useState(false)

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Top Banner Ad */}
      <div className="px-6 pt-6">
        <AdPlacement position="1593654749" className="w-full" />
      </div>

      {/* Hero Section */}
      <HeroSection toolCount={tools.length} categoryCount={categories.length} />

      {/* Search Section */}
      <div
        onFocus={() => setHasActiveSearch(true)}
        onBlur={(e) => {
          // Only hide categories if search input is empty
          const input = e.currentTarget.querySelector('input')
          if (input && !input.value.trim()) {
            setHasActiveSearch(false)
          }
        }}
      >
        <WelcomePageSearch
          tools={tools}
          onToolClick={onToolClick}
          onSearchChange={(hasSearch) => setHasActiveSearch(hasSearch)}
        />
      </div>

      {/* Show categories when no active search */}
      {!hasActiveSearch && (
        <>
          {/* In-Content Ad */}
          <div className="px-6">
            <AdPlacement position="1593654749" className="w-full" />
          </div>

          {/* Categories with Top Tools */}
          <CategorySection tools={tools} onToolClick={onToolClick} />
        </>
      )}
    </div>
  )
}

