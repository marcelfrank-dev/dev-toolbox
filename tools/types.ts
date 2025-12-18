import { ComponentType } from 'react'

export type ToolCategory =
  | 'JSON'
  | 'Encoding'
  | 'Text'
  | 'Web'
  | 'Security'
  | 'Generator'
  | 'Formatter'
  | 'Converter'
  | 'Utility'
  | 'Developer Reference'

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

