'use client'

import { useState, useMemo } from 'react'
import { CopyButton } from '@/components/CopyButton'

const PERSONAS = [
    { id: 'expert', name: 'Expert Consultant', description: 'Deep domain knowledge, professional and analytical' },
    { id: 'teacher', name: 'Supportive Teacher', description: 'Explains concepts simply with examples' },
    { id: 'creative', name: 'Creative Writer', description: 'Focuses on narrative, tone, and engagement' },
    { id: 'critic', name: 'Critical Reviewer', description: 'Finds flaws, suggests improvements, and explores edge cases' }
]

const OUTPUT_FORMATS = [
    'Markdown Table',
    'Step-by-Step Guide',
    'Summary + Detail',
    'Bullet Points',
    'Scientific Report'
]

export default function AIPromptOptimizer() {
    const [basePrompt, setBasePrompt] = useState('')
    const [selectedPersona, setSelectedPersona] = useState(PERSONAS[0].id)
    const [format, setFormat] = useState(OUTPUT_FORMATS[1])
    const [context, setContext] = useState('')
    const [includeNegativeConstraints, setIncludeNegativeConstraints] = useState(true)

    const optimizedPrompt = useMemo(() => {
        if (!basePrompt.trim()) return ''

        const persona = PERSONAS.find(p => p.id === selectedPersona)

        let prompt = `Act as a ${persona?.name}. ${persona?.description}. \n\n`

        if (context.trim()) {
            prompt += `### BACKGROUND CONTEXT\n${context}\n\n`
        }

        prompt += `### MAIN TASK\n${basePrompt}\n\n`
        prompt += `### OUTPUT FORMAT\nPlease provide the output as a ${format}.\n\n`

        if (includeNegativeConstraints) {
            prompt += `### CONSTRAINTS\n- Do not be repetitive.\n- Avoid unnecessary jargon.\n- Be concise but thorough.\n- If you are unsure, state your uncertainty clearly.\n`
        }

        prompt += `\n### FINAL INSTRUCTION\nReview your response against the persona of a ${persona?.name} before finalizing.`

        return prompt
    }, [basePrompt, selectedPersona, format, context, includeNegativeConstraints])

    return (
        <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex flex-col gap-6">
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-zinc-300">Base Prompt</h3>
                        <textarea
                            value={basePrompt}
                            onChange={(e) => setBasePrompt(e.target.value)}
                            className="w-full h-32 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 font-sans text-sm focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/50 placeholder-zinc-600"
                            placeholder="e.g., Explain how a database index works..."
                        />
                    </div>

                    <div className="space-y-6 bg-zinc-900/20 p-6 rounded-2xl border border-zinc-800">
                        <div>
                            <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider block mb-3">Target Persona</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {PERSONAS.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => setSelectedPersona(p.id)}
                                        className={`text-left p-3 rounded-xl border transition-all ${selectedPersona === p.id
                                                ? 'bg-violet-600/10 border-violet-500/50 text-violet-100'
                                                : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                                            }`}
                                    >
                                        <div className="text-sm font-bold">{p.name}</div>
                                        <div className="text-[10px] opacity-60 leading-tight mt-1">{p.description}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider block mb-3">Additional Context</label>
                            <textarea
                                value={context}
                                onChange={(e) => setContext(e.target.value)}
                                className="w-full h-20 bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-sm focus:border-violet-500/50 focus:outline-none"
                                placeholder="Specific industry, audience, or prior work..."
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider block mb-1">Output Format</label>
                                <select
                                    value={format}
                                    onChange={(e) => setFormat(e.target.value)}
                                    className="bg-zinc-900 border border-zinc-800 rounded-lg py-1.5 px-3 text-sm focus:outline-none"
                                >
                                    {OUTPUT_FORMATS.map(f => (
                                        <option key={f} value={f}>{f}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="constraints"
                                    checked={includeNegativeConstraints}
                                    onChange={(e) => setIncludeNegativeConstraints(e.target.checked)}
                                    className="rounded border-zinc-800 bg-zinc-900 text-violet-600 focus:ring-violet-600"
                                />
                                <label htmlFor="constraints" className="text-xs text-zinc-400 cursor-pointer">Add Constraints</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-zinc-300">Optimized Mega-Prompt</h3>
                        <CopyButton text={optimizedPrompt} />
                    </div>
                    <div className="flex-1 min-h-[400px] relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-emerald-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                        <pre className="relative h-full w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-sm font-mono text-zinc-300 whitespace-pre-wrap overflow-y-auto overflow-x-hidden">
                            {optimizedPrompt || 'Start typing your base prompt to see the magic...'}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    )
}
