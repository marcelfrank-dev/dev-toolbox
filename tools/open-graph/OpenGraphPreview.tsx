'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

export default function OpenGraphPreview() {
  const [url, setUrl] = useState('')
  const [ogData, setOgData] = useState<{
    title?: string
    description?: string
    image?: string
    url?: string
    type?: string
    siteName?: string
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchOgData = async () => {
    if (!url.trim()) return
    setLoading(true)
    try {
      // In a real implementation, you'd fetch the URL and parse HTML
      // For now, we'll create a preview based on the URL
      setOgData({
        title: 'Page Title',
        description: 'Page description from Open Graph meta tags',
        image: 'https://via.placeholder.com/1200x630',
        url: url,
        type: 'website',
        siteName: new URL(url.startsWith('http') ? url : 'https://' + url).hostname,
      })
    } catch (e) {
      setOgData(null)
    } finally {
      setLoading(false)
    }
  }

  const clear = () => {
    setUrl('')
    setOgData(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="og-url" className="text-sm font-medium text-zinc-300">
            URL
          </label>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
        <div className="flex gap-2">
          <input
            id="og-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                fetchOgData()
              }
            }}
            placeholder="https://example.com/page"
            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
          <button
            onClick={fetchOgData}
            disabled={!url.trim() || loading}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Preview'}
          </button>
        </div>
      </div>

      {ogData && (
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
            <h3 className="mb-3 text-sm font-medium text-zinc-300">Social Media Preview</h3>
            <div className="rounded-lg border border-zinc-800 bg-white p-4">
              {ogData.image && (
                <img
                  src={ogData.image}
                  alt="Preview"
                  className="mb-3 h-48 w-full rounded object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              )}
              <div className="flex flex-col gap-1">
                {ogData.siteName && (
                  <p className="text-xs text-gray-500 uppercase">{ogData.siteName}</p>
                )}
                {ogData.title && (
                  <h4 className="text-base font-semibold text-gray-900">{ogData.title}</h4>
                )}
                {ogData.description && (
                  <p className="text-sm text-gray-600">{ogData.description}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-300">Open Graph Data</span>
              <CopyButton text={JSON.stringify(ogData, null, 2)} />
            </div>
            <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
              <table className="w-full border-collapse">
                <tbody>
                  {Object.entries(ogData).map(([key, value]) => (
                    <tr key={key} className="border-b border-zinc-800/50">
                      <td className="p-2 text-sm font-medium text-zinc-400 capitalize">{key}</td>
                      <td className="p-2">
                        <code className="text-sm text-zinc-200">{String(value)}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <p className="text-sm text-zinc-400">
          Note: This is a simplified preview. In a real implementation, the tool would fetch the URL and parse Open Graph meta tags from the HTML.
        </p>
      </div>
    </div>
  )
}

