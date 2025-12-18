'use client'

import { useState, useMemo } from 'react'

interface DiffLine {
  type: 'equal' | 'add' | 'remove'
  content: string
  lineNumber?: { left?: number; right?: number }
}

export default function TextDiff() {
  const [leftText, setLeftText] = useState('')
  const [rightText, setRightText] = useState('')
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false)
  const [ignoreCase, setIgnoreCase] = useState(false)

  const diff = useMemo(() => {
    const leftLines = leftText.split('\n')
    const rightLines = rightText.split('\n')

    const normalize = (line: string) => {
      let result = line
      if (ignoreWhitespace) result = result.replace(/\s+/g, ' ').trim()
      if (ignoreCase) result = result.toLowerCase()
      return result
    }

    // Simple LCS-based diff
    const m = leftLines.length
    const n = rightLines.length

    // Build LCS matrix
    const dp: number[][] = Array(m + 1)
      .fill(null)
      .map(() => Array(n + 1).fill(0))

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (normalize(leftLines[i - 1]) === normalize(rightLines[j - 1])) {
          dp[i][j] = dp[i - 1][j - 1] + 1
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
        }
      }
    }

    // Backtrack to find diff
    const result: DiffLine[] = []
    let i = m,
      j = n

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && normalize(leftLines[i - 1]) === normalize(rightLines[j - 1])) {
        result.unshift({
          type: 'equal',
          content: leftLines[i - 1],
          lineNumber: { left: i, right: j },
        })
        i--
        j--
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        result.unshift({
          type: 'add',
          content: rightLines[j - 1],
          lineNumber: { right: j },
        })
        j--
      } else {
        result.unshift({
          type: 'remove',
          content: leftLines[i - 1],
          lineNumber: { left: i },
        })
        i--
      }
    }

    return result
  }, [leftText, rightText, ignoreWhitespace, ignoreCase])

  const stats = useMemo(() => {
    const added = diff.filter((d) => d.type === 'add').length
    const removed = diff.filter((d) => d.type === 'remove').length
    const unchanged = diff.filter((d) => d.type === 'equal').length
    return { added, removed, unchanged }
  }, [diff])

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="flex flex-wrap gap-4">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={ignoreWhitespace}
            onChange={(e) => setIgnoreWhitespace(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
          />
          <span className="text-sm text-zinc-300">Ignore whitespace</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={ignoreCase}
            onChange={(e) => setIgnoreCase(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
          />
          <span className="text-sm text-zinc-300">Ignore case</span>
        </label>
      </div>

      {/* Input Areas */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">Original Text</label>
          <textarea
            value={leftText}
            onChange={(e) => setLeftText(e.target.value)}
            placeholder="Paste original text here..."
            className="h-48 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">Modified Text</label>
          <textarea
            value={rightText}
            onChange={(e) => setRightText(e.target.value)}
            placeholder="Paste modified text here..."
            className="h-48 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Stats */}
      {(leftText || rightText) && (
        <div className="flex gap-4 text-sm">
          <span className="text-emerald-400">+{stats.added} added</span>
          <span className="text-red-400">-{stats.removed} removed</span>
          <span className="text-zinc-500">{stats.unchanged} unchanged</span>
        </div>
      )}

      {/* Diff Output */}
      {diff.length > 0 && (leftText || rightText) && (
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">Diff Output</label>
          <div className="max-h-96 overflow-auto rounded-lg border border-zinc-700 bg-zinc-900/50 font-mono text-sm">
            {diff.map((line, i) => (
              <div
                key={i}
                className={`flex ${
                  line.type === 'add'
                    ? 'bg-emerald-900/20'
                    : line.type === 'remove'
                      ? 'bg-red-900/20'
                      : ''
                }`}
              >
                <div className="w-12 shrink-0 border-r border-zinc-800 px-2 py-1 text-right text-zinc-600">
                  {line.lineNumber?.left || ''}
                </div>
                <div className="w-12 shrink-0 border-r border-zinc-800 px-2 py-1 text-right text-zinc-600">
                  {line.lineNumber?.right || ''}
                </div>
                <div className="w-6 shrink-0 px-1 py-1 text-center">
                  {line.type === 'add' && <span className="text-emerald-400">+</span>}
                  {line.type === 'remove' && <span className="text-red-400">-</span>}
                </div>
                <div
                  className={`flex-1 whitespace-pre-wrap break-all px-2 py-1 ${
                    line.type === 'add'
                      ? 'text-emerald-300'
                      : line.type === 'remove'
                        ? 'text-red-300'
                        : 'text-zinc-400'
                  }`}
                >
                  {line.content || ' '}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

