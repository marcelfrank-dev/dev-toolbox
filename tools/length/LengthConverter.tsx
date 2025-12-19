'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

const LENGTH_UNITS = {
  meter: 1,
  kilometer: 1000,
  centimeter: 0.01,
  millimeter: 0.001,
  inch: 0.0254,
  foot: 0.3048,
  yard: 0.9144,
  mile: 1609.34,
  nauticalMile: 1852,
}

function convertLength(value: number, from: string, to: string): number {
  const fromMeters = value * LENGTH_UNITS[from as keyof typeof LENGTH_UNITS]
  return fromMeters / LENGTH_UNITS[to as keyof typeof LENGTH_UNITS]
}

export default function LengthConverter() {
  const [value, setValue] = useState('1')
  const [from, setFrom] = useState('meter')
  const [to, setTo] = useState('kilometer')
  const numValue = parseFloat(value) || 0
  const result = convertLength(numValue, from, to)

  const clear = () => {
    setValue('1')
    setFrom('meter')
    setTo('kilometer')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="length-value" className="text-sm font-medium text-zinc-300">
            Value
          </label>
          <input
            id="length-value"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="length-from" className="text-sm font-medium text-zinc-300">
            From
          </label>
          <select
            id="length-from"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          >
            {Object.keys(LENGTH_UNITS).map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="length-to" className="text-sm font-medium text-zinc-300">
            To
          </label>
          <select
            id="length-to"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          >
            {Object.keys(LENGTH_UNITS).map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="length-result" className="text-sm font-medium text-zinc-300">
            Result
          </label>
          <CopyButton text={result.toString()} />
        </div>
        <input
          id="length-result"
          type="text"
          value={result.toFixed(6)}
          readOnly
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-lg text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <button
        onClick={clear}
        className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
      >
        Reset
      </button>
    </div>
  )
}
