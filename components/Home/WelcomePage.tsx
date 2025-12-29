'use client'

import { Tool } from '@/tools/types'
import { categories } from '@/tools/definitions'
import { HeroSection } from './HeroSection'
import { AdPlacement } from './AdPlacement'
import { FeaturedTools } from './FeaturedTools'

interface WelcomePageProps {
  tools: Tool[]
  onToolClick: (tool: Tool) => void
}

export function WelcomePage({ tools, onToolClick }: WelcomePageProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Top Banner Ad */}
      <div className="px-6 pt-6">
        <AdPlacement position="1593654749" className="w-full" />
      </div>

      {/* Hero Section */}
      <HeroSection toolCount={tools.length} categoryCount={categories.length} />

      {/* In-Content Ad */}
      <div className="px-6">
        <AdPlacement position="1593654749" className="w-full" />
      </div>

      {/* Featured Tools */}
      <FeaturedTools tools={tools} onToolClick={onToolClick} />

      {/* Additional Content */}
      <div className="px-6 pb-12">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-6">
          <h2 className="mb-3 text-lg font-semibold text-zinc-200">Why Dev Toolbox?</h2>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              <span>All tools run entirely in your browser - no server calls</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              <span>Your data never leaves your machine - complete privacy</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              <span>Fast and responsive - no loading times</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              <span>Free and open source - no account required</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

