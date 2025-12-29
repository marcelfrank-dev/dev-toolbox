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
    'Converters & Formatters': 0.9,
    'Text & Analysis': 0.85,
    'Security & Crypto': 0.85,
    'Generators': 0.85,
    'DevOps & Network': 0.8,
    'AI': 0.8,
    'Cheatsheets': 0.75,
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
