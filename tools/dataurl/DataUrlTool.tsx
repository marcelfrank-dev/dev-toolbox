'use client'

import { useState, useCallback, useRef } from 'react'
import { CopyButton } from '@/components/CopyButton'

type Mode = 'encode' | 'decode'

export default function DataUrlTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<Mode>('encode')
  const [mimeType, setMimeType] = useState('text/plain')
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const encode = useCallback(
    (text: string) => {
      const base64 = btoa(unescape(encodeURIComponent(text)))
      return `data:${mimeType};base64,${base64}`
    },
    [mimeType]
  )

  const decode = useCallback((dataUrl: string) => {
    const match = dataUrl.match(/^data:([^;]+)?;?base64,(.+)$/)
    if (!match) {
      throw new Error('Invalid Data URL format')
    }

    const [, mime, base64] = match
    const decoded = decodeURIComponent(escape(atob(base64)))
    return { mime: mime || 'text/plain', content: decoded }
  }, [])

  const handleConvert = useCallback(() => {
    setError('')
    setPreview(null)

    if (!input) {
      setOutput('')
      return
    }

    try {
      if (mode === 'encode') {
        setOutput(encode(input))
      } else {
        const { content } = decode(input)
        setOutput(content)

        // Show preview for images
        if (input.startsWith('data:image/')) {
          setPreview(input)
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion error')
      setOutput('')
    }
  }, [input, mode, encode, decode])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setInput(result)
      setOutput('')
      setMode('decode')
      setError('')

      if (result.startsWith('data:image/')) {
        setPreview(result)
      }
    }
    reader.onerror = () => {
      setError('Failed to read file')
    }
    reader.readAsDataURL(file)
  }, [])

  const commonMimeTypes = [
    'text/plain',
    'text/html',
    'text/css',
    'text/javascript',
    'application/json',
    'application/xml',
    'image/png',
    'image/jpeg',
    'image/svg+xml',
    'image/gif',
  ]

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setMode('encode')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === 'encode'
              ? 'bg-emerald-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          Text → Data URL
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === 'decode'
              ? 'bg-emerald-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          Data URL → Text
        </button>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="ml-auto rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-600"
        >
          Upload File
        </button>
      </div>

      {/* MIME Type (for encoding) */}
      {mode === 'encode' && (
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">MIME Type</label>
          <select
            value={mimeType}
            onChange={(e) => setMimeType(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
          >
            {commonMimeTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Input */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">
          {mode === 'encode' ? 'Content' : 'Data URL'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === 'encode' ? 'Enter content to encode...' : 'Enter data URL (data:mime;base64,...)...'
          }
          className="h-32 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
        />
      </div>

      {/* Convert Button */}
      <button
        onClick={handleConvert}
        disabled={!input}
        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Convert
      </button>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-900/50 bg-red-900/20 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Preview (for images) */}
      {preview && (
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">Image Preview</label>
          <div className="rounded-lg border border-zinc-700 bg-zinc-900/50 p-4">
            <img src={preview} alt="Preview" className="max-h-64 max-w-full object-contain" />
          </div>
        </div>
      )}

      {/* Output */}
      {output && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-400">
              {mode === 'encode' ? 'Data URL' : 'Decoded Content'}
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            value={output}
            readOnly
            className="h-32 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-emerald-400 focus:outline-none"
          />
        </div>
      )}
    </div>
  )
}

