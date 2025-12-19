'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

interface QueryParam {
  key: string
  value: string
}

export default function QueryStringBuilder() {
  const [params, setParams] = useState<QueryParam[]>([{ key: '', value: '' }])
  const [baseUrl, setBaseUrl] = useState('')

  const queryString = params
    .filter((p) => p.key.trim())
    .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
    .join('&')

  const fullUrl = baseUrl
    ? `${baseUrl}${queryString ? (baseUrl.includes('?') ? '&' : '?') + queryString : ''}`
    : queryString

  const addParam = () => {
    setParams([...params, { key: '', value: '' }])
  }

  const removeParam = (index: number) => {
    setParams(params.filter((_, i) => i !== index))
  }

  const updateParam = (index: number, field: 'key' | 'value', value: string) => {
    const newParams = [...params]
    newParams[index] = { ...newParams[index], [field]: value }
    setParams(newParams)
  }

  const clear = () => {
    setParams([{ key: '', value: '' }])
    setBaseUrl('')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="base-url" className="text-sm font-medium text-zinc-300">
          Base URL (optional)
        </label>
        <input
          id="base-url"
          type="text"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          placeholder="https://example.com"
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-zinc-300">Query Parameters</label>
          <button
            onClick={addParam}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
          >
            Add Parameter
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {params.map((param, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={param.key}
                onChange={(e) => updateParam(index, 'key', e.target.value)}
                placeholder="Key"
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
              />
              <input
                type="text"
                value={param.value}
                onChange={(e) => updateParam(index, 'value', e.target.value)}
                placeholder="Value"
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
              />
              <button
                onClick={() => removeParam(index)}
                className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="query-output" className="text-sm font-medium text-zinc-300">
            Query String
          </label>
          <CopyButton text={queryString} />
        </div>
        <input
          id="query-output"
          type="text"
          value={queryString}
          readOnly
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      {baseUrl && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="full-url-output" className="text-sm font-medium text-zinc-300">
              Full URL
            </label>
            <CopyButton text={fullUrl} />
          </div>
          <input
            id="full-url-output"
            type="text"
            value={fullUrl}
            readOnly
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
      )}

      <button
        onClick={clear}
        className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
      >
        Clear All
      </button>
    </div>
  )
}

