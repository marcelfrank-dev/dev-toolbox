import { Metadata } from 'next'
import { Tool } from '@/tools/types'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://tiny-dev-tools.vercel.app'

export function generateToolMetadata(tool: Tool): Metadata {
  const toolUrl = `${BASE_URL}/?tool=${tool.id}`
  const fullDescription = `${tool.description}. Free online tool - runs locally in your browser. No data leaves your machine.`
  
  return {
    title: `${tool.name} | Free Online Tool - Dev Toolbox`,
    description: fullDescription,
    keywords: [...tool.keywords, 'free tool', 'online tool', 'developer tool', 'privacy'].join(', '),
    alternates: {
      canonical: toolUrl,
    },
    openGraph: {
      title: `${tool.name} | Dev Toolbox`,
      description: fullDescription,
      url: toolUrl,
      siteName: 'Dev Toolbox',
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: `${BASE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${tool.name} - Dev Toolbox`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.name} | Dev Toolbox`,
      description: fullDescription,
      images: [`${BASE_URL}/og-image.png`],
    },
  }
}

export function generateBaseMetadata(): Metadata {
  const description =
    'Free online developer tools: JSON formatter, Base64 encoder, URL encoder, JWT decoder, UUID generator, hash generator, regex tester, timestamp converter, case converter, and 130+ more tools. All tools run locally in your browser - no data leaves your machine. Privacy-first, instant, and completely free.'
  
  const keywords = [
    'developer tools',
    'online tools',
    'json formatter',
    'base64 encoder',
    'url encoder',
    'jwt decoder',
    'uuid generator',
    'hash generator',
    'regex tester',
    'timestamp converter',
    'case converter',
    'free tools',
    'web developer tools',
    'programming tools',
    'code formatter',
    'text tools',
    'encoding tools',
    'security tools',
    'privacy tools',
    'client-side tools',
  ].join(', ')

  return {
    title: 'Dev Toolbox - 130+ Free Online Developer Tools | Privacy-First',
    description,
    keywords,
    authors: [{ name: 'Dev Toolbox' }],
    creator: 'Dev Toolbox',
    publisher: 'Dev Toolbox',
    alternates: {
      canonical: BASE_URL,
    },
    openGraph: {
      title: 'Dev Toolbox - 130+ Free Online Developer Tools',
      description,
      url: BASE_URL,
      siteName: 'Dev Toolbox',
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: `${BASE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'Dev Toolbox - Free Online Developer Tools',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Dev Toolbox - 130+ Free Online Developer Tools',
      description,
      images: [`${BASE_URL}/og-image.png`],
      creator: '@devtoolbox',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    metadataBase: new URL(BASE_URL),
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
      yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
    },
  }
}

