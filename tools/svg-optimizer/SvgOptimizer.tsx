'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function optimizeSvg(svg: string): string {
  let optimized = svg

  // Remove comments
  optimized = optimized.replace(/<!--[\s\S]*?-->/g, '')

  // Remove unnecessary whitespace
  optimized = optimized.replace(/\s+/g, ' ')
  optimized = optimized.replace(/>\s+</g, '><')

  // Remove default attributes
  optimized = optimized.replace(/\s+fill="black"/g, '')
  optimized = optimized.replace(/\s+stroke="none"/g, '')
  optimized = optimized.replace(/\s+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/g, '')

  // Remove empty elements (basic)
  optimized = optimized.replace(/<(\w+)[^>]*>\s*<\/\1>/g, '')

  // Trim
  optimized = optimized.trim()

  return optimized
}

export default function SvgOptimizer() {
  const [input, setInput] = useState('')
  const output = input ? optimizeSvg(input) : ''
  const originalSize = input.length
  const optimizedSize = output.length
  const savings = originalSize > 0 ? ((1 - optimizedSize / originalSize) * 100).toFixed(1) : '0'

  const clear = () => setInput('')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="svg-input" className="text-sm font-medium text-zinc-300">
            SVG Input
          </label>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
        <textarea
          id="svg-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='<svg><circle cx="50" cy="50" r="40"/></svg>'
          className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      {output && (
        <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
          <span className="text-sm text-zinc-400">
            Original: {originalSize} bytes
          </span>
          <span className="text-sm text-zinc-400">
            Optimized: {optimizedSize} bytes
          </span>
          <span className="text-sm font-medium text-emerald-400">
            Saved: {savings}%
          </span>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="svg-output" className="text-sm font-medium text-zinc-300">
            Optimized SVG
          </label>
          <CopyButton text={output} />
        </div>
        <textarea
          id="svg-output"
          value={output}
          readOnly
          className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>
    </div>
  )
}

