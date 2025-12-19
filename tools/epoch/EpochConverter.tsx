'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function epochToDate(epoch: number, unit: 'seconds' | 'milliseconds'): Date {
  if (unit === 'milliseconds') {
    return new Date(epoch)
  }
  return new Date(epoch * 1000)
}

function dateToEpoch(date: Date, unit: 'seconds' | 'milliseconds'): number {
  const ms = date.getTime()
  return unit === 'milliseconds' ? ms : Math.floor(ms / 1000)
}

export default function EpochConverter() {
  const [mode, setMode] = useState<'epoch-to-date' | 'date-to-epoch'>('epoch-to-date')
  const [epoch, setEpoch] = useState('')
  const [unit, setUnit] = useState<'seconds' | 'milliseconds'>('seconds')
  const [date, setDate] = useState('')

  const epochToDateResult = epoch
    ? epochToDate(parseFloat(epoch) || 0, unit).toISOString()
    : ''
  const dateToEpochResult = date
    ? dateToEpoch(new Date(date), unit).toString()
    : ''

  const clear = () => {
    setEpoch('')
    setDate('')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-zinc-300">Mode:</label>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('epoch-to-date')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === 'epoch-to-date'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}
          >
            Epoch → Date
          </button>
          <button
            onClick={() => setMode('date-to-epoch')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === 'date-to-epoch'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}
          >
            Date → Epoch
          </button>
        </div>
      </div>

      {mode === 'epoch-to-date' ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="epoch-input" className="text-sm font-medium text-zinc-300">
                Epoch Timestamp
              </label>
              <input
                id="epoch-input"
                type="number"
                value={epoch}
                onChange={(e) => setEpoch(e.target.value)}
                placeholder="1609459200"
                className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="epoch-unit" className="text-sm font-medium text-zinc-300">
                Unit
              </label>
              <select
                id="epoch-unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value as 'seconds' | 'milliseconds')}
                className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
              >
                <option value="seconds">Seconds</option>
                <option value="milliseconds">Milliseconds</option>
              </select>
            </div>
          </div>
          {epochToDateResult && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="epoch-date-output" className="text-sm font-medium text-zinc-300">
                  Date (ISO)
                </label>
                <CopyButton text={epochToDateResult} />
              </div>
              <input
                id="epoch-date-output"
                type="text"
                value={epochToDateResult}
                readOnly
                className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
              />
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <label htmlFor="date-input" className="text-sm font-medium text-zinc-300">
              Date
            </label>
            <input
              id="date-input"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="date-unit" className="text-sm font-medium text-zinc-300">
              Unit
            </label>
            <select
              id="date-unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value as 'seconds' | 'milliseconds')}
              className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            >
              <option value="seconds">Seconds</option>
              <option value="milliseconds">Milliseconds</option>
            </select>
          </div>
          {dateToEpochResult && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="date-epoch-output" className="text-sm font-medium text-zinc-300">
                  Epoch Timestamp
                </label>
                <CopyButton text={dateToEpochResult} />
              </div>
              <input
                id="date-epoch-output"
                type="text"
                value={dateToEpochResult}
                readOnly
                className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-lg text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
              />
            </div>
          )}
        </>
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
