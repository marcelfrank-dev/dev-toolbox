'use client'

import { Tool } from '@/tools/types'
import { categories } from '@/tools/definitions'

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
                    <button
                      key={tool.id}
                      onClick={() => onToolClick(tool)}
                      className="group/item rounded-lg border border-white/5 bg-white/5 p-4 text-left transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-md"
                    >
                      <h4 className="font-semibold text-white/90 group-hover/item:text-cyan-400 transition-colors">
                        {tool.name}
                      </h4>
                      <p className="mt-1 text-sm text-zinc-400 line-clamp-2">{tool.description}</p>
                      <div className="mt-3 flex items-center text-xs text-secondary opacity-0 group-hover/item:opacity-100 transition-opacity -translate-x-2 group-hover/item:translate-x-0">
                        Open Tool →
                      </div>
                    </button>
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

