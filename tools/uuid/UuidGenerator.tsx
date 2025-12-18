'use client'

import { useState, useCallback } from 'react'
import { CopyButton } from '@/components/CopyButton'

type UuidVersion = 'v4' | 'v1-like'

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([])
  const [version, setVersion] = useState<UuidVersion>('v4')
  const [count, setCount] = useState(1)
  const [uppercase, setUppercase] = useState(false)
  const [noDashes, setNoDashes] = useState(false)

  const generateUuidV4 = useCallback(() => {
    // Generate a random UUID v4 using crypto.randomUUID if available, otherwise fallback
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID()
    }
    // Fallback implementation
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }, [])

  const generateUuidV1Like = useCallback(() => {
    // Generate a timestamp-based UUID (v1-like, not strictly RFC compliant)
    const now = Date.now()
    const clockSeq = Math.floor(Math.random() * 0x3fff) | 0x8000
    const node = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, '0')
    ).join('')

    const timeHex = now.toString(16).padStart(12, '0')
    const timeLow = timeHex.slice(-8)
    const timeMid = timeHex.slice(-12, -8)
    const timeHi = '1' + timeHex.slice(0, 3)
    const clockSeqHex = clockSeq.toString(16).padStart(4, '0')

    return `${timeLow}-${timeMid}-${timeHi}-${clockSeqHex}-${node}`
  }, [])

  const formatUuid = useCallback(
    (uuid: string) => {
      let result = uuid
      if (noDashes) {
        result = result.replace(/-/g, '')
      }
      if (uppercase) {
        result = result.toUpperCase()
      }
      return result
    },
    [uppercase, noDashes]
  )

  const generateUuids = useCallback(() => {
    const generator = version === 'v4' ? generateUuidV4 : generateUuidV1Like
    const newUuids = Array.from({ length: count }, () => formatUuid(generator()))
    setUuids(newUuids)
  }, [version, count, generateUuidV4, generateUuidV1Like, formatUuid])

  const allUuidsText = uuids.join('\n')

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Version */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">Version</label>
          <select
            value={version}
            onChange={(e) => setVersion(e.target.value as UuidVersion)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
          >
            <option value="v4">UUID v4 (Random)</option>
            <option value="v1-like">UUID v1-like (Timestamp)</option>
          </select>
        </div>

        {/* Count */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">Count</label>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
          />
        </div>

        {/* Uppercase */}
        <div className="flex items-end">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-sm text-zinc-300">Uppercase</span>
          </label>
        </div>

        {/* No Dashes */}
        <div className="flex items-end">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={noDashes}
              onChange={(e) => setNoDashes(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-sm text-zinc-300">No Dashes</span>
          </label>
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex gap-2">
        <button
          onClick={generateUuids}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
          </svg>
          Generate UUID{count > 1 ? 's' : ''}
        </button>

        {uuids.length > 0 && <CopyButton text={allUuidsText} label={`Copy All (${uuids.length})`} />}
      </div>

      {/* Results */}
      {uuids.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-400">Generated UUIDs</label>
          <div className="max-h-80 overflow-auto rounded-lg border border-zinc-700 bg-zinc-900/50">
            {uuids.map((uuid, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-zinc-800 px-4 py-2 last:border-b-0"
              >
                <code className="font-mono text-sm text-emerald-400">{uuid}</code>
                <CopyButton text={uuid} label="" className="!px-2" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4 text-sm text-zinc-500">
        <p className="mb-2">
          <strong className="text-zinc-400">UUID v4:</strong> Randomly generated UUID. Best for most
          use cases where uniqueness is required.
        </p>
        <p>
          <strong className="text-zinc-400">UUID v1-like:</strong> Timestamp-based UUID. Contains a
          timestamp component, useful when ordering matters.
        </p>
      </div>
    </div>
  )
}

