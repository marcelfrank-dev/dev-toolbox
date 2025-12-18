'use client'

import { useState, useMemo } from 'react'

interface DiffResult {
  path: string
  type: 'added' | 'removed' | 'changed'
  oldValue?: unknown
  newValue?: unknown
}

export default function JsonDiff() {
  const [leftJson, setLeftJson] = useState('')
  const [rightJson, setRightJson] = useState('')
  const [error, setError] = useState('')

  const diff = useMemo(() => {
    setError('')

    if (!leftJson.trim() || !rightJson.trim()) {
      return []
    }

    try {
      const left = JSON.parse(leftJson)
      const right = JSON.parse(rightJson)

      const results: DiffResult[] = []

      const compare = (obj1: unknown, obj2: unknown, path = ''): void => {
        if (obj1 === obj2) return

        if (typeof obj1 !== typeof obj2 || obj1 === null || obj2 === null) {
          results.push({
            path: path || '(root)',
            type: 'changed',
            oldValue: obj1,
            newValue: obj2,
          })
          return
        }

        if (Array.isArray(obj1) && Array.isArray(obj2)) {
          const maxLen = Math.max(obj1.length, obj2.length)
          for (let i = 0; i < maxLen; i++) {
            const newPath = path ? `${path}[${i}]` : `[${i}]`
            if (i >= obj1.length) {
              results.push({ path: newPath, type: 'added', newValue: obj2[i] })
            } else if (i >= obj2.length) {
              results.push({ path: newPath, type: 'removed', oldValue: obj1[i] })
            } else {
              compare(obj1[i], obj2[i], newPath)
            }
          }
          return
        }

        if (typeof obj1 === 'object' && typeof obj2 === 'object') {
          const keys1 = Object.keys(obj1 as object)
          const keys2 = Object.keys(obj2 as object)
          const allKeys = new Set([...keys1, ...keys2])

          for (const key of allKeys) {
            const newPath = path ? `${path}.${key}` : key
            const val1 = (obj1 as Record<string, unknown>)[key]
            const val2 = (obj2 as Record<string, unknown>)[key]

            if (!(key in (obj1 as object))) {
              results.push({ path: newPath, type: 'added', newValue: val2 })
            } else if (!(key in (obj2 as object))) {
              results.push({ path: newPath, type: 'removed', oldValue: val1 })
            } else {
              compare(val1, val2, newPath)
            }
          }
          return
        }

        if (obj1 !== obj2) {
          results.push({
            path: path || '(root)',
            type: 'changed',
            oldValue: obj1,
            newValue: obj2,
          })
        }
      }

      compare(left, right)
      return results
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON')
      return []
    }
  }, [leftJson, rightJson])

  const formatValue = (value: unknown): string => {
    if (value === undefined) return 'undefined'
    return JSON.stringify(value, null, 2)
  }

  return (
    <div className="space-y-6">
      {/* Input Areas */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">Original JSON</label>
          <textarea
            value={leftJson}
            onChange={(e) => setLeftJson(e.target.value)}
            placeholder='{"key": "value"}'
            className="h-48 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">Modified JSON</label>
          <textarea
            value={rightJson}
            onChange={(e) => setRightJson(e.target.value)}
            placeholder='{"key": "new value"}'
            className="h-48 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-900/50 bg-red-900/20 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Stats */}
      {diff.length > 0 && (
        <div className="flex gap-4 text-sm">
          <span className="text-emerald-400">
            +{diff.filter((d) => d.type === 'added').length} added
          </span>
          <span className="text-red-400">
            -{diff.filter((d) => d.type === 'removed').length} removed
          </span>
          <span className="text-yellow-400">
            ~{diff.filter((d) => d.type === 'changed').length} changed
          </span>
        </div>
      )}

      {/* Results */}
      {leftJson && rightJson && !error && (
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">
            Differences ({diff.length} {diff.length === 1 ? 'change' : 'changes'})
          </label>

          {diff.length === 0 ? (
            <div className="rounded-lg border border-emerald-900/50 bg-emerald-900/20 p-4 text-sm text-emerald-400">
              ✓ JSON objects are identical
            </div>
          ) : (
            <div className="max-h-96 overflow-auto rounded-lg border border-zinc-700 bg-zinc-900/50">
              {diff.map((d, i) => (
                <div key={i} className="border-b border-zinc-800 p-4 last:border-b-0">
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${
                        d.type === 'added'
                          ? 'bg-emerald-900/50 text-emerald-400'
                          : d.type === 'removed'
                            ? 'bg-red-900/50 text-red-400'
                            : 'bg-yellow-900/50 text-yellow-400'
                      }`}
                    >
                      {d.type}
                    </span>
                    <code className="text-sm text-zinc-300">{d.path}</code>
                  </div>

                  {d.type === 'changed' && (
                    <div className="grid gap-2 text-sm lg:grid-cols-2">
                      <div>
                        <span className="text-xs text-zinc-500">Old:</span>
                        <pre className="mt-1 rounded bg-red-900/20 p-2 text-red-300">
                          {formatValue(d.oldValue)}
                        </pre>
                      </div>
                      <div>
                        <span className="text-xs text-zinc-500">New:</span>
                        <pre className="mt-1 rounded bg-emerald-900/20 p-2 text-emerald-300">
                          {formatValue(d.newValue)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {d.type === 'added' && (
                    <pre className="rounded bg-emerald-900/20 p-2 text-sm text-emerald-300">
                      {formatValue(d.newValue)}
                    </pre>
                  )}

                  {d.type === 'removed' && (
                    <pre className="rounded bg-red-900/20 p-2 text-sm text-red-300">
                      {formatValue(d.oldValue)}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

