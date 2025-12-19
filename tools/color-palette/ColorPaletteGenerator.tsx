'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function hslToHex(h: number, s: number, l: number): string {
  l /= 100
  const a = (s * Math.min(l, 1 - l)) / 100
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function generatePalette(count: number, hue: number): string[] {
  const colors: string[] = []
  const step = 360 / count

  for (let i = 0; i < count; i++) {
    const h = (hue + i * step) % 360
    colors.push(hslToHex(h, 70, 50))
  }

  return colors
}

export default function ColorPaletteGenerator() {
  const [count, setCount] = useState(5)
  const [hue, setHue] = useState(0)
  const palette = generatePalette(count, hue)

  const clear = () => {
    setCount(5)
    setHue(0)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="palette-count" className="text-sm font-medium text-zinc-300">
            Colors
          </label>
          <input
            id="palette-count"
            type="number"
            min="2"
            max="12"
            value={count}
            onChange={(e) => setCount(Math.max(2, Math.min(12, parseInt(e.target.value) || 5)))}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="palette-hue" className="text-sm font-medium text-zinc-300">
            Base Hue (0-360)
          </label>
          <input
            id="palette-hue"
            type="number"
            min="0"
            max="360"
            value={hue}
            onChange={(e) => setHue(Math.max(0, Math.min(360, parseInt(e.target.value) || 0)))}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-300">Color Palette</span>
          <CopyButton text={palette.join(', ')} />
        </div>
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}>
          {palette.map((color, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4"
            >
              <div
                className="h-24 w-full rounded"
                style={{ backgroundColor: color }}
              />
              <code className="text-xs text-zinc-400">{color}</code>
              <CopyButton text={color} />
            </div>
          ))}
        </div>
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

