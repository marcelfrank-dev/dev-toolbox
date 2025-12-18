import { ToolCategory } from './types'

export interface ToolDefinition {
  id: string
  name: string
  description: string
  category: ToolCategory
  keywords: string[]
}

export const toolDefinitions: ToolDefinition[] = [
  // JSON Tools
  {
    id: 'json-formatter',
    name: 'JSON Formatter & Validator',
    description: 'Format, validate, and beautify JSON data with syntax highlighting',
    category: 'JSON',
    keywords: ['json', 'format', 'validate', 'beautify', 'minify', 'parse'],
  },
  {
    id: 'json-yaml',
    name: 'JSON ↔ YAML Converter',
    description: 'Convert between JSON and YAML formats',
    category: 'Converter',
    keywords: ['json', 'yaml', 'convert', 'transform', 'config'],
  },
  {
    id: 'json-diff',
    name: 'JSON Diff/Compare',
    description: 'Compare two JSON documents and highlight differences',
    category: 'JSON',
    keywords: ['json', 'diff', 'compare', 'difference', 'merge'],
  },
  {
    id: 'json-csv',
    name: 'JSON ↔ CSV Converter',
    description: 'Convert JSON arrays to CSV and CSV to JSON',
    category: 'Converter',
    keywords: ['json', 'csv', 'convert', 'export', 'import', 'spreadsheet'],
  },
  {
    id: 'json-minify',
    name: 'JSON Minifier',
    description: 'Minify JSON by removing whitespace',
    category: 'JSON',
    keywords: ['json', 'minify', 'compress', 'compact', 'size'],
  },

  // Encoding Tools
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
    id: 'html-entity',
    name: 'HTML Entity Encode/Decode',
    description: 'Convert special characters to HTML entities and vice versa',
    category: 'Encoding',
    keywords: ['html', 'entity', 'encode', 'decode', 'escape', 'special'],
  },
  {
    id: 'hex-ascii',
    name: 'Hex ↔ ASCII Converter',
    description: 'Convert between hexadecimal and ASCII text',
    category: 'Encoding',
    keywords: ['hex', 'hexadecimal', 'ascii', 'text', 'convert'],
  },
  {
    id: 'binary-text',
    name: 'Binary ↔ Text Converter',
    description: 'Convert between binary and text',
    category: 'Encoding',
    keywords: ['binary', 'text', 'convert', 'bits', 'encode'],
  },
  {
    id: 'dataurl',
    name: 'Data URL Converter',
    description: 'Encode files/text to Data URLs and decode them',
    category: 'Encoding',
    keywords: ['data', 'url', 'base64', 'image', 'file', 'encode'],
  },

  // Text Tools
  {
    id: 'case-converter',
    name: 'Case Converter',
    description: 'Convert text between camelCase, PascalCase, snake_case, and kebab-case',
    category: 'Text',
    keywords: ['case', 'camel', 'pascal', 'snake', 'kebab', 'convert', 'text'],
  },
  {
    id: 'lorem',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder Lorem Ipsum text',
    category: 'Text',
    keywords: ['lorem', 'ipsum', 'placeholder', 'text', 'generate', 'dummy'],
  },
  {
    id: 'word-count',
    name: 'Word & Character Counter',
    description: 'Count words, characters, sentences, and paragraphs',
    category: 'Text',
    keywords: ['word', 'character', 'count', 'sentence', 'paragraph', 'length'],
  },
  {
    id: 'regex',
    name: 'Regex Tester',
    description: 'Test regular expressions with live matching and highlighting',
    category: 'Text',
    keywords: ['regex', 'regular', 'expression', 'test', 'match', 'pattern'],
  },
  {
    id: 'text-diff',
    name: 'Text Diff/Compare',
    description: 'Compare two text inputs and show differences',
    category: 'Text',
    keywords: ['diff', 'compare', 'text', 'difference', 'merge'],
  },
  {
    id: 'markdown',
    name: 'Markdown Preview',
    description: 'Live Markdown preview with GitHub Flavored Markdown support',
    category: 'Text',
    keywords: ['markdown', 'preview', 'md', 'github', 'render'],
  },
  {
    id: 'string-escape',
    name: 'String Escape/Unescape',
    description: 'Escape and unescape strings for various languages',
    category: 'Text',
    keywords: ['escape', 'unescape', 'string', 'json', 'javascript', 'sql'],
  },
  {
    id: 'line-sort',
    name: 'Line Sorter',
    description: 'Sort lines of text alphabetically, numerically, or naturally',
    category: 'Text',
    keywords: ['sort', 'line', 'alphabetical', 'order', 'arrange'],
  },
  {
    id: 'duplicate-lines',
    name: 'Remove Duplicate Lines',
    description: 'Remove duplicate lines from text',
    category: 'Text',
    keywords: ['duplicate', 'remove', 'unique', 'line', 'dedupe'],
  },

  // Security Tools
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode and inspect JSON Web Tokens (header & payload)',
    category: 'Security',
    keywords: ['jwt', 'token', 'decode', 'json', 'web', 'auth', 'header', 'payload'],
  },
  {
    id: 'hash',
    name: 'Hash Generator',
    description: 'Generate SHA-256, SHA-512, SHA-1 hash values',
    category: 'Security',
    keywords: ['hash', 'sha256', 'sha512', 'sha1', 'md5', 'checksum'],
  },
  {
    id: 'hmac',
    name: 'HMAC Generator',
    description: 'Generate HMAC signatures with various algorithms',
    category: 'Security',
    keywords: ['hmac', 'hash', 'mac', 'signature', 'secret', 'key'],
  },

  // Generator Tools
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate random UUIDs (v4) or timestamp-based UUIDs',
    category: 'Generator',
    keywords: ['uuid', 'guid', 'generate', 'random', 'unique', 'identifier', 'v4', 'v1'],
  },
  {
    id: 'gitignore-generator',
    name: '.gitignore Generator',
    description: 'Generate .gitignore files for various languages and frameworks',
    category: 'Generator',
    keywords: ['gitignore', 'git', 'ignore', 'generate', 'template', 'language', 'framework'],
  },
  {
    id: 'readme-generator',
    name: 'README Generator',
    description: 'Generate README.md files with templates',
    category: 'Generator',
    keywords: ['readme', 'markdown', 'generate', 'template', 'documentation', 'md'],
  },
  {
    id: 'favicon-generator',
    name: 'Favicon Generator',
    description: 'Generate favicon sets from an image',
    category: 'Generator',
    keywords: ['favicon', 'icon', 'generate', 'image', 'apple', 'android', 'chrome'],
  },
  {
    id: 'box-shadow-generator',
    name: 'Box-Shadow Generator',
    description: 'Generate CSS box-shadow visually',
    category: 'Generator',
    keywords: ['box-shadow', 'css', 'shadow', 'generate', 'visual', 'styling'],
  },
  {
    id: 'flexbox-playground',
    name: 'Flexbox Playground',
    description: 'Visual playground for CSS Flexbox',
    category: 'Generator',
    keywords: ['flexbox', 'css', 'flex', 'layout', 'playground', 'visual'],
  },
  {
    id: 'css-grid-generator',
    name: 'CSS Grid Generator',
    description: 'Visual CSS Grid layout generator',
    category: 'Generator',
    keywords: ['css', 'grid', 'layout', 'generate', 'visual', 'template'],
  },
  {
    id: 'password',
    name: 'Password Generator',
    description: 'Generate secure random passwords with configurable options',
    category: 'Generator',
    keywords: ['password', 'generate', 'random', 'secure', 'strong'],
  },
  {
    id: 'qrcode',
    name: 'QR Code Generator',
    description: 'Generate QR codes from text or URLs',
    category: 'Generator',
    keywords: ['qr', 'qrcode', 'code', 'generate', 'barcode'],
  },

  // Web Tools
  {
    id: 'timestamp',
    name: 'Timestamp Converter',
    description: 'Convert between Unix timestamps and human-readable dates',
    category: 'Web',
    keywords: ['timestamp', 'unix', 'date', 'time', 'convert', 'epoch'],
  },
  {
    id: 'color',
    name: 'Color Converter',
    description: 'Convert between HEX, RGB, HSL color formats',
    category: 'Web',
    keywords: ['color', 'hex', 'rgb', 'hsl', 'convert', 'picker'],
  },

  // Formatter Tools
  {
    id: 'html-formatter',
    name: 'HTML Formatter',
    description: 'Format and beautify HTML with proper indentation',
    category: 'Formatter',
    keywords: ['html', 'format', 'beautify', 'indent', 'minify'],
  },
  {
    id: 'css-formatter',
    name: 'CSS Formatter',
    description: 'Format and beautify CSS with proper indentation',
    category: 'Formatter',
    keywords: ['css', 'format', 'beautify', 'indent', 'minify', 'style'],
  },
  {
    id: 'js-formatter',
    name: 'JavaScript Formatter',
    description: 'Format and beautify JavaScript code',
    category: 'Formatter',
    keywords: ['javascript', 'js', 'format', 'beautify', 'indent', 'minify'],
  },
  {
    id: 'sql-formatter',
    name: 'SQL Formatter',
    description: 'Format and beautify SQL queries',
    category: 'Formatter',
    keywords: ['sql', 'format', 'beautify', 'query', 'database'],
  },
  {
    id: 'xml-formatter',
    name: 'XML Formatter',
    description: 'Format and beautify XML with proper indentation',
    category: 'Formatter',
    keywords: ['xml', 'format', 'beautify', 'indent', 'minify'],
  },

  // Converter Tools
  {
    id: 'number-base',
    name: 'Number Base Converter',
    description: 'Convert numbers between binary, octal, decimal, hexadecimal',
    category: 'Converter',
    keywords: ['number', 'base', 'binary', 'octal', 'decimal', 'hex', 'convert'],
  },
  {
    id: 'byte-size',
    name: 'Byte/Size Converter',
    description: 'Convert between bytes, KB, MB, GB, TB units',
    category: 'Converter',
    keywords: ['byte', 'size', 'kb', 'mb', 'gb', 'tb', 'convert', 'storage'],
  },
  {
    id: 'image-base64',
    name: 'Image to Base64',
    description: 'Convert images to Base64 encoded strings and data URLs',
    category: 'Converter',
    keywords: ['image', 'base64', 'data url', 'convert', 'encode', 'picture'],
  },
  {
    id: 'markdown-html',
    name: 'Markdown → HTML Converter',
    description: 'Convert Markdown to clean HTML',
    category: 'Converter',
    keywords: ['markdown', 'html', 'convert', 'md', 'render'],
  },

  // Formatter Tools (continued)
  {
    id: 'ts-formatter',
    name: 'TypeScript Formatter',
    description: 'Format and beautify TypeScript code',
    category: 'Formatter',
    keywords: ['typescript', 'ts', 'format', 'beautify', 'indent', 'minify'],
  },
  {
    id: 'yaml-formatter',
    name: 'YAML Formatter',
    description: 'Format and beautify YAML with validation',
    category: 'Formatter',
    keywords: ['yaml', 'yml', 'format', 'beautify', 'indent', 'minify'],
  },

  // Web Tools (continued)
  {
    id: 'http-status',
    name: 'HTTP Status Code Reference',
    description: 'Quick reference for HTTP status codes with descriptions and use cases',
    category: 'Web',
    keywords: ['http', 'status', 'code', 'reference', 'error', 'response'],
  },

  // Security Tools (continued)
  {
    id: 'jwt-generator',
    name: 'JWT Generator',
    description: 'Generate JSON Web Tokens with custom claims',
    category: 'Security',
    keywords: ['jwt', 'token', 'generate', 'json', 'web', 'auth', 'signature'],
  },

  // Developer Reference Tools
  {
    id: 'ascii-table',
    name: 'ASCII Table Reference',
    description: 'Complete ASCII character reference table',
    category: 'Utility',
    keywords: ['ascii', 'character', 'reference', 'table', 'code', 'decimal', 'hex'],
  },
  {
    id: 'git-cheat',
    name: 'Git Cheat Sheet',
    description: 'Quick reference for common Git commands',
    category: 'Utility',
    keywords: ['git', 'cheat sheet', 'reference', 'commands', 'version control'],
  },
  {
    id: 'regex-cheat',
    name: 'Regex Cheat Sheet',
    description: 'Quick reference for regular expression syntax',
    category: 'Utility',
    keywords: ['regex', 'regular expression', 'cheat sheet', 'reference', 'pattern'],
  },
]

export const categories = [...new Set(toolDefinitions.map((t) => t.category))]

export function getToolDefinitionById(id: string): ToolDefinition | undefined {
  return toolDefinitions.find((t) => t.id === id)
}
