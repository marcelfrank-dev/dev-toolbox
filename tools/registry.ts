'use client'

import { ComponentType } from 'react'
import dynamic from 'next/dynamic'
import { Tool, ToolCategory } from './types'
import { toolDefinitions } from './definitions'

// Tool components are lazy-loaded (client-only)
const toolComponents: Record<string, ComponentType> = {
  // JSON Tools
  'json-formatter': dynamic(() => import('./json/JsonFormatter'), { ssr: false }),
  'json-yaml': dynamic(() => import('./json-yaml/JsonYamlConverter'), { ssr: false }),
  'json-diff': dynamic(() => import('./json-diff/JsonDiff'), { ssr: false }),
  'json-csv': dynamic(() => import('./json-csv/JsonCsvConverter'), { ssr: false }),
  'json-minify': dynamic(() => import('./json-minify/JsonMinifier'), { ssr: false }),

  // Encoding Tools
  'base64': dynamic(() => import('./base64/Base64Tool'), { ssr: false }),
  'url-encode': dynamic(() => import('./url/UrlTool'), { ssr: false }),
  'html-entity': dynamic(() => import('./html-entity/HtmlEntityTool'), { ssr: false }),
  'hex-ascii': dynamic(() => import('./hex/HexAsciiTool'), { ssr: false }),
  'binary-text': dynamic(() => import('./binary/BinaryTextTool'), { ssr: false }),
  'dataurl': dynamic(() => import('./dataurl/DataUrlTool'), { ssr: false }),

  // Text Tools
  'case-converter': dynamic(() => import('./case/CaseConverter'), { ssr: false }),
  'lorem': dynamic(() => import('./lorem/LoremGenerator'), { ssr: false }),
  'word-count': dynamic(() => import('./word-count/WordCounter'), { ssr: false }),
  'regex': dynamic(() => import('./regex/RegexTester'), { ssr: false }),
  'text-diff': dynamic(() => import('./text-diff/TextDiff'), { ssr: false }),
  'markdown': dynamic(() => import('./markdown/MarkdownPreview'), { ssr: false }),
  'string-escape': dynamic(() => import('./string-escape/StringEscape'), { ssr: false }),
  'line-sort': dynamic(() => import('./line-sort/LineSorter'), { ssr: false }),
  'duplicate-lines': dynamic(() => import('./duplicate-lines/DuplicateRemover'), { ssr: false }),

  // Security Tools
  'jwt-decoder': dynamic(() => import('./jwt/JwtDecoder'), { ssr: false }),
  'hash': dynamic(() => import('./hash/HashGenerator'), { ssr: false }),
  'hmac': dynamic(() => import('./hmac/HmacGenerator'), { ssr: false }),

  // Generator Tools
  'uuid-generator': dynamic(() => import('./uuid/UuidGenerator'), { ssr: false }),
  'password': dynamic(() => import('./password/PasswordGenerator'), { ssr: false }),
  'qrcode': dynamic(() => import('./qrcode/QrCodeGenerator'), { ssr: false }),

  // Web Tools
  'timestamp': dynamic(() => import('./timestamp/TimestampConverter'), { ssr: false }),
  'color': dynamic(() => import('./color/ColorConverter'), { ssr: false }),

  // Formatter Tools
  'html-formatter': dynamic(() => import('./html-formatter/HtmlFormatter'), { ssr: false }),
  'css-formatter': dynamic(() => import('./css-formatter/CssFormatter'), { ssr: false }),
  'js-formatter': dynamic(() => import('./js-formatter/JsFormatter'), { ssr: false }),
  'sql-formatter': dynamic(() => import('./sql-formatter/SqlFormatter'), { ssr: false }),
  'xml-formatter': dynamic(() => import('./xml-formatter/XmlFormatter'), { ssr: false }),

  // Converter Tools
  'number-base': dynamic(() => import('./number-base/NumberBaseConverter'), { ssr: false }),
  'byte-size': dynamic(() => import('./byte-size/ByteSizeConverter'), { ssr: false }),
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
