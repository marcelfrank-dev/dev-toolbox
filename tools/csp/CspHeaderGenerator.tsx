'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

export default function CspHeaderGenerator() {
  const [directives, setDirectives] = useState<Record<string, string>>({
    'default-src': "'self'",
    'script-src': "'self' 'unsafe-inline'",
    'style-src': "'self' 'unsafe-inline'",
    'img-src': "'self' data: https:",
    'font-src': "'self'",
  })

  const commonDirectives = [
    'default-src',
    'script-src',
    'style-src',
    'img-src',
    'font-src',
    'connect-src',
    'frame-src',
    'object-src',
    'media-src',
    'worker-src',
  ]

  const commonValues = ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'data:', 'https:', 'http:', 'blob:', '*']

  const updateDirective = (directive: string, value: string) => {
    setDirectives({ ...directives, [directive]: value })
  }

  const removeDirective = (directive: string) => {
    const newDirectives = { ...directives }
    delete newDirectives[directive]
    setDirectives(newDirectives)
  }

  const generateCSP = () => {
    return Object.entries(directives)
      .map(([key, value]) => `${key} ${value}`)
      .join('; ')
  }

  const output = generateCSP()

  const clear = () => {
    setDirectives({
      'default-src': "'self'",
      'script-src': "'self' 'unsafe-inline'",
      'style-src': "'self' 'unsafe-inline'",
      'img-src': "'self' data: https:",
      'font-src': "'self'",
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {Object.entries(directives).map(([directive, value]) => (
          <div key={directive} className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">{directive}</label>
              <button
                onClick={() => removeDirective(directive)}
                className="rounded-lg bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
              >
                Remove
              </button>
            </div>
            <input
              type="text"
              value={value}
              onChange={(e) => updateDirective(directive, e.target.value)}
              className="rounded-lg border border-zinc-700 bg-zinc-900 p-2 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            />
            <div className="flex flex-wrap gap-1">
              {commonValues.map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    const current = directives[directive] || ''
                    updateDirective(directive, current ? `${current} ${val}` : val)
                  }}
                  className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-700"
                >
                  + {val}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <p className="mb-2 text-sm font-medium text-zinc-300">Add Directive:</p>
        <div className="flex flex-wrap gap-2">
          {commonDirectives
            .filter((d) => !directives[d])
            .map((directive) => (
              <button
                key={directive}
                onClick={() => updateDirective(directive, "'self'")}
                className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
              >
                + {directive}
              </button>
            ))}
        </div>
      </div>

      {output && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="csp-output" className="text-sm font-medium text-zinc-300">
              Content-Security-Policy Header
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            id="csp-output"
            value={output}
            readOnly
            className="h-24 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
            <p className="mb-1 text-xs font-medium text-zinc-300">Usage:</p>
            <code className="block text-xs text-zinc-400">
              Content-Security-Policy: {output}
            </code>
          </div>
        </div>
      )}

      <button
        onClick={clear}
        className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
      >
        Reset to Defaults
      </button>
    </div>
  )
}

