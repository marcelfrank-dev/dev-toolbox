'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

export default function MetaTagGenerator() {
    const [values, setValues] = useState({
        title: 'My Awesome Website',
        description: 'The best website on the internet.',
        url: 'https://example.com',
        image: 'https://example.com/og-image.jpg',
        author: '@handle',
        keywords: 'website, awesome, best'
    })

    const handleChange = (key: string, value: string) => {
        setValues(prev => ({ ...prev, [key]: value }))
    }

    const generateTags = () => {
        return `<!-- Primary Meta Tags -->
<title>${values.title}</title>
<meta name="title" content="${values.title}" />
<meta name="description" content="${values.description}" />
<meta name="keywords" content="${values.keywords}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${values.url}" />
<meta property="og:title" content="${values.title}" />
<meta property="og:description" content="${values.description}" />
<meta property="og:image" content="${values.image}" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${values.url}" />
<meta property="twitter:title" content="${values.title}" />
<meta property="twitter:description" content="${values.description}" />
<meta property="twitter:image" content="${values.image}" />`
    }

    const tags = generateTags()

    return (
        <div className="grid gap-8 lg:grid-cols-2">
            {/* Form */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase text-zinc-500">Page Information</h3>

                <div className="grid gap-4">
                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Title</label>
                        <input
                            type="text"
                            value={values.title}
                            onChange={e => handleChange('title', e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Description</label>
                        <textarea
                            value={values.description}
                            onChange={e => handleChange('description', e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 resize-none h-24"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">URL</label>
                        <input
                            type="text"
                            value={values.url}
                            onChange={e => handleChange('url', e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Image URL (OG Image)</label>
                        <input
                            type="text"
                            value={values.image}
                            onChange={e => handleChange('image', e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Keywords (Comma separated)</label>
                        <input
                            type="text"
                            value={values.keywords}
                            onChange={e => handleChange('keywords', e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                </div>
            </div>

            {/* Output */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase text-zinc-500">Generated HTML</h3>
                    <CopyButton text={tags} />
                </div>
                <textarea
                    readOnly
                    value={tags}
                    className="flex-1 w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 font-mono text-xs text-zinc-400 focus:outline-none resize-none"
                />

                {/* Preview Card */}
                <div className="mt-4 border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900 max-w-sm mx-auto">
                    <div className="bg-zinc-800 h-40 w-full bg-cover bg-center" style={{ backgroundImage: `url(${values.image})` }} />
                    <div className="p-4">
                        <div className="text-xs text-zinc-500 uppercase font-semibold mb-1 truncate">{new URL(values.url || 'https://example.com').hostname}</div>
                        <div className="font-bold text-zinc-100 mb-1 leading-tight">{values.title}</div>
                        <div className="text-xs text-zinc-400 line-clamp-2">{values.description}</div>
                    </div>
                </div>
                <div className="text-center text-xs text-zinc-600">Preview (Social Card)</div>
            </div>
        </div>
    )
}
