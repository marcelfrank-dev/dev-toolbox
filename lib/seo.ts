import { Metadata } from 'next'
import { Tool } from '@/tools/types'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://dev-toolbox.vercel.app'

export function generateToolMetadata(tool: Tool): Metadata {
  return {
    title: `${tool.name} | Dev Toolbox`,
    description: tool.description,
    keywords: tool.keywords.join(', '),
    openGraph: {
      title: `${tool.name} | Dev Toolbox`,
      description: tool.description,
      url: `${BASE_URL}/?tool=${tool.id}`,
      siteName: 'Dev Toolbox',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.name} | Dev Toolbox`,
      description: tool.description,
    },
  }
}

export function generateBaseMetadata(): Metadata {
  return {
    title: 'Dev Toolbox - Free Online Developer Tools',
    description:
      'A collection of free online developer tools: JSON formatter, Base64 encoder, URL encoder, case converter, JWT decoder, and more. All tools run locally in your browser.',
    keywords:
      'developer tools, json formatter, base64 encoder, url encoder, case converter, jwt decoder, timestamp converter, online tools',
    authors: [{ name: 'Dev Toolbox' }],
    openGraph: {
      title: 'Dev Toolbox - Free Online Developer Tools',
      description:
        'A collection of free online developer tools that run locally in your browser.',
      url: BASE_URL,
      siteName: 'Dev Toolbox',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Dev Toolbox - Free Online Developer Tools',
      description:
        'A collection of free online developer tools that run locally in your browser.',
    },
    robots: {
      index: true,
      follow: true,
    },
    metadataBase: new URL(BASE_URL),
  }
}

