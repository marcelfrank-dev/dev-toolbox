'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function generateInsert(tableName: string, columns: string[], values: string[][]): string {
  if (!tableName || columns.length === 0 || values.length === 0) return ''

  const columnList = columns.join(', ')
  const valueStatements = values.map((row) => {
    const formattedValues = row.map((val) => {
      if (val === '' || val === null || val === undefined) return 'NULL'
      if (!isNaN(Number(val)) && val.trim() !== '') return val
      return `'${val.replace(/'/g, "''")}'`
    })
    return `(${formattedValues.join(', ')})`
  })

  return `INSERT INTO ${tableName} (${columnList})\nVALUES\n${valueStatements.join(',\n')};`
}

export default function SqlInsertGenerator() {
  const [tableName, setTableName] = useState('users')
  const [columns, setColumns] = useState(['id', 'name', 'email'])
  const [rows, setRows] = useState<Record<string, string>[]>([
    { id: '1', name: 'John', email: 'john@example.com' },
  ])

  const addColumn = () => {
    setColumns([...columns, ''])
  }

  const removeColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index))
    setRows(rows.map((row) => {
      const newRow = { ...row }
      delete newRow[columns[index]]
      return newRow
    }))
  }

  const updateColumn = (index: number, value: string) => {
    const oldName = columns[index]
    const newColumns = [...columns]
    newColumns[index] = value
    setColumns(newColumns)

    setRows(rows.map((row) => {
      const newRow = { ...row }
      if (oldName && newRow[oldName] !== undefined) {
        newRow[value] = newRow[oldName]
        delete newRow[oldName]
      } else {
        newRow[value] = ''
      }
      return newRow
    }))
  }

  const addRow = () => {
    const newRow: Record<string, string> = {}
    columns.forEach((col) => {
      newRow[col] = ''
    })
    setRows([...rows, newRow])
  }

  const removeRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index))
  }

  const updateRow = (rowIndex: number, column: string, value: string) => {
    const newRows = [...rows]
    newRows[rowIndex] = { ...newRows[rowIndex], [column]: value }
    setRows(newRows)
  }

  const values = rows.map((row) => columns.map((col) => row[col] || ''))
  const output = generateInsert(tableName, columns, values)

  const clear = () => {
    setTableName('users')
    setColumns(['id', 'name', 'email'])
    setRows([{ id: '1', name: 'John', email: 'john@example.com' }])
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="sql-table" className="text-sm font-medium text-zinc-300">
          Table Name
        </label>
        <input
          id="sql-table"
          type="text"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-zinc-300">Columns</label>
          <button
            onClick={addColumn}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
          >
            Add Column
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {columns.map((col, i) => (
            <div key={i} className="flex items-center gap-1">
              <input
                type="text"
                value={col}
                onChange={(e) => updateColumn(i, e.target.value)}
                placeholder="column_name"
                className="rounded-lg border border-zinc-700 bg-zinc-900 p-2 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
              />
              {columns.length > 1 && (
                <button
                  onClick={() => removeColumn(i)}
                  className="rounded-lg bg-zinc-800 px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-700"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-zinc-300">Rows</label>
          <button
            onClick={addRow}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
          >
            Add Row
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-zinc-800">
                {columns.map((col) => (
                  <th key={col} className="p-2 text-left text-xs font-medium text-zinc-300">
                    {col || '(empty)'}
                  </th>
                ))}
                <th className="p-2 text-left text-xs font-medium text-zinc-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-zinc-800/50">
                  {columns.map((col) => (
                    <td key={col} className="p-2">
                      <input
                        type="text"
                        value={row[col] || ''}
                        onChange={(e) => updateRow(rowIndex, col, e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-2 font-mono text-xs text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
                      />
                    </td>
                  ))}
                  <td className="p-2">
                    <button
                      onClick={() => removeRow(rowIndex)}
                      className="rounded-lg bg-zinc-800 px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {output && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="sql-output" className="text-sm font-medium text-zinc-300">
              Generated SQL
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            id="sql-output"
            value={output}
            readOnly
            className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
      )}

      <button
        onClick={clear}
        className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
      >
        Reset
      </button>
    </div>
  )
}

