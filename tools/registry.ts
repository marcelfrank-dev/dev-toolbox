'use client'

import { ComponentType } from 'react'
import dynamic from 'next/dynamic'
import { Tool, ToolCategory } from './types'
import { toolDefinitions } from './definitions'

// Tool components are lazy-loaded (client-only)
const toolComponents: Record<string, ComponentType> = {
  'json-formatter': dynamic(() => import('./json/JsonFormatter'), { ssr: false }),
  'base64': dynamic(() => import('./base64/Base64Tool'), { ssr: false }),
  'url-encode': dynamic(() => import('./url/UrlTool'), { ssr: false }),
  'case-converter': dynamic(() => import('./case/CaseConverter'), { ssr: false }),
  'jwt-decoder': dynamic(() => import('./jwt/JwtDecoder'), { ssr: false }),
  'timestamp': dynamic(() => import('./timestamp/TimestampConverter'), { ssr: false }),
  'uuid-generator': dynamic(() => import('./uuid/UuidGenerator'), { ssr: false }),
}

export const tools: Tool[] = toolDefinitions.map((def) => ({
  ...def,
  component: toolComponents[def.id],
}))

export const categories: ToolCategory[] = [...new Set(tools.map((t) => t.category))]

export function getToolById(id: string): Tool | undefined {
  return tools.find((t) => t.id === id)
}

export function getToolsByCategory(category: string): Tool[] {
  return tools.filter((t) => t.category === category)
}

export function searchTools(query: string): Tool[] {
  const lowerQuery = query.toLowerCase()
  return tools.filter(
    (t) =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.keywords.some((k) => k.toLowerCase().includes(lowerQuery))
  )
}
