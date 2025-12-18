'use client'

import { useState, useMemo } from 'react'
import { CopyButton } from '@/components/CopyButton'

type Unit = 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB' | 'KiB' | 'MiB' | 'GiB' | 'TiB' | 'PiB'

interface UnitInfo {
  label: string
  bytes: number
  type: 'decimal' | 'binary'
}

const units: Record<Unit, UnitInfo> = {
  B: { label: 'Bytes', bytes: 1, type: 'decimal' },
  KB: { label: 'Kilobytes', bytes: 1000, type: 'decimal' },
  MB: { label: 'Megabytes', bytes: 1000 ** 2, type: 'decimal' },
  GB: { label: 'Gigabytes', bytes: 1000 ** 3, type: 'decimal' },
  TB: { label: 'Terabytes', bytes: 1000 ** 4, type: 'decimal' },
  PB: { label: 'Petabytes', bytes: 1000 ** 5, type: 'decimal' },
  KiB: { label: 'Kibibytes', bytes: 1024, type: 'binary' },
  MiB: { label: 'Mebibytes', bytes: 1024 ** 2, type: 'binary' },
  GiB: { label: 'Gibibytes', bytes: 1024 ** 3, type: 'binary' },
  TiB: { label: 'Tebibytes', bytes: 1024 ** 4, type: 'binary' },
  PiB: { label: 'Pebibytes', bytes: 1024 ** 5, type: 'binary' },
}

export default function ByteSizeConverter() {
  const [value, setValue] = useState('')
  const [inputUnit, setInputUnit] = useState<Unit>('MB')

  const conversions = useMemo(() => {
    const num = parseFloat(value)
    if (isNaN(num) || !value.trim()) return null

    const bytes = num * units[inputUnit].bytes

    return Object.entries(units).map(([unit, info]) => ({
      unit: unit as Unit,
      label: info.label,
      value: bytes / info.bytes,
      type: info.type,
    }))
  }, [value, inputUnit])

  const formatNumber = (num: number): string => {
    if (num === 0) return '0'
    if (num >= 1) return num.toLocaleString(undefined, { maximumFractionDigits: 2 })
    // For very small numbers
    return num.toExponential(2)
  }

  const decimalUnits: Unit[] = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  const binaryUnits: Unit[] = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB']

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-zinc-400">Value</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter a value..."
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">Unit</label>
          <select
            value={inputUnit}
            onChange={(e) => setInputUnit(e.target.value as Unit)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-3 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
          >
            <optgroup label="Decimal (SI)">
              {decimalUnits.map((unit) => (
                <option key={unit} value={unit}>
                  {unit} ({units[unit].label})
                </option>
              ))}
            </optgroup>
            <optgroup label="Binary (IEC)">
              {binaryUnits.filter((u) => u !== 'B').map((unit) => (
                <option key={unit} value={unit}>
                  {unit} ({units[unit].label})
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      {/* Results */}
      {conversions && (
        <div className="space-y-4">
          {/* Decimal Units */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-zinc-400">Decimal (SI) - Base 1000</h3>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {conversions
                .filter((c) => c.type === 'decimal')
                .map(({ unit, label, value }) => (
                  <div
                    key={unit}
                    className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3"
                  >
                    <div>
                      <code className="text-sm text-emerald-400">{formatNumber(value)}</code>
                      <span className="ml-2 text-sm text-zinc-500">{unit}</span>
                    </div>
                    <CopyButton text={value.toString()} label="" className="!px-2" />
                  </div>
                ))}
            </div>
          </div>

          {/* Binary Units */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-zinc-400">Binary (IEC) - Base 1024</h3>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {conversions
                .filter((c) => c.type === 'binary' || c.unit === 'B')
                .map(({ unit, label, value }) => (
                  <div
                    key={unit + '-binary'}
                    className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3"
                  >
                    <div>
                      <code className="text-sm text-emerald-400">{formatNumber(value)}</code>
                      <span className="ml-2 text-sm text-zinc-500">{unit === 'B' ? 'B' : unit}</span>
                    </div>
                    <CopyButton text={value.toString()} label="" className="!px-2" />
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4 text-sm text-zinc-500">
        <p className="mb-2">
          <strong className="text-zinc-400">Decimal (SI):</strong> Uses powers of 1000. Used by disk
          manufacturers. (KB, MB, GB...)
        </p>
        <p>
          <strong className="text-zinc-400">Binary (IEC):</strong> Uses powers of 1024. Used by
          operating systems. (KiB, MiB, GiB...)
        </p>
      </div>
    </div>
  )
}

