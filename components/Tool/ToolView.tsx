'use client'

import { Tool } from '@/tools/types'
import { ToolHeader } from './ToolHeader'

interface ToolViewProps {
  tool: Tool
  onClose: () => void
}

export function ToolView({ tool, onClose }: ToolViewProps) {
  const ToolComponent = tool.component

  return (
    <div className="flex h-full flex-col">
      <ToolHeader tool={tool} onClose={onClose} />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <ToolComponent />
        </div>
      </div>
    </div>
  )
}

