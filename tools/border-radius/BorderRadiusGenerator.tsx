'use client'

import { useState, useMemo } from 'react'
import { CopyButton } from '@/components/CopyButton'

export default function BorderRadiusGenerator() {
  const [topLeft, setTopLeft] = useState(8)
  const [topRight, setTopRight] = useState(8)
  const [bottomRight, setBottomRight] = useState(8)
  const [bottomLeft, setBottomLeft] = useState(8)
  const [unit, setUnit] = useState<'px' | '%' | 'rem' | 'em'>('px')
  const [linked, setLinked] = useState(true)

  const cssValue = useMemo(() => {
    if (linked && topLeft === topRight && topRight === bottomRight && bottomRight === bottomLeft) {
      return `${topLeft}${unit}`
    }
    return `${topLeft}${unit} ${topRight}${unit} ${bottomRight}${unit} ${bottomLeft}${unit}`
  }, [topLeft, topRight, bottomRight, bottomLeft, unit, linked])

  const previewStyle = useMemo(() => {
    return {
      borderRadius: cssValue,
    }
  }, [cssValue])

  const handleCornerChange = (corner: 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft', value: number) => {
    if (linked) {
      setTopLeft(value)
      setTopRight(value)
      setBottomRight(value)
      setBottomLeft(value)
    } else {
      switch (corner) {
        case 'topLeft':
          setTopLeft(value)
          break
        case 'topRight':
          setTopRight(value)
          break
        case 'bottomRight':
          setBottomRight(value)
          break
        case 'bottomLeft':
          setBottomLeft(value)
          break
      }
    }
  }

  const maxValue = unit === '%' ? 50 : unit === 'rem' || unit === 'em' ? 10 : 200

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Controls */}
        <div className="space-y-6">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">Corner Radius</label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={linked}
                  onChange={(e) => setLinked(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                />
                <span className="text-sm text-zinc-400">Link corners</span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Top Left */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs text-zinc-500">Top Left</label>
                  <span className="text-xs text-zinc-400">
                    {linked ? topLeft : topLeft}
                    {unit}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxValue}
                  step={unit === 'px' ? 1 : 0.1}
                  value={topLeft}
                  onChange={(e) => handleCornerChange('topLeft', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Top Right */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs text-zinc-500">Top Right</label>
                  <span className="text-xs text-zinc-400">
                    {linked ? topRight : topRight}
                    {unit}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxValue}
                  step={unit === 'px' ? 1 : 0.1}
                  value={topRight}
                  onChange={(e) => handleCornerChange('topRight', parseFloat(e.target.value))}
                  disabled={linked}
                  className="w-full disabled:opacity-50"
                />
              </div>

              {/* Bottom Right */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs text-zinc-500">Bottom Right</label>
                  <span className="text-xs text-zinc-400">
                    {linked ? bottomRight : bottomRight}
                    {unit}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxValue}
                  step={unit === 'px' ? 1 : 0.1}
                  value={bottomRight}
                  onChange={(e) => handleCornerChange('bottomRight', parseFloat(e.target.value))}
                  disabled={linked}
                  className="w-full disabled:opacity-50"
                />
              </div>

              {/* Bottom Left */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs text-zinc-500">Bottom Left</label>
                  <span className="text-xs text-zinc-400">
                    {linked ? bottomLeft : bottomLeft}
                    {unit}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxValue}
                  step={unit === 'px' ? 1 : 0.1}
                  value={bottomLeft}
                  onChange={(e) => handleCornerChange('bottomLeft', parseFloat(e.target.value))}
                  disabled={linked}
                  className="w-full disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Unit Selector */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">Unit</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as typeof unit)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            >
              <option value="px">px</option>
              <option value="%">%</option>
              <option value="rem">rem</option>
              <option value="em">em</option>
            </select>
          </div>

          {/* CSS Output */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">CSS</label>
              <CopyButton text={`border-radius: ${cssValue};`} />
            </div>
            <textarea
              readOnly
              value={`border-radius: ${cssValue};`}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
              rows={3}
            />
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-zinc-300">Preview</h3>
          <div className="flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 p-8">
            <div
              className="h-48 w-48 bg-emerald-600"
              style={previewStyle}
            />
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
            <p className="mb-2 text-xs text-zinc-500">Individual Properties</p>
            <div className="space-y-1 font-mono text-xs text-zinc-400">
              <div>border-top-left-radius: {topLeft}{unit};</div>
              <div>border-top-right-radius: {topRight}{unit};</div>
              <div>border-bottom-right-radius: {bottomRight}{unit};</div>
              <div>border-bottom-left-radius: {bottomLeft}{unit};</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

