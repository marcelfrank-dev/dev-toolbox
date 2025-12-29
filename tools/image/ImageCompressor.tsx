'use client'

import { useState } from 'react'
import imageCompression from 'browser-image-compression'
import { useToast } from '@/components/Toast'

export default function ImageCompressor() {
    const [file, setFile] = useState<File | null>(null)
    const [compressedFile, setCompressedFile] = useState<Blob | null>(null)
    const [loading, setLoading] = useState(false)
    const [options, setOptions] = useState({
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
    })
    const { showToast } = useToast()

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            if (!selectedFile.type.startsWith('image/')) {
                showToast('Please select a valid image file', 'error')
                return
            }
            setFile(selectedFile)
            setCompressedFile(null)
        }
    }

    const compressImage = async () => {
        if (!file) return

        setLoading(true)
        try {
            const compressed = await imageCompression(file, options)
            setCompressedFile(compressed)
            showToast('Image compressed successfully!', 'success')
        } catch (error) {
            console.error(error)
            showToast('Failed to compress image', 'error')
        } finally {
            setLoading(false)
        }
    }

    const downloadImage = () => {
        if (!compressedFile) return
        const url = URL.createObjectURL(compressedFile)
        const link = document.createElement('a')
        link.href = url
        link.download = `compressed-${file?.name || 'image'}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Input & Settings */}
                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-medium text-zinc-300">Upload Image</label>
                        <div className="mt-2 flex w-full items-center justify-center rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-900/50 px-6 py-10 transition-colors hover:border-zinc-500 hover:bg-zinc-900">
                            <div className="text-center">
                                <svg
                                    className="mx-auto h-12 w-12 text-zinc-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                <div className="mt-4 flex flex-col gap-2 text-sm text-zinc-400">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer rounded-md font-medium text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-emerald-500/20 hover:text-emerald-400"
                                    >
                                        <span>Upload a file</span>
                                        <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            accept="image/*"
                                            className="sr-only"
                                            onChange={handleFileSelect}
                                        />
                                    </label>
                                    <span>or drag and drop</span>
                                </div>
                                <p className="text-xs text-zinc-500">PNG, JPG, WEBP up to 50MB</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                        <h3 className="text-lg font-medium text-zinc-200">Compression Settings</h3>

                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">
                                Max Size (MB): {options.maxSizeMB}
                            </label>
                            <input
                                type="range"
                                min="0.1"
                                max="10"
                                step="0.1"
                                value={options.maxSizeMB}
                                onChange={(e) => setOptions({ ...options, maxSizeMB: parseFloat(e.target.value) })}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">
                                Max Width/Height (px): {options.maxWidthOrHeight}
                            </label>
                            <input
                                type="range"
                                min="480"
                                max="4096"
                                step="100"
                                value={options.maxWidthOrHeight}
                                onChange={(e) => setOptions({ ...options, maxWidthOrHeight: parseInt(e.target.value) })}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <button
                        onClick={compressImage}
                        disabled={!file || loading}
                        className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition-all hover:bg-emerald-500 hover:shadow-emerald-900/40 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? 'Compressing...' : 'Compress Image'}
                    </button>
                </div>

                {/* Preview & Result */}
                <div className="space-y-6">
                    {file && (
                        <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-4">
                            <div className="mb-2 flex items-center justify-between">
                                <h4 className="text-sm font-medium text-zinc-300">Original</h4>
                                <span className="text-xs text-zinc-400">{formatSize(file.size)}</span>
                            </div>
                            <img
                                src={URL.createObjectURL(file)}
                                alt="Original"
                                className="max-h-60 w-full rounded-lg object-contain bg-zinc-950/50"
                            />
                        </div>
                    )}

                    {compressedFile && (
                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
                            <div className="mb-2 flex items-center justify-between">
                                <h4 className="text-sm font-medium text-emerald-400">Compressed</h4>
                                <span className="text-xs text-emerald-300 font-bold">{formatSize(compressedFile.size)}</span>
                            </div>
                            <img
                                src={URL.createObjectURL(compressedFile)}
                                alt="Compressed"
                                className="max-h-60 w-full rounded-lg object-contain bg-zinc-950/50"
                            />
                            <div className="mt-4">
                                <p className="mb-3 text-center text-sm text-zinc-400">
                                    Saved {file && formatSize(file.size - compressedFile.size)} ({file && Math.round(((file.size - compressedFile.size) / file.size) * 100)}%)
                                </p>
                                <button
                                    onClick={downloadImage}
                                    className="w-full rounded-lg bg-emerald-600/20 border border-emerald-500/50 px-4 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-600/30"
                                >
                                    Download Result
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
