'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Dubai',
  'Australia/Sydney',
]

function convertTimezone(dateStr: string, fromTz: string, toTz: string): string {
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return 'Invalid date'

    // Get time in source timezone
    const fromDate = new Date(
      date.toLocaleString('en-US', { timeZone: fromTz === 'UTC' ? 'UTC' : fromTz })
    )

    // Convert to target timezone
    const toDate = new Date(
      fromDate.toLocaleString('en-US', { timeZone: toTz === 'UTC' ? 'UTC' : toTz })
    )

    return toDate.toISOString()
  } catch {
    return 'Error converting timezone'
  }
}

export default function TimezoneConverter() {
  const [dateStr, setDateStr] = useState(new Date().toISOString().slice(0, 16))
  const [fromTz, setFromTz] = useState('UTC')
  const [toTz, setToTz] = useState('America/New_York')

  const output = dateStr ? convertTimezone(dateStr, fromTz, toTz) : ''

  const clear = () => {
    setDateStr(new Date().toISOString().slice(0, 16))
    setFromTz('UTC')
    setToTz('America/New_York')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="timezone-date" className="text-sm font-medium text-zinc-300">
          Date & Time
        </label>
        <input
          id="timezone-date"
          type="datetime-local"
          value={dateStr}
          onChange={(e) => setDateStr(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="timezone-from" className="text-sm font-medium text-zinc-300">
            From Timezone
          </label>
          <select
            id="timezone-from"
            value={fromTz}
            onChange={(e) => setFromTz(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="timezone-to" className="text-sm font-medium text-zinc-300">
            To Timezone
          </label>
          <select
            id="timezone-to"
            value={toTz}
            onChange={(e) => setToTz(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>
      </div>

      {output && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="timezone-output" className="text-sm font-medium text-zinc-300">
              Converted Time
            </label>
            <CopyButton text={output} />
          </div>
          <input
            id="timezone-output"
            type="text"
            value={output}
            readOnly
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
      )}

      <button
        onClick={clear}
        className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
      >
        Reset
      </button>
    </div>
  )
}

