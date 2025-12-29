'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'
import { motion, AnimatePresence } from 'framer-motion'

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [indentation, setIndentation] = useState(2)

  const formatJson = () => {
    if (!input.trim()) return
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, indentation))
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON')
      setOutput('')
    }
  }

  const minifyJson = () => {
    if (!input.trim()) return
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON')
      setOutput('')
    }
  }

  const clear = () => {
    setInput('')
    setOutput('')
    setError(null)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="indent" className="text-sm font-medium text-zinc-400">
              Indent
            </label>
            <select
              id="indent"
              value={indentation}
              onChange={(e) => setIndentation(Number(e.target.value))}
              className="rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-sm text-zinc-200 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={0}>Compact</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={clear}
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          >
            Clear
          </button>
          <button
            onClick={minifyJson}
            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700 active:translate-y-0.5"
          >
            Minify
          </button>
          <button
            onClick={formatJson}
            className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition-all hover:bg-emerald-500 hover:shadow-emerald-900/40 active:translate-y-0.5"
          >
            Format
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="json-input" className="ml-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Input JSON
          </label>
          <div className="relative group">
            <textarea
              id="json-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='{"key": "value"}'
              spellCheck={false}
              className="h-[500px] w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 font-mono text-sm text-zinc-300 placeholder-zinc-700 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 group-hover:border-zinc-700 transition-all"
            />
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Result</label>
            <div className="origin-right scale-90">
              <CopyButton text={output} />
            </div>
          </div>

          <div className="relative h-[500px] w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/80">
            <AnimatePresence mode="wait">
              {error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute inset-0 flex items-center justify-center p-8 text-center bg-red-950/10 backdrop-blur-sm"
                >
                  <div className="rounded-xl border border-red-500/20 bg-red-900/10 p-6 shadow-2xl">
                    <div className="mb-2 text-2xl">❌</div>
                    <h3 className="mb-1 font-semibold text-red-400">Invalid JSON</h3>
                    <p className="text-sm text-red-400/80 font-mono">{error}</p>
                  </div>
                </motion.div>
              ) : (
                <textarea
                  readOnly
                  value={output}
                  placeholder="Formatted result..."
                  spellCheck={false}
                  className="h-full w-full resize-none bg-transparent p-4 font-mono text-sm text-emerald-400/90 placeholder-zinc-700 focus:outline-none"
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

