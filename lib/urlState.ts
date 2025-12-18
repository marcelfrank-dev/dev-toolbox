'use client'

const BASE_TITLE = 'Dev Toolbox - Free Online Developer Tools'
const BASE_DESCRIPTION =
  'A collection of free online developer tools: JSON formatter, Base64 encoder, URL encoder, case converter, JWT decoder, and more. All tools run locally in your browser.'

export function getToolFromUrl(): string | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  return params.get('tool')
}

export function setToolInUrl(toolId: string | null): void {
  if (typeof window === 'undefined') return

  const url = new URL(window.location.href)
  if (toolId) {
    url.searchParams.set('tool', toolId)
  } else {
    url.searchParams.delete('tool')
  }
  window.history.pushState({}, '', url.toString())
}

export function updateDocumentTitle(toolName: string | null): void {
  if (typeof document === 'undefined') return

  const baseTitle = 'Dev Toolbox'
  document.title = toolName ? `${toolName} | ${baseTitle}` : BASE_TITLE
}

interface ToolMeta {
  name: string
  description: string
  keywords: string[]
}

export function updateMetaTags(tool: ToolMeta | null): void {
  if (typeof document === 'undefined') return

  const title = tool ? `${tool.name} | Dev Toolbox` : BASE_TITLE
  const description = tool?.description || BASE_DESCRIPTION
  const keywords = tool?.keywords.join(', ') || 'developer tools, json formatter, base64 encoder'

  // Update title
  document.title = title

  // Update meta description
  updateMetaTag('description', description)

  // Update keywords
  updateMetaTag('keywords', keywords)

  // Update Open Graph tags
  updateMetaTag('og:title', title, 'property')
  updateMetaTag('og:description', description, 'property')

  // Update Twitter tags
  updateMetaTag('twitter:title', title)
  updateMetaTag('twitter:description', description)
}

function updateMetaTag(name: string, content: string, attribute: 'name' | 'property' = 'name'): void {
  let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement | null

  if (meta) {
    meta.content = content
  } else {
    meta = document.createElement('meta')
    meta.setAttribute(attribute, name)
    meta.content = content
    document.head.appendChild(meta)
  }
}

