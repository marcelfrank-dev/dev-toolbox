import { ToolCategory } from './types'

export interface ToolDefinition {
  id: string
  name: string
  description: string
  category: ToolCategory
  keywords: string[]
}

export const toolDefinitions: ToolDefinition[] = [
  {
    id: 'json-formatter',
    name: 'JSON Formatter & Validator',
    description: 'Format, validate, and beautify JSON data with syntax highlighting',
    category: 'JSON',
    keywords: ['json', 'format', 'validate', 'beautify', 'minify', 'parse'],
  },
  {
    id: 'base64',
    name: 'Base64 Encode / Decode',
    description: 'Encode text to Base64 or decode Base64 strings',
    category: 'Encoding',
    keywords: ['base64', 'encode', 'decode', 'convert', 'binary'],
  },
  {
    id: 'url-encode',
    name: 'URL Encode / Decode',
    description: 'Encode or decode URL components and query strings',
    category: 'Encoding',
    keywords: ['url', 'encode', 'decode', 'uri', 'percent', 'query'],
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    description: 'Convert text between camelCase, PascalCase, snake_case, and kebab-case',
    category: 'Text',
    keywords: ['case', 'camel', 'pascal', 'snake', 'kebab', 'convert', 'text'],
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode and inspect JSON Web Tokens (header & payload)',
    category: 'Security',
    keywords: ['jwt', 'token', 'decode', 'json', 'web', 'auth', 'header', 'payload'],
  },
  {
    id: 'timestamp',
    name: 'Timestamp Converter',
    description: 'Convert between Unix timestamps and human-readable dates',
    category: 'Web',
    keywords: ['timestamp', 'unix', 'date', 'time', 'convert', 'epoch'],
  },
]

export const categories = [...new Set(toolDefinitions.map((t) => t.category))]

export function getToolDefinitionById(id: string): ToolDefinition | undefined {
  return toolDefinitions.find((t) => t.id === id)
}

