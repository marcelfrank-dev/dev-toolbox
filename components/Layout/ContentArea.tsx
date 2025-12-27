'use client'

import { ReactNode } from 'react'

interface ContentAreaProps {
  children: ReactNode
}

export function ContentArea({ children }: ContentAreaProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-zinc-950">
      <div className="mx-auto h-full max-w-7xl">{children}</div>
    </div>
  )
}

