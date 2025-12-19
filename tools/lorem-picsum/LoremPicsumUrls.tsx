'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function generateLoremPicsumUrl(width: number, height: number, seed?: number, grayscale?: boolean, blur?: number): string {
  let url = `https://picsum.photos/${width}/${height}`
  const params: string[] = []
  if (seed) params.push(`seed=${seed}`)
  if (grayscale) params.push('grayscale')
  if (blur && blur > 0) params.push(`blur=${blur}`)
  if (params.length > 0) url += '?' + params.join('&')
  return url
}

export default function LoremPicsumUrls() {
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(600)
  const [seed, setSeed] = useState('')
  const [grayscale, setGrayscale] = useState(false)
  const [blur, setBlur] = useState(0)
  const [count, setCount] = useState(1)

  const urls: string[] = []
  for (let i = 0; i < count; i++) {
    const seedNum = seed ? parseInt(seed) + i : undefined
    urls.push(generateLoremPicsumUrl(width, height, seedNum, grayscale, blur))
  }

  const output = urls.join('\n')

  const clear = () => {
    setWidth(800)
    setHeight(600)
    setSeed('')
    setGrayscale(false)
    setBlur(0)
    setCount(1)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="picsum-width" className="text-sm font-medium text-zinc-300">
            Width
          </label>
          <input
            id="picsum-width"
            type="number"
            min="1"
            value={width}
            onChange={(e) => setWidth(Math.max(1, parseInt(e.target.value) || 800))}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="picsum-height" className="text-sm font-medium text-zinc-300">
            Height
          </label>
          <input
            id="picsum-height"
            type="number"
            min="1"
            value={height}
            onChange={(e) => setHeight(Math.max(1, parseInt(e.target.value) || 600))}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="picsum-seed" className="text-sm font-medium text-zinc-300">
            Seed (optional)
          </label>
          <input
            id="picsum-seed"
            type="number"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            placeholder="Leave empty for random"
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="picsum-count" className="text-sm font-medium text-zinc-300">
            Count
          </label>
          <input
            id="picsum-count"
            type="number"
            min="1"
            max="10"
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={grayscale}
            onChange={(e) => setGrayscale(e.target.checked)}
            className="rounded border-zinc-700 bg-zinc-900 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
          />
          <span className="text-sm text-zinc-400">Grayscale</span>
        </label>
        <div className="flex items-center gap-2">
          <label htmlFor="picsum-blur" className="text-sm text-zinc-400">
            Blur:
          </label>
          <input
            id="picsum-blur"
            type="number"
            min="0"
            max="10"
            value={blur}
            onChange={(e) => setBlur(Math.max(0, Math.min(10, parseInt(e.target.value) || 0)))}
            className="w-20 rounded-lg border border-zinc-700 bg-zinc-900 p-2 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="picsum-output" className="text-sm font-medium text-zinc-300">
            Generated URLs
          </label>
          <CopyButton text={output} />
        </div>
        <textarea
          id="picsum-output"
          value={output}
          readOnly
          className="h-32 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      {urls.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {urls.slice(0, 4).map((url, i) => (
            <div key={i} className="flex flex-col gap-2">
              <img src={url} alt={`Preview ${i + 1}`} className="h-32 w-full rounded-lg object-cover" />
              <code className="truncate text-xs text-zinc-400">{url}</code>
            </div>
          ))}
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

