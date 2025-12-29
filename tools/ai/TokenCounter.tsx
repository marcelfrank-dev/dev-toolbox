'use client'

import { useState, useEffect } from 'react'
import { encode } from 'gpt-tokenizer'
import { CopyButton } from '@/components/CopyButton'

interface ModelInfo {
    name: string
    contextWindow: number
    costPer1kInput: number
    costPer1kOutput: number
}

const models: Record<string, ModelInfo> = {
    'gpt-4': { name: 'GPT-4', contextWindow: 8192, costPer1kInput: 0.03, costPer1kOutput: 0.06 },
    'gpt-4-32k': { name: 'GPT-4 32K', contextWindow: 32768, costPer1kInput: 0.06, costPer1kOutput: 0.12 },
    'gpt-4-turbo': { name: 'GPT-4 Turbo', contextWindow: 128000, costPer1kInput: 0.01, costPer1kOutput: 0.03 },
    'gpt-3.5-turbo': { name: 'GPT-3.5 Turbo', contextWindow: 16385, costPer1kInput: 0.0005, costPer1kOutput: 0.0015 },
    'claude-3-opus': { name: 'Claude 3 Opus', contextWindow: 200000, costPer1kInput: 0.015, costPer1kOutput: 0.075 },
    'claude-3-sonnet': { name: 'Claude 3 Sonnet', contextWindow: 200000, costPer1kInput: 0.003, costPer1kOutput: 0.015 },
    'claude-3-haiku': { name: 'Claude 3 Haiku', contextWindow: 200000, costPer1kInput: 0.00025, costPer1kOutput: 0.00125 },
}

export default function TokenCounter() {
    const [text, setText] = useState('')
    const [selectedModel, setSelectedModel] = useState('gpt-4-turbo')
    const [tokenCount, setTokenCount] = useState(0)
    const [charCount, setCharCount] = useState(0)

    useEffect(() => {
        setCharCount(text.length)
        try {
            const tokens = encode(text)
            setTokenCount(tokens.length)
        } catch (e) {
            console.error('Token encoding error:', e)
            setTokenCount(0)
        }
    }, [text])

    const model = models[selectedModel]
    const inputCost = (tokenCount / 1000) * model.costPer1kInput
    const outputCost = (tokenCount / 1000) * model.costPer1kOutput
    const percentOfContext = ((tokenCount / model.contextWindow) * 100).toFixed(2)

    return (
        <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                {/* Input Area */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="text-input" className="mb-2 block text-sm font-medium text-zinc-300">
                            Text to Analyze
                        </label>
                        <textarea
                            id="text-input"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Paste your text here to count tokens..."
                            className="h-96 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
                            <div className="text-xs text-zinc-500">Characters</div>
                            <div className="mt-1 text-2xl font-bold text-zinc-200">{charCount.toLocaleString()}</div>
                        </div>
                        <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-4">
                            <div className="text-xs text-emerald-400">Tokens</div>
                            <div className="mt-1 text-2xl font-bold text-emerald-300">{tokenCount.toLocaleString()}</div>
                        </div>
                        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
                            <div className="text-xs text-zinc-500">Chars/Token</div>
                            <div className="mt-1 text-2xl font-bold text-zinc-200">
                                {tokenCount > 0 ? (charCount / tokenCount).toFixed(2) : '0'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Model Selection & Stats */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="model-select" className="mb-2 block text-sm font-medium text-zinc-300">
                            Model
                        </label>
                        <select
                            id="model-select"
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        >
                            {Object.entries(models).map(([key, info]) => (
                                <option key={key} value={key}>
                                    {info.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                        <h3 className="text-sm font-medium text-zinc-300">Context Usage</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-zinc-500">Tokens Used</span>
                                <span className="font-mono text-zinc-300">{tokenCount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-zinc-500">Context Window</span>
                                <span className="font-mono text-zinc-300">{model.contextWindow.toLocaleString()}</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
                                    style={{ width: `${Math.min(parseFloat(percentOfContext), 100)}%` }}
                                />
                            </div>
                            <div className="text-right text-xs font-medium text-emerald-400">{percentOfContext}%</div>
                        </div>
                    </div>

                    <div className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                        <h3 className="text-sm font-medium text-zinc-300">Cost Estimate</h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-zinc-500">Input</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-sm text-zinc-300">${inputCost.toFixed(4)}</span>
                                    <CopyButton text={inputCost.toFixed(4)} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-zinc-500">Output</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-sm text-zinc-300">${outputCost.toFixed(4)}</span>
                                    <CopyButton text={outputCost.toFixed(4)} />
                                </div>
                            </div>
                            <div className="border-t border-zinc-800 pt-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-zinc-400">Total (Round Trip)</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-sm font-bold text-emerald-400">
                                            ${(inputCost + outputCost).toFixed(4)}
                                        </span>
                                        <CopyButton text={(inputCost + outputCost).toFixed(4)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-blue-500/20 bg-blue-950/10 p-3">
                        <p className="text-xs text-blue-300">
                            💡 <strong>Tip:</strong> Costs are estimates based on current pricing. Actual costs may vary.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
