'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, Download, FileText, Trash2, AlertTriangle, X, Type, FileUp } from 'lucide-react'
import { CopyButton } from '@/components/CopyButton'

interface LessFile {
    id: string
    name: string
    content: string
}

interface ImportInfo {
    fileName: string
    line: number
    resolved: boolean
}

export default function LessToCss() {
    const [mode, setMode] = useState<'paste' | 'upload'>('paste')
    const [lessInput, setLessInput] = useState('')
    const [files, setFiles] = useState<LessFile[]>([])
    const [cssOutput, setCssOutput] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [imports, setImports] = useState<ImportInfo[]>([])
    const [isCompiling, setIsCompiling] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Parse @import statements from LESS content
    const parseImports = useCallback((content: string, fileName: string): ImportInfo[] => {
        const importRegex = /@import\s+(?:\([^)]*\)\s*)?["']([^"']+)["']/g
        const foundImports: ImportInfo[] = []
        let match
        let lineNumber = 1

        const lines = content.split('\n')
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]
            importRegex.lastIndex = 0
            while ((match = importRegex.exec(line)) !== null) {
                foundImports.push({
                    fileName: match[1],
                    line: i + 1,
                    resolved: false,
                })
            }
        }

        return foundImports
    }, [])

    // Check if imports are resolved by uploaded files
    const checkImportResolution = useCallback((allFiles: LessFile[], allImports: ImportInfo[]): ImportInfo[] => {
        const fileNames = new Set(allFiles.map(f => {
            // Handle both with and without extension
            const name = f.name.toLowerCase()
            return [name, name.replace(/\.less$/, '')]
        }).flat())

        return allImports.map(imp => ({
            ...imp,
            resolved: fileNames.has(imp.fileName.toLowerCase()) ||
                fileNames.has(imp.fileName.toLowerCase().replace(/\.less$/, ''))
        }))
    }, [])

    // Compile LESS to CSS
    const compile = useCallback(async () => {
        setIsCompiling(true)
        setError(null)
        setCssOutput('')

        try {
            // Dynamic import of less
            const less = (await import('less')).default

            let lessContent = ''
            let allImports: ImportInfo[] = []

            if (mode === 'paste') {
                lessContent = lessInput
                allImports = parseImports(lessInput, 'input')
            } else {
                // Combine all files in order
                // Earlier files' variables will be available to later files
                lessContent = files.map(f => `/* === ${f.name} === */\n${f.content}`).join('\n\n')

                // Collect all imports
                files.forEach(f => {
                    allImports.push(...parseImports(f.content, f.name))
                })
            }

            if (!lessContent.trim()) {
                setError('Please enter some LESS code to convert.')
                setIsCompiling(false)
                return
            }

            // Check import resolution
            const checkedImports = mode === 'upload'
                ? checkImportResolution(files, allImports)
                : allImports.map(imp => ({ ...imp, resolved: false }))
            setImports(checkedImports)

            // Compile LESS to CSS
            const result = await less.render(lessContent, {
                // Disable file imports since we're processing in browser
                javascriptEnabled: false,
            })

            setCssOutput(result.css)
        } catch (err: any) {
            const errorMessage = err.message || 'Unknown compilation error'
            const lineInfo = err.line ? ` (line ${err.line})` : ''
            setError(`Compilation Error${lineInfo}: ${errorMessage}`)
        } finally {
            setIsCompiling(false)
        }
    }, [mode, lessInput, files, parseImports, checkImportResolution])

    // Handle file upload
    const handleFileSelect = useCallback((selectedFiles: FileList) => {
        const newFiles: LessFile[] = []
        const readPromises: Promise<void>[] = []

        Array.from(selectedFiles).forEach(file => {
            if (file.name.endsWith('.less') || file.name.endsWith('.css')) {
                const promise = file.text().then(content => {
                    newFiles.push({
                        id: `${file.name}-${Date.now()}-${Math.random()}`,
                        name: file.name,
                        content,
                    })
                })
                readPromises.push(promise)
            }
        })

        Promise.all(readPromises).then(() => {
            setFiles(prev => [...prev, ...newFiles])
            setError(null)
        })
    }, [])

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
        if (e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files)
        }
    }

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id))
    }

    const moveFile = (index: number, direction: 'up' | 'down') => {
        const newFiles = [...files]
        const newIndex = direction === 'up' ? index - 1 : index + 1
        if (newIndex >= 0 && newIndex < files.length) {
            [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]]
            setFiles(newFiles)
        }
    }

    const reset = () => {
        setLessInput('')
        setFiles([])
        setCssOutput('')
        setError(null)
        setImports([])
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const downloadCss = () => {
        if (!cssOutput) return
        const blob = new Blob([cssOutput], { type: 'text/css' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = mode === 'upload' && files.length > 0
            ? files[0].name.replace(/\.less$/, '.css')
            : 'output.css'
        a.click()
        URL.revokeObjectURL(url)
    }

    const sampleLess = `// Variables
@primary-color: #4CAF50;
@secondary-color: #2196F3;
@font-stack: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
@border-radius: 8px;

// Mixins
.rounded(@radius: @border-radius) {
  border-radius: @radius;
  -webkit-border-radius: @radius;
  -moz-border-radius: @radius;
}

.shadow(@offset: 0 2px 4px, @color: rgba(0,0,0,0.1)) {
  box-shadow: @offset @color;
}

// Nesting Example
.button {
  display: inline-flex;
  align-items: center;
  padding: 12px 24px;
  font-family: @font-stack;
  font-size: 14px;
  font-weight: 500;
  color: white;
  background-color: @primary-color;
  border: none;
  cursor: pointer;
  .rounded();
  .shadow();
  
  &:hover {
    background-color: darken(@primary-color, 10%);
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  &--secondary {
    background-color: @secondary-color;
    
    &:hover {
      background-color: darken(@secondary-color, 10%);
    }
  }
  
  .icon {
    margin-right: 8px;
    width: 16px;
    height: 16px;
  }
}`

    const unresolvedImports = imports.filter(imp => !imp.resolved)

    return (
        <div className="space-y-6">
            {/* Mode Tabs */}
            <div className="flex rounded-lg bg-zinc-800/50 p-1">
                <button
                    onClick={() => { setMode('paste'); setFiles([]); setCssOutput(''); setError(null); }}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${mode === 'paste'
                            ? 'bg-zinc-700 text-zinc-100 shadow-sm'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                >
                    <Type className="h-4 w-4" />
                    Paste LESS
                </button>
                <button
                    onClick={() => { setMode('upload'); setLessInput(''); setCssOutput(''); setError(null); }}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${mode === 'upload'
                            ? 'bg-zinc-700 text-zinc-100 shadow-sm'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                >
                    <FileUp className="h-4 w-4" />
                    Upload Files
                </button>
            </div>

            {/* Paste Mode */}
            {mode === 'paste' && (
                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <label className="text-sm font-medium text-zinc-400">LESS Input</label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setLessInput(sampleLess)}
                                className="text-sm text-emerald-500 hover:text-emerald-400"
                            >
                                Load Sample
                            </button>
                            {lessInput && (
                                <button
                                    onClick={() => { setLessInput(''); setCssOutput(''); setError(null); }}
                                    className="text-sm text-zinc-500 hover:text-zinc-300"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                    <textarea
                        value={lessInput}
                        onChange={(e) => setLessInput(e.target.value)}
                        placeholder="Paste your LESS code here..."
                        className="h-64 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
                    />
                </div>
            )}

            {/* Upload Mode */}
            {mode === 'upload' && (
                <div className="space-y-4">
                    {/* Drop Zone */}
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all ${isDragging
                                ? 'border-emerald-500 bg-emerald-500/10'
                                : 'border-zinc-700 hover:border-zinc-500 bg-zinc-800/30'
                            }`}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".less,.css"
                            multiple
                            onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                        />
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                            <Upload className="h-6 w-6" />
                        </div>
                        <h3 className="mt-3 text-sm font-medium text-zinc-200">
                            Drop your LESS files here
                        </h3>
                        <p className="mt-1 text-xs text-zinc-500">
                            or click to browse (.less, .css)
                        </p>
                    </div>

                    {/* File List */}
                    {files.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-zinc-400">
                                    Uploaded Files ({files.length})
                                </label>
                                <button
                                    onClick={() => { setFiles([]); setCssOutput(''); setError(null); }}
                                    className="text-sm text-zinc-500 hover:text-zinc-300"
                                >
                                    Clear All
                                </button>
                            </div>
                            <p className="text-xs text-zinc-500">
                                Files are compiled in order. Drag to reorder if needed (variables from earlier files are available to later files).
                            </p>
                            <div className="space-y-1">
                                {files.map((file, index) => (
                                    <div
                                        key={file.id}
                                        className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col gap-0.5">
                                                <button
                                                    onClick={() => moveFile(index, 'up')}
                                                    disabled={index === 0}
                                                    className="text-zinc-500 hover:text-zinc-300 disabled:opacity-30"
                                                >
                                                    ▲
                                                </button>
                                                <button
                                                    onClick={() => moveFile(index, 'down')}
                                                    disabled={index === files.length - 1}
                                                    className="text-zinc-500 hover:text-zinc-300 disabled:opacity-30"
                                                >
                                                    ▼
                                                </button>
                                            </div>
                                            <FileText className="h-4 w-4 text-emerald-500" />
                                            <div>
                                                <span className="text-sm text-zinc-200">{file.name}</span>
                                                <span className="ml-2 text-xs text-zinc-500">
                                                    {file.content.length.toLocaleString()} chars
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFile(file.id)}
                                            className="p-1 text-zinc-500 hover:text-red-400"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Unresolved Imports Warning */}
            {unresolvedImports.length > 0 && (
                <div className="rounded-lg border border-yellow-600/50 bg-yellow-500/10 p-4">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-medium text-yellow-500">Missing Imports</h4>
                            <p className="mt-1 text-xs text-yellow-500/80">
                                The following imports could not be resolved. Upload these files or the compiled CSS may be incomplete.
                            </p>
                            <ul className="mt-2 space-y-1">
                                {unresolvedImports.map((imp, i) => (
                                    <li key={i} className="text-xs text-yellow-500/80 font-mono">
                                        • {imp.fileName} (line {imp.line})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Compile Button */}
            <div className="flex gap-2">
                <button
                    onClick={compile}
                    disabled={isCompiling || (mode === 'paste' ? !lessInput.trim() : files.length === 0)}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isCompiling ? 'Compiling...' : 'Convert to CSS'}
                </button>
                {(lessInput || files.length > 0 || cssOutput) && (
                    <button
                        onClick={reset}
                        className="inline-flex items-center gap-2 rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-600"
                    >
                        <Trash2 className="h-4 w-4" />
                        Reset All
                    </button>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-lg border border-red-600/50 bg-red-500/10 p-4">
                    <p className="font-mono text-sm text-red-400 whitespace-pre-wrap">{error}</p>
                </div>
            )}

            {/* CSS Output */}
            {cssOutput && (
                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <label className="text-sm font-medium text-zinc-400">CSS Output</label>
                        <div className="flex items-center gap-2">
                            <CopyButton text={cssOutput} />
                            <button
                                onClick={downloadCss}
                                className="inline-flex items-center gap-1 rounded bg-zinc-700 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-600"
                            >
                                <Download className="h-3 w-3" />
                                Download
                            </button>
                        </div>
                    </div>
                    <textarea
                        value={cssOutput}
                        readOnly
                        className="h-64 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-emerald-400 focus:outline-none"
                    />
                </div>
            )}
        </div>
    )
}
