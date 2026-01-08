'use client'

import React, { useState, useRef, useMemo, useCallback } from 'react'
import { Upload, Download, FileText, Trash2, Copy, Check, Type, FileUp } from 'lucide-react'
import { saveAs } from 'file-saver'
import clsx from 'clsx'

type InputMode = 'paste' | 'upload'

export default function MarkdownToPdf() {
    const [mode, setMode] = useState<InputMode>('paste')
    const [markdown, setMarkdown] = useState('')
    const [fileName, setFileName] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fileInputRef = useRef<HTMLInputElement>(null)
    const printRef = useRef<HTMLDivElement>(null)

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
        if (files.length > 0) {
            processFile(files[0])
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processFile(e.target.files[0])
        }
    }

    const processFile = async (file: File) => {
        const validExtensions = ['.md', '.markdown', '.txt']
        const hasValidExtension = validExtensions.some(ext =>
            file.name.toLowerCase().endsWith(ext)
        )

        if (!hasValidExtension && !file.type.includes('text')) {
            setError('Please upload a Markdown file (.md, .markdown) or text file.')
            return
        }

        try {
            const text = await file.text()
            setMarkdown(text)
            setFileName(file.name)
            setError(null)
        } catch (err) {
            setError('Failed to read file. Please try again.')
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(markdown)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const reset = () => {
        setMarkdown('')
        setFileName(null)
        setError(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const exportToPdf = useCallback(() => {
        if (!printRef.current) return

        const printContent = printRef.current.innerHTML
        const printWindow = window.open('', '_blank')
        if (!printWindow) {
            alert('Please allow popups to export PDF')
            return
        }

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${fileName?.replace(/\.(md|markdown|txt)$/i, '') || 'document'}</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                        line-height: 1.6;
                        color: #1a1a1a;
                        padding: 40px;
                        max-width: 800px;
                        margin: 0 auto;
                    }
                    h1 { font-size: 2em; font-weight: 700; margin: 1em 0 0.5em; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.3em; }
                    h2 { font-size: 1.5em; font-weight: 600; margin: 1em 0 0.5em; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.2em; }
                    h3 { font-size: 1.25em; font-weight: 600; margin: 1em 0 0.5em; }
                    h4 { font-size: 1em; font-weight: 600; margin: 1em 0 0.5em; }
                    p { margin: 1em 0; }
                    ul, ol { margin: 1em 0; padding-left: 2em; }
                    li { margin: 0.25em 0; }
                    code {
                        background: #f1f5f9;
                        padding: 0.2em 0.4em;
                        border-radius: 3px;
                        font-family: 'SF Mono', Monaco, Consolas, monospace;
                        font-size: 0.9em;
                    }
                    pre {
                        background: #f1f5f9;
                        padding: 1em;
                        border-radius: 6px;
                        overflow-x: auto;
                        margin: 1em 0;
                    }
                    pre code {
                        background: none;
                        padding: 0;
                    }
                    blockquote {
                        border-left: 4px solid #3b82f6;
                        margin: 1em 0;
                        padding-left: 1em;
                        color: #4b5563;
                    }
                    table {
                        border-collapse: collapse;
                        width: 100%;
                        margin: 1em 0;
                    }
                    th, td {
                        border: 1px solid #e2e8f0;
                        padding: 0.5em 1em;
                        text-align: left;
                    }
                    th {
                        background: #f8fafc;
                        font-weight: 600;
                    }
                    hr {
                        border: none;
                        border-top: 2px solid #e2e8f0;
                        margin: 2em 0;
                    }
                    a { color: #3b82f6; text-decoration: underline; }
                    strong { font-weight: 600; }
                    em { font-style: italic; }
                    img { max-width: 100%; height: auto; }
                    @media print {
                        body { padding: 0; }
                        @page { margin: 1in; }
                    }
                </style>
            </head>
            <body>
                ${printContent}
            </body>
            </html>
        `)
        printWindow.document.close()

        // Wait for content to load then trigger print
        setTimeout(() => {
            printWindow.print()
        }, 250)
    }, [fileName])

    // Markdown to HTML converter (enhanced)
    const previewHtml = useMemo(() => {
        let result = markdown
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')

        // Code blocks (must come before inline code)
        result = result.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
            return `<pre><code class="language-${lang}">${code.trim()}</code></pre>`
        })

        // Inline code
        result = result.replace(/`([^`]+)`/g, '<code>$1</code>')

        // Headers
        result = result.replace(/^#### (.+)$/gm, '<h4>$1</h4>')
        result = result.replace(/^### (.+)$/gm, '<h3>$1</h3>')
        result = result.replace(/^## (.+)$/gm, '<h2>$1</h2>')
        result = result.replace(/^# (.+)$/gm, '<h1>$1</h1>')

        // Horizontal rules
        result = result.replace(/^---$/gm, '<hr>')
        result = result.replace(/^\*\*\*$/gm, '<hr>')

        // Bold and Italic
        result = result.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>')
        result = result.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        result = result.replace(/\*([^*]+)\*/g, '<em>$1</em>')
        result = result.replace(/__([^_]+)__/g, '<strong>$1</strong>')
        result = result.replace(/_([^_]+)_/g, '<em>$1</em>')

        // Blockquotes
        result = result.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')

        // Links
        result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

        // Images
        result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')

        // Unordered lists
        result = result.replace(/^- (.+)$/gm, '<li>$1</li>')
        result = result.replace(/^\* (.+)$/gm, '<li>$1</li>')
        result = result.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')

        // Ordered lists
        result = result.replace(/^\d+\. (.+)$/gm, '<li>$1</li>')

        // Paragraphs
        result = result
            .split('\n\n')
            .map(block => {
                const trimmed = block.trim()
                if (!trimmed) return ''
                if (trimmed.startsWith('<')) return block
                return `<p>${block.replace(/\n/g, '<br>')}</p>`
            })
            .join('\n')

        return result
    }, [markdown])

    const sampleMarkdown = `# Sample Markdown Document

## Introduction

This is a **sample document** to demonstrate the Markdown to PDF converter. You can write your content here and export it as a PDF.

## Features

- Convert markdown text to PDF
- Upload markdown files
- Live preview
- Professional formatting

## Code Example

\`\`\`javascript
function greet(name) {
    console.log(\`Hello, \${name}!\`);
}
\`\`\`

## Quote

> "The best way to predict the future is to create it." - Peter Drucker

---

*Thank you for using our tool!*`

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                    Markdown to PDF Converter
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Convert Markdown text or files to downloadable PDF documents.
                </p>
            </div>

            {/* Mode Tabs */}
            <div className="flex gap-2 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                <button
                    onClick={() => setMode('paste')}
                    className={clsx(
                        'flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all',
                        mode === 'paste'
                            ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                    )}
                >
                    <Type className="h-4 w-4" />
                    Paste Text
                </button>
                <button
                    onClick={() => setMode('upload')}
                    className={clsx(
                        'flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all',
                        mode === 'upload'
                            ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                    )}
                >
                    <FileUp className="h-4 w-4" />
                    Upload File
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    <p>{error}</p>
                </div>
            )}

            {/* Paste Mode */}
            {mode === 'paste' && (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Markdown Input
                        </label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setMarkdown(sampleMarkdown)}
                                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                Load Sample
                            </button>
                            {markdown && (
                                <button
                                    onClick={reset}
                                    className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                    <textarea
                        value={markdown}
                        onChange={(e) => setMarkdown(e.target.value)}
                        placeholder="Paste your Markdown here..."
                        className="h-[300px] w-full rounded-lg border border-slate-200 bg-white p-4 font-mono text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                    />
                </div>
            )}

            {/* Upload Mode */}
            {mode === 'upload' && !markdown && (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={clsx(
                        'flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all',
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
                        accept=".md,.markdown,.txt,text/markdown,text/plain"
                        onChange={handleFileSelect}
                    />
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                        <Upload className="h-8 w-8" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-200">
                        Drop your Markdown file here
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        or click to browse (.md, .markdown, .txt)
                    </p>
                </div>
            )}

            {/* File Info (Upload Mode with content) */}
            {mode === 'upload' && markdown && fileName && (
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-medium text-slate-900 dark:text-slate-200">
                                {fileName}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {markdown.length.toLocaleString()} characters
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={reset}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        <Trash2 className="h-4 w-4" />
                        Remove
                    </button>
                </div>
            )}

            {/* Preview & Actions */}
            {markdown && (
                <div className="flex flex-col gap-6">
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={copyToClipboard}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            {copied ? 'Copied!' : 'Copy Markdown'}
                        </button>
                        <button
                            onClick={exportToPdf}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
                        >
                            <Download className="h-4 w-4" />
                            Export PDF
                        </button>
                    </div>

                    {/* Preview */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-500 dark:text-slate-400">
                            Preview
                        </label>
                        <div
                            ref={printRef}
                            className="markdown-preview min-h-[400px] overflow-auto rounded-lg border border-slate-200 bg-white p-6 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                            dangerouslySetInnerHTML={{ __html: previewHtml }}
                        />
                    </div>
                </div>
            )}

            <style jsx global>{`
                .markdown-preview h1 { font-size: 2em; font-weight: bold; margin: 0.67em 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.3em; }
                .dark .markdown-preview h1 { border-color: #334155; }
                .markdown-preview h2 { font-size: 1.5em; font-weight: bold; margin: 0.75em 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.3em; }
                .dark .markdown-preview h2 { border-color: #334155; }
                .markdown-preview h3 { font-size: 1.17em; font-weight: bold; margin: 0.83em 0; }
                .markdown-preview h4 { font-size: 1em; font-weight: bold; margin: 0.83em 0; }
                .markdown-preview p { margin: 1em 0; line-height: 1.6; }
                .markdown-preview ul, .markdown-preview ol { list-style-type: disc; padding-left: 2em; margin: 1em 0; }
                .markdown-preview ol { list-style-type: decimal; }
                .markdown-preview li { margin: 0.25em 0; }
                .markdown-preview strong { font-weight: bold; }
                .markdown-preview em { font-style: italic; }
                .markdown-preview code { 
                    background: #f1f5f9; 
                    padding: 0.2em 0.4em; 
                    border-radius: 3px; 
                    font-family: 'SF Mono', Monaco, Consolas, monospace;
                    font-size: 0.9em;
                }
                .dark .markdown-preview code { background: #1e293b; }
                .markdown-preview pre { 
                    background: #f1f5f9; 
                    padding: 1em; 
                    border-radius: 6px; 
                    overflow-x: auto; 
                    margin: 1em 0;
                }
                .dark .markdown-preview pre { background: #1e293b; }
                .markdown-preview pre code { background: none; padding: 0; }
                .markdown-preview blockquote {
                    border-left: 4px solid #3b82f6;
                    margin: 1em 0;
                    padding-left: 1em;
                    color: #4b5563;
                }
                .dark .markdown-preview blockquote { color: #9ca3af; }
                .markdown-preview hr {
                    border: none;
                    border-top: 2px solid #e2e8f0;
                    margin: 2em 0;
                }
                .dark .markdown-preview hr { border-color: #334155; }
                .markdown-preview a { color: #3b82f6; text-decoration: underline; }
                .markdown-preview img { max-width: 100%; height: auto; border-radius: 6px; }
            `}</style>
        </div>
    )
}
