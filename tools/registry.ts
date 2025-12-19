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
  'json-typescript': dynamic(() => import('./json-typescript/JsonToTypeScript'), { ssr: false }),
  'json-path': dynamic(() => import('./json-path/JsonPathEvaluator'), { ssr: false }),
  'json-tree': dynamic(() => import('./json-tree/JsonTreeViewer'), { ssr: false }),
  'json-go': dynamic(() => import('./json-go/JsonToGoStruct'), { ssr: false }),
  'json-rust': dynamic(() => import('./json-rust/JsonToRustStruct'), { ssr: false }),
  'json-jq': dynamic(() => import('./json-jq/JsonJq'), { ssr: false }),
  'json-schema': dynamic(() => import('./json-schema/JsonSchemaValidator'), { ssr: false }),

  // Encoding Tools
  'base64': dynamic(() => import('./base64/Base64Tool'), { ssr: false }),
  'url-encode': dynamic(() => import('./url/UrlTool'), { ssr: false }),
  'html-entity': dynamic(() => import('./html-entity/HtmlEntityTool'), { ssr: false }),
  'hex-ascii': dynamic(() => import('./hex/HexAsciiTool'), { ssr: false }),
  'binary-text': dynamic(() => import('./binary/BinaryTextTool'), { ssr: false }),
  'dataurl': dynamic(() => import('./dataurl/DataUrlTool'), { ssr: false }),
  'rot13': dynamic(() => import('./rot13/ROT13Cipher'), { ssr: false }),
  'unicode-escape': dynamic(() => import('./unicode-escape/UnicodeEscape'), { ssr: false }),
  'punycode': dynamic(() => import('./punycode/PunycodeConverter'), { ssr: false }),
  'url-parser': dynamic(() => import('./url-parser/UrlParser'), { ssr: false }),
  'query-string-builder': dynamic(() => import('./query-string-builder/QueryStringBuilder'), { ssr: false }),
  'morse-code': dynamic(() => import('./morse-code/MorseCodeTranslator'), { ssr: false }),

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
  'text-slug': dynamic(() => import('./text-slug/TextToSlug'), { ssr: false }),
  'string-reverse': dynamic(() => import('./string-reverse/StringReverse'), { ssr: false }),
  'text-repeater': dynamic(() => import('./text-repeater/TextRepeater'), { ssr: false }),
  'whitespace-remover': dynamic(() => import('./whitespace-remover/WhitespaceRemover'), { ssr: false }),
  'line-numbers': dynamic(() => import('./line-numbers/LineNumbers'), { ssr: false }),
  'shuffle-lines': dynamic(() => import('./shuffle-lines/ShuffleLines'), { ssr: false }),
  'extract-emails-urls': dynamic(() => import('./extract-emails-urls/ExtractEmailsUrls'), { ssr: false }),
  'text-truncator': dynamic(() => import('./text-truncator/TextTruncator'), { ssr: false }),
  'find-replace': dynamic(() => import('./find-replace/FindReplace'), { ssr: false }),
  'number-to-words': dynamic(() => import('./number-to-words/NumberToWords'), { ssr: false }),
  'text-ascii-art': dynamic(() => import('./text-ascii-art/TextAsciiArt'), { ssr: false }),

  // Security Tools
  'jwt-decoder': dynamic(() => import('./jwt/JwtDecoder'), { ssr: false }),
  'hash': dynamic(() => import('./hash/HashGenerator'), { ssr: false }),
  'hmac': dynamic(() => import('./hmac/HmacGenerator'), { ssr: false }),
  'password-strength': dynamic(() => import('./password-strength/PasswordStrengthChecker'), { ssr: false }),
  'api-key': dynamic(() => import('./api-key/ApiKeyGenerator'), { ssr: false }),
  'sri': dynamic(() => import('./sri/SriGenerator'), { ssr: false }),
  'cors': dynamic(() => import('./cors/CorsHeaderGenerator'), { ssr: false }),
  'csp': dynamic(() => import('./csp/CspHeaderGenerator'), { ssr: false }),
  'password-strength': dynamic(() => import('./password-strength/PasswordStrengthChecker'), { ssr: false }),
  'bcrypt': dynamic(() => import('./bcrypt/BcryptHashGenerator'), { ssr: false }),
  'aes': dynamic(() => import('./aes/AesEncryptDecrypt'), { ssr: false }),
  'rsa': dynamic(() => import('./rsa/RsaKeyGenerator'), { ssr: false }),
  'ssl-certificate': dynamic(() => import('./ssl-certificate/SslCertificateDecoder'), { ssr: false }),

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
  'random-number': dynamic(() => import('./random-number/RandomNumberGenerator'), { ssr: false }),
  'ulid': dynamic(() => import('./ulid/UlidGenerator'), { ssr: false }),
  'nanoid': dynamic(() => import('./nanoid/NanoIdGenerator'), { ssr: false }),
  'lorem-picsum': dynamic(() => import('./lorem-picsum/LoremPicsumUrls'), { ssr: false }),
  'crontab': dynamic(() => import('./crontab/CrontabGenerator'), { ssr: false }),
  'mock-json': dynamic(() => import('./mock-json/MockJsonGenerator'), { ssr: false }),
  'fake-data': dynamic(() => import('./fake-data/FakeDataGenerator'), { ssr: false }),
  'color-palette': dynamic(() => import('./color-palette/ColorPaletteGenerator'), { ssr: false }),
  'gradient': dynamic(() => import('./gradient/GradientGenerator'), { ssr: false }),
  'sql-insert': dynamic(() => import('./sql-insert/SqlInsertGenerator'), { ssr: false }),
  'regex-generator': dynamic(() => import('./regex-generator/RegexGenerator'), { ssr: false }),
  'placeholder-image': dynamic(() => import('./placeholder-image/PlaceholderImageGenerator'), { ssr: false }),
  'barcode': dynamic(() => import('./barcode/BarcodeGenerator'), { ssr: false }),

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
  'temperature': dynamic(() => import('./temperature/TemperatureConverter'), { ssr: false }),
  'unix-permissions': dynamic(() => import('./unix-permissions/UnixPermissions'), { ssr: false }),
  'length': dynamic(() => import('./length/LengthConverter'), { ssr: false }),
  'weight': dynamic(() => import('./weight/WeightConverter'), { ssr: false }),
  'epoch': dynamic(() => import('./epoch/EpochConverter'), { ssr: false }),
  'csv-markdown': dynamic(() => import('./csv-markdown/CsvToMarkdownTable'), { ssr: false }),
  'tsv-csv': dynamic(() => import('./tsv-csv/TsvCsvConverter'), { ssr: false }),
  'xml-json': dynamic(() => import('./xml-json/XmlJsonConverter'), { ssr: false }),
  'html-markdown': dynamic(() => import('./html-markdown/HtmlToMarkdown'), { ssr: false }),
  'toml-json': dynamic(() => import('./toml-json/TomlJsonConverter'), { ssr: false }),
  'properties-json': dynamic(() => import('./properties-json/PropertiesJsonConverter'), { ssr: false }),
  'image-format': dynamic(() => import('./image-format/ImageFormatConverter'), { ssr: false }),
  'svg-optimizer': dynamic(() => import('./svg-optimizer/SvgOptimizer'), { ssr: false }),
  'length': dynamic(() => import('./length/LengthConverter'), { ssr: false }),
  'weight': dynamic(() => import('./weight/WeightConverter'), { ssr: false }),
  'epoch': dynamic(() => import('./epoch/EpochConverter'), { ssr: false }),

  // Formatter Tools (continued)
  'ts-formatter': dynamic(() => import('./ts-formatter/TsFormatter'), { ssr: false }),
  'yaml-formatter': dynamic(() => import('./yaml-formatter/YamlFormatter'), { ssr: false }),
  'toml-formatter': dynamic(() => import('./toml-formatter/TomlFormatter'), { ssr: false }),
  'markdown-formatter': dynamic(() => import('./markdown-formatter/MarkdownFormatter'), { ssr: false }),
  'shell-formatter': dynamic(() => import('./shell-formatter/ShellFormatter'), { ssr: false }),
  'python-formatter': dynamic(() => import('./python-formatter/PythonFormatter'), { ssr: false }),
  'php-formatter': dynamic(() => import('./php-formatter/PhpFormatter'), { ssr: false }),
  'graphql-formatter': dynamic(() => import('./graphql-formatter/GraphQLFormatter'), { ssr: false }),

  // Web Tools (continued)
  'http-status': dynamic(() => import('./http-status/HttpStatusReference'), { ssr: false }),
  'timezone': dynamic(() => import('./timezone/TimezoneConverter'), { ssr: false }),
  'cron-parser': dynamic(() => import('./cron-parser/CronExpressionParser'), { ssr: false }),
  'http-header-parser': dynamic(() => import('./http-header-parser/HttpHeaderParser'), { ssr: false }),
  'cookie-parser': dynamic(() => import('./cookie-parser/CookieParser'), { ssr: false }),
  'meta-tag': dynamic(() => import('./meta-tag/MetaTagGenerator'), { ssr: false }),
  'sitemap': dynamic(() => import('./sitemap/SitemapGenerator'), { ssr: false }),
  'robots-txt': dynamic(() => import('./robots-txt/RobotsTxtGenerator'), { ssr: false }),
  'user-agent': dynamic(() => import('./user-agent/UserAgentParser'), { ssr: false }),
  'open-graph': dynamic(() => import('./open-graph/OpenGraphPreview'), { ssr: false }),

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
  'http-methods': dynamic(() => import('./http-methods/HttpMethodsReference'), { ssr: false }),
  'vim-cheat': dynamic(() => import('./vim-cheat/VimCheatSheet'), { ssr: false }),
  'linux-commands': dynamic(() => import('./linux-commands/LinuxCommandsCheatSheet'), { ssr: false }),
  'keyboard-shortcuts': dynamic(() => import('./keyboard-shortcuts/KeyboardShortcuts'), { ssr: false }),
  'unicode-search': dynamic(() => import('./unicode-search/UnicodeCharacterSearch'), { ssr: false }),
  'emoji-picker': dynamic(() => import('./emoji-picker/EmojiPicker'), { ssr: false }),
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
