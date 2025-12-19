'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function generateGradientCSS(
  type: 'linear' | 'radial',
  colors: string[],
  angle: number,
  position: string
): string {
  if (type === 'linear') {
    return `linear-gradient(${angle}deg, ${colors.join(', ')})`
  } else {
    return `radial-gradient(${position}, ${colors.join(', ')})`
  }
}

export default function GradientGenerator() {
  const [type, setType] = useState<'linear' | 'radial'>('linear')
  const [colors, setColors] = useState(['#ff0000', '#0000ff'])
  const [angle, setAngle] = useState(90)
  const [position, setPosition] = useState('circle at center')

  const css = generateGradientCSS(type, colors, angle, position)

  const addColor = () => {
    setColors([...colors, '#00ff00'])
  }

  const removeColor = (index: number) => {
    if (colors.length > 2) {
      setColors(colors.filter((_, i) => i !== index))
    }
  }

  const updateColor = (index: number, value: string) => {
    const newColors = [...colors]
    newColors[index] = value
    setColors(newColors)
  }

  const clear = () => {
    setType('linear')
    setColors(['#ff0000', '#0000ff'])
    setAngle(90)
    setPosition('circle at center')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-zinc-300">Type:</label>
        <div className="flex gap-2">
          <button
            onClick={() => setType('linear')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              type === 'linear'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}
          >
            Linear
          </button>
          <button
            onClick={() => setType('radial')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              type === 'radial'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}
          >
            Radial
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-zinc-300">Colors</label>
          <button
            onClick={addColor}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
          >
            Add Color
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {colors.map((color, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => updateColor(i, e.target.value)}
                className="h-10 w-20 cursor-pointer rounded border border-zinc-700"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => updateColor(i, e.target.value)}
                className="w-24 rounded-lg border border-zinc-700 bg-zinc-900 p-2 font-mono text-xs text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
              />
              {colors.length > 2 && (
                <button
                  onClick={() => removeColor(i)}
                  className="rounded-lg bg-zinc-800 px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-700"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {type === 'linear' ? (
        <div className="flex flex-col gap-2">
          <label htmlFor="gradient-angle" className="text-sm font-medium text-zinc-300">
            Angle (degrees)
          </label>
          <input
            id="gradient-angle"
            type="number"
            min="0"
            max="360"
            value={angle}
            onChange={(e) => setAngle(parseInt(e.target.value) || 90)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <label htmlFor="gradient-position" className="text-sm font-medium text-zinc-300">
            Position
          </label>
          <select
            id="gradient-position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          >
            <option value="circle at center">Center</option>
            <option value="circle at top">Top</option>
            <option value="circle at bottom">Bottom</option>
            <option value="circle at left">Left</option>
            <option value="circle at right">Right</option>
            <option value="circle at top left">Top Left</option>
            <option value="circle at top right">Top Right</option>
            <option value="circle at bottom left">Bottom Left</option>
            <option value="circle at bottom right">Bottom Right</option>
          </select>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="gradient-preview" className="text-sm font-medium text-zinc-300">
            Preview
          </label>
        </div>
        <div
          id="gradient-preview"
          className="h-48 w-full rounded-lg border border-zinc-800"
          style={{ background: css }}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="gradient-css" className="text-sm font-medium text-zinc-300">
            CSS
          </label>
          <CopyButton text={`background: ${css};`} />
        </div>
        <textarea
          id="gradient-css"
          value={`background: ${css};`}
          readOnly
          className="h-24 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
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

