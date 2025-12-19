'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

export default function CorsHeaderGenerator() {
  const [origin, setOrigin] = useState('*')
  const [methods, setMethods] = useState(['GET', 'POST', 'PUT', 'DELETE'])
  const [headers, setHeaders] = useState(['Content-Type', 'Authorization'])
  const [credentials, setCredentials] = useState(false)
  const [maxAge, setMaxAge] = useState('86400')

  const availableMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD']
  const commonHeaders = ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']

  const toggleMethod = (method: string) => {
    if (methods.includes(method)) {
      setMethods(methods.filter((m) => m !== method))
    } else {
      setMethods([...methods, method])
    }
  }

  const addHeader = (header: string) => {
    if (!headers.includes(header)) {
      setHeaders([...headers, header])
    }
  }

  const removeHeader = (header: string) => {
    setHeaders(headers.filter((h) => h !== header))
  }

  const generateHeaders = () => {
    const corsHeaders: string[] = []
    corsHeaders.push(`Access-Control-Allow-Origin: ${origin}`)
    corsHeaders.push(`Access-Control-Allow-Methods: ${methods.join(', ')}`)
    corsHeaders.push(`Access-Control-Allow-Headers: ${headers.join(', ')}`)
    if (credentials) {
      corsHeaders.push('Access-Control-Allow-Credentials: true')
    }
    if (maxAge) {
      corsHeaders.push(`Access-Control-Max-Age: ${maxAge}`)
    }
    return corsHeaders.join('\n')
  }

  const output = generateHeaders()

  const clear = () => {
    setOrigin('*')
    setMethods(['GET', 'POST', 'PUT', 'DELETE'])
    setHeaders(['Content-Type', 'Authorization'])
    setCredentials(false)
    setMaxAge('86400')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="cors-origin" className="text-sm font-medium text-zinc-300">
          Access-Control-Allow-Origin
        </label>
        <input
          id="cors-origin"
          type="text"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="* or https://example.com"
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-300">Access-Control-Allow-Methods</label>
        <div className="flex flex-wrap gap-2">
          {availableMethods.map((method) => (
            <button
              key={method}
              onClick={() => toggleMethod(method)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                methods.includes(method)
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-300">Access-Control-Allow-Headers</label>
        <div className="flex flex-wrap gap-2">
          {commonHeaders.map((header) => (
            <button
              key={header}
              onClick={() => addHeader(header)}
              className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
            >
              + {header}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {headers.map((header) => (
            <div key={header} className="flex items-center gap-1 rounded-lg bg-emerald-600/20 px-3 py-1.5">
              <span className="text-sm text-emerald-400">{header}</span>
              <button
                onClick={() => removeHeader(header)}
                className="text-emerald-400 hover:text-emerald-300"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        {headers.length === 0 && (
          <p className="text-xs text-zinc-500">Click headers above to add them</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={credentials}
            onChange={(e) => setCredentials(e.target.checked)}
            className="rounded border-zinc-700 bg-zinc-900 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
          />
          <label className="text-sm text-zinc-400">Access-Control-Allow-Credentials</label>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="cors-max-age" className="text-sm font-medium text-zinc-300">
            Access-Control-Max-Age (seconds)
          </label>
          <input
            id="cors-max-age"
            type="number"
            value={maxAge}
            onChange={(e) => setMaxAge(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
      </div>

      {output && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="cors-output" className="text-sm font-medium text-zinc-300">
              Generated CORS Headers
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            id="cors-output"
            value={output}
            readOnly
            className="h-32 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
      )}

      <button
        onClick={clear}
        className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
      >
        Clear
      </button>
    </div>
  )
}

