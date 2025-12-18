'use client'

import { useState, useMemo } from 'react'
import { CopyButton } from '@/components/CopyButton'

export default function FlexboxPlayground() {
  const [direction, setDirection] = useState<'row' | 'column'>('row')
  const [justifyContent, setJustifyContent] = useState('flex-start')
  const [alignItems, setAlignItems] = useState('stretch')
  const [flexWrap, setFlexWrap] = useState<React.CSSProperties['flexWrap']>('nowrap')
  const [gap, setGap] = useState(8)
  const [childCount, setChildCount] = useState(3)

  const containerStyle = useMemo<React.CSSProperties>(() => {
    return {
      display: 'flex',
      flexDirection: direction,
      justifyContent: justifyContent as React.CSSProperties['justifyContent'],
      alignItems: alignItems as React.CSSProperties['alignItems'],
      flexWrap,
      gap: `${gap}px`,
      padding: '20px',
      minHeight: '200px',
      backgroundColor: '#18181b',
      border: '1px solid #3f3f46',
      borderRadius: '8px',
    }
  }, [direction, justifyContent, alignItems, flexWrap, gap])

  const cssCode = useMemo(() => {
    return `.container {
  display: flex;
  flex-direction: ${direction};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  flex-wrap: ${flexWrap};
  gap: ${gap}px;
}`
  }, [direction, justifyContent, alignItems, flexWrap, gap])

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-zinc-300">Container Properties</h3>

          <div>
            <label className="mb-2 block text-xs text-zinc-500">Flex Direction</label>
            <div className="flex gap-2">
              {(['row', 'column'] as const).map((value) => (
                <button
                  key={value}
                  onClick={() => setDirection(value)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    direction === value
                      ? 'border-zinc-500 bg-zinc-800 text-zinc-100'
                      : 'border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900 hover:text-zinc-300'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs text-zinc-500">Justify Content</label>
            <select
              value={justifyContent}
              onChange={(e) => setJustifyContent(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            >
              <option value="flex-start">flex-start</option>
              <option value="flex-end">flex-end</option>
              <option value="center">center</option>
              <option value="space-between">space-between</option>
              <option value="space-around">space-around</option>
              <option value="space-evenly">space-evenly</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs text-zinc-500">Align Items</label>
            <select
              value={alignItems}
              onChange={(e) => setAlignItems(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            >
              <option value="stretch">stretch</option>
              <option value="flex-start">flex-start</option>
              <option value="flex-end">flex-end</option>
              <option value="center">center</option>
              <option value="baseline">baseline</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs text-zinc-500">Flex Wrap</label>
            <select
              value={flexWrap}
              onChange={(e) => setFlexWrap(e.target.value as React.CSSProperties['flexWrap'])}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            >
              <option value="nowrap">nowrap</option>
              <option value="wrap">wrap</option>
              <option value="wrap-reverse">wrap-reverse</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs text-zinc-500">Gap: {gap}px</label>
            <input
              type="range"
              min="0"
              max="40"
              value={gap}
              onChange={(e) => setGap(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs text-zinc-500">Number of Children: {childCount}</label>
            <input
              type="range"
              min="1"
              max="12"
              value={childCount}
              onChange={(e) => setChildCount(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-zinc-300">Preview</h3>
          <div style={containerStyle}>
            {Array.from({ length: childCount }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-center rounded bg-zinc-700 px-4 py-3 text-sm font-medium text-zinc-100"
                style={{ minWidth: '60px', minHeight: '60px' }}
              >
                {i + 1}
              </div>
            ))}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="css-output" className="block text-sm font-medium text-zinc-300">
                CSS
              </label>
              <CopyButton text={cssCode} />
            </div>
            <textarea
              id="css-output"
              readOnly
              value={cssCode}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
              rows={8}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

