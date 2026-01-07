'use client'

import { ComponentType } from 'react'
import dynamic from 'next/dynamic'
import { Tool, ToolCategory } from './types'
import { toolDefinitions } from './definitions'

// Tool components are lazy-loaded (client-only)
const toolComponents: Record<string, ComponentType> = {
  // Converters & Formatters
  'json-formatter': dynamic(() => import('./json/JsonFormatter'), { ssr: false }),
  'json-yaml': dynamic(() => import('./json-yaml/JsonYamlConverter'), { ssr: false }),
  'json-csv': dynamic(() => import('./json-csv/JsonCsvConverter'), { ssr: false }),
  'json-xml': dynamic(() => import('./xml-json/XmlJsonConverter'), { ssr: false }),
  'sql-to-json': dynamic(() => import('./converter/SqlToJson'), { ssr: false }),
  'json-typescript': dynamic(() => import('./json-typescript/JsonToTypeScript'), { ssr: false }),
  'json-go': dynamic(() => import('./json-go/JsonToGoStruct'), { ssr: false }),
  'json-rust': dynamic(() => import('./json-rust/JsonToRustStruct'), { ssr: false }),
  'base64': dynamic(() => import('./base64/Base64Tool'), { ssr: false }),
  'url-encode': dynamic(() => import('./url/UrlTool'), { ssr: false }),
  'html-entity': dynamic(() => import('./html-entity/HtmlEntityTool'), { ssr: false }),
  'image-base64': dynamic(() => import('./image-base64/ImageToBase64'), { ssr: false }),
  'image-format': dynamic(() => import('./image-format/ImageFormatConverter'), { ssr: false }),
  'timestamp': dynamic(() => import('./timestamp/TimestampConverter'), { ssr: false }),
  'color': dynamic(() => import('./color/ColorConverter'), { ssr: false }),
  'image-compressor': dynamic(() => import('./image/ImageCompressor'), { ssr: false }),
  'image-cropper': dynamic(() => import('./image/ImageCropper'), { ssr: false }),
  'image-filters': dynamic(() => import('./image/ImageFilters'), { ssr: false }),
  'color-extractor': dynamic(() => import('./image/ColorExtractor'), { ssr: false }),
  'pdf-to-image': dynamic(() => import('./image/PdfToImage'), { ssr: false }),
  'pdf-to-markdown': dynamic(() => import('./pdf/PdfToMarkdown'), { ssr: false }),
  'svg-to-png': dynamic(() => import('./image/SvgToPng'), { ssr: false }),
  'exif-viewer': dynamic(() => import('./image/ExifViewer'), { ssr: false }),
  'number-base': dynamic(() => import('./number-base/NumberBaseConverter'), { ssr: false }),
  'html-formatter': dynamic(() => import('./html-formatter/HtmlFormatter'), { ssr: false }),
  'css-formatter': dynamic(() => import('./css-formatter/CssFormatter'), { ssr: false }),
  'js-formatter': dynamic(() => import('./js-formatter/JsFormatter'), { ssr: false }),
  'ts-formatter': dynamic(() => import('./ts-formatter/TsFormatter'), { ssr: false }),
  'sql-formatter': dynamic(() => import('./sql-formatter/SqlFormatter'), { ssr: false }),
  'xml-formatter': dynamic(() => import('./xml-formatter/XmlFormatter'), { ssr: false }),
  'yaml-formatter': dynamic(() => import('./yaml-formatter/YamlFormatter'), { ssr: false }),
  'python-formatter': dynamic(() => import('./python-formatter/PythonFormatter'), { ssr: false }),
  'markdown-html': dynamic(() => import('./markdown-html/MarkdownToHtml'), { ssr: false }),

  // Text & Analysis
  'text-diff': dynamic(() => import('./text-diff/TextDiff'), { ssr: false }),
  'regex': dynamic(() => import('./regex/RegexTester'), { ssr: false }),
  'word-count': dynamic(() => import('./word-count/WordCounter'), { ssr: false }),
  'case-converter': dynamic(() => import('./case/CaseConverter'), { ssr: false }),
  'cron-explainer': dynamic(() => import('./text/CronExplainer'), { ssr: false }),
  'json-path': dynamic(() => import('./json-path/JsonPathEvaluator'), { ssr: false }),
  'json-jq': dynamic(() => import('./json-jq/JsonJq'), { ssr: false }),
  'url-parser': dynamic(() => import('./url-parser/UrlParser'), { ssr: false }),
  'html-markdown': dynamic(() => import('./html-markdown/HtmlToMarkdown'), { ssr: false }),
  'text-slug': dynamic(() => import('./text-slug/TextToSlug'), { ssr: false }),
  'string-escape': dynamic(() => import('./string-escape/StringEscape'), { ssr: false }),
  'extract-emails-urls': dynamic(() => import('./extract-emails-urls/ExtractEmailsUrls'), { ssr: false }),
  'find-replace': dynamic(() => import('./find-replace/FindReplace'), { ssr: false }),

  // Generators
  'uuid-generator': dynamic(() => import('./uuid/UuidGenerator'), { ssr: false }),
  'password': dynamic(() => import('./password/PasswordGenerator'), { ssr: false }),
  'lorem': dynamic(() => import('./lorem/LoremGenerator'), { ssr: false }),
  'qrcode': dynamic(() => import('./qrcode/QrCodeGenerator'), { ssr: false }),
  'markdown-table-generator': dynamic(() => import('./generator/MarkdownTable'), { ssr: false }),
  'meta-tag-generator': dynamic(() => import('./web/MetaTagGenerator'), { ssr: false }),
  'gitignore-generator': dynamic(() => import('./gitignore/GitignoreGenerator'), { ssr: false }),
  'color-palette': dynamic(() => import('./color-palette/ColorPaletteGenerator'), { ssr: false }),
  'box-shadow-generator': dynamic(() => import('./box-shadow/BoxShadowGenerator'), { ssr: false }),
  'glassmorphism-generator': dynamic(() => import('./css/GlassmorphismGenerator'), { ssr: false }),
  'clip-path-generator': dynamic(() => import('./css/ClipPathGenerator'), { ssr: false }),
  'triangle-generator': dynamic(() => import('./css/TriangleGenerator'), { ssr: false }),
  'code-to-image': dynamic(() => import('./image/CodeToImage'), { ssr: false }),
  'json-to-zod': dynamic(() => import('./generator/JsonToZod'), { ssr: false }),
  'readme-generator': dynamic(() => import('./readme/ReadmeGenerator'), { ssr: false }),

  // DevOps & Network
  'docker-converter': dynamic(() => import('./devops/DockerConverter'), { ssr: false }),
  'nginx-generator': dynamic(() => import('./generator/NginxGenerator'), { ssr: false }),
  'cidr-calculator': dynamic(() => import('./cidr/CidrCalculator'), { ssr: false }),
  'unix-permissions': dynamic(() => import('./unix-permissions/UnixPermissions'), { ssr: false }),
  'http-status': dynamic(() => import('./http-status/HttpStatusReference'), { ssr: false }),
  'user-agent': dynamic(() => import('./user-agent/UserAgentParser'), { ssr: false }),

  // Security & Crypto
  'jwt-decoder': dynamic(() => import('./jwt/JwtDecoder'), { ssr: false }),
  'hash': dynamic(() => import('./hash/HashGenerator'), { ssr: false }),
  'hmac': dynamic(() => import('./hmac/HmacGenerator'), { ssr: false }),
  'bcrypt': dynamic(() => import('./bcrypt/BcryptHashGenerator'), { ssr: false }),
  'password-strength': dynamic(() => import('./password-strength/PasswordStrengthChecker'), { ssr: false }),
  'rsa': dynamic(() => import('./rsa/RsaKeyGenerator'), { ssr: false }),
  'cors': dynamic(() => import('./cors/CorsHeaderGenerator'), { ssr: false }),
  'website-security': dynamic(() => import('./security/WebsiteSecurityChecker'), { ssr: false }),

  // Cheatsheets
  'git-explorer': dynamic(() => import('./devops/GitExplorer'), { ssr: false }),
  'linux-commands': dynamic(() => import('./linux-commands/LinuxCommandsCheatSheet'), { ssr: false }),
  'regex-cheat': dynamic(() => import('./regex-cheat/RegexCheatSheet'), { ssr: false }),
  'http-methods': dynamic(() => import('./http-methods/HttpMethodsReference'), { ssr: false }),
  'keyboard-codes': dynamic(() => import('./keyboard-codes/KeyboardCodesReference'), { ssr: false }),
  'iban-validator': dynamic(() => import('./web/IbanValidator'), { ssr: false }),

  // AI
  'token-counter': dynamic(() => import('./ai/TokenCounter'), { ssr: false }),
  'prompt-template': dynamic(() => import('./ai/PromptTemplate'), { ssr: false }),
  'ai-response-formatter': dynamic(() => import('./ai/AIResponseFormatter'), { ssr: false }),
  'prompt-helper': dynamic(() => import('./ai/PromptHelper'), { ssr: false }),
  'model-comparison': dynamic(() => import('./ai/ModelComparison'), { ssr: false }),
  'json-schema-ai': dynamic(() => import('./ai/JSONSchemaAI'), { ssr: false }),
  'few-shot-builder': dynamic(() => import('./ai/FewShotBuilder'), { ssr: false }),
  'ai-safety': dynamic(() => import('./ai/AISafetyChecker'), { ssr: false }),
  'aes': dynamic(() => import('./aes/AesEncryptDecrypt'), { ssr: false }),
  'api-key': dynamic(() => import('./api-key/ApiKeyGenerator'), { ssr: false }),
  'ascii-table': dynamic(() => import('./ascii-table/AsciiTable'), { ssr: false }),
  'aspect-ratio': dynamic(() => import('./aspect-ratio/AspectRatioCalculator'), { ssr: false }),
  'barcode': dynamic(() => import('./barcode/BarcodeGenerator'), { ssr: false }),
  'binary': dynamic(() => import('./binary/BinaryTextTool'), { ssr: false }),
  'border-radius': dynamic(() => import('./border-radius/BorderRadiusGenerator'), { ssr: false }),
  'byte-size': dynamic(() => import('./byte-size/ByteSizeConverter'), { ssr: false }),
  'color-names': dynamic(() => import('./color-names/ColorNamesReference'), { ssr: false }),
  'cookie-parser': dynamic(() => import('./cookie-parser/CookieParser'), { ssr: false }),
  'cron-parser': dynamic(() => import('./cron-parser/CronExpressionParser'), { ssr: false }),
  'crontab': dynamic(() => import('./crontab/CrontabGenerator'), { ssr: false }),
  'csp': dynamic(() => import('./csp/CspHeaderGenerator'), { ssr: false }),
  'css-grid': dynamic(() => import('./css-grid/CssGridGenerator'), { ssr: false }),
  'css-units': dynamic(() => import('./css-units/CssUnitsReference'), { ssr: false }),
  'csv-markdown': dynamic(() => import('./csv-markdown/CsvToMarkdownTable'), { ssr: false }),
  'dataurl': dynamic(() => import('./dataurl/DataUrlTool'), { ssr: false }),
  'duplicate-lines': dynamic(() => import('./duplicate-lines/DuplicateRemover'), { ssr: false }),
  'emoji-picker': dynamic(() => import('./emoji-picker/EmojiPicker'), { ssr: false }),
  'env-formatter': dynamic(() => import('./env-formatter/EnvFormatter'), { ssr: false }),
  'epoch': dynamic(() => import('./epoch/EpochConverter'), { ssr: false }),
  'fake-data': dynamic(() => import('./fake-data/FakeDataGenerator'), { ssr: false }),
  'favicon': dynamic(() => import('./favicon/FaviconGenerator'), { ssr: false }),
  'flexbox': dynamic(() => import('./flexbox/FlexboxPlayground'), { ssr: false }),
  'git-cheat': dynamic(() => import('./git-cheat/GitCheatSheet'), { ssr: false }),
  'gradient': dynamic(() => import('./gradient/GradientGenerator'), { ssr: false }),
  'graphql-formatter': dynamic(() => import('./graphql-formatter/GraphQLFormatter'), { ssr: false }),
  'hex': dynamic(() => import('./hex/HexAsciiTool'), { ssr: false }),
  'htaccess': dynamic(() => import('./htaccess/HtaccessGenerator'), { ssr: false }),
  'html-entities': dynamic(() => import('./html-entities/HtmlEntitiesReference'), { ssr: false }),
  'http-header-parser': dynamic(() => import('./http-header-parser/HttpHeaderParser'), { ssr: false }),
  'json-diff': dynamic(() => import('./json-diff/JsonDiff'), { ssr: false }),
  'json-minify': dynamic(() => import('./json-minify/JsonMinifier'), { ssr: false }),
  'json-schema': dynamic(() => import('./json-schema/JsonSchemaValidator'), { ssr: false }),
  'json-tree': dynamic(() => import('./json-tree/JsonTreeViewer'), { ssr: false }),
  'jwt-generator': dynamic(() => import('./jwt-generator/JwtGenerator'), { ssr: false }),
  'keyboard-shortcuts': dynamic(() => import('./keyboard-shortcuts/KeyboardShortcuts'), { ssr: false }),
  'length': dynamic(() => import('./length/LengthConverter'), { ssr: false }),
  'license': dynamic(() => import('./license/LicenseGenerator'), { ssr: false }),
  'line-numbers': dynamic(() => import('./line-numbers/LineNumbers'), { ssr: false }),
  'line-sort': dynamic(() => import('./line-sort/LineSorter'), { ssr: false }),
  'lorem-picsum': dynamic(() => import('./lorem-picsum/LoremPicsumUrls'), { ssr: false }),
  'markdown-formatter': dynamic(() => import('./markdown-formatter/MarkdownFormatter'), { ssr: false }),
  'markdown-table': dynamic(() => import('./markdown-table/MarkdownTableGenerator'), { ssr: false }),
  'markdown': dynamic(() => import('./markdown/MarkdownPreview'), { ssr: false }),
  'meta-tag': dynamic(() => import('./meta-tag/MetaTagGenerator'), { ssr: false }),
  'mime-types': dynamic(() => import('./mime-types/MimeTypesReference'), { ssr: false }),
  'mock-json': dynamic(() => import('./mock-json/MockJsonGenerator'), { ssr: false }),
  'morse-code': dynamic(() => import('./morse-code/MorseCodeTranslator'), { ssr: false }),
  'nanoid': dynamic(() => import('./nanoid/NanoIdGenerator'), { ssr: false }),
  'nginx-formatter': dynamic(() => import('./nginx-formatter/NginxFormatter'), { ssr: false }),
  'number-to-words': dynamic(() => import('./number-to-words/NumberToWords'), { ssr: false }),
  'open-graph': dynamic(() => import('./open-graph/OpenGraphPreview'), { ssr: false }),
  'php-formatter': dynamic(() => import('./php-formatter/PhpFormatter'), { ssr: false }),
  'placeholder-image': dynamic(() => import('./placeholder-image/PlaceholderImageGenerator'), { ssr: false }),
  'properties-json': dynamic(() => import('./properties-json/PropertiesJsonConverter'), { ssr: false }),
  'punycode': dynamic(() => import('./punycode/PunycodeConverter'), { ssr: false }),
  'query-string-builder': dynamic(() => import('./query-string-builder/QueryStringBuilder'), { ssr: false }),
  'random-number': dynamic(() => import('./random-number/RandomNumberGenerator'), { ssr: false }),
  'random-string': dynamic(() => import('./random-string/RandomStringGenerator'), { ssr: false }),
  'regex-generator': dynamic(() => import('./regex-generator/RegexGenerator'), { ssr: false }),
  'robots-txt': dynamic(() => import('./robots-txt/RobotsTxtGenerator'), { ssr: false }),
  'rot13': dynamic(() => import('./rot13/ROT13Cipher'), { ssr: false }),
  'shell-formatter': dynamic(() => import('./shell-formatter/ShellFormatter'), { ssr: false }),
  'shuffle-lines': dynamic(() => import('./shuffle-lines/ShuffleLines'), { ssr: false }),
  'sitemap': dynamic(() => import('./sitemap/SitemapGenerator'), { ssr: false }),
  'sql-insert': dynamic(() => import('./sql-insert/SqlInsertGenerator'), { ssr: false }),
  'sri': dynamic(() => import('./sri/SriGenerator'), { ssr: false }),
  'ssl-certificate': dynamic(() => import('./ssl-certificate/SslCertificateDecoder'), { ssr: false }),
  'string-reverse': dynamic(() => import('./string-reverse/StringReverse'), { ssr: false }),
  'svg-optimizer': dynamic(() => import('./svg-optimizer/SvgOptimizer'), { ssr: false }),
  'temperature': dynamic(() => import('./temperature/TemperatureConverter'), { ssr: false }),
  'text-ascii-art': dynamic(() => import('./text-ascii-art/TextAsciiArt'), { ssr: false }),
  'text-repeater': dynamic(() => import('./text-repeater/TextRepeater'), { ssr: false }),
  'text-truncator': dynamic(() => import('./text-truncator/TextTruncator'), { ssr: false }),
  'text': dynamic(() => import('./text/RegexVisualizer'), { ssr: false }),
  'timezone': dynamic(() => import('./timezone/TimezoneConverter'), { ssr: false }),
  'toml-formatter': dynamic(() => import('./toml-formatter/TomlFormatter'), { ssr: false }),
  'toml-json': dynamic(() => import('./toml-json/TomlJsonConverter'), { ssr: false }),
  'tsv-csv': dynamic(() => import('./tsv-csv/TsvCsvConverter'), { ssr: false }),
  'ulid': dynamic(() => import('./ulid/UlidGenerator'), { ssr: false }),
  'unicode-escape': dynamic(() => import('./unicode-escape/UnicodeEscape'), { ssr: false }),
  'unicode-search': dynamic(() => import('./unicode-search/UnicodeCharacterSearch'), { ssr: false }),
  'vim-cheat': dynamic(() => import('./vim-cheat/VimCheatSheet'), { ssr: false }),
  'weight': dynamic(() => import('./weight/WeightConverter'), { ssr: false }),
  'whitespace-remover': dynamic(() => import('./whitespace-remover/WhitespaceRemover'), { ssr: false }),
  'layout-playground': dynamic(() => import('./layout-playground/LayoutPlayground'), { ssr: false }),
  'api-mock-generator': dynamic(() => import('./api-mock-generator/ApiMockGenerator'), { ssr: false }),
  'ai-prompt-optimizer': dynamic(() => import('./ai/prompt-optimizer/AIPromptOptimizer'), { ssr: false }),
  'ai-commit-generator': dynamic(() => import('./ai/commit-generator/AICommitGenerator'), { ssr: false }),
  'css-unit-converter': dynamic(() => import('./css-units/CssUnitConverter'), { ssr: false }),
}

export const tools: Tool[] = toolDefinitions
  .map((def) => ({
    ...def,
    component: toolComponents[def.id],
  }))
  .filter((tool) => tool.component !== undefined)

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
