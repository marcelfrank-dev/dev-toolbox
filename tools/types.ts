import { ComponentType } from 'react'

export type ToolCategory =
  | 'JSON'
  | 'Encoding'
  | 'Text'
  | 'Security'
  | 'Generator'
  | 'Web'
  | 'Formatter'
  | 'Converter'
  | 'Math'
  | 'DevOps'
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

