'use client'

import { useState, useEffect } from 'react'
import { CopyButton } from '@/components/CopyButton'

interface Example {
    id: string
    input: string
    output: string
}

export default function FewShotBuilder() {
    const [examples, setExamples] = useState<Example[]>([])
    const [currentInput, setCurrentInput] = useState('')
    const [currentOutput, setCurrentOutput] = useState('')
    const [format, setFormat] = useState<'openai' | 'anthropic' | 'plain'>('openai')

    useEffect(() => {
        const saved = localStorage.getItem('few-shot-examples')
        if (saved) {
            try {
                setExamples(JSON.parse(saved))
            } catch (e) {
                console.error('Failed to load examples:', e)
            }
        }
    }, [])

    const addExample = () => {
        if (!currentInput || !currentOutput) return
        const newExample: Example = {
            id: Date.now().toString(),
            input: currentInput,
            output: currentOutput,
        }
        const updated = [...examples, newExample]
        setExamples(updated)
        localStorage.setItem('few-shot-examples', JSON.stringify(updated))
        setCurrentInput('')
        setCurrentOutput('')
    }

    const removeExample = (id: string) => {
        const updated = examples.filter((e) => e.id !== id)
        setExamples(updated)
        localStorage.setItem('few-shot-examples', JSON.stringify(updated))
    }

    const generatePrompt = () => {
        if (format === 'openai') {
            const messages = examples.flatMap((ex) => [
                { role: 'user', content: ex.input },
                { role: 'assistant', content: ex.output },
            ])
            return JSON.stringify(messages, null, 2)
        } else if (format === 'anthropic') {
            const formatted = examples
                .map((ex) => `Human: ${ex.input}\n\nAssistant: ${ex.output}`)
                .join('\n\n')
            return formatted
        } else {
            return examples.map((ex, i) => `Example ${i + 1}:\nInput: ${ex.input}\nOutput: ${ex.output}`).join('\n\n')
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
                {/* Example Builder */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-zinc-200">Add Examples</h3>
                    <div className="space-y-3">
                        <div>
                            <label htmlFor="input" className="mb-2 block text-sm text-zinc-400">
                                Input
                            </label>
                            <textarea
                                id="input"
                                value={currentInput}
                                onChange={(e) => setCurrentInput(e.target.value)}
                                placeholder="Enter example input..."
                                className="h-24 w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-sm text-zinc-200 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="output" className="mb-2 block text-sm text-zinc-400">
                                Output
                            </label>
                            <textarea
                                id="output"
                                value={currentOutput}
                                onChange={(e) => setCurrentOutput(e.target.value)}
                                placeholder="Enter expected output..."
                                className="h-24 w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-sm text-zinc-200 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
                            />
                        </div>
                        <button
                            onClick={addExample}
                            disabled={!currentInput || !currentOutput}
                            className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Add Example
                        </button>
                    </div>

                    {/* Example List */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-zinc-300">Examples ({examples.length})</h4>
                        {examples.map((ex, i) => (
                            <div key={ex.id} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-xs font-medium text-zinc-400">Example {i + 1}</span>
                                    <button
                                        onClick={() => removeExample(ex.id)}
                                        className="text-xs text-red-400 hover:text-red-300"
                                    >
                                        Remove
                                    </button>
                                </div>
                                <div className="space-y-1 text-xs">
                                    <div className="text-zinc-500">Input: {ex.input.substring(0, 50)}...</div>
                                    <div className="text-zinc-500">Output: {ex.output.substring(0, 50)}...</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Generated Prompt */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="format" className="mb-2 block text-sm font-medium text-zinc-300">
                            Format
                        </label>
                        <select
                            id="format"
                            value={format}
                            onChange={(e) => setFormat(e.target.value as any)}
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none"
                        >
                            <option value="openai">OpenAI (JSON)</option>
                            <option value="anthropic">Anthropic (Text)</option>
                            <option value="plain">Plain Text</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-zinc-300">Generated Prompt</label>
                        <CopyButton text={generatePrompt()} />
                    </div>
                    <textarea
                        value={generatePrompt()}
                        readOnly
                        className="h-96 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 font-mono text-sm text-zinc-200 focus:outline-none"
                    />

                    <div className="rounded-lg border border-blue-500/20 bg-blue-950/10 p-3">
                        <p className="text-xs text-blue-300">
                            💡 <strong>Tip:</strong> Use 3-5 diverse examples for best results. Examples are saved locally.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
