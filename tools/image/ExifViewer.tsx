'use client'

import { useState } from 'react'
import exifr from 'exif-js'
import { CopyButton } from '@/components/CopyButton'
import { useToast } from '@/components/Toast'

interface ExifData {
    [key: string]: string | number
}

export default function ExifViewer() {
    const [file, setFile] = useState<File | null>(null)
    const [exifData, setExifData] = useState<ExifData | null>(null)
    const [loading, setLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const { showToast } = useToast()

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            if (!selectedFile.type.startsWith('image/')) {
                showToast('Please select a valid image file', 'error')
                return
            }
            setFile(selectedFile)
            setExifData(null)

            const reader = new FileReader()
            reader.onload = (e) => setImagePreview(e.target?.result as string)
            reader.readAsDataURL(selectedFile)

            extractExif(selectedFile)
        }
    }

    const extractExif = (file: File) => {
        setLoading(true)
        // @ts-ignore - exif-js types might be incomplete
        exifr.getData(file, function (this: any) {
            // @ts-ignore
            const allMetaData = exifr.getAllTags(this)
            if (allMetaData && Object.keys(allMetaData).length > 0) {
                // Clean up the data for display
                const cleanData: ExifData = {}
                for (const [key, value] of Object.entries(allMetaData)) {
                    if (typeof value === 'object' && value !== null) {
                        cleanData[key] = JSON.stringify(value)
                    } else {
                        // @ts-ignore
                        cleanData[key] = value
                    }
                }
                setExifData(cleanData)
                showToast('EXIF data extracted successfully', 'success')
            } else {
                setExifData(null)
                showToast('No EXIF data found in this image', 'info')
            }
            setLoading(false)
        })
    }

    const removeExif = () => {
        if (!imagePreview) return

        // Simple stripping by re-encoding via canvas
        const img = new Image()
        img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            if (ctx) {
                ctx.drawImage(img, 0, 0)
                const cleanDataUrl = canvas.toDataURL('image/jpeg', 0.95)

                const link = document.createElement('a')
                link.download = `clean-${file?.name || 'image.jpg'}`
                link.href = cleanDataUrl
                link.click()
                showToast('MetaData removed (Re-encoded image downloaded)', 'success')
            }
        }
        img.src = imagePreview
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
                {/* Sidebar / Upload */}
                <div className="space-y-6">
                    <div className="flex w-full items-center justify-center rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-900/50 px-6 py-10 transition-colors hover:border-zinc-500 hover:bg-zinc-900">
                        <div className="text-center">
                            <svg className="mx-auto h-12 w-12 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <label
                                htmlFor="file-upload"
                                className="mt-4 inline-block cursor-pointer rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
                            >
                                Select Image
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/jpeg,image/tiff"
                                    className="sr-only"
                                    onChange={handleFileSelect}
                                />
                            </label>
                            <p className="mt-2 text-xs text-zinc-500">Supports JPEG, TIFF</p>
                        </div>
                    </div>

                    {imagePreview && (
                        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-2">
                            <img src={imagePreview} alt="Preview" className="w-full rounded-lg object-contain opacity-50 hover:opacity-100 transition-opacity" />
                            <button
                                onClick={removeExif}
                                className="mt-3 w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white"
                            >
                                Remove Metadata & Download
                            </button>
                        </div>
                    )}
                </div>

                {/* Data Display */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-zinc-200">EXIF Data</h3>
                        {exifData && (
                            <span className="text-xs text-zinc-500">{Object.keys(exifData).length} tags found</span>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
                        </div>
                    ) : exifData ? (
                        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/30">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-zinc-900/80 text-zinc-400">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Tag</th>
                                        <th className="px-4 py-3 font-medium">Value</th>
                                        <th className="w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {Object.entries(exifData).map(([key, value]) => (
                                        <tr key={key} className="hover:bg-zinc-800/30">
                                            <td className="px-4 py-3 font-mono text-zinc-400">{key}</td>
                                            <td className="px-4 py-3 text-zinc-200 break-all">{String(value)}</td>
                                            <td className="px-4 py-3">
                                                <CopyButton text={String(value)} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 p-8 text-center text-zinc-500">
                            {file ? 'No EXIF data found in this image.' : 'Upload an image to view its metadata.'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
