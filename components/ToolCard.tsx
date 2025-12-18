'use client'

import { Tool } from '@/tools/types'

interface ToolCardProps {
  tool: Tool
  onClick: () => void
}

const categoryColors: Record<string, string> = {
  JSON: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Encoding: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Text: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Web: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Security: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  Generator: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  Formatter: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  Converter: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Utility: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  Hash: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
}

export function ToolCard({ tool, onClick }: ToolCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 text-left transition-all hover:border-zinc-700 hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
    >
      <div className="flex w-full items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-white">
          {tool.name}
        </h3>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${categoryColors[tool.category] || 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}`}
        >
          {tool.category}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-zinc-400">{tool.description}</p>
      <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
        {tool.keywords.slice(0, 4).map((keyword) => (
          <span
            key={keyword}
            className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-500"
          >
            {keyword}
          </span>
        ))}
      </div>
    </button>
  )
}

