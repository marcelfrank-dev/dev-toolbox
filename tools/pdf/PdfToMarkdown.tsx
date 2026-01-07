'use client'

import React, { useState, useRef, useMemo } from 'react'
import { Upload, Download, FileText, Loader2, Trash2, Copy, Check } from 'lucide-react'
import * as pdfjsLib from 'pdfjs-dist'
import { saveAs } from 'file-saver'
import clsx from 'clsx'

// Initialize worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

interface TextItem {
    str: string
    transform: number[]
    width: number
    height: number
    hasEOL: boolean
}

export default function PdfToMarkdown() {
    const [isDragging, setIsDragging] = useState(false)
    const [pdfFile, setPdfFile] = useState<File | null>(null)
    const [markdown, setMarkdown] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)
    const [progress, setProgress] = useState<{ current: number; total: number } | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

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
        setMarkdown('')
        setError(null)
        setIsLoading(true)
        setProgress(null)

        try {
            const arrayBuffer = await file.arrayBuffer()
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
            const pdf = await loadingTask.promise
            const numPages = pdf.numPages
            let fullText = ''

            for (let i = 1; i <= numPages; i++) {
                setProgress({ current: i, total: numPages })
                const page = await pdf.getPage(i)
                const textContent = await page.getTextContent()

                // Basic extraction strategy
                // This can be improved with advanced heuristics for layout analysis
                const pageText = textContent.items
                    .map((item: any) => item.str)
                    .join(' ')

                // Add page separator if multiple pages
                if (i > 1) {
                    fullText += '\n\n---\n\n'
                }

                // Clean up text
                // - Fix multiple spaces
                // - Try to detect headers (simplified: very crude assumption here, 
                //   real layout analysis needs coordinate sorting)
                let cleanText = pageText
                    .replace(/\s+/g, ' ') // Collapse multiple spaces
                    .trim()

                fullText += cleanText
            }

            // Attempt to make it look a bit more like markdown (very basic)
            // Since we lost layout info in the simple join, we just have a stream of text.
            // Ideally, we would sort by Y coordinate to reconstruct lines.
            // Let's try a slightly better approach: grouping by 'transform[5]' (y coordinate)

            // Re-process with coordinate awareness if possible
            // (For this MVP, due to complexity of client-side PDF layout analysis, 
            // we will stick to a simpler text extraction which is often sufficient for copy-paste)

            // NOTE: A better approach for "PDF to Markdown" usually involves 
            // rigorous sorting of text items by Y, then X, and checking gaps.
            // Let's try to implement a basic version of that.

            let structuredText = ''
            for (let i = 1; i <= numPages; i++) {
                setProgress({ current: i, total: numPages })
                const page = await pdf.getPage(i)
                const textContent = await page.getTextContent()

                const items = textContent.items as any[]
                // Sort by Y (descending) then X (ascending)
                // transform[5] is Y, transform[4] is X
                items.sort((a, b) => {
                    const dy = b.transform[5] - a.transform[5]
                    if (Math.abs(dy) > 5) return dy // Threshold for 'same line'
                    return a.transform[4] - b.transform[4]
                })

                let lastY = -1
                let pageStr = ''

                items.forEach((item, index) => {
                    if (lastY !== -1 && Math.abs(item.transform[5] - lastY) > 10) {
                        pageStr += '\n' // New line
                        if (Math.abs(item.transform[5] - lastY) > 20) {
                            pageStr += '\n' // Paragraph break
                        }
                    } else if (index > 0) {
                        pageStr += ' '
                    }
                    pageStr += item.str
                    lastY = item.transform[5]
                })

                if (i > 1) structuredText += '\n\n---\n\n'
                structuredText += pageStr
            }

            setMarkdown(structuredText)

        } catch (err: any) {
            console.error('Error processing PDF:', err)
            setError('Failed to process PDF. Please try another file. ' + (err.message || ''))
        } finally {
            setIsLoading(false)
            setProgress(null)
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(markdown)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const downloadMarkdown = () => {
        if (!markdown) return
        const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
        saveAs(blob, (pdfFile?.name.replace('.pdf', '') || 'document') + '.md')
    }

    const reset = () => {
        setPdfFile(null)
        setMarkdown('')
        setError(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    // Simple Markdown Preview Logic (reused from MarkdownPreview tool logic conceptually)
    const previewHtml = useMemo(() => {
        let result = markdown
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')

        // Headers
        result = result.replace(/^### (.+)$/gm, '<h3>$1</h3>')
        result = result.replace(/^## (.+)$/gm, '<h2>$1</h2>')
        result = result.replace(/^# (.+)$/gm, '<h1>$1</h1>')
        // Bold/Italic
        result = result.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        result = result.replace(/\*([^*]+)\*/g, '<em>$1</em>')
        // Lists
        result = result.replace(/^- (.+)$/gm, '<li>$1</li>')
        result = result.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
        // Paragraphs - simple split by double newline
        result = result
            .split('\n\n')
            .map(block => {
                if (block.startsWith('<') || !block.trim()) return block
                return `<p>${block.replace(/\n/g, '<br>')}</p>`
            })
            .join('\n')

        return result
    }, [markdown])

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                    PDF to Markdown Converter
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Extract text from PDF files and convert it to Markdown.
                </p>
            </div>

            {/* Upload */}
            {!markdown && !isLoading && (
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

            {/* Loading */}
            {isLoading && (
                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                    <p className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-200">
                        Extracting text from PDF...
                    </p>
                    {progress && (
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Processing page {progress.current} of {progress.total}
                        </p>
                    )}
                </div>
            )}

            {/* Error */}
            {error && !isLoading && !markdown && (
                <div className="rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    <p>{error}</p>
                    <button onClick={reset} className="mt-2 font-medium underline">
                        Try again
                    </button>
                </div>
            )}

            {/* Result */}
            {markdown && (
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                <FileText className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-medium text-slate-900 dark:text-slate-200">
                                    {pdfFile?.name}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Converted to Markdown
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={reset}
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                <Trash2 className="h-4 w-4" />
                                New
                            </button>
                            <button
                                onClick={copyToClipboard}
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                            <button
                                onClick={downloadMarkdown}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
                            >
                                <Download className="h-4 w-4" />
                                Download
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-500 dark:text-slate-400">
                                Markdown Source
                            </label>
                            <textarea
                                value={markdown}
                                onChange={(e) => setMarkdown(e.target.value)}
                                className="h-[500px] w-full rounded-lg border border-slate-200 bg-white p-4 font-mono text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-500 dark:text-slate-400">
                                Preview
                            </label>
                            <div
                                className="markdown-preview h-[500px] overflow-auto rounded-lg border border-slate-200 bg-white p-6 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                dangerouslySetInnerHTML={{ __html: previewHtml }}
                            />
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
        .markdown-preview h1 { font-size: 2em; font-weight: bold; margin: 0.67em 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.3em; }
        .dark .markdown-preview h1 { border-color: #334155; }
        .markdown-preview h2 { font-size: 1.5em; font-weight: bold; margin: 0.75em 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.3em; }
        .dark .markdown-preview h2 { border-color: #334155; }
        .markdown-preview h3 { font-size: 1.17em; font-weight: bold; margin: 0.83em 0; }
        .markdown-preview p { margin: 1em 0; line-height: 1.6; }
        .markdown-preview ul { list-style-type: disc; padding-left: 2em; margin: 1em 0; }
        .markdown-preview li { margin: 0.25em 0; }
        .markdown-preview strong { font-weight: bold; }
        .markdown-preview em { font-style: italic; }
      `}</style>
        </div>
    )
}
