'use client'

import { useState, useRef, useCallback } from 'react'
import { useToast } from '@/components/Toast'

export default function FaviconGenerator() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [sizes, setSizes] = useState<Set<number>>(new Set([16, 32, 180]))
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { showToast } = useToast()

  const standardSizes = [
    { size: 16, name: 'Favicon (16x16)' },
    { size: 32, name: 'Favicon (32x32)' },
    { size: 180, name: 'Apple Touch Icon (180x180)' },
    { size: 192, name: 'Android Chrome (192x192)' },
    { size: 512, name: 'Android Chrome (512x512)' },
  ]

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error')
      return
    }

    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }, [showToast])

  const toggleSize = (size: number) => {
    const newSizes = new Set(sizes)
    if (newSizes.has(size)) {
      newSizes.delete(size)
    } else {
      newSizes.add(size)
    }
    setSizes(newSizes)
  }

  const generateFavicon = useCallback(async (size: number): Promise<Blob | null> => {
    if (!preview || !canvasRef.current) return null

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    const img = new Image()
    return new Promise((resolve) => {
      img.onload = () => {
        canvas.width = size
        canvas.height = size
        ctx.drawImage(img, 0, 0, size, size)
        canvas.toBlob((blob) => resolve(blob || null), 'image/png')
      }
      img.src = preview
    })
  }, [preview])

  const downloadFavicon = useCallback(async (size: number) => {
    const blob = await generateFavicon(size)
    if (!blob) {
      showToast('Failed to generate favicon', 'error')
      return
    }

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `favicon-${size}x${size}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast(`Downloaded favicon-${size}x${size}.png`, 'success')
  }, [generateFavicon, showToast])

  const downloadAll = useCallback(async () => {
    if (sizes.size === 0) {
      showToast('Please select at least one size', 'error')
      return
    }

    for (const size of sizes) {
      await downloadFavicon(size)
      // Small delay between downloads
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
    showToast(`Downloaded ${sizes.size} favicon(s)`, 'success')
  }, [sizes, downloadFavicon, showToast])

  const generateHTML = useCallback(() => {
    const htmlParts: string[] = []
    sizes.forEach((size) => {
      if (size === 180) {
        htmlParts.push(`<link rel="apple-touch-icon" sizes="${size}x${size}" href="/apple-icon-${size}x${size}.png">`)
      } else if (size === 192 || size === 512) {
        htmlParts.push(`<link rel="icon" type="image/png" sizes="${size}x${size}" href="/android-chrome-${size}x${size}.png">`)
      } else {
        htmlParts.push(`<link rel="icon" type="image/png" sizes="${size}x${size}" href="/favicon-${size}x${size}.png">`)
      }
    })
    return htmlParts.join('\n')
  }, [sizes])

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="file-input" className="mb-2 block text-sm font-medium text-zinc-300">
          Select Image
        </label>
        <input
          id="file-input"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="block w-full text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-4 file:py-2 file:text-sm file:font-medium file:text-zinc-100 hover:file:bg-zinc-700"
        />
        <p className="mt-2 text-xs text-zinc-500">
          Upload an image to generate favicon files in multiple sizes
        </p>
      </div>

      {preview && (
        <>
          <div>
            <h3 className="mb-2 text-sm font-medium text-zinc-300">Preview</h3>
            <div className="flex items-center gap-4">
              <img
                src={preview}
                alt="Preview"
                className="h-32 w-32 rounded-lg border border-zinc-700 object-cover"
              />
              <div className="flex flex-col gap-2">
                {standardSizes.map(({ size, name }) => (
                  <div key={size} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={sizes.has(size)}
                      onChange={() => toggleSize(size)}
                      className="rounded border-zinc-700 bg-zinc-900/50 text-zinc-500 focus:ring-zinc-500/20"
                    />
                    <label className="text-sm text-zinc-400">
                      {name} ({size}x{size})
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium text-zinc-300">Actions</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={downloadAll}
                disabled={sizes.size === 0}
                className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Download All Selected
              </button>
              {Array.from(sizes).map((size) => (
                <button
                  key={size}
                  onClick={() => downloadFavicon(size)}
                  className="rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:border-zinc-600 hover:bg-zinc-900 hover:text-zinc-300"
                >
                  Download {size}x{size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium text-zinc-300">HTML Code</h3>
            <textarea
              readOnly
              value={generateHTML()}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
              rows={Math.max(3, sizes.size)}
            />
          </div>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}

