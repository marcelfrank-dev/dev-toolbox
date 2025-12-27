'use client'

import { Tool } from '@/tools/types'

interface FeaturedToolsProps {
  tools: Tool[]
  onToolClick: (tool: Tool) => void
}

export function FeaturedTools({ tools, onToolClick }: FeaturedToolsProps) {
  // Show first 6 tools as "featured"
  const featuredTools = tools.slice(0, 6)

  if (featuredTools.length === 0) return null

  return (
    <div className="px-6 py-8">
      <h2 className="mb-4 text-xl font-semibold text-zinc-200">Popular Tools</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featuredTools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolClick(tool)}
            className="group rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-left transition-all hover:border-zinc-700 hover:bg-zinc-900"
          >
            <h3 className="font-semibold text-zinc-200 group-hover:text-emerald-400">
              {tool.name}
            </h3>
            <p className="mt-1 text-sm text-zinc-400">{tool.description}</p>
            <span className="mt-2 inline-block text-xs text-emerald-500">Use tool →</span>
          </button>
        ))}
      </div>
    </div>
  )
}

