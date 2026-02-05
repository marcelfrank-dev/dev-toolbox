'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

const FALLBACK_TIMEZONES = [
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

function getAvailableTimezones(): string[] {
  if (typeof Intl !== 'undefined' && 'supportedValuesOf' in Intl) {
    const zones = (Intl as unknown as { supportedValuesOf: (type: string) => string[] }).supportedValuesOf(
      'timeZone'
    )
    return zones.includes('UTC') ? zones : ['UTC', ...zones]
  }
  return FALLBACK_TIMEZONES
}

function getOffsetMinutes(date: Date, timeZone: string): number {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const parts = formatter.formatToParts(date)
  const lookup = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  const year = Number(lookup.year)
  const month = Number(lookup.month)
  const day = Number(lookup.day)
  const hour = Number(lookup.hour)
  const minute = Number(lookup.minute)
  const second = Number(lookup.second)
  const asUtc = Date.UTC(year, month - 1, day, hour, minute, second)
  return Math.round((asUtc - date.getTime()) / 60000)
}

function formatOffsetLabel(minutes: number): string {
  if (minutes === 0) return 'UTC'
  const sign = minutes > 0 ? '+' : '-'
  const absMinutes = Math.abs(minutes)
  const hours = Math.floor(absMinutes / 60)
  const mins = absMinutes % 60
  return `UTC${sign}${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

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
  const dateForOffsets = Number.isNaN(new Date(dateStr).getTime()) ? new Date() : new Date(dateStr)
  const availableTimezones = getAvailableTimezones()
  const timezoneOptions = availableTimezones.map((tz) => ({
    tz,
    label: `${tz} (${formatOffsetLabel(getOffsetMinutes(dateForOffsets, tz))})`,
  }))

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
            {timezoneOptions.map(({ tz, label }) => (
              <option key={tz} value={tz}>
                {label}
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
            {timezoneOptions.map(({ tz, label }) => (
              <option key={tz} value={tz}>
                {label}
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

