'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

const SCENARIOS = [
    {
        id: 'undo',
        title: 'Undo Changes',
        options: [
            { label: 'Discard local changes in a file', cmd: 'git checkout -- <file>' },
            { label: 'Unstage a file (undo git add)', cmd: 'git reset HEAD <file>' },
            { label: 'Undo most recent commit (keep changes)', cmd: 'git reset --soft HEAD~1' },
            { label: 'Undo most recent commit (discard changes)', cmd: 'git reset --hard HEAD~1' },
            { label: 'Revert a public commit (safe)', cmd: 'git revert <commit-hash>' },
        ]
    },
    {
        id: 'branch',
        title: 'Branching & Merging',
        options: [
            { label: 'Create new branch and switch', cmd: 'git checkout -b <branch-name>' },
            { label: 'Delete a local branch', cmd: 'git branch -d <branch-name>' },
            { label: 'Delete a remote branch', cmd: 'git push origin --delete <branch-name>' },
            { label: 'Rename current branch', cmd: 'git branch -m <new-name>' },
            { label: 'Sync with remote (fetch & pull)', cmd: 'git fetch --all && git pull' },
        ]
    },
    {
        id: 'log',
        title: 'History & Logs',
        options: [
            { label: 'Pretty log graph', cmd: "git log --graph --oneline --decorate --all" },
            { label: 'Search commit messages', cmd: 'git log --grep="<term>"' },
            { label: 'Show who changed what line', cmd: 'git blame <file>' },
            { label: 'Show changes in a specific commit', cmd: 'git show <commit-hash>' },
        ]
    },
    {
        id: 'config',
        title: 'Configuration',
        options: [
            { label: 'Set global username', cmd: 'git config --global user.name "Your Name"' },
            { label: 'Set global email', cmd: 'git config --global user.email "you@example.com"' },
            { label: 'List all config', cmd: 'git config --list' },
            { label: 'Setup an alias (e.g., git co)', cmd: 'git config --global alias.co checkout' },
        ]
    }
]

export default function GitExplorer() {
    const [activeScenario, setActiveScenario] = useState(SCENARIOS[0])

    return (
        <div className="grid gap-8 md:grid-cols-[200px_1fr] min-h-[500px]">
            {/* Sidebar */}
            <div className="flex flex-col gap-2">
                {SCENARIOS.map(s => (
                    <button
                        key={s.id}
                        onClick={() => setActiveScenario(s)}
                        className={`px-4 py-3 rounded-xl text-left text-sm font-medium transition-all ${activeScenario.id === s.id
                                ? 'bg-zinc-800 text-white shadow-lg'
                                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
                            }`}
                    >
                        {s.title}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold text-zinc-100 mb-4 px-2">{activeScenario.title}</h2>
                <div className="space-y-4">
                    {activeScenario.options.map((opt, i) => (
                        <div key={i} className="group p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-zinc-400 text-sm">{opt.label}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <code className="flex-1 bg-black/30 p-3 rounded-lg font-mono text-sm text-emerald-400 overflow-x-auto">
                                    {opt.cmd}
                                </code>
                                <CopyButton text={opt.cmd} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
