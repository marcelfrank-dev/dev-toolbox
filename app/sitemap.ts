import { MetadataRoute } from 'next'
import { toolDefinitions } from '@/tools/definitions'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dev-toolbox-livid.vercel.app'

  // Main page
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]

  // Tool deep links
  toolDefinitions.forEach((tool) => {
    routes.push({
      url: `${baseUrl}/?tool=${tool.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    })
  })

  return routes
}
