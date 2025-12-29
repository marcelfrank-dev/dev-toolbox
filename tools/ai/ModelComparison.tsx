'use client'

import { useState } from 'react'

interface ModelSpec {
    name: string
    provider: string
    contextWindow: number
    maxOutput: number
    inputCost: number
    outputCost: number
    vision: boolean
    functionCalling: boolean
    json: boolean
}

const models: ModelSpec[] = [
    {
        name: 'GPT-4 Turbo',
        provider: 'OpenAI',
        contextWindow: 128000,
        maxOutput: 4096,
        inputCost: 0.01,
        outputCost: 0.03,
        vision: true,
        functionCalling: true,
        json: true,
    },
    {
        name: 'GPT-4',
        provider: 'OpenAI',
        contextWindow: 8192,
        maxOutput: 4096,
        inputCost: 0.03,
        outputCost: 0.06,
        vision: false,
        functionCalling: true,
        json: false,
    },
    {
        name: 'GPT-3.5 Turbo',
        provider: 'OpenAI',
        contextWindow: 16385,
        maxOutput: 4096,
        inputCost: 0.0005,
        outputCost: 0.0015,
        vision: false,
        functionCalling: true,
        json: true,
    },
    {
        name: 'Claude 3 Opus',
        provider: 'Anthropic',
        contextWindow: 200000,
        maxOutput: 4096,
        inputCost: 0.015,
        outputCost: 0.075,
        vision: true,
        functionCalling: false,
        json: false,
    },
    {
        name: 'Claude 3 Sonnet',
        provider: 'Anthropic',
        contextWindow: 200000,
        maxOutput: 4096,
        inputCost: 0.003,
        outputCost: 0.015,
        vision: true,
        functionCalling: false,
        json: false,
    },
    {
        name: 'Claude 3 Haiku',
        provider: 'Anthropic',
        contextWindow: 200000,
        maxOutput: 4096,
        inputCost: 0.00025,
        outputCost: 0.00125,
        vision: true,
        functionCalling: false,
        json: false,
    },
    {
        name: 'Gemini Pro',
        provider: 'Google',
        contextWindow: 32000,
        maxOutput: 8192,
        inputCost: 0.00025,
        outputCost: 0.0005,
        vision: false,
        functionCalling: true,
        json: true,
    },
]

export default function ModelComparison() {
    const [selectedModels, setSelectedModels] = useState<string[]>([models[0].name, models[3].name])
    const [tokenCount, setTokenCount] = useState(10000)

    const toggleModel = (modelName: string) => {
        if (selectedModels.includes(modelName)) {
            setSelectedModels(selectedModels.filter((m) => m !== modelName))
        } else {
            setSelectedModels([...selectedModels, modelName])
        }
    }

    const selectedSpecs = models.filter((m) => selectedModels.includes(m.name))

    return (
        <div className="space-y-6">
            {/* Model Selection */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-zinc-300">Select Models to Compare</label>
                <div className="flex flex-wrap gap-2">
                    {models.map((model) => (
                        <button
                            key={model.name}
                            onClick={() => toggleModel(model.name)}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${selectedModels.includes(model.name)
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                }`}
                        >
                            {model.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Cost Calculator */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                <label htmlFor="token-input" className="mb-2 block text-sm font-medium text-zinc-300">
                    Token Count for Cost Estimate
                </label>
                <input
                    id="token-input"
                    type="number"
                    value={tokenCount}
                    onChange={(e) => setTokenCount(parseInt(e.target.value) || 0)}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none"
                />
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto rounded-xl border border-zinc-800">
                <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-900/80 text-zinc-400">
                        <tr>
                            <th className="px-4 py-3 font-medium">Feature</th>
                            {selectedSpecs.map((model) => (
                                <th key={model.name} className="px-4 py-3 font-medium">
                                    {model.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        <tr className="hover:bg-zinc-800/30">
                            <td className="px-4 py-3 text-zinc-500">Provider</td>
                            {selectedSpecs.map((model) => (
                                <td key={model.name} className="px-4 py-3 text-zinc-200">
                                    {model.provider}
                                </td>
                            ))}
                        </tr>
                        <tr className="hover:bg-zinc-800/30">
                            <td className="px-4 py-3 text-zinc-500">Context Window</td>
                            {selectedSpecs.map((model) => (
                                <td key={model.name} className="px-4 py-3 font-mono text-zinc-200">
                                    {model.contextWindow.toLocaleString()}
                                </td>
                            ))}
                        </tr>
                        <tr className="hover:bg-zinc-800/30">
                            <td className="px-4 py-3 text-zinc-500">Max Output</td>
                            {selectedSpecs.map((model) => (
                                <td key={model.name} className="px-4 py-3 font-mono text-zinc-200">
                                    {model.maxOutput.toLocaleString()}
                                </td>
                            ))}
                        </tr>
                        <tr className="hover:bg-zinc-800/30">
                            <td className="px-4 py-3 text-zinc-500">Input Cost (per 1K)</td>
                            {selectedSpecs.map((model) => (
                                <td key={model.name} className="px-4 py-3 font-mono text-emerald-400">
                                    ${model.inputCost.toFixed(4)}
                                </td>
                            ))}
                        </tr>
                        <tr className="hover:bg-zinc-800/30">
                            <td className="px-4 py-3 text-zinc-500">Output Cost (per 1K)</td>
                            {selectedSpecs.map((model) => (
                                <td key={model.name} className="px-4 py-3 font-mono text-emerald-400">
                                    ${model.outputCost.toFixed(4)}
                                </td>
                            ))}
                        </tr>
                        <tr className="bg-emerald-950/20 hover:bg-emerald-950/30">
                            <td className="px-4 py-3 font-medium text-emerald-400">Est. Cost ({tokenCount} tokens)</td>
                            {selectedSpecs.map((model) => {
                                const cost = ((tokenCount / 1000) * (model.inputCost + model.outputCost)).toFixed(4)
                                return (
                                    <td key={model.name} className="px-4 py-3 font-mono font-bold text-emerald-300">
                                        ${cost}
                                    </td>
                                )
                            })}
                        </tr>
                        <tr className="hover:bg-zinc-800/30">
                            <td className="px-4 py-3 text-zinc-500">Vision</td>
                            {selectedSpecs.map((model) => (
                                <td key={model.name} className="px-4 py-3">
                                    {model.vision ? '✅' : '❌'}
                                </td>
                            ))}
                        </tr>
                        <tr className="hover:bg-zinc-800/30">
                            <td className="px-4 py-3 text-zinc-500">Function Calling</td>
                            {selectedSpecs.map((model) => (
                                <td key={model.name} className="px-4 py-3">
                                    {model.functionCalling ? '✅' : '❌'}
                                </td>
                            ))}
                        </tr>
                        <tr className="hover:bg-zinc-800/30">
                            <td className="px-4 py-3 text-zinc-500">JSON Mode</td>
                            {selectedSpecs.map((model) => (
                                <td key={model.name} className="px-4 py-3">
                                    {model.json ? '✅' : '❌'}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
