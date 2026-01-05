'use client'

import { Tool } from '@/tools/types'
import { ToolCard } from './ToolCard'

interface PopularToolsSectionProps {
    tools: Tool[]
    onToolClick: (tool: Tool) => void
}

const POPULAR_TOOL_IDS = [
    'json-formatter',
    'jwt-decoder',
    'timestamp',
    'base64',
    'uuid-generator',
    'text-diff',
    'cron-explainer',
    'color'
]

export function PopularToolsSection({ tools, onToolClick }: PopularToolsSectionProps) {
    const popularTools = POPULAR_TOOL_IDS.map((id) =>
        tools.find((t) => t.id === id)
    ).filter((t): t is Tool => t !== undefined)

    if (popularTools.length === 0) return null

    return (
        <div className="mb-12 px-6">
            <div className="mb-6 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/20 text-orange-400">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-[var(--foreground)]">Most Popular</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {popularTools.map((tool) => (
                    <ToolCard
                        key={tool.id}
                        tool={tool}
                        onClick={() => onToolClick(tool)}
                        isPopular
                    />
                ))}
            </div>
        </div>
    )
}
