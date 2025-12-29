import { Metadata } from 'next'
import { Tool } from '@/tools/types'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://tiny-dev-tools.vercel.app'

export function generateToolMetadata(tool: Tool): Metadata {
  const toolUrl = `${BASE_URL}/?tool=${tool.id}`
  const fullDescription = `${tool.description}. Free online tool - runs locally in your browser. No data leaves your machine.`
  
  return {
    title: `${tool.name} | Tiny Dev Tools - Free Online Utilities`,
    description: fullDescription,
    keywords: [...tool.keywords, 'tiny dev tools', 'free tool', 'online tool', 'developer tool', 'privacy'].join(', '),
    alternates: {
      canonical: toolUrl,
    },
    openGraph: {
      title: `${tool.name} | Tiny Dev Tools`,
      description: fullDescription,
      url: toolUrl,
      siteName: 'Tiny Dev Tools',
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: `${BASE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${tool.name} - Tiny Dev Tools`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.name} | Tiny Dev Tools`,
      description: fullDescription,
      images: [`${BASE_URL}/og-image.png`],
    },
  }
}

export function generateBaseMetadata(): Metadata {
  const description =
    'Tiny Dev Tools is a collection of 85+ free online developer utilities: JSON formatter, Base64 encoder, URL encoder, JWT decoder, UUID generator, hash generator, regex tester, and many more. All tools run entirely in your browser - no data leaves your machine. Privacy-first, instant, and completely free.'
  
  const keywords = [
    'tiny dev tools',
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
    title: 'Tiny Dev Tools - 85+ Free Online Developer Utilities | Privacy-First',
    description,
    keywords,
    authors: [{ name: 'Tiny Dev Tools' }],
    creator: 'Tiny Dev Tools',
    publisher: 'Tiny Dev Tools',
    alternates: {
      canonical: BASE_URL,
    },
    openGraph: {
      title: 'Tiny Dev Tools - 85+ Free Online Developer Utilities',
      description,
      url: BASE_URL,
      siteName: 'Tiny Dev Tools',
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: `${BASE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'Tiny Dev Tools - Free Online Developer Utilities',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Tiny Dev Tools - 85+ Free Online Developer Utilities',
      description,
      images: [`${BASE_URL}/og-image.png`],
      creator: '@tinydevtools',
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

