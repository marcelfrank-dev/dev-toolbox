'use client'

import { useState, useRef } from 'react'
import ColorThief from 'colorthief'
import { CopyButton } from '@/components/CopyButton'
import { useToast } from '@/components/Toast'

interface ColorPalette {
    dominant: number[]
    palette: number[][]
}

export default function ColorExtractor() {
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [palette, setPalette] = useState<ColorPalette | null>(null)
    const imageRef = useRef<HTMLImageElement>(null)
    const { showToast } = useToast()

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (!file.type.startsWith('image/')) {
                showToast('Please select a valid image file', 'error')
                return
            }
            const reader = new FileReader()
            reader.onload = (e) => {
                setImageSrc(e.target?.result as string)
                setPalette(null)
            }
            reader.readAsDataURL(file)
        }
    }

    const extractColors = () => {
        const img = imageRef.current
        if (!img) return

        try {
            const colorThief = new ColorThief()
            const dominant = colorThief.getColor(img)
            const paletteColors = colorThief.getPalette(img, 10)

            setPalette({
                dominant,
                palette: paletteColors
            })
        } catch (e) {
            console.error(e)
            // Sometimes fails if image isn't fully loaded or cross-origin issues (not applicable for local blob)
            showToast('Failed to extract colors', 'error')
        }
    }

    // Helper to convert [r,g,b] to hex
    const rgbToHex = (rgb: number[]) => {
        return '#' + rgb.map(x => {
            const hex = x.toString(16)
            return hex.length === 1 ? '0' + hex : hex
        }).join('')
    }

    const rgbString = (rgb: number[]) => `rgb(${rgb.join(', ')})`

    return (
        <div className="space-y-8">
            {/* Upload Area */}
            {!imageSrc ? (
                <div className="flex w-full items-center justify-center rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-900/50 px-6 py-20 transition-colors hover:border-zinc-500 hover:bg-zinc-900">
                    <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                        <label
                            htmlFor="file-upload"
                            className="mt-4 inline-block cursor-pointer rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
                        >
                            Upload Image
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={handleFileSelect}
                            />
                        </label>
                        <p className="mt-2 text-xs text-zinc-500">Extracts dominant colors and palette</p>
                    </div>
                </div>
            ) : (
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Image Preview */}
                    <div className="space-y-4">
                        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-2 relative group">
                            <img
                                ref={imageRef}
                                src={imageSrc}
                                alt="Preview"
                                className="max-h-[500px] w-full object-contain rounded-lg"
                                onLoad={() => extractColors()} // Auto-extract on load
                                crossOrigin="anonymous"
                            />
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <label
                                    htmlFor="change-image"
                                    className="cursor-pointer rounded-lg bg-black/50 backdrop-blur px-3 py-1.5 text-xs font-medium text-white hover:bg-black/70"
                                >
                                    Change Image
                                    <input
                                        id="change-image"
                                        type="file"
                                        accept="image/*"
                                        className="sr-only"
                                        onChange={handleFileSelect}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Color Results */}
                    <div className="space-y-8">
                        {palette && (
                            <>
                                {/* Dominant Color */}
                                <div>
                                    <h3 className="mb-3 text-lg font-medium text-zinc-200">Dominant Color</h3>
                                    <div className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                                        <div
                                            className="h-16 w-16 rounded-lg shadow-inner ring-1 ring-white/10"
                                            style={{ backgroundColor: rgbString(palette.dominant) }}
                                        />
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <code className="text-sm font-mono text-zinc-300">{rgbToHex(palette.dominant)}</code>
                                                <CopyButton text={rgbToHex(palette.dominant)} />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <code className="text-sm font-mono text-zinc-400">{rgbString(palette.dominant)}</code>
                                                <CopyButton text={rgbString(palette.dominant)} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Palette */}
                                <div>
                                    <h3 className="mb-3 text-lg font-medium text-zinc-200">Palette</h3>
                                    <div className="grid gap-3">
                                        {palette.palette.map((color, i) => (
                                            <div key={i} className="group flex items-center gap-4 rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-2 transition-colors hover:bg-zinc-900/80 hover:border-zinc-700">
                                                <div
                                                    className="h-10 w-10 shrink-0 rounded shadow-sm ring-1 ring-white/10"
                                                    style={{ backgroundColor: rgbString(color) }}
                                                />
                                                <div className="flex items-center gap-4 flex-1">
                                                    <span className="font-mono text-sm text-zinc-300 w-20">{rgbToHex(color)}</span>
                                                    <span className="font-mono text-xs text-zinc-500 flex-1">{rgbString(color)}</span>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity px-2">
                                                    <CopyButton text={rgbToHex(color)} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
