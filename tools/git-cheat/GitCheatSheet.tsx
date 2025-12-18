'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

interface GitCommand {
  category: string
  command: string
  description: string
  example?: string
}

const gitCommands: GitCommand[] = [
  {
    category: 'Setup',
    command: 'git config --global user.name "Your Name"',
    description: 'Set your name',
  },
  {
    category: 'Setup',
    command: 'git config --global user.email "your.email@example.com"',
    description: 'Set your email',
  },
  {
    category: 'Setup',
    command: 'git init',
    description: 'Initialize a new repository',
  },
  {
    category: 'Setup',
    command: 'git clone <url>',
    description: 'Clone a repository',
    example: 'git clone https://github.com/user/repo.git',
  },
  {
    category: 'Basic',
    command: 'git status',
    description: 'Check status of working directory',
  },
  {
    category: 'Basic',
    command: 'git add <file>',
    description: 'Stage a file',
    example: 'git add index.html',
  },
  {
    category: 'Basic',
    command: 'git add .',
    description: 'Stage all changes',
  },
  {
    category: 'Basic',
    command: 'git commit -m "message"',
    description: 'Commit staged changes',
    example: 'git commit -m "Add new feature"',
  },
  {
    category: 'Basic',
    command: 'git log',
    description: 'View commit history',
  },
  {
    category: 'Basic',
    command: 'git diff',
    description: 'Show unstaged changes',
  },
  {
    category: 'Branching',
    command: 'git branch',
    description: 'List all branches',
  },
  {
    category: 'Branching',
    command: 'git branch <name>',
    description: 'Create a new branch',
    example: 'git branch feature/new-feature',
  },
  {
    category: 'Branching',
    command: 'git checkout <branch>',
    description: 'Switch to a branch',
    example: 'git checkout main',
  },
  {
    category: 'Branching',
    command: 'git checkout -b <branch>',
    description: 'Create and switch to a new branch',
    example: 'git checkout -b feature/new-feature',
  },
  {
    category: 'Branching',
    command: 'git merge <branch>',
    description: 'Merge a branch into current branch',
    example: 'git merge feature/new-feature',
  },
  {
    category: 'Remote',
    command: 'git remote -v',
    description: 'List remote repositories',
  },
  {
    category: 'Remote',
    command: 'git remote add <name> <url>',
    description: 'Add a remote repository',
    example: 'git remote add origin https://github.com/user/repo.git',
  },
  {
    category: 'Remote',
    command: 'git push <remote> <branch>',
    description: 'Push commits to remote',
    example: 'git push origin main',
  },
  {
    category: 'Remote',
    command: 'git pull <remote> <branch>',
    description: 'Pull changes from remote',
    example: 'git pull origin main',
  },
  {
    category: 'Remote',
    command: 'git fetch',
    description: 'Download changes without merging',
  },
  {
    category: 'Undo',
    command: 'git restore <file>',
    description: 'Discard changes in working directory',
    example: 'git restore index.html',
  },
  {
    category: 'Undo',
    command: 'git restore --staged <file>',
    description: 'Unstage a file',
    example: 'git restore --staged index.html',
  },
  {
    category: 'Undo',
    command: 'git reset --soft HEAD~1',
    description: 'Undo last commit, keep changes staged',
  },
  {
    category: 'Undo',
    command: 'git reset --hard HEAD~1',
    description: 'Undo last commit, discard changes',
  },
  {
    category: 'Undo',
    command: 'git revert <commit>',
    description: 'Create a new commit that undoes changes',
    example: 'git revert abc123',
  },
]

export default function GitCheatSheet() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = [...new Set(gitCommands.map((c) => c.category))]

  const filteredCommands = gitCommands.filter((cmd) => {
    if (selectedCategory && cmd.category !== selectedCategory) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        cmd.command.toLowerCase().includes(query) ||
        cmd.description.toLowerCase().includes(query)
      )
    }
    return true
  })

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search commands..."
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Commands List */}
      <div className="space-y-4">
        {filteredCommands.map((cmd, index) => (
          <div
            key={index}
            className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 hover:bg-zinc-900"
          >
            <div className="mb-2 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-400">
                    {cmd.category}
                  </span>
                </div>
                <code className="block rounded bg-zinc-950 px-3 py-2 font-mono text-sm text-emerald-400">
                  {cmd.command}
                </code>
                <p className="mt-2 text-sm text-zinc-400">{cmd.description}</p>
                {cmd.example && (
                  <p className="mt-1 text-xs text-zinc-500">
                    Example: <code className="text-zinc-400">{cmd.example}</code>
                  </p>
                )}
              </div>
              <CopyButton text={cmd.command} label="" className="!px-2 shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

