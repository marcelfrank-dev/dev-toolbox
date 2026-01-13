'use client'

import { ReactNode } from 'react'

interface SplitLayoutProps {
  sidebar: ReactNode
  content: ReactNode
}

export function SplitLayout({ sidebar, content }: SplitLayoutProps) {
  return (
    <div className="flex flex-1 pt-16 lg:pt-0 overflow-hidden">
      {sidebar}
      <div className="flex-1 relative overflow-y-auto">
        {content}
      </div>
    </div>
  )
}

