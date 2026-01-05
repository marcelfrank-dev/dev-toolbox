'use client'

import { ReactNode } from 'react'

interface SplitLayoutProps {
  sidebar: ReactNode
  content: ReactNode
}

export function SplitLayout({ sidebar, content }: SplitLayoutProps) {
  return (
    <div className="flex h-screen pt-16 lg:pt-0 overflow-hidden flex-1">
      {sidebar}
      <div className="flex-1 overflow-hidden relative">
        {content}
      </div>
    </div>
  )
}

