'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

export default function MetaTagGenerator() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [keywords, setKeywords] = useState('')
  const [author, setAuthor] = useState('')
  const [ogTitle, setOgTitle] = useState('')
  const [ogDescription, setOgDescription] = useState('')
  const [ogImage, setOgImage] = useState('')
  const [ogUrl, setOgUrl] = useState('')
  const [twitterCard, setTwitterCard] = useState('summary_large_image')

  const generateMetaTags = () => {
    const tags: string[] = []

    if (title) tags.push(`<title>${title}</title>`)
    if (description) tags.push(`<meta name="description" content="${description}">`)
    if (keywords) tags.push(`<meta name="keywords" content="${keywords}">`)
    if (author) tags.push(`<meta name="author" content="${author}">`)

    // Open Graph
    if (ogTitle || title) tags.push(`<meta property="og:title" content="${ogTitle || title}">`)
    if (ogDescription || description) tags.push(`<meta property="og:description" content="${ogDescription || description}">`)
    if (ogImage) tags.push(`<meta property="og:image" content="${ogImage}">`)
    if (ogUrl) tags.push(`<meta property="og:url" content="${ogUrl}">`)
    tags.push('<meta property="og:type" content="website">')

    // Twitter
    tags.push(`<meta name="twitter:card" content="${twitterCard}">`)
    if (ogTitle || title) tags.push(`<meta name="twitter:title" content="${ogTitle || title}">`)
    if (ogDescription || description) tags.push(`<meta name="twitter:description" content="${ogDescription || description}">`)
    if (ogImage) tags.push(`<meta name="twitter:image" content="${ogImage}">`)

    return tags.join('\n')
  }

  const output = generateMetaTags()

  const clear = () => {
    setTitle('')
    setDescription('')
    setKeywords('')
    setAuthor('')
    setOgTitle('')
    setOgDescription('')
    setOgImage('')
    setOgUrl('')
    setTwitterCard('summary_large_image')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="meta-title" className="text-sm font-medium text-zinc-300">
            Title
          </label>
          <input
            id="meta-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="meta-author" className="text-sm font-medium text-zinc-300">
            Author
          </label>
          <input
            id="meta-author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="meta-description" className="text-sm font-medium text-zinc-300">
            Description
          </label>
          <textarea
            id="meta-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-20 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="meta-keywords" className="text-sm font-medium text-zinc-300">
            Keywords (comma-separated)
          </label>
          <input
            id="meta-keywords"
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="keyword1, keyword2, keyword3"
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <h3 className="mb-3 text-sm font-medium text-zinc-300">Open Graph</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="og-title" className="text-sm font-medium text-zinc-300">
              OG Title
            </label>
            <input
              id="og-title"
              type="text"
              value={ogTitle}
              onChange={(e) => setOgTitle(e.target.value)}
              className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="og-url" className="text-sm font-medium text-zinc-300">
              OG URL
            </label>
            <input
              id="og-url"
              type="url"
              value={ogUrl}
              onChange={(e) => setOgUrl(e.target.value)}
              className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label htmlFor="og-description" className="text-sm font-medium text-zinc-300">
              OG Description
            </label>
            <textarea
              id="og-description"
              value={ogDescription}
              onChange={(e) => setOgDescription(e.target.value)}
              className="h-20 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label htmlFor="og-image" className="text-sm font-medium text-zinc-300">
              OG Image URL
            </label>
            <input
              id="og-image"
              type="url"
              value={ogImage}
              onChange={(e) => setOgImage(e.target.value)}
              className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="twitter-card" className="text-sm font-medium text-zinc-300">
              Twitter Card Type
            </label>
            <select
              id="twitter-card"
              value={twitterCard}
              onChange={(e) => setTwitterCard(e.target.value)}
              className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            >
              <option value="summary">Summary</option>
              <option value="summary_large_image">Summary Large Image</option>
            </select>
          </div>
        </div>
      </div>

      {output && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="meta-output" className="text-sm font-medium text-zinc-300">
              Generated Meta Tags
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            id="meta-output"
            value={output}
            readOnly
            className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
      )}

      <button
        onClick={clear}
        className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
      >
        Clear
      </button>
    </div>
  )
}

