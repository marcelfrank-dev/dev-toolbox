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
  'gitignore-generator': dynamic(() => import('./gitignore/GitignoreGenerator'), { ssr: false }),
  'readme-generator': dynamic(() => import('./readme/ReadmeGenerator'), { ssr: false }),
  'favicon-generator': dynamic(() => import('./favicon/FaviconGenerator'), { ssr: false }),
  'box-shadow-generator': dynamic(() => import('./box-shadow/BoxShadowGenerator'), { ssr: false }),
  'flexbox-playground': dynamic(() => import('./flexbox/FlexboxPlayground'), { ssr: false }),
  'css-grid-generator': dynamic(() => import('./css-grid/CssGridGenerator'), { ssr: false }),

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
  'image-base64': dynamic(() => import('./image-base64/ImageToBase64'), { ssr: false }),
  'markdown-html': dynamic(() => import('./markdown-html/MarkdownToHtml'), { ssr: false }),

  // Formatter Tools (continued)
  'ts-formatter': dynamic(() => import('./ts-formatter/TsFormatter'), { ssr: false }),
  'yaml-formatter': dynamic(() => import('./yaml-formatter/YamlFormatter'), { ssr: false }),

  // Web Tools (continued)
  'http-status': dynamic(() => import('./http-status/HttpStatusReference'), { ssr: false }),

  // Security Tools (continued)
  'jwt-generator': dynamic(() => import('./jwt-generator/JwtGenerator'), { ssr: false }),

  // Developer Reference Tools
  'ascii-table': dynamic(() => import('./ascii-table/AsciiTable'), { ssr: false }),
  'git-cheat': dynamic(() => import('./git-cheat/GitCheatSheet'), { ssr: false }),
  'regex-cheat': dynamic(() => import('./regex-cheat/RegexCheatSheet'), { ssr: false }),
  'html-entities': dynamic(() => import('./html-entities/HtmlEntitiesReference'), { ssr: false }),
  'css-units': dynamic(() => import('./css-units/CssUnitsReference'), { ssr: false }),
  'keyboard-codes': dynamic(() => import('./keyboard-codes/KeyboardCodesReference'), { ssr: false }),
  'mime-types': dynamic(() => import('./mime-types/MimeTypesReference'), { ssr: false }),
  'color-names': dynamic(() => import('./color-names/ColorNamesReference'), { ssr: false }),
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
