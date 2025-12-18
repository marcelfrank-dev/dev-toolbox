'use client'

import { useState, useMemo } from 'react'
import { CopyButton } from '@/components/CopyButton'

export default function CssGridGenerator() {
  const [rows, setRows] = useState(3)
  const [columns, setColumns] = useState(3)
  const [rowGap, setRowGap] = useState(8)
  const [columnGap, setColumnGap] = useState(8)
  const [templateAreas, setTemplateAreas] = useState<string[][]>([])
  const [useTemplateAreas, setUseTemplateAreas] = useState(false)

  const gridTemplateRows = useMemo(() => {
    return `repeat(${rows}, 1fr)`
  }, [rows])

  const gridTemplateColumns = useMemo(() => {
    return `repeat(${columns}, 1fr)`
  }, [columns])

  const gridTemplateAreasValue = useMemo(() => {
    if (!useTemplateAreas || templateAreas.length === 0) return ''
    return templateAreas.map((row) => `"${row.join(' ')}"`).join(' ')
  }, [useTemplateAreas, templateAreas])

  const containerStyle = useMemo(() => {
    const style: React.CSSProperties = {
      display: 'grid',
      gridTemplateRows,
      gridTemplateColumns,
      gap: `${rowGap}px ${columnGap}px`,
      padding: '20px',
      minHeight: '300px',
      backgroundColor: '#18181b',
      border: '1px solid #3f3f46',
      borderRadius: '8px',
    }

    if (useTemplateAreas && gridTemplateAreasValue) {
      style.gridTemplateAreas = gridTemplateAreasValue
    }

    return style
  }, [gridTemplateRows, gridTemplateColumns, rowGap, columnGap, useTemplateAreas, gridTemplateAreasValue])

  const cssCode = useMemo(() => {
    let code = `.container {
  display: grid;
  grid-template-rows: ${gridTemplateRows};
  grid-template-columns: ${gridTemplateColumns};
  gap: ${rowGap}px ${columnGap}px;
`

    if (useTemplateAreas && gridTemplateAreasValue) {
      code += `  grid-template-areas:\n    ${gridTemplateAreasValue.split('"').filter(Boolean).join('\n    ')};\n`
    }

    code += '}'
    return code
  }, [gridTemplateRows, gridTemplateColumns, rowGap, columnGap, useTemplateAreas, gridTemplateAreasValue])

  const totalCells = rows * columns

  const initializeTemplateAreas = () => {
    const areas: string[][] = []
    for (let i = 0; i < rows; i++) {
      const row: string[] = []
      for (let j = 0; j < columns; j++) {
        row.push(`area-${i}-${j}`)
      }
      areas.push(row)
    }
    setTemplateAreas(areas)
  }

  const updateTemplateArea = (row: number, col: number, value: string) => {
    const newAreas = templateAreas.map((r) => [...r])
    newAreas[row][col] = value || `area-${row}-${col}`
    setTemplateAreas(newAreas)
  }

  if (useTemplateAreas && templateAreas.length === 0) {
    initializeTemplateAreas()
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-zinc-300">Grid Properties</h3>

          <div>
            <label className="mb-2 block text-xs text-zinc-500">Rows: {rows}</label>
            <input
              type="range"
              min="1"
              max="6"
              value={rows}
              onChange={(e) => {
                setRows(parseInt(e.target.value))
                if (useTemplateAreas) {
                  initializeTemplateAreas()
                }
              }}
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs text-zinc-500">Columns: {columns}</label>
            <input
              type="range"
              min="1"
              max="6"
              value={columns}
              onChange={(e) => {
                setColumns(parseInt(e.target.value))
                if (useTemplateAreas) {
                  initializeTemplateAreas()
                }
              }}
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs text-zinc-500">Row Gap: {rowGap}px</label>
            <input
              type="range"
              min="0"
              max="40"
              value={rowGap}
              onChange={(e) => setRowGap(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs text-zinc-500">Column Gap: {columnGap}px</label>
            <input
              type="range"
              min="0"
              max="40"
              value={columnGap}
              onChange={(e) => setColumnGap(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={useTemplateAreas}
                onChange={(e) => {
                  setUseTemplateAreas(e.target.checked)
                  if (e.target.checked) {
                    initializeTemplateAreas()
                  }
                }}
                className="rounded border-zinc-700 bg-zinc-900/50 text-zinc-500 focus:ring-zinc-500/20"
              />
              <span className="text-xs text-zinc-400">Use Template Areas</span>
            </label>
          </div>

          {useTemplateAreas && templateAreas.length > 0 && (
            <div>
              <label className="mb-2 block text-xs text-zinc-500">Template Areas</label>
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                {templateAreas.flat().map((area, idx) => {
                  const row = Math.floor(idx / columns)
                  const col = idx % columns
                  return (
                    <input
                      key={idx}
                      type="text"
                      value={area}
                      onChange={(e) => updateTemplateArea(row, col, e.target.value)}
                      className="rounded border border-zinc-700 bg-zinc-900/50 px-2 py-1 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
                      placeholder={`area-${row}-${col}`}
                    />
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-zinc-300">Preview</h3>
          <div style={containerStyle}>
            {Array.from({ length: totalCells }).map((_, i) => {
              const areaName = useTemplateAreas && templateAreas.length > 0
                ? templateAreas[Math.floor(i / columns)][i % columns]
                : undefined
              return (
                <div
                  key={i}
                  className="flex items-center justify-center rounded bg-zinc-700 px-2 py-3 text-xs font-medium text-zinc-100"
                  style={areaName ? { gridArea: areaName } : {}}
                >
                  {i + 1}
                </div>
              )
            })}
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
              rows={12}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

