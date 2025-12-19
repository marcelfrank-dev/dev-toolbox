'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

interface UrlEntry {
  loc: string
  lastmod?: string
  changefreq?: string
  priority?: string
}

export default function SitemapGenerator() {
  const [baseUrl, setBaseUrl] = useState('https://example.com')
  const [urls, setUrls] = useState<UrlEntry[]>([{ loc: '' }])

  const addUrl = () => {
    setUrls([...urls, { loc: '' }])
  }

  const removeUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index))
  }

  const updateUrl = (index: number, field: keyof UrlEntry, value: string) => {
    const newUrls = [...urls]
    newUrls[index] = { ...newUrls[index], [field]: value || undefined }
    setUrls(newUrls)
  }

  const generateSitemap = () => {
    const validUrls = urls.filter((u) => u.loc.trim())
    if (validUrls.length === 0) return ''

    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    validUrls.forEach((url) => {
      const fullUrl = url.loc.startsWith('http') ? url.loc : `${baseUrl}${url.loc.startsWith('/') ? '' : '/'}${url.loc}`
      sitemap += '  <url>\n'
      sitemap += `    <loc>${fullUrl}</loc>\n`
      if (url.lastmod) sitemap += `    <lastmod>${url.lastmod}</lastmod>\n`
      if (url.changefreq) sitemap += `    <changefreq>${url.changefreq}</changefreq>\n`
      if (url.priority) sitemap += `    <priority>${url.priority}</priority>\n`
      sitemap += '  </url>\n'
    })

    sitemap += '</urlset>'
    return sitemap
  }

  const output = generateSitemap()

  const clear = () => {
    setBaseUrl('https://example.com')
    setUrls([{ loc: '' }])
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="sitemap-base" className="text-sm font-medium text-zinc-300">
          Base URL
        </label>
        <input
          id="sitemap-base"
          type="url"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-zinc-300">URLs</label>
          <button
            onClick={addUrl}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
          >
            Add URL
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {urls.map((url, index) => (
            <div key={index} className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
              <div className="grid gap-2 sm:grid-cols-4">
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-xs text-zinc-400">Path</label>
                  <input
                    type="text"
                    value={url.loc}
                    onChange={(e) => updateUrl(index, 'loc', e.target.value)}
                    placeholder="/page"
                    className="rounded-lg border border-zinc-700 bg-zinc-900 p-2 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-zinc-400">Change Freq</label>
                  <select
                    value={url.changefreq || ''}
                    onChange={(e) => updateUrl(index, 'changefreq', e.target.value)}
                    className="rounded-lg border border-zinc-700 bg-zinc-900 p-2 text-xs text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
                  >
                    <option value="">None</option>
                    <option value="always">Always</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="never">Never</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-zinc-400">Priority</label>
                  <input
                    type="text"
                    value={url.priority || ''}
                    onChange={(e) => updateUrl(index, 'priority', e.target.value)}
                    placeholder="0.5"
                    className="rounded-lg border border-zinc-700 bg-zinc-900 p-2 font-mono text-xs text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <input
                  type="date"
                  value={url.lastmod || ''}
                  onChange={(e) => updateUrl(index, 'lastmod', e.target.value)}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 p-2 text-xs text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
                />
                <button
                  onClick={() => removeUrl(index)}
                  className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {output && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="sitemap-output" className="text-sm font-medium text-zinc-300">
              Generated Sitemap
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            id="sitemap-output"
            value={output}
            readOnly
            className="h-64 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-xs text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
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

