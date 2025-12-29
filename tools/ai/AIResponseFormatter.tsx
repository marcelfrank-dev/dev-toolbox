'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

export default function AIResponseFormatter() {
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')

    const extractCodeBlocks = () => {
        const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
        const matches = [...input.matchAll(codeBlockRegex)]

        if (matches.length === 0) {
            setOutput('No code blocks found')
            return
        }

        const extracted = matches
            .map((match, i) => {
                const lang = match[1] || 'text'
                const code = match[2].trim()
                return `// Block ${i + 1} (${lang})\n${code}`
            })
            .join('\n\n---\n\n')

        setOutput(extracted)
    }

    const removeMarkdown = () => {
        let cleaned = input
        // Remove code block markers
        cleaned = cleaned.replace(/```[\w]*\n?/g, '')
        // Remove bold/italic
        cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1')
        cleaned = cleaned.replace(/\*([^*]+)\*/g, '$1')
        // Remove inline code
        cleaned = cleaned.replace(/`([^`]+)`/g, '$1')
        setOutput(cleaned.trim())
    }

    const extractFirstCode = () => {
        const match = input.match(/```[\w]*\n([\s\S]*?)```/)
        if (match) {
            setOutput(match[1].trim())
        } else {
            setOutput('No code block found')
        }
    }

    const cleanFormatting = () => {
        let cleaned = input
        // Remove extra newlines
        cleaned = cleaned.replace(/\n{3,}/g, '\n\n')
        // Trim lines
        cleaned = cleaned.split('\n').map(line => line.trim()).join('\n')
        setOutput(cleaned.trim())
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Input */}
                <div className="space-y-4">
                    <label htmlFor="ai-response" className="block text-sm font-medium text-zinc-300">
                        AI Response
                    </label>
                    <textarea
                        id="ai-response"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Paste AI response here..."
                        className="h-96 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
                    />

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={extractCodeBlocks}
                            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
                        >
                            Extract All Code
                        </button>
                        <button
                            onClick={extractFirstCode}
                            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
                        >
                            Extract First Block
                        </button>
                        <button
                            onClick={removeMarkdown}
                            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
                        >
                            Remove Markdown
                        </button>
                        <button
                            onClick={cleanFormatting}
                            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
                        >
                            Clean Formatting
                        </button>
                    </div>
                </div>

                {/* Output */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-zinc-300">Formatted Output</label>
                        <CopyButton text={output} />
                    </div>
                    <textarea
                        value={output}
                        readOnly
                        className="h-96 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 font-mono text-sm text-zinc-200 focus:outline-none"
                    />
                    <div className="rounded-lg border border-blue-500/20 bg-blue-950/10 p-3">
                        <p className="text-xs text-blue-300">
                            💡 <strong>Tip:</strong> Use "Extract All Code" to get all code blocks, or "Extract First Block" for just the first one.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
