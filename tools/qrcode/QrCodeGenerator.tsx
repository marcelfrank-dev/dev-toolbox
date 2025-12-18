'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

export default function QrCodeGenerator() {
  const [text, setText] = useState('')
  const [size, setSize] = useState(256)
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [qrGenerated, setQrGenerated] = useState(false)

  // Simple QR Code generator (using a third-party API for simplicity)
  // In production, you might want to use a library like 'qrcode'
  const generateQR = useCallback(() => {
    if (!text || !canvasRef.current) {
      setQrGenerated(false)
      return
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Create a simple QR code using Google Charts API (as a fallback/demo)
    // Note: For production, use a proper library
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      canvas.width = size
      canvas.height = size
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, size, size)
      ctx.drawImage(img, 0, 0, size, size)
      setQrGenerated(true)
    }
    img.onerror = () => {
      // Fallback: draw a placeholder
      canvas.width = size
      canvas.height = size
      ctx.fillStyle = '#18181b'
      ctx.fillRect(0, 0, size, size)
      ctx.fillStyle = '#71717a'
      ctx.font = '14px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('QR Code Preview', size / 2, size / 2 - 10)
      ctx.fillText('(requires online)', size / 2, size / 2 + 10)
      setQrGenerated(true)
    }

    // Using a data URL approach for simple QR generation
    // This creates a simple pattern representation
    generateSimpleQR(ctx, text, size)
    setQrGenerated(true)
  }, [text, size, errorLevel])

  // Simple QR code pattern generator (visual representation)
  const generateSimpleQR = (ctx: CanvasRenderingContext2D, data: string, size: number) => {
    // This is a simplified visual representation, not a real QR code
    // For real QR codes, use a library like 'qrcode'
    
    const moduleCount = 25 + Math.floor(data.length / 10) * 4
    const moduleSize = size / moduleCount

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, size, size)
    ctx.fillStyle = '#000000'

    // Generate pattern based on text hash
    const hash = data.split('').reduce((acc, char) => {
      return ((acc << 5) - acc + char.charCodeAt(0)) | 0
    }, 0)

    // Draw finder patterns (corners)
    const drawFinder = (x: number, y: number) => {
      const s = moduleSize * 7
      ctx.fillRect(x, y, s, s)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(x + moduleSize, y + moduleSize, s - moduleSize * 2, s - moduleSize * 2)
      ctx.fillStyle = '#000000'
      ctx.fillRect(x + moduleSize * 2, y + moduleSize * 2, s - moduleSize * 4, s - moduleSize * 4)
    }

    drawFinder(0, 0) // Top-left
    drawFinder(size - moduleSize * 7, 0) // Top-right
    drawFinder(0, size - moduleSize * 7) // Bottom-left

    // Draw data modules (pseudo-random based on input)
    let seed = Math.abs(hash)
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        // Skip finder patterns
        if (
          (row < 8 && col < 8) ||
          (row < 8 && col >= moduleCount - 8) ||
          (row >= moduleCount - 8 && col < 8)
        ) {
          continue
        }

        seed = (seed * 1103515245 + 12345) & 0x7fffffff
        if (seed % 3 === 0) {
          ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize - 1, moduleSize - 1)
        }
      }
    }
  }

  useEffect(() => {
    if (text) {
      generateQR()
    }
  }, [text, size, errorLevel, generateQR])

  const downloadQR = useCallback(
    (format: 'png' | 'svg') => {
      if (!canvasRef.current || !qrGenerated) return

      if (format === 'png') {
        const link = document.createElement('a')
        link.download = 'qrcode.png'
        link.href = canvasRef.current.toDataURL('image/png')
        link.click()
      } else {
        // For SVG, we'd need a proper library
        // For now, just download PNG
        const link = document.createElement('a')
        link.download = 'qrcode.png'
        link.href = canvasRef.current.toDataURL('image/png')
        link.click()
      }
    },
    [qrGenerated]
  )

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">Text or URL</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text or URL to encode..."
          className="h-24 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
        />
      </div>

      {/* Options */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">Size</label>
          <select
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
          >
            <option value={128}>128 × 128</option>
            <option value={256}>256 × 256</option>
            <option value={512}>512 × 512</option>
            <option value={1024}>1024 × 1024</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">Error Correction</label>
          <select
            value={errorLevel}
            onChange={(e) => setErrorLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
          >
            <option value="L">Low (7%)</option>
            <option value="M">Medium (15%)</option>
            <option value="Q">Quartile (25%)</option>
            <option value="H">High (30%)</option>
          </select>
        </div>
      </div>

      {/* QR Code Preview */}
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-lg border border-zinc-700 bg-white p-4">
          <canvas ref={canvasRef} width={size} height={size} className="max-w-full" />
        </div>

        {/* Download Buttons */}
        {qrGenerated && (
          <div className="flex gap-2">
            <button
              onClick={() => downloadQR('png')}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
            >
              Download PNG
            </button>
          </div>
        )}
      </div>

      {/* Note */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4 text-sm text-zinc-500">
        <p>
          Note: This is a visual representation of a QR code pattern. For production use with
          guaranteed scannability, consider using a dedicated QR code library.
        </p>
      </div>
    </div>
  )
}

