'use client'

import { useState } from 'react'
import { Tool } from '@/tools/types'
import { categories } from '@/tools/definitions'
import { HeroSection } from './HeroSection'
import { AdPlacement } from './AdPlacement'
import { WelcomePageSearch } from './WelcomePageSearch'
import { CategorySection } from './CategorySection'
import { PopularToolsSection } from './PopularToolsSection'
import { ClipStackBanner } from './ClipStackBanner'

interface WelcomePageProps {
  tools: Tool[]
  onToolClick: (tool: Tool) => void
}

export function WelcomePage({ tools, onToolClick }: WelcomePageProps) {
  const [hasActiveSearch, setHasActiveSearch] = useState(false)

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-transparent">
      {/* Top Banner - ClipStack */}
      <ClipStackBanner />

      {/* Hero Section - Updated Visuals handled in components or globally */}
      <div className="relative">
        {/* Optional: Add glow effect behind hero */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
        <HeroSection toolCount={tools.length} categoryCount={categories.length} />
      </div>

      {/* Popular Tools Section */}
      <div className="relative z-10 mt-8">
        <PopularToolsSection tools={tools} onToolClick={onToolClick} />
      </div>

      {/* Search Section */}
      <div
        className="relative z-10"
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
          {/* In-Content Ad - AdSense */}
          <div className="px-6 my-4">
            <AdPlacement position="1593654749" className="w-full glass-card rounded-xl p-4" />
          </div>

          {/* Categories with Top Tools */}
          <CategorySection tools={tools} onToolClick={onToolClick} />
        </>
      )}
    </div>
  )
}

