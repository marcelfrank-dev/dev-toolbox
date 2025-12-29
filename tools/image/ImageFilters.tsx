'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useToast } from '@/components/Toast'

interface FilterState {
    brightness: number
    contrast: number
    saturate: number
    grayscale: number
    sepia: number
    hueRotate: number
    blur: number
}

const defaultFilters: FilterState = {
    brightness: 100,
    contrast: 100,
    saturate: 100,
    grayscale: 0,
    sepia: 0,
    hueRotate: 0,
    blur: 0,
}

export default function ImageFilters() {
    const [file, setFile] = useState<File | null>(null)
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [filters, setFilters] = useState<FilterState>(defaultFilters)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const { showToast } = useToast()

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            if (!selectedFile.type.startsWith('image/')) {
                showToast('Please select a valid image file', 'error')
                return
            }
            setFile(selectedFile)
            const reader = new FileReader()
            reader.onload = (e) => setImageSrc(e.target?.result as string)
            reader.readAsDataURL(selectedFile)
            setFilters(defaultFilters)
        }
    }

    const getFilterString = (f: FilterState) => {
        return `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturate}%) grayscale(${f.grayscale}%) sepia(${f.sepia}%) hue-rotate(${f.hueRotate}deg) blur(${f.blur}px)`
    }

    const handleDownload = useCallback(() => {
        if (!imageSrc || !canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const img = new Image()

        img.onload = () => {
            canvas.width = img.width
            canvas.height = img.height

            if (ctx) {
                ctx.filter = getFilterString(filters)
                ctx.drawImage(img, 0, 0, img.width, img.height)

                const link = document.createElement('a')
                link.download = `filtered-${file?.name || 'image.png'}`
                link.href = canvas.toDataURL('image/png')
                link.click()
                showToast('Image downloaded successfully', 'success')
            }
        }
        img.src = imageSrc
    }, [imageSrc, filters, file, showToast])


    return (
        <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
                {/* Sidebar Controls */}
                <div className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 h-fit">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-medium text-zinc-200">Filters</h3>
                            <p className="text-xs text-zinc-500">Adjust the sliders to apply effects</p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { key: 'brightness', label: 'Brightness', min: 0, max: 200, unit: '%' },
                                { key: 'contrast', label: 'Contrast', min: 0, max: 200, unit: '%' },
                                { key: 'saturate', label: 'Saturation', min: 0, max: 200, unit: '%' },
                                { key: 'grayscale', label: 'Grayscale', min: 0, max: 100, unit: '%' },
                                { key: 'sepia', label: 'Sepia', min: 0, max: 100, unit: '%' },
                                { key: 'hueRotate', label: 'Hue Rotate', min: 0, max: 360, unit: 'deg' },
                                { key: 'blur', label: 'Blur', min: 0, max: 20, unit: 'px' },
                            ].map((filter) => (
                                <div key={filter.key} className="space-y-1">
                                    <div className="flex justify-between text-xs text-zinc-400">
                                        <label htmlFor={filter.key}>{filter.label}</label>
                                        <span className="font-mono">{filters[filter.key as keyof FilterState]}{filter.unit}</span>
                                    </div>
                                    <input
                                        id={filter.key}
                                        type="range"
                                        min={filter.min}
                                        max={filter.max}
                                        value={filters[filter.key as keyof FilterState]}
                                        onChange={(e) => setFilters({ ...filters, [filter.key]: Number(e.target.value) })}
                                        className="w-full"
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setFilters(defaultFilters)}
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>

                {/* Main Preview Area */}
                <div className="space-y-6">
                    {!imageSrc ? (
                        <div className="flex h-96 w-full items-center justify-center rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-900/30 transition-colors hover:border-zinc-500 hover:bg-zinc-900/50">
                            <div className="text-center">
                                <svg className="mx-auto h-12 w-12 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-1">
                                {/* CSS Filter Preview */}
                                <img
                                    src={imageSrc}
                                    alt="Preview"
                                    style={{ filter: getFilterString(filters) }}
                                    className="max-h-[600px] w-full object-contain mx-auto"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <label
                                    htmlFor="file-upload-change"
                                    className="cursor-pointer rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700"
                                >
                                    Change Image
                                    <input
                                        id="file-upload-change"
                                        type="file"
                                        accept="image/*"
                                        className="sr-only"
                                        onChange={handleFileSelect}
                                    />
                                </label>
                                <button
                                    onClick={handleDownload}
                                    className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition-all hover:bg-emerald-500 hover:shadow-emerald-900/40"
                                >
                                    Download Result
                                </button>
                            </div>
                        </div>
                    )}
                    <canvas ref={canvasRef} className="hidden" />
                </div>
            </div>
        </div>
    )
}
