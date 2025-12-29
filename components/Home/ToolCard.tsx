'use client'

import { Tool } from '@/tools/types'

interface ToolCardProps {
  tool: Tool
  onClick: () => void
}

interface ToolCardProps {
  tool: Tool
  onClick: () => void
}


export function ToolCard({ tool, onClick, isPopular }: ToolCardProps & { isPopular?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col items-start gap-3 rounded-xl border border-white/5 bg-white/5 p-5 text-left transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:-translate-y-1 ${isPopular ? 'bg-primary/5 border-primary/10 hover:border-primary/30' : ''
        }`}
    >
      <div className="flex w-full items-start justify-between gap-3">
        <h3 className={`text-lg font-semibold transition-colors ${isPopular ? 'text-primary-foreground' : 'text-white/90 group-hover:text-white'}`}>
          {tool.name}
        </h3>
        {/* Category badge can be optional or styled differently */}
      </div>
      <p className="text-sm leading-relaxed text-zinc-400 line-clamp-2">{tool.description}</p>

      <div className="mt-auto pt-2 flex items-center text-xs text-secondary opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
        Open Tool →
      </div>
    </button>
  )
}

