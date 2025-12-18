'use client'

import { useState, useMemo } from 'react'
import { CopyButton } from '@/components/CopyButton'

interface Shadow {
  id: string
  offsetX: number
  offsetY: number
  blur: number
  spread: number
  color: string
  inset: boolean
}

export default function BoxShadowGenerator() {
  const [shadows, setShadows] = useState<Shadow[]>([
    {
      id: '1',
      offsetX: 0,
      offsetY: 4,
      blur: 6,
      spread: -1,
      color: '#000000',
      inset: false,
    },
  ])

  const cssValue = useMemo(() => {
    return shadows
      .map((shadow) => {
        const parts = [
          shadow.inset ? 'inset' : '',
          `${shadow.offsetX}px`,
          `${shadow.offsetY}px`,
          `${shadow.blur}px`,
          `${shadow.spread}px`,
          shadow.color,
        ].filter(Boolean)
        return parts.join(' ')
      })
      .join(', ')
  }, [shadows])

  const addShadow = () => {
    setShadows([
      ...shadows,
      {
        id: Date.now().toString(),
        offsetX: 0,
        offsetY: 4,
        blur: 6,
        spread: 0,
        color: '#000000',
        inset: false,
      },
    ])
  }

  const removeShadow = (id: string) => {
    setShadows(shadows.filter((s) => s.id !== id))
  }

  const updateShadow = (id: string, updates: Partial<Shadow>) => {
    setShadows(shadows.map((s) => (s.id === id ? { ...s, ...updates } : s)))
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-300">Shadows</h3>
            <button
              onClick={addShadow}
              className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-700"
            >
              Add Shadow
            </button>
          </div>

          <div className="space-y-4">
            {shadows.map((shadow, index) => (
              <div
                key={shadow.id}
                className="rounded-lg border border-zinc-700 bg-zinc-900/50 p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-400">Shadow {index + 1}</span>
                  {shadows.length > 1 && (
                    <button
                      onClick={() => removeShadow(shadow.id)}
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs text-zinc-500">Offset X (px)</label>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={shadow.offsetX}
                      onChange={(e) => updateShadow(shadow.id, { offsetX: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="mt-1 text-xs text-zinc-500">{shadow.offsetX}px</div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-zinc-500">Offset Y (px)</label>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={shadow.offsetY}
                      onChange={(e) => updateShadow(shadow.id, { offsetY: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="mt-1 text-xs text-zinc-500">{shadow.offsetY}px</div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-zinc-500">Blur (px)</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={shadow.blur}
                      onChange={(e) => updateShadow(shadow.id, { blur: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="mt-1 text-xs text-zinc-500">{shadow.blur}px</div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-zinc-500">Spread (px)</label>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={shadow.spread}
                      onChange={(e) => updateShadow(shadow.id, { spread: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="mt-1 text-xs text-zinc-500">{shadow.spread}px</div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-zinc-500">Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={shadow.color}
                        onChange={(e) => updateShadow(shadow.id, { color: e.target.value })}
                        className="h-10 w-20 cursor-pointer rounded border border-zinc-700 bg-zinc-900"
                      />
                      <input
                        type="text"
                        value={shadow.color}
                        onChange={(e) => updateShadow(shadow.id, { color: e.target.value })}
                        className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 py-2 font-mono text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={shadow.inset}
                        onChange={(e) => updateShadow(shadow.id, { inset: e.target.checked })}
                        className="rounded border-zinc-700 bg-zinc-900/50 text-zinc-500 focus:ring-zinc-500/20"
                      />
                      <span className="text-xs text-zinc-400">Inset</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-zinc-300">Preview</h3>
          <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900/30 p-8">
            <div
              className="h-32 w-32 rounded-lg bg-zinc-800"
              style={{ boxShadow: cssValue }}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="css-output" className="block text-sm font-medium text-zinc-300">
                CSS
              </label>
              <CopyButton text={`box-shadow: ${cssValue};`} />
            </div>
            <textarea
              id="css-output"
              readOnly
              value={`box-shadow: ${cssValue};`}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

