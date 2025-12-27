'use client'

import { useState, useMemo } from 'react'
import { CopyButton } from '@/components/CopyButton'

interface GridPreset {
  name: string
  columns: string
  rows: string
  description: string
}

const GRID_PRESETS: GridPreset[] = [
  {
    name: '12-Column Grid',
    columns: 'repeat(12, 1fr)',
    rows: 'auto',
    description: 'Common 12-column grid system used in many frameworks',
  },
  {
    name: '16-Column Grid',
    columns: 'repeat(16, 1fr)',
    rows: 'auto',
    description: '16-column grid system',
  },
  {
    name: 'Auto-fit Card Grid',
    columns: 'repeat(auto-fit, minmax(250px, 1fr))',
    rows: 'auto',
    description: 'Responsive card grid that adapts to container width',
  },
  {
    name: 'Auto-fill Card Grid',
    columns: 'repeat(auto-fill, minmax(200px, 1fr))',
    rows: 'auto',
    description: 'Responsive grid that fills available space',
  },
  {
    name: 'Holy Grail Layout',
    columns: '200px 1fr 200px',
    rows: 'auto 1fr auto',
    description: 'Classic layout with header, sidebar, main, footer',
  },
  {
    name: 'Asymmetric 3-Column',
    columns: '200px 1fr 300px',
    rows: 'auto',
    description: 'Three columns with fixed sidebars',
  },
  {
    name: 'Equal Columns',
    columns: '1fr 1fr 1fr',
    rows: 'auto',
    description: 'Three equal-width columns',
  },
  {
    name: 'Masonry Style',
    columns: 'repeat(auto-fill, minmax(150px, 1fr))',
    rows: 'masonry',
    description: 'Masonry-style layout (requires CSS Grid Level 3)',
  },
]

type InputMode = 'simple' | 'advanced'

export default function CssGridGenerator() {
  const [inputMode, setInputMode] = useState<InputMode>('simple')
  const [rows, setRows] = useState(3)
  const [columns, setColumns] = useState(3)
  const [customColumns, setCustomColumns] = useState('')
  const [customRows, setCustomRows] = useState('')
  const [rowGap, setRowGap] = useState(8)
  const [columnGap, setColumnGap] = useState(8)
  const [gapUnit, setGapUnit] = useState<'px' | 'rem' | 'em' | '%'>('px')
  const [useUnifiedGap, setUseUnifiedGap] = useState(true)
  const [gridAutoFlow, setGridAutoFlow] = useState<'row' | 'column' | 'row dense' | 'column dense'>('row')
  const [justifyItems, setJustifyItems] = useState<'start' | 'end' | 'center' | 'stretch'>('stretch')
  const [alignItems, setAlignItems] = useState<'start' | 'end' | 'center' | 'stretch' | 'baseline'>('stretch')
  const [justifyContent, setJustifyContent] = useState<
    'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly'
  >('start')
  const [alignContent, setAlignContent] = useState<
    'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly'
  >('start')
  const [gridAutoRows, setGridAutoRows] = useState('')
  const [gridAutoColumns, setGridAutoColumns] = useState('')
  const [templateAreas, setTemplateAreas] = useState<string[][]>([])
  const [useTemplateAreas, setUseTemplateAreas] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<string>('')

  const gridTemplateRows = useMemo(() => {
    if (inputMode === 'advanced' && customRows.trim()) {
      return customRows.trim()
    }
    return `repeat(${rows}, 1fr)`
  }, [rows, customRows, inputMode])

  const gridTemplateColumns = useMemo(() => {
    if (inputMode === 'advanced' && customColumns.trim()) {
      return customColumns.trim()
    }
    return `repeat(${columns}, 1fr)`
  }, [columns, customColumns, inputMode])

  const gridTemplateAreasValue = useMemo(() => {
    if (!useTemplateAreas || templateAreas.length === 0) return ''
    return templateAreas.map((row) => `"${row.join(' ')}"`).join(' ')
  }, [useTemplateAreas, templateAreas])

  const gapValue = useMemo(() => {
    if (useUnifiedGap) {
      return `${rowGap}${gapUnit}`
    }
    return `${rowGap}${gapUnit} ${columnGap}${gapUnit}`
  }, [rowGap, columnGap, gapUnit, useUnifiedGap])

  const containerStyle = useMemo(() => {
    const style: React.CSSProperties = {
      display: 'grid',
      gridTemplateRows,
      gridTemplateColumns,
      gap: gapValue,
      gridAutoFlow,
      justifyItems,
      alignItems,
      justifyContent,
      alignContent,
      padding: '20px',
      minHeight: '300px',
      backgroundColor: '#18181b',
      border: '1px solid #3f3f46',
      borderRadius: '8px',
    }

    if (gridAutoRows) {
      style.gridAutoRows = gridAutoRows
    }
    if (gridAutoColumns) {
      style.gridAutoColumns = gridAutoColumns
    }
    if (useTemplateAreas && gridTemplateAreasValue) {
      style.gridTemplateAreas = gridTemplateAreasValue
    }

    return style
  }, [
    gridTemplateRows,
    gridTemplateColumns,
    gapValue,
    gridAutoFlow,
    justifyItems,
    alignItems,
    justifyContent,
    alignContent,
    gridAutoRows,
    gridAutoColumns,
    useTemplateAreas,
    gridTemplateAreasValue,
  ])

  const cssCode = useMemo(() => {
    let code = `.container {
  display: grid;
  grid-template-rows: ${gridTemplateRows};
  grid-template-columns: ${gridTemplateColumns};
  gap: ${gapValue};
  grid-auto-flow: ${gridAutoFlow};
  justify-items: ${justifyItems};
  align-items: ${alignItems};
  justify-content: ${justifyContent};
  align-content: ${alignContent};`

    if (gridAutoRows) {
      code += `\n  grid-auto-rows: ${gridAutoRows};`
    }
    if (gridAutoColumns) {
      code += `\n  grid-auto-columns: ${gridAutoColumns};`
    }
    if (useTemplateAreas && gridTemplateAreasValue) {
      code += `\n  grid-template-areas:\n    ${gridTemplateAreasValue.split('"').filter(Boolean).join('\n    ')};`
    }

    code += '\n}'
    return code
  }, [
    gridTemplateRows,
    gridTemplateColumns,
    gapValue,
    gridAutoFlow,
    justifyItems,
    alignItems,
    justifyContent,
    alignContent,
    gridAutoRows,
    gridAutoColumns,
    useTemplateAreas,
    gridTemplateAreasValue,
  ])

  const totalCells = useMemo(() => {
    if (inputMode === 'advanced' && customColumns.trim()) {
      // Try to estimate cells from custom columns
      const parts = customColumns.split(/\s+/).filter(Boolean)
      return Math.max(parts.length, 1) * rows
    }
    return rows * columns
  }, [rows, columns, customColumns, inputMode])

  const initializeTemplateAreas = () => {
    const areas: string[][] = []
    const rowCount = rows
    const colCount = inputMode === 'advanced' && customColumns.trim()
      ? customColumns.split(/\s+/).filter(Boolean).length
      : columns
    for (let i = 0; i < rowCount; i++) {
      const row: string[] = []
      for (let j = 0; j < colCount; j++) {
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

  const handlePresetSelect = (preset: GridPreset) => {
    setSelectedPreset(preset.name)
    setInputMode('advanced')
    setCustomColumns(preset.columns)
    setCustomRows(preset.rows)
  }

  const clearPreset = () => {
    setSelectedPreset('')
    setCustomColumns('')
    setCustomRows('')
    setInputMode('simple')
  }

  if (useTemplateAreas && templateAreas.length === 0) {
    initializeTemplateAreas()
  }

  const currentColCount = inputMode === 'advanced' && customColumns.trim()
    ? customColumns.split(/\s+/).filter(Boolean).length
    : columns

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <div>
          <label className="text-sm font-medium text-zinc-300">Input Mode</label>
          <p className="text-xs text-zinc-500">Choose how to define your grid</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setInputMode('simple')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              inputMode === 'simple'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            Simple
          </button>
          <button
            onClick={() => setInputMode('advanced')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              inputMode === 'advanced'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            Advanced
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Panel - Controls */}
        <div className="space-y-6">
          {/* Presets */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">Grid Presets</label>
            <select
              value={selectedPreset}
              onChange={(e) => {
                if (e.target.value) {
                  const preset = GRID_PRESETS.find((p) => p.name === e.target.value)
                  if (preset) handlePresetSelect(preset)
                } else {
                  clearPreset()
                }
              }}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            >
              <option value="">Select a preset...</option>
              {GRID_PRESETS.map((preset) => (
                <option key={preset.name} value={preset.name}>
                  {preset.name} - {preset.description}
                </option>
              ))}
            </select>
            {selectedPreset && (
              <button
                onClick={clearPreset}
                className="mt-2 text-xs text-zinc-400 hover:text-zinc-300"
              >
                Clear preset
              </button>
            )}
          </div>

          {/* Grid Template Columns */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Grid Template Columns
            </label>
            {inputMode === 'simple' ? (
              <>
                <div>
                  <label className="mb-2 block text-xs text-zinc-500">Columns: {columns}</label>
                  <input
                    type="range"
                    min="1"
                    max="12"
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
                <p className="mt-2 text-xs text-zinc-500">
                  Current: <code className="text-emerald-400">{gridTemplateColumns}</code>
                </p>
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={customColumns}
                  onChange={(e) => {
                    setCustomColumns(e.target.value)
                    if (useTemplateAreas) {
                      initializeTemplateAreas()
                    }
                  }}
                  placeholder="e.g., 1fr 2fr 1fr or repeat(3, 1fr) or minmax(200px, 1fr)"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
                />
                <p className="mt-2 text-xs text-zinc-500">
                  Examples: <code className="text-emerald-400">1fr 2fr 1fr</code>,{' '}
                  <code className="text-emerald-400">repeat(12, 1fr)</code>,{' '}
                  <code className="text-emerald-400">200px 1fr 300px</code>,{' '}
                  <code className="text-emerald-400">repeat(auto-fit, minmax(250px, 1fr))</code>
                </p>
              </>
            )}
          </div>

          {/* Grid Template Rows */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">Grid Template Rows</label>
            {inputMode === 'simple' ? (
              <>
                <div>
                  <label className="mb-2 block text-xs text-zinc-500">Rows: {rows}</label>
                  <input
                    type="range"
                    min="1"
                    max="12"
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
                <p className="mt-2 text-xs text-zinc-500">
                  Current: <code className="text-emerald-400">{gridTemplateRows}</code>
                </p>
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={customRows}
                  onChange={(e) => setCustomRows(e.target.value)}
                  placeholder="e.g., auto 1fr auto or repeat(3, 1fr)"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
                />
                <p className="mt-2 text-xs text-zinc-500">
                  Examples: <code className="text-emerald-400">auto</code>,{' '}
                  <code className="text-emerald-400">auto 1fr auto</code>,{' '}
                  <code className="text-emerald-400">repeat(3, 1fr)</code>
                </p>
              </>
            )}
          </div>

          {/* Gap Controls */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">Gap</label>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={useUnifiedGap}
                  onChange={(e) => setUseUnifiedGap(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                />
                <span className="text-sm text-zinc-300">Use unified gap</span>
              </div>
              {useUnifiedGap ? (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <label className="text-xs text-zinc-500">Gap: {rowGap}{gapUnit}</label>
                    <select
                      value={gapUnit}
                      onChange={(e) => setGapUnit(e.target.value as typeof gapUnit)}
                      className="ml-auto rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-200"
                    >
                      <option value="px">px</option>
                      <option value="rem">rem</option>
                      <option value="em">em</option>
                      <option value="%">%</option>
                    </select>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={gapUnit === '%' ? 20 : gapUnit === 'rem' ? 5 : gapUnit === 'em' ? 5 : 40}
                    step={gapUnit === 'px' ? 1 : 0.1}
                    value={rowGap}
                    onChange={(e) => setRowGap(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <label className="text-xs text-zinc-500">Row Gap: {rowGap}{gapUnit}</label>
                      <select
                        value={gapUnit}
                        onChange={(e) => setGapUnit(e.target.value as typeof gapUnit)}
                        className="ml-auto rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-200"
                      >
                        <option value="px">px</option>
                        <option value="rem">rem</option>
                        <option value="em">em</option>
                        <option value="%">%</option>
                      </select>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={gapUnit === '%' ? 20 : gapUnit === 'rem' ? 5 : gapUnit === 'em' ? 5 : 40}
                      step={gapUnit === 'px' ? 1 : 0.1}
                      value={rowGap}
                      onChange={(e) => setRowGap(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs text-zinc-500">
                      Column Gap: {columnGap}{gapUnit}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max={gapUnit === '%' ? 20 : gapUnit === 'rem' ? 5 : gapUnit === 'em' ? 5 : 40}
                      step={gapUnit === 'px' ? 1 : 0.1}
                      value={columnGap}
                      onChange={(e) => setColumnGap(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Grid Auto Flow */}
          <div>
            <label htmlFor="auto-flow" className="mb-2 block text-sm font-medium text-zinc-300">
              Grid Auto Flow
            </label>
            <select
              id="auto-flow"
              value={gridAutoFlow}
              onChange={(e) => setGridAutoFlow(e.target.value as typeof gridAutoFlow)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            >
              <option value="row">row (default)</option>
              <option value="column">column</option>
              <option value="row dense">row dense</option>
              <option value="column dense">column dense</option>
            </select>
          </div>

          {/* Alignment Properties */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-zinc-300">Alignment</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="justify-items" className="mb-2 block text-xs text-zinc-500">
                  justify-items
                </label>
                <select
                  id="justify-items"
                  value={justifyItems}
                  onChange={(e) => setJustifyItems(e.target.value as typeof justifyItems)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-2 text-xs text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
                >
                  <option value="stretch">stretch</option>
                  <option value="start">start</option>
                  <option value="end">end</option>
                  <option value="center">center</option>
                </select>
              </div>
              <div>
                <label htmlFor="align-items" className="mb-2 block text-xs text-zinc-500">
                  align-items
                </label>
                <select
                  id="align-items"
                  value={alignItems}
                  onChange={(e) => setAlignItems(e.target.value as typeof alignItems)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-2 text-xs text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
                >
                  <option value="stretch">stretch</option>
                  <option value="start">start</option>
                  <option value="end">end</option>
                  <option value="center">center</option>
                  <option value="baseline">baseline</option>
                </select>
              </div>
              <div>
                <label htmlFor="justify-content" className="mb-2 block text-xs text-zinc-500">
                  justify-content
                </label>
                <select
                  id="justify-content"
                  value={justifyContent}
                  onChange={(e) => setJustifyContent(e.target.value as typeof justifyContent)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-2 text-xs text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
                >
                  <option value="start">start</option>
                  <option value="end">end</option>
                  <option value="center">center</option>
                  <option value="stretch">stretch</option>
                  <option value="space-around">space-around</option>
                  <option value="space-between">space-between</option>
                  <option value="space-evenly">space-evenly</option>
                </select>
              </div>
              <div>
                <label htmlFor="align-content" className="mb-2 block text-xs text-zinc-500">
                  align-content
                </label>
                <select
                  id="align-content"
                  value={alignContent}
                  onChange={(e) => setAlignContent(e.target.value as typeof alignContent)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-2 text-xs text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
                >
                  <option value="start">start</option>
                  <option value="end">end</option>
                  <option value="center">center</option>
                  <option value="stretch">stretch</option>
                  <option value="space-around">space-around</option>
                  <option value="space-between">space-between</option>
                  <option value="space-evenly">space-evenly</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid Auto Rows/Columns */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-zinc-300">Auto Sizing</h4>
            <div>
              <label htmlFor="auto-rows" className="mb-2 block text-xs text-zinc-500">
                grid-auto-rows (optional)
              </label>
              <input
                id="auto-rows"
                type="text"
                value={gridAutoRows}
                onChange={(e) => setGridAutoRows(e.target.value)}
                placeholder="e.g., 100px or minmax(50px, auto)"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
              />
            </div>
            <div>
              <label htmlFor="auto-columns" className="mb-2 block text-xs text-zinc-500">
                grid-auto-columns (optional)
              </label>
              <input
                id="auto-columns"
                type="text"
                value={gridAutoColumns}
                onChange={(e) => setGridAutoColumns(e.target.value)}
                placeholder="e.g., 100px or minmax(50px, auto)"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
              />
            </div>
          </div>

          {/* Template Areas */}
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
                className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
              />
              <span className="text-sm text-zinc-300">Use Template Areas</span>
            </label>
            {useTemplateAreas && templateAreas.length > 0 && (
              <div className="mt-3">
                <label className="mb-2 block text-xs text-zinc-500">Template Areas</label>
                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${currentColCount}, 1fr)` }}>
                  {templateAreas.flat().map((area, idx) => {
                    const row = Math.floor(idx / currentColCount)
                    const col = idx % currentColCount
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
        </div>

        {/* Right Panel - Preview and CSS */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-zinc-300">Preview</h3>
          <div style={containerStyle}>
            {Array.from({ length: totalCells }).map((_, i) => {
              const areaName = useTemplateAreas && templateAreas.length > 0
                ? templateAreas[Math.floor(i / currentColCount)][i % currentColCount]
                : undefined
              return (
                <div
                  key={i}
                  className="flex items-center justify-center rounded bg-zinc-700 px-2 py-3 text-xs font-medium text-zinc-100 transition-colors hover:bg-zinc-600"
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
              rows={16}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
