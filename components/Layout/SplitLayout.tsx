'use client'

import { ReactNode } from 'react'

interface SplitLayoutProps {
  sidebar: ReactNode
  content: ReactNode
}

export function SplitLayout({ sidebar, content }: SplitLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {sidebar}
      {content}
    </div>
  )
}

