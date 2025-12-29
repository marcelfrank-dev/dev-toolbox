'use client'

import { useState, useRef, useEffect } from 'react'
import { Highlight, themes, type Language } from 'prism-react-renderer'
import { toPng } from 'html-to-image'
import { CopyButton } from '@/components/CopyButton'

// Map some common languages
const LANGUAGES = [
    'javascript',
    'typescript',
    'jsx',
    'tsx',
    'python',
    'css',
    'json',
    'bash',
    'html',
    'sql',
    'go',
    'rust',
]

const COLORS = [
    'from-pink-500 via-red-500 to-yellow-500',
    'from-green-300 via-blue-500 to-purple-600',
    'from-indigo-400 to-cyan-400',
    'from-gray-900 to-gray-600',
    'bg-zinc-800', // Solid
]

export default function CodeToImage() {
    const [code, setCode] = useState(`function hello() {
  console.log("Hello, World!");
}`)
    const [language, setLanguage] = useState('javascript')
    const [background, setBackground] = useState(COLORS[0])
    const [padding, setPadding] = useState(64)
    const [exported, setExported] = useState(false)

    const editorRef = useRef<HTMLDivElement>(null)

    const handleExport = async () => {
        if (editorRef.current) {
            try {
                const dataUrl = await toPng(editorRef.current, { cacheBust: true, pixelRatio: 2 })
                const link = document.createElement('a')
                link.download = 'code-snippet.png'
                link.href = dataUrl
                link.click()
                setExported(true)
                setTimeout(() => setExported(false), 2000)
            } catch (err) {
                console.error('Failed to export image', err)
            }
        }
    }

    return (
        <div className="flex flex-col gap-8">
            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 backdrop-blur-sm">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Language Selector */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-zinc-400">Lang</label>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="rounded-lg border border-zinc-700 bg-zinc-800 py-1 px-2 text-sm text-zinc-200 focus:outline-none"
                        >
                            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>

                    {/* Padding */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-zinc-400">Padding</label>
                        <input
                            type="range"
                            min="16"
                            max="128"
                            value={padding}
                            onChange={(e) => setPadding(Number(e.target.value))}
                            className="w-24 accent-emerald-500"
                        />
                    </div>

                    {/* Theme Colors */}
                    <div className="flex items-center gap-2">
                        {COLORS.map((bg, i) => (
                            <button
                                key={i}
                                onClick={() => setBackground(bg)}
                                className={`w-6 h-6 rounded-full border-2 transition-all ${bg.includes('gradient') ? 'bg-gradient-to-br' : ''} ${bg} ${background === bg ? 'border-white scale-110' : 'border-transparent'}`}
                            />
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleExport}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition-all hover:bg-emerald-500 hover:shadow-emerald-900/40 active:translate-y-0.5"
                >
                    {exported ? 'Downloaded!' : 'Export PNG'}
                </button>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Editor (Text Area) */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Source Code</label>
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="h-[400px] w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 font-mono text-sm text-zinc-300 placeholder-zinc-700 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        spellCheck={false}
                    />
                </div>

                {/* Preview Area */}
                <div className="flex flex-col gap-2 overflow-hidden">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Preview</label>
                    <div className="flex-1 overflow-auto rounded-xl border border-zinc-800 bg-zinc-950">
                        <div
                            ref={editorRef}
                            className={`min-w-full min-h-[400px] flex items-center justify-center transition-all ${background.includes('gradient') ? 'bg-gradient-to-br' : ''} ${background}`}
                            style={{ padding: `${padding}px` }}
                        >
                            <div className="relative min-w-[300px] rounded-xl overflow-hidden shadow-2xl bg-[#1e1e1e]/90 backdrop-blur-sm border border-white/5">
                                {/* Window Controls */}
                                <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5">
                                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                                    <div className="w-3 h-3 rounded-full bg-green-400/80" />
                                </div>

                                {/* Code Highlight */}
                                <Highlight
                                    theme={themes.vsDark}
                                    code={code}
                                    language={language as Language}
                                >
                                    {({ className, style, tokens, getLineProps, getTokenProps }) => (
                                        <pre className="p-6 overflow-auto text-sm font-mono leading-relaxed" style={{ ...style, background: 'transparent' }}>
                                            {tokens.map((line, i) => (
                                                <div key={i} {...getLineProps({ line })}>
                                                    <span className="inline-block w-8 select-none text-zinc-600 text-right mr-4 text-xs">{i + 1}</span>
                                                    {line.map((token, key) => (
                                                        <span key={key} {...getTokenProps({ token })} />
                                                    ))}
                                                </div>
                                            ))}
                                        </pre>
                                    )}
                                </Highlight>
                                <div className="absolute bottom-2 right-4 text-[10px] text-white/20 font-sans tracking-widest font-bold uppercase">Dev Toolbox</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
