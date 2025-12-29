'use client'

import { useState, useEffect } from 'react'
import { CopyButton } from '@/components/CopyButton'
import { useToast } from '@/components/Toast'

interface Template {
    id: string
    name: string
    content: string
    variables: string[]
}

const defaultTemplates: Template[] = [
    {
        id: 'code-review',
        name: 'Code Review',
        content: `Review the following {{language}} code and provide feedback on:
- Code quality and best practices
- Potential bugs or issues
- Performance optimizations
- Security concerns

Code:
{{code}}`,
        variables: ['language', 'code'],
    },
    {
        id: 'explain-code',
        name: 'Explain Code',
        content: `Explain what this {{language}} code does in simple terms:

{{code}}

Please include:
1. Overall purpose
2. Step-by-step breakdown
3. Key concepts used`,
        variables: ['language', 'code'],
    },
    {
        id: 'bug-fix',
        name: 'Bug Fix Request',
        content: `I'm experiencing the following issue in my {{language}} code:

Problem: {{problem}}

Code:
{{code}}

Expected behavior: {{expected}}
Actual behavior: {{actual}}

Please help me identify and fix the bug.`,
        variables: ['language', 'problem', 'code', 'expected', 'actual'],
    },
    {
        id: 'refactor',
        name: 'Refactoring Request',
        content: `Please refactor this {{language}} code to improve:
- {{improvement_area}}

Current code:
{{code}}

Requirements:
- Maintain the same functionality
- Follow {{language}} best practices
- Add comments explaining changes`,
        variables: ['language', 'improvement_area', 'code'],
    },
]

export default function PromptTemplateGenerator() {
    const [templates, setTemplates] = useState<Template[]>(defaultTemplates)
    const [selectedTemplate, setSelectedTemplate] = useState<Template>(defaultTemplates[0])
    const [variables, setVariables] = useState<Record<string, string>>({})
    const [output, setOutput] = useState('')
    const { showToast } = useToast()

    useEffect(() => {
        // Load custom templates from localStorage
        const saved = localStorage.getItem('ai-prompt-templates')
        if (saved) {
            try {
                const custom = JSON.parse(saved)
                setTemplates([...defaultTemplates, ...custom])
            } catch (e) {
                console.error('Failed to load templates:', e)
            }
        }
    }, [])

    useEffect(() => {
        // Initialize variables for selected template
        const newVars: Record<string, string> = {}
        selectedTemplate.variables.forEach((v) => {
            newVars[v] = variables[v] || ''
        })
        setVariables(newVars)
    }, [selectedTemplate])

    useEffect(() => {
        // Generate output by replacing variables
        let result = selectedTemplate.content
        Object.entries(variables).forEach(([key, value]) => {
            result = result.replace(new RegExp(`{{${key}}}`, 'g'), value)
        })
        setOutput(result)
    }, [variables, selectedTemplate])

    const saveCustomTemplate = () => {
        const name = prompt('Enter template name:')
        if (!name) return

        const content = prompt('Enter template content (use {{variable}} for placeholders):')
        if (!content) return

        const varMatches = content.match(/{{([^}]+)}}/g)
        const vars = varMatches ? varMatches.map((v) => v.slice(2, -2)) : []

        const newTemplate: Template = {
            id: `custom-${Date.now()}`,
            name,
            content,
            variables: vars,
        }

        const customTemplates = templates.filter((t) => t.id.startsWith('custom-'))
        customTemplates.push(newTemplate)
        localStorage.setItem('ai-prompt-templates', JSON.stringify(customTemplates))

        setTemplates([...defaultTemplates, ...customTemplates])
        setSelectedTemplate(newTemplate)
        showToast('Template saved!', 'success')
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
                {/* Template Selection */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="template-select" className="mb-2 block text-sm font-medium text-zinc-300">
                            Template
                        </label>
                        <select
                            id="template-select"
                            value={selectedTemplate.id}
                            onChange={(e) => {
                                const template = templates.find((t) => t.id === e.target.value)
                                if (template) setSelectedTemplate(template)
                            }}
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none"
                        >
                            {templates.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={saveCustomTemplate}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
                    >
                        + New Template
                    </button>

                    {/* Variables */}
                    <div className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                        <h3 className="text-sm font-medium text-zinc-300">Variables</h3>
                        {selectedTemplate.variables.map((variable) => (
                            <div key={variable}>
                                <label htmlFor={variable} className="mb-1 block text-xs text-zinc-500">
                                    {variable}
                                </label>
                                <input
                                    id={variable}
                                    type="text"
                                    value={variables[variable] || ''}
                                    onChange={(e) => setVariables({ ...variables, [variable]: e.target.value })}
                                    placeholder={`Enter ${variable}...`}
                                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-2 text-sm text-zinc-200 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Output */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-zinc-300">Generated Prompt</label>
                        <CopyButton text={output} />
                    </div>
                    <textarea
                        value={output}
                        readOnly
                        className="h-96 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 font-mono text-sm text-zinc-200 focus:outline-none"
                    />
                    <div className="rounded-lg border border-blue-500/20 bg-blue-950/10 p-3">
                        <p className="text-xs text-blue-300">
                            💡 <strong>Tip:</strong> Fill in all variables to generate a complete prompt. Templates are saved locally.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
