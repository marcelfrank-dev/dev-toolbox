'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

export default function ImageFormatConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [targetFormat, setTargetFormat] = useState<'png' | 'jpeg' | 'webp'>('png')
  const [output, setOutput] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const convert = async () => {
    if (!file) return

    setLoading(true)
    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(img, 0, 0)
            const mimeType = `image/${targetFormat === 'jpeg' ? 'jpeg' : targetFormat}`
            const dataUrl = canvas.toDataURL(mimeType, 0.92)
            setOutput(dataUrl)
          }
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    } catch (e) {
      setOutput('Error: ' + (e instanceof Error ? e.message : 'Conversion failed'))
    } finally {
      setLoading(false)
    }
  }

  const clear = () => {
    setFile(null)
    setOutput('')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="image-file" className="text-sm font-medium text-zinc-300">
          Image File
        </label>
        <input
          id="image-file"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="image-format" className="text-sm font-medium text-zinc-300">
          Target Format
        </label>
        <select
          id="image-format"
          value={targetFormat}
          onChange={(e) => setTargetFormat(e.target.value as 'png' | 'jpeg' | 'webp')}
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        >
          <option value="png">PNG</option>
          <option value="jpeg">JPEG</option>
          <option value="webp">WebP</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          onClick={convert}
          disabled={!file || loading}
          className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Converting...' : 'Convert'}
        </button>
        <button
          onClick={clear}
          className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
        >
          Clear
        </button>
      </div>

      {output && output.startsWith('data:') && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-300">Converted Image</label>
            <CopyButton text={output} />
          </div>
          <div className="flex flex-col items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
            <img src={output} alt="Converted" className="max-h-64 rounded" />
            <code className="text-xs text-zinc-400">{targetFormat.toUpperCase()}</code>
          </div>
        </div>
      )}

      {output && !output.startsWith('data:') && (
        <div className="rounded-lg border border-red-800 bg-red-900/20 p-4">
          <p className="text-sm text-red-400">{output}</p>
        </div>
      )}
    </div>
  )
}

