'use client'

import { toolDefinitions } from '@/tools/definitions'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://tiny-dev-tools.vercel.app'

export function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Dev Toolbox',
    url: BASE_URL,
    description:
      'A collection of free online developer tools including JSON formatter, Base64 encoder, UUID generator, hash generator, regex tester, and 30+ more. All tools run locally in your browser for maximum privacy.',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: toolDefinitions.map((tool) => tool.name),
    author: {
      '@type': 'Organization',
      name: 'Dev Toolbox',
      url: BASE_URL,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/?search={search_term}`,
      },
      'query-input': 'required name=search_term',
    },
  }

  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Dev Toolbox',
    url: BASE_URL,
    description: 'Free online developer tools that run locally in your browser',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/?search={search_term}`,
      },
      'query-input': 'required name=search_term',
    },
  }

  const softwareAppData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Dev Toolbox',
    url: BASE_URL,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      ratingCount: '1',
      bestRating: '5',
      worstRating: '1',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareAppData),
        }}
      />
    </>
  )
}

