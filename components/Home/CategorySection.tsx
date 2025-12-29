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
      <h2 className="mb-6 text-2xl font-bold text-zinc-100">Browse by Category</h2>
      <div className="space-y-8">
        {categories
          .filter((category) => toolsByCategory[category]?.length > 0)
          .map((category) => {
            const categoryTools = toolsByCategory[category]
            const topTools = categoryTools.slice(0, 3)
            const remainingCount = categoryTools.length - 3

            return (
              <div key={category} className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-zinc-200">{category}</h3>
                  <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-400">
                    {categoryTools.length} tool{categoryTools.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {topTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => onToolClick(tool)}
                      className="group rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-left transition-all hover:border-zinc-700 hover:bg-zinc-900"
                    >
                      <h4 className="font-semibold text-zinc-200 group-hover:text-emerald-400">
                        {tool.name}
                      </h4>
                      <p className="mt-1 text-sm text-zinc-400">{tool.description}</p>
                      <span className="mt-2 inline-block text-xs text-emerald-500">Use tool →</span>
                    </button>
                  ))}
                </div>
                {remainingCount > 0 && (
                  <p className="mt-4 text-sm text-zinc-500">
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

