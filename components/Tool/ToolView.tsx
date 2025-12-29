'use client'

import { Tool } from '@/tools/types'


interface ToolViewProps {
  tool: Tool
  onClose: () => void
}

export function ToolView({ tool, onClose }: ToolViewProps) {
  const ToolComponent = tool.component

  return (
    <div className="flex flex-col h-full bg-transparent">
      <header className="flex items-center justify-between border-b border-white/5 bg-black/20 px-6 py-4 backdrop-blur-md">
        <div>
          <h1 className="text-xl font-bold text-white">{tool.name}</h1>
          <p className="mt-1 text-sm text-zinc-400">{tool.description}</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Close tool"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <ToolComponent />
        </div>
      </div>
    </div>
  )
}
