'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Upload, Download, FileText, Image as ImageIcon, Loader2, Trash2 } from 'lucide-react'
import * as pdfjsLib from 'pdfjs-dist'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import clsx from 'clsx'

// Initialize worker
// We use a specific version to match the installed package, or a relatively recent one.
// Since we can't easily get the version at runtime without importing package.json, we'll try to rely on the version we instaled or use a standard CDN.
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

interface PdfPage {
    pageNumber: number
    imageUrl: string
    blob: Blob
    width: number
    height: number
}

export default function PdfToImage() {
    const [isDragging, setIsDragging] = useState(false)
    const [pdfFile, setPdfFile] = useState<File | null>(null)
    const [pages, setPages] = useState<PdfPage[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [progress, setProgress] = useState<{ current: number; total: number } | null>(null)
    const [error, setError] = useState<string | null>(null)

    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const files = e.dataTransfer.files
        if (files.length > 0 && files[0].type === 'application/pdf') {
            processFile(files[0])
        } else {
            setError('Please upload a valid PDF file.')
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processFile(e.target.files[0])
        }
    }

    const processFile = async (file: File) => {
        setPdfFile(file)
        setPages([])
        setError(null)
        setIsLoading(true)
        setProgress(null)

        try {
            const arrayBuffer = await file.arrayBuffer()
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
            const pdf = await loadingTask.promise

            const numPages = pdf.numPages
            const generatedPages: PdfPage[] = []

            for (let i = 1; i <= numPages; i++) {
                setProgress({ current: i, total: numPages })
                const page = await pdf.getPage(i)

                // precise scale for good quality output
                const scale = 2
                const viewport = page.getViewport({ scale })

                const canvas = document.createElement('canvas')
                const context = canvas.getContext('2d')
                canvas.height = viewport.height
                canvas.width = viewport.width

                if (context) {
                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport,
                        canvas: canvas, // Include the canvas element to satisfy types
                    }

                    await page.render(renderContext).promise

                    const blob = await new Promise<Blob | null>((resolve) =>
                        canvas.toBlob(resolve, 'image/png')
                    )

                    if (blob) {
                        generatedPages.push({
                            pageNumber: i,
                            imageUrl: URL.createObjectURL(blob),
                            blob,
                            width: viewport.width,
                            height: viewport.height
                        })
                    }
                }
            }

            setPages(generatedPages)
        } catch (err: any) {
            console.error('Error processing PDF:', err)
            setError('Failed to process PDF. Please try another file. ' + (err.message || ''))
        } finally {
            setIsLoading(false)
            setProgress(null)
        }
    }

    const downloadAll = async () => {
        if (pages.length === 0) return

        const zip = new JSZip()
        const folderName = pdfFile ? pdfFile.name.replace('.pdf', '') : 'pdf-images'

        pages.forEach((page) => {
            zip.file(`page-${page.pageNumber}.png`, page.blob)
        })

        const content = await zip.generateAsync({ type: 'blob' })
        saveAs(content, `${folderName}-images.zip`)
    }

    const downloadSingle = (page: PdfPage) => {
        saveAs(page.blob, `page-${page.pageNumber}.png`)
    }

    const reset = () => {
        setPdfFile(null)
        setPages([])
        setError(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <div className="flex flex-col gap-8">
            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                    PDF to Image Converter
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Convert PDF pages into high-quality images instantly.
                </p>
            </div>

            {/* Upload Section */}
            {!pages.length && !isLoading && (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={clsx(
                        'flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all',
                        isDragging
                            ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                            : 'border-slate-300 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-600',
                        'bg-slate-50 dark:bg-slate-800/50'
                    )}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="application/pdf"
                        onChange={handleFileSelect}
                    />
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                        <Upload className="h-8 w-8" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-200">
                        Drop your PDF here
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        or click to browse
                    </p>
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                    <p className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-200">
                        Processing PDF...
                    </p>
                    {progress && (
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Converting page {progress.current} of {progress.total}
                        </p>
                    )}
                </div>
            )}

            {/* Error State */}
            {error && !isLoading && !pages.length && (
                <div className="rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    <p>{error}</p>
                    <button
                        onClick={reset}
                        className="mt-2 font-medium underline"
                    >
                        Try again
                    </button>
                </div>
            )}

            {/* Results Section */}
            {pages.length > 0 && (
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                <FileText className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-medium text-slate-900 dark:text-slate-200">
                                    {pdfFile?.name}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {pages.length} pages • {Math.round(pages[0].width)}x{Math.round(pages[0].height)}px
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={reset}
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                <Trash2 className="h-4 w-4" />
                                Clear
                            </button>
                            <button
                                onClick={downloadAll}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
                            >
                                <Download className="h-4 w-4" />
                                Download All (ZIP)
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {pages.map((page) => (
                            <div
                                key={page.pageNumber}
                                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
                            >
                                <div className="aspect-[3/4] w-full bg-slate-100 p-4 dark:bg-slate-900/50">
                                    <img
                                        src={page.imageUrl}
                                        alt={`Page ${page.pageNumber}`}
                                        className="h-full w-full object-contain shadow-sm"
                                    />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/0 opacity-0 transition-all group-hover:bg-slate-900/40 group-hover:opacity-100">
                                    <button
                                        onClick={() => downloadSingle(page)}
                                        className="rounded-full bg-white p-3 text-slate-900 shadow-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        title="Download Image"
                                    >
                                        <Download className="h-6 w-6" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between border-t border-slate-100 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                        Page {page.pageNumber}
                                    </span>
                                    <span className="text-xs text-slate-400">
                                        PNG
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
