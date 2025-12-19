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
      'A collection of 130+ free online developer tools including JSON formatter, Base64 encoder, UUID generator, hash generator, regex tester, JWT decoder, timestamp converter, and more. All tools run locally in your browser for maximum privacy - no data ever leaves your machine.',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    softwareVersion: '1.7.1',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: toolDefinitions.map((tool) => tool.name),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      ratingCount: '1',
      bestRating: '5',
      worstRating: '1',
    },
    author: {
      '@type': 'Organization',
      name: 'Dev Toolbox',
      url: BASE_URL,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
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

