'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

interface PromptSection {
    role: string
    context: string
    task: string
    format: string
    constraints: string
    examples: string
}

export default function PromptHelper() {
    const [sections, setSections] = useState<PromptSection>({
        role: '',
        context: '',
        task: '',
        format: '',
        constraints: '',
        examples: '',
    })

    const generatePrompt = () => {
        const parts: string[] = []

        if (sections.role) {
            parts.push(`You are ${sections.role}.`)
        }

        if (sections.context) {
            parts.push(`\nContext:\n${sections.context}`)
        }

        if (sections.task) {
            parts.push(`\nTask:\n${sections.task}`)
        }

        if (sections.format) {
            parts.push(`\nFormat:\n${sections.format}`)
        }

        if (sections.constraints) {
            parts.push(`\nConstraints:\n${sections.constraints}`)
        }

        if (sections.examples) {
            parts.push(`\nExamples:\n${sections.examples}`)
        }

        return parts.join('\n')
    }

    const tips = {
        role: 'Define who the AI should act as (e.g., "an expert Python developer", "a helpful teacher")',
        context: 'Provide background information needed to complete the task',
        task: 'Clearly state what you want the AI to do',
        format: 'Specify how you want the output formatted (e.g., "as a JSON object", "in bullet points")',
        constraints: 'Add any limitations or requirements (e.g., "use only standard library", "max 100 words")',
        examples: 'Provide examples of desired input/output pairs',
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
                {/* Input Sections */}
                <div className="space-y-4">
                    {Object.entries(sections).map(([key, value]) => (
                        <div key={key}>
                            <div className="mb-2 flex items-center justify-between">
                                <label htmlFor={key} className="text-sm font-medium capitalize text-zinc-300">
                                    {key}
                                </label>
                                <span className="text-xs text-zinc-500">{tips[key as keyof typeof tips]}</span>
                            </div>
                            <textarea
                                id={key}
                                value={value}
                                onChange={(e) => setSections({ ...sections, [key]: e.target.value })}
                                placeholder={`Enter ${key}...`}
                                className="h-24 w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-sm text-zinc-200 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
                            />
                        </div>
                    ))}
                </div>

                {/* Generated Prompt */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-zinc-300">Generated Prompt</label>
                        <CopyButton text={generatePrompt()} />
                    </div>
                    <textarea
                        value={generatePrompt()}
                        readOnly
                        className="h-[600px] w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 font-mono text-sm text-zinc-200 focus:outline-none"
                    />

                    <div className="space-y-2 rounded-lg border border-blue-500/20 bg-blue-950/10 p-3">
                        <p className="text-xs font-medium text-blue-300">Best Practices:</p>
                        <ul className="space-y-1 text-xs text-blue-200">
                            <li>• Be specific and clear in your task description</li>
                            <li>• Provide context to help the AI understand</li>
                            <li>• Specify the desired output format</li>
                            <li>• Use examples when possible</li>
                            <li>• Add constraints to guide the response</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
