'use client'

import { useState, useMemo } from 'react'
import { CopyButton } from '@/components/CopyButton'

const COMMIT_TYPES = [
    { type: 'feat', label: 'Feature', description: 'A new feature' },
    { type: 'fix', label: 'Bug Fix', description: 'A bug fix' },
    { type: 'docs', label: 'Documentation', description: 'Documentation only changes' },
    { type: 'style', label: 'Style', description: 'Changes that do not affect the meaning of the code' },
    { type: 'refactor', label: 'Refactor', description: 'A code change that neither fixes a bug nor adds a feature' },
    { type: 'perf', label: 'Performance', description: 'A code change that improves performance' },
    { type: 'test', label: 'Testing', description: 'Adding missing tests or correcting existing tests' },
    { type: 'chore', label: 'Chore', description: 'Changes to the build process or auxiliary tools' }
]

export default function AICommitGenerator() {
    const [diff, setDiff] = useState('')
    const [selectedType, setSelectedType] = useState('feat')
    const [scope, setScope] = useState('')
    const [subject, setSubject] = useState('')
    const [body, setBody] = useState('')
    const [isBreaking, setIsBreaking] = useState(false)

    const generatedCommit = useMemo(() => {
        if (!subject.trim()) return ''

        let message = `${selectedType}${scope ? `(${scope})` : ''}${isBreaking ? '!' : ''}: ${subject}`

        if (body.trim()) {
            message += `\n\n${body}`
        }

        if (isBreaking) {
            message += `\n\nBREAKING CHANGE: ${subject}`
        }

        return message
    }, [selectedType, scope, subject, body, isBreaking])

    return (
        <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex flex-col gap-6">
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-zinc-300">Changes / Git Diff</h3>
                        <textarea
                            value={diff}
                            onChange={(e) => setDiff(e.target.value)}
                            className="w-full h-48 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 font-mono text-xs focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/50 placeholder-zinc-600"
                            placeholder="Paste your git diff or a bulleted list of changes here..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider block mb-2">Type</label>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-sm focus:outline-none"
                            >
                                {COMMIT_TYPES.map(t => (
                                    <option key={t.type} value={t.type}>{t.type} - {t.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider block mb-2">Scope (optional)</label>
                            <input
                                type="text"
                                value={scope}
                                onChange={(e) => setScope(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-sm focus:outline-none"
                                placeholder="e.g. auth, api, ui"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider block mb-2">Subject (Short description)</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-sm focus:outline-none"
                            placeholder="What changed?"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="breaking"
                            checked={isBreaking}
                            onChange={(e) => setIsBreaking(e.target.checked)}
                            className="rounded border-zinc-800 bg-zinc-900 text-rose-600 focus:ring-rose-600"
                        />
                        <label htmlFor="breaking" className="text-xs text-rose-400 font-bold cursor-pointer">Breaking Change</label>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-zinc-300">Generated Commit Message</h3>
                        <CopyButton text={generatedCommit} />
                    </div>
                    <div className="flex-1 bg-zinc-900/30 rounded-2xl border border-zinc-800 p-6 flex flex-col">
                        <pre className="flex-1 text-sm font-mono text-zinc-300 p-6 bg-black/40 rounded-xl overflow-auto whitespace-pre-wrap">
                            {generatedCommit || 'Complete the subject to see the result...'}
                        </pre>
                        <p className="mt-4 text-[10px] text-zinc-500 text-center italic">
                            Follows Conventional Commits 1.0.0
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
