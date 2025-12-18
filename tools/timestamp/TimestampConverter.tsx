'use client'

import { useState, useEffect } from 'react'
import { CopyButton } from '@/components/CopyButton'

export default function TimestampConverter() {
  const [unixInput, setUnixInput] = useState('')
  const [dateInput, setDateInput] = useState('')
  const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now() / 1000))

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const unixToDate = (unix: string): string => {
    const num = parseInt(unix, 10)
    if (isNaN(num)) return ''
    // Handle both seconds and milliseconds
    const ms = unix.length > 10 ? num : num * 1000
    return new Date(ms).toISOString()
  }

  const dateToUnix = (date: string): string => {
    const parsed = new Date(date)
    if (isNaN(parsed.getTime())) return ''
    return Math.floor(parsed.getTime() / 1000).toString()
  }

  const useCurrentTime = () => {
    setUnixInput(currentTimestamp.toString())
  }

  const clear = () => {
    setUnixInput('')
    setDateInput('')
  }

  const unixResult = unixInput ? unixToDate(unixInput) : ''
  const dateResult = dateInput ? dateToUnix(dateInput) : ''

  return (
    <div className="flex flex-col gap-6">
      {/* Current timestamp */}
      <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <div>
          <p className="text-sm text-zinc-400">Current Unix Timestamp</p>
          <p className="font-mono text-2xl font-bold text-zinc-100">{currentTimestamp}</p>
        </div>
        <button
          onClick={useCurrentTime}
          className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-600"
        >
          Use Current
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Unix to Date */}
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-800 bg-zinc-900/30 p-4">
          <h3 className="text-sm font-semibold text-zinc-200">Unix → Human Date</h3>
          <div className="flex flex-col gap-2">
            <label htmlFor="unix-input" className="text-xs text-zinc-500">
              Unix Timestamp (seconds or milliseconds)
            </label>
            <input
              id="unix-input"
              type="text"
              value={unixInput}
              onChange={(e) => setUnixInput(e.target.value)}
              placeholder="1702900800"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">Result (ISO 8601)</span>
              <CopyButton text={unixResult} />
            </div>
            <div className="min-h-[2.5rem] rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-sm text-zinc-200">
              {unixResult || <span className="text-zinc-600">—</span>}
            </div>
          </div>
        </div>

        {/* Date to Unix */}
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-800 bg-zinc-900/30 p-4">
          <h3 className="text-sm font-semibold text-zinc-200">Human Date → Unix</h3>
          <div className="flex flex-col gap-2">
            <label htmlFor="date-input" className="text-xs text-zinc-500">
              Date/Time (ISO 8601 or readable)
            </label>
            <input
              id="date-input"
              type="text"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              placeholder="2024-12-18T12:00:00Z"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">Result (seconds)</span>
              <CopyButton text={dateResult} />
            </div>
            <div className="min-h-[2.5rem] rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-sm text-zinc-200">
              {dateResult || <span className="text-zinc-600">—</span>}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={clear}
        className="self-start rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
      >
        Clear All
      </button>
    </div>
  )
}

