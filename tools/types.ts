import { ComponentType } from 'react'

export type ToolCategory =
  | 'Converters & Formatters'
  | 'Text & Analysis'
  | 'Generators'
  | 'DevOps & Network'
  | 'Security & Crypto'
  | 'Cheatsheets'

export interface Tool {
  id: string
  name: string
  description: string
  category: ToolCategory
  keywords: string[]
  component: ComponentType
}

export interface ToolResult<T = string> {
  success: boolean
  data?: T
  error?: string
}

