'use client'

import { useState, useMemo, useEffect } from 'react'
import { CopyButton } from '@/components/CopyButton'

type Alignment = 'left' | 'center' | 'right'

export default function MarkdownTableGenerator() {
  const [rows, setRows] = useState(3)
  const [columns, setColumns] = useState(3)
  const [data, setData] = useState<string[][]>([])
  const [alignments, setAlignments] = useState<Alignment[]>([])
  const [hasHeader, setHasHeader] = useState(true)

  // Initialize and update data when rows/columns change
  useEffect(() => {
    const newData: string[][] = []
    for (let i = 0; i < rows; i++) {
      const row: string[] = data[i] || []
      while (row.length < columns) {
        row.push('')
      }
      newData.push(row.slice(0, columns))
    }
    while (newData.length < rows) {
      newData.push(new Array(columns).fill(''))
    }
    setData(newData)

    const newAlignments = [...alignments]
    while (newAlignments.length < columns) {
      newAlignments.push('left')
    }
    setAlignments(newAlignments.slice(0, columns))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, columns])

  const updateCell = (row: number, col: number, value: string) => {
    const newData = data.map((r) => [...r])
    if (!newData[row]) {
      newData[row] = new Array(columns).fill('')
    }
    newData[row][col] = value
    setData(newData)
  }

  const updateAlignment = (col: number, alignment: Alignment) => {
    const newAlignments = [...alignments]
    newAlignments[col] = alignment
    setAlignments(newAlignments)
  }

  const addRow = () => {
    setRows(rows + 1)
    setData([...data, new Array(columns).fill('')])
  }

  const removeRow = (index: number) => {
    if (rows > 1) {
      setRows(rows - 1)
      setData(data.filter((_, i) => i !== index))
    }
  }

  const addColumn = () => {
    setColumns(columns + 1)
    setData(data.map((row) => [...row, '']))
    setAlignments([...alignments, 'left'])
  }

  const removeColumn = (index: number) => {
    if (columns > 1) {
      setColumns(columns - 1)
      setData(data.map((row) => row.filter((_, i) => i !== index)))
      setAlignments(alignments.filter((_, i) => i !== index))
    }
  }

  const markdownTable = useMemo(() => {
    if (data.length === 0) return ''

    const lines: string[] = []

    // Header row
    if (hasHeader && data.length > 0) {
      const headerRow = data[0].map((cell) => cell || ' ').join(' | ')
      lines.push(`| ${headerRow} |`)
    }

    // Separator row
    const separator = alignments.map((align) => {
      switch (align) {
        case 'left':
          return ':---'
        case 'center':
          return ':---:'
        case 'right':
          return '---:'
        default:
          return '---'
      }
    }).join(' | ')
    lines.push(`| ${separator} |`)

    // Data rows
    const startRow = hasHeader ? 1 : 0
    for (let i = startRow; i < data.length; i++) {
      const row = data[i].map((cell) => cell || ' ').join(' | ')
      lines.push(`| ${row} |`)
    }

    return lines.join('\n')
  }, [data, alignments, hasHeader])

  const renderedPreview = useMemo(() => {
    // Simple markdown table rendering (basic)
    return markdownTable
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')
  }, [markdownTable])

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editor */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-300">Table Editor</h3>
            <div className="flex gap-2">
              <button
                onClick={addRow}
                className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-100 transition-colors hover:bg-zinc-700"
              >
                + Row
              </button>
              <button
                onClick={addColumn}
                className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-100 transition-colors hover:bg-zinc-700"
              >
                + Col
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={hasHeader}
                onChange={(e) => setHasHeader(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
              />
              <span className="text-sm text-zinc-300">Header row</span>
            </label>
          </div>

          <div className="space-y-2 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {Array.from({ length: columns }).map((_, colIdx) => (
                    <th key={colIdx} className="border border-zinc-700 bg-zinc-900/50 p-2">
                      <div className="mb-1">
                        <select
                          value={alignments[colIdx] || 'left'}
                          onChange={(e) => updateAlignment(colIdx, e.target.value as Alignment)}
                          className="w-full rounded border border-zinc-700 bg-zinc-950 px-1 py-0.5 text-xs text-zinc-200"
                        >
                          <option value="left">Left</option>
                          <option value="center">Center</option>
                          <option value="right">Right</option>
                        </select>
                      </div>
                      {colIdx < columns - 1 && (
                        <button
                          onClick={() => removeColumn(colIdx)}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          ×
                        </button>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: rows }).map((_, rowIdx) => (
                  <tr key={rowIdx}>
                    {Array.from({ length: columns }).map((_, colIdx) => (
                      <td key={colIdx} className="border border-zinc-700 bg-zinc-900/30 p-1">
                        <input
                          type="text"
                          value={data[rowIdx]?.[colIdx] || ''}
                          onChange={(e) => updateCell(rowIdx, colIdx, e.target.value)}
                          className="w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-200 focus:border-zinc-600 focus:outline-none"
                          placeholder={`R${rowIdx + 1}C${colIdx + 1}`}
                        />
                      </td>
                    ))}
                    {rowIdx < rows - 1 && (
                      <td className="border border-zinc-700 bg-zinc-900/30 p-1">
                        <button
                          onClick={() => removeRow(rowIdx)}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          ×
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Output */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-300">Markdown Output</label>
            <CopyButton text={markdownTable} />
          </div>
          <textarea
            readOnly
            value={markdownTable}
            className="h-64 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">Preview</label>
            <div className="rounded-lg border border-zinc-700 bg-zinc-900/50 p-4">
              <div
                className="prose prose-invert max-w-none text-sm"
                dangerouslySetInnerHTML={{ __html: renderedPreview }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

