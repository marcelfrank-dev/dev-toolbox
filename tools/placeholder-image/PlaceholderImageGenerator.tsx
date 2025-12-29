'use client'

import { useState, useMemo } from 'react'
import { CopyButton } from '@/components/CopyButton'

function generatePlaceholderImageDataUrl(
  width: number,
  height: number,
  text: string,
  bgColor: string,
  textColor: string
): string {
  // Create a canvas element
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return ''
  }

  // Fill background
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, width, height)

  // Draw text
  if (text || true) {
    const displayText = text || `${width} × ${height}`
    ctx.fillStyle = textColor
    ctx.font = `bold ${Math.min(width, height) / 10}px Arial, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(displayText, width / 2, height / 2)
  }

  // Return as data URL
  return canvas.toDataURL('image/png')
}

function generatePlaceholderUrl(width: number, height: number, text: string, bgColor: string, textColor: string): string {
  // Generate data URL for client-side placeholder
  return generatePlaceholderImageDataUrl(width, height, text, bgColor, textColor)
}

export default function PlaceholderImageGenerator() {
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(600)
  const [text, setText] = useState('')
  const [bgColor, setBgColor] = useState('#cccccc')
  const [textColor, setTextColor] = useState('#000000')
  const [count, setCount] = useState(1)

  // Generate data URLs for preview (client-side only)
  const imageDataUrls = useMemo(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return []
    }
    const urls: string[] = []
    for (let i = 0; i < count; i++) {
      urls.push(generatePlaceholderUrl(width, height, text, bgColor, textColor))
    }
    return urls
  }, [width, height, text, bgColor, textColor, count])

  // Generate exportable code snippets
  const output = useMemo(() => {
    if (count === 1) {
      // Single image - provide data URL and base64 code
      const dataUrl = imageDataUrls[0]
      const base64 = dataUrl.split(',')[1]
      return `Data URL:\n${dataUrl}\n\nBase64:\n${base64}\n\nHTML:\n<img src="${dataUrl}" alt="Placeholder ${width}x${height}" width="${width}" height="${height}" />`
    } else {
      // Multiple images
      return imageDataUrls.map((url, i) => `Image ${i + 1}:\n${url}`).join('\n\n')
    }
  }, [imageDataUrls, count, width, height])

  const clear = () => {
    setWidth(800)
    setHeight(600)
    setText('')
    setBgColor('#cccccc')
    setTextColor('#000000')
    setCount(1)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="placeholder-width" className="text-sm font-medium text-zinc-300">
            Width
          </label>
          <input
            id="placeholder-width"
            type="number"
            min="1"
            value={width}
            onChange={(e) => setWidth(Math.max(1, parseInt(e.target.value) || 800))}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="placeholder-height" className="text-sm font-medium text-zinc-300">
            Height
          </label>
          <input
            id="placeholder-height"
            type="number"
            min="1"
            value={height}
            onChange={(e) => setHeight(Math.max(1, parseInt(e.target.value) || 600))}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="placeholder-text" className="text-sm font-medium text-zinc-300">
            Text (optional)
          </label>
          <input
            id="placeholder-text"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Leave empty for dimensions"
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="placeholder-count" className="text-sm font-medium text-zinc-300">
            Count
          </label>
          <input
            id="placeholder-count"
            type="number"
            min="1"
            max="10"
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="placeholder-bg" className="text-sm font-medium text-zinc-300">
            Background Color
          </label>
          <div className="flex gap-2">
            <input
              id="placeholder-bg"
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="h-10 w-20 cursor-pointer rounded border border-zinc-700"
            />
            <input
              type="text"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 p-2 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="placeholder-text-color" className="text-sm font-medium text-zinc-300">
            Text Color
          </label>
          <div className="flex gap-2">
            <input
              id="placeholder-text-color"
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="h-10 w-20 cursor-pointer rounded border border-zinc-700"
            />
            <input
              type="text"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 p-2 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            />
          </div>
        </div>
      </div>

      {imageDataUrls.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="placeholder-output" className="text-sm font-medium text-zinc-300">
              Generated Data URLs & Code
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            id="placeholder-output"
            value={output}
            readOnly
            className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-xs text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
      )}

      {imageDataUrls.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-medium text-zinc-300">Preview</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {imageDataUrls.slice(0, 4).map((url, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-400">Preview {i + 1}</span>
                  <span className="text-xs text-zinc-500">
                    {width} × {height}
                  </span>
                </div>
                <div className="relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
                  <img
                    src={url}
                    alt={`Placeholder ${width}x${height} ${i + 1}`}
                    className="h-48 w-full object-contain"
                    style={{ maxHeight: '300px' }}
                  />
                </div>
                <button
                  onClick={() => {
                    const link = document.createElement('a')
                    link.download = `placeholder-${width}x${height}-${i + 1}.png`
                    link.href = url
                    link.click()
                  }}
                  className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-zinc-100"
                >
                  Download Image
                </button>
              </div>
            ))}
          </div>
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

