'use client'

import { Tool } from '@/tools/types'
import { categories } from '@/tools/definitions'
import { ToolCard } from './ToolCard'

interface CategorySectionProps {
  tools: Tool[]
  onToolClick: (tool: Tool) => void
}

export function CategorySection({ tools, onToolClick }: CategorySectionProps) {
  // Group tools by category
  const toolsByCategory = categories.reduce((acc, category) => {
    const categoryTools = tools.filter((tool) => tool.category === category)
    if (categoryTools.length > 0) {
      acc[category] = categoryTools
    }
    return acc
  }, {} as Record<string, Tool[]>)

  return (
    <div className="px-6 pb-12">
      <h2 className="mb-6 text-2xl font-bold text-white tracking-tight">Browse by Category</h2>
      <div className="space-y-8">
        {categories
          .filter((category) => toolsByCategory[category]?.length > 0)
          .map((category) => {
            const categoryTools = toolsByCategory[category]
            const topTools = categoryTools.slice(0, 3)
            const remainingCount = categoryTools.length - 3

            return (
              <div key={category} className="glass-card rounded-xl p-6 relative overflow-hidden group/card shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-cyan-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity" />

                <div className="mb-4 flex items-center justify-between relative z-10">
                  <h3 className="text-xl font-semibold text-white/90">{category}</h3>
                  <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-medium text-white/70">
                    {categoryTools.length} tool{categoryTools.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
                  {topTools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} onClick={() => onToolClick(tool)} />
                  ))}
                </div>
                {remainingCount > 0 && (
                  <p className="mt-4 text-sm text-zinc-500 relative z-10">
                    + {remainingCount} more tool{remainingCount !== 1 ? 's' : ''} in this category. Use the sidebar to
                    browse all.
                  </p>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}

