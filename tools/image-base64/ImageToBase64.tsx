'use client'

import { useState, useRef } from 'react'
import { CopyButton } from '@/components/CopyButton'
import { useToast } from '@/components/Toast'

export default function ImageToBase64() {
  const { showToast } = useToast()
  const [base64, setBase64] = useState('')
  const [dataUrl, setDataUrl] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [format, setFormat] = useState<'base64' | 'dataurl'>('dataurl')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setBase64(result.split(',')[1] || result)
      setDataUrl(result)
      setPreview(result)
      showToast('Image converted successfully!', 'success')
    }
    reader.onerror = () => {
      showToast('Error reading file', 'error')
    }
    reader.readAsDataURL(file)
  }

  const clear = () => {
    setBase64('')
    setDataUrl('')
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const output = format === 'base64' ? base64 : dataUrl

  return (
    <div className="space-y-6">
      {/* File Input */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">Select Image</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 file:mr-4 file:rounded file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-emerald-500"
        />
      </div>

      {/* Format Selection */}
      {base64 && (
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">Output Format</label>
          <div className="flex gap-2">
            <button
              onClick={() => setFormat('dataurl')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                format === 'dataurl'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              Data URL
            </button>
            <button
              onClick={() => setFormat('base64')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                format === 'base64'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              Base64 Only
            </button>
          </div>
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">Preview</label>
          <div className="flex justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
            <img src={preview} alt="Preview" className="max-h-64 max-w-full rounded" />
          </div>
        </div>
      )}

      {/* Output */}
      {output && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-400">
              {format === 'dataurl' ? 'Data URL' : 'Base64 String'}
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            value={output}
            readOnly
            className="h-32 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-xs text-zinc-100 focus:border-zinc-500 focus:outline-none"
          />
        </div>
      )}

      {/* Clear Button */}
      {base64 && (
        <button
          onClick={clear}
          className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
        >
          Clear
        </button>
      )}

      {/* Info */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4 text-sm text-zinc-500">
        <p>
          Upload an image file to convert it to Base64 or Data URL format. Data URLs can be used directly in HTML{' '}
          <code className="text-emerald-400">&lt;img&gt;</code> tags or CSS.
        </p>
      </div>
    </div>
  )
}

