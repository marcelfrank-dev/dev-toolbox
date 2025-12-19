import { MetadataRoute } from 'next'
import { toolDefinitions } from '@/tools/definitions'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tiny-dev-tools.vercel.app'
  const now = new Date()

  // Main page - highest priority
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ]

  // Tool deep links - organized by category priority
  const categoryPriority: Record<string, number> = {
    JSON: 0.9,
    Encoding: 0.9,
    Text: 0.85,
    Security: 0.85,
    Generator: 0.85,
    Web: 0.8,
    Formatter: 0.8,
    Converter: 0.8,
    'Developer Reference': 0.75,
  }

  toolDefinitions.forEach((tool) => {
    routes.push({
      url: `${baseUrl}/?tool=${tool.id}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: categoryPriority[tool.category] || 0.7,
    })
  })

  return routes
}
