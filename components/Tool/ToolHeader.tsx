'use client'

import { Tool } from '@/tools/types'

interface ToolHeaderProps {
  tool: Tool
  onClose: () => void
}

export function ToolHeader({ tool, onClose }: ToolHeaderProps) {
  return (
    <div className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-200"
              aria-label="Back to home"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-zinc-100">{tool.name}</h1>
                <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-400">
                  {tool.category}
                </span>
              </div>
              {tool.description && (
                <p className="mt-1 text-sm text-zinc-400">{tool.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

