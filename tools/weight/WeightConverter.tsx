'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

const WEIGHT_UNITS = {
  gram: 1,
  kilogram: 1000,
  milligram: 0.001,
  pound: 453.592,
  ounce: 28.3495,
  ton: 1000000,
  stone: 6350.29,
}

function convertWeight(value: number, from: string, to: string): number {
  const fromGrams = value * WEIGHT_UNITS[from as keyof typeof WEIGHT_UNITS]
  return fromGrams / WEIGHT_UNITS[to as keyof typeof WEIGHT_UNITS]
}

export default function WeightConverter() {
  const [value, setValue] = useState('1')
  const [from, setFrom] = useState('kilogram')
  const [to, setTo] = useState('pound')
  const numValue = parseFloat(value) || 0
  const result = convertWeight(numValue, from, to)

  const clear = () => {
    setValue('1')
    setFrom('kilogram')
    setTo('pound')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="weight-value" className="text-sm font-medium text-zinc-300">
            Value
          </label>
          <input
            id="weight-value"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="weight-from" className="text-sm font-medium text-zinc-300">
            From
          </label>
          <select
            id="weight-from"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          >
            {Object.keys(WEIGHT_UNITS).map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="weight-to" className="text-sm font-medium text-zinc-300">
            To
          </label>
          <select
            id="weight-to"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          >
            {Object.keys(WEIGHT_UNITS).map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="weight-result" className="text-sm font-medium text-zinc-300">
            Result
          </label>
          <CopyButton text={result.toString()} />
        </div>
        <input
          id="weight-result"
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
