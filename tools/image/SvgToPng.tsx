'use client'

import { useState, useRef, useEffect } from 'react'
import { useToast } from '@/components/Toast'

export default function SvgToPng() {
    const [inputMode, setInputMode] = useState<'file' | 'code'>('file')
    const [svgContent, setSvgContent] = useState('')
    const [scale, setScale] = useState(1)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const { showToast } = useToast()

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.type !== 'image/svg+xml') {
                showToast('Please select a valid SVG file', 'error')
                return
            }
            const reader = new FileReader()
            reader.onload = (e) => {
                setSvgContent(e.target?.result as string)
            }
            reader.readAsText(file)
        }
    }

    // Update preview when SVG content or scale changes
    useEffect(() => {
        if (!svgContent) {
            setPreviewUrl(null)
            setDimensions(null)
            return
        }

        try {
            const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' })
            const url = URL.createObjectURL(svgBlob)

            const img = new Image()
            img.onload = () => {
                setDimensions({ width: img.width, height: img.height })
                setPreviewUrl(url)
            }
            img.onerror = () => {
                showToast('Invalid SVG content', 'error')
            }
            img.src = url

            return () => URL.revokeObjectURL(url)
        } catch (e) {
            console.error(e)
        }
    }, [svgContent, showToast])


    const downloadPng = () => {
        if (!previewUrl || !canvasRef.current || !dimensions) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const img = new Image()

        img.onload = () => {
            canvas.width = dimensions.width * scale
            canvas.height = dimensions.height * scale

            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

                const link = document.createElement('a')
                link.download = `converted-image@${scale}x.png`
                link.href = canvas.toDataURL('image/png')
                link.click()
                showToast('PNG downloaded successfully', 'success')
            }
        }
        img.src = previewUrl
    }

    return (
        <div className="space-y-6">
            {/* Input Mode Switcher */}
            <div className="flex border-b border-zinc-800">
                <button
                    onClick={() => setInputMode('file')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${inputMode === 'file'
                            ? 'border-b-2 border-emerald-500 text-emerald-400'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                >
                    Upload File
                </button>
                <button
                    onClick={() => setInputMode('code')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${inputMode === 'code'
                            ? 'border-b-2 border-emerald-500 text-emerald-400'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                >
                    Paste Code
                </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Input Area */}
                <div className="space-y-4">
                    {inputMode === 'file' ? (
                        <div className="flex w-full items-center justify-center rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-900/50 px-6 py-20 transition-colors hover:border-zinc-500 hover:bg-zinc-900">
                            <div className="text-center">
                                <svg className="mx-auto h-12 w-12 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <label
                                    htmlFor="file-upload"
                                    className="mt-4 inline-block cursor-pointer rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
                                >
                                    Upload SVG
                                    <input
                                        id="file-upload"
                                        type="file"
                                        accept="image/svg+xml"
                                        className="sr-only"
                                        onChange={handleFileSelect}
                                    />
                                </label>
                            </div>
                        </div>
                    ) : (
                        <textarea
                            value={svgContent}
                            onChange={(e) => setSvgContent(e.target.value)}
                            placeholder="<svg>...</svg>"
                            className="h-80 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 font-mono text-xs text-zinc-300 focus:border-emerald-500 focus:outline-none"
                        />
                    )}

                    {/* Settings */}
                    {svgContent && (
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-zinc-300">Output Scale</label>
                                <span className="text-sm font-mono text-zinc-400">{scale}x</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                step="1"
                                value={scale}
                                onChange={(e) => setScale(Number(e.target.value))}
                                className="w-full"
                            />
                            <div className="text-xs text-zinc-500 text-right">
                                Output size: {dimensions ? `${dimensions.width * scale} x ${dimensions.height * scale} px` : '--'}
                            </div>
                        </div>
                    )}
                </div>

                {/* Preview & Download */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-zinc-200">Preview</h3>
                    <div className="flex h-80 w-full items-center justify-center rounded-xl border border-zinc-800 bg-[url('/grid.svg')] bg-zinc-950 p-4">
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="SVG Preview"
                                className="max-h-full max-w-full object-contain"
                            />
                        ) : (
                            <span className="text-sm text-zinc-500">No SVG loaded</span>
                        )}
                    </div>

                    <button
                        onClick={downloadPng}
                        disabled={!previewUrl}
                        className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition-all hover:bg-emerald-500 hover:shadow-emerald-900/40 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Download PNG
                    </button>
                </div>
            </div>

            <canvas ref={canvasRef} className="hidden" />
        </div>
    )
}
