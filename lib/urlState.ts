'use client'

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
  document.title = toolName ? `${toolName} | ${baseTitle}` : baseTitle
}

