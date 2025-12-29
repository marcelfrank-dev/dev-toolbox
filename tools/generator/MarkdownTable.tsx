'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

export default function MarkdownTableGenerator() {
    const [rows, setRows] = useState(3)
    const [cols, setCols] = useState(3)
    const [data, setData] = useState<string[][]>(Array(3).fill('').map(() => Array(3).fill('')))
    const [alignments, setAlignments] = useState<string[]>(Array(3).fill('left')) // left, center, right

    const updateCell = (r: number, c: number, val: string) => {
        const newData = [...data]
        newData[r] = [...newData[r]]
        newData[r][c] = val
        setData(newData)
    }

    const generateMarkdown = () => {
        if (data.length === 0) return ''

        // Headers (Row 0)
        const header = '| ' + data[0].map(c => c || 'Header').join(' | ') + ' |'

        // Alignment separator
        const separator = '| ' + alignments.map(a => {
            if (a === 'center') return ':---:'
            if (a === 'right') return '---:'
            return '---'
        }).join(' | ') + ' |'

        // Body (Rows 1+)
        const body = data.slice(1).map(row => {
            return '| ' + row.map(c => c || '').join(' | ') + ' |'
        }).join('\n')

        return `${header}\n${separator}\n${body}`
    }

    const addRow = () => {
        setData([...data, Array(cols).fill('')])
        setRows(r => r + 1)
    }

    const addCol = () => {
        setData(data.map(row => [...row, '']))
        setAlignments([...alignments, 'left'])
        setCols(c => c + 1)
        // We don't reset data, just expand
    }

    const markdown = generateMarkdown()

    return (
        <div className="flex flex-col gap-8">
            {/* Controls */}
            <div className="flex gap-4">
                <button onClick={addRow} className="px-3 py-1 bg-zinc-800 text-xs rounded hover:bg-zinc-700">Add Row</button>
                <button onClick={addCol} className="px-3 py-1 bg-zinc-800 text-xs rounded hover:bg-zinc-700">Add Column</button>
                <button onClick={() => { setData([Array(cols).fill('')]); setRows(1) }} className="px-3 py-1 bg-zinc-800 text-xs rounded hover:bg-zinc-700 text-red-400">Clear Rows</button>
            </div>

            <div className="overflow-x-auto border border-zinc-800 rounded-lg">
                <table className="w-full text-sm">
                    <thead>
                        <tr>
                            {Array(cols).fill(0).map((_, i) => (
                                <th key={i} className="bg-zinc-900 border-b border-r border-zinc-800 p-2 min-w-[100px]">
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="text"
                                            value={data[0]?.[i] || ''}
                                            onChange={e => updateCell(0, i, e.target.value)}
                                            placeholder="Header"
                                            className="bg-transparent text-center font-bold text-zinc-200 outline-none w-full"
                                        />
                                        <div className="flex justify-center gap-1">
                                            <button onClick={() => { const A = [...alignments]; A[i] = 'left'; setAlignments(A) }} className={`text-[10px] w-4 ${alignments[i] === 'left' ? 'text-blue-400' : 'text-zinc-600'}`}>L</button>
                                            <button onClick={() => { const A = [...alignments]; A[i] = 'center'; setAlignments(A) }} className={`text-[10px] w-4 ${alignments[i] === 'center' ? 'text-blue-400' : 'text-zinc-600'}`}>C</button>
                                            <button onClick={() => { const A = [...alignments]; A[i] = 'right'; setAlignments(A) }} className={`text-[10px] w-4 ${alignments[i] === 'right' ? 'text-blue-400' : 'text-zinc-600'}`}>R</button>
                                        </div>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.slice(1).map((row, rIdx) => (
                            <tr key={rIdx}>
                                {row.map((cell, cIdx) => (
                                    <td key={cIdx} className="border-b border-r border-zinc-800 p-0">
                                        <input
                                            type="text"
                                            value={cell}
                                            onChange={e => updateCell(rIdx + 1, cIdx, e.target.value)}
                                            className="w-full bg-transparent p-2 outline-none text-zinc-300"
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="relative">
                <div className="absolute top-2 right-2">
                    <CopyButton text={markdown} />
                </div>
                <pre className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 overflow-x-auto text-sm font-mono text-zinc-400">
                    {markdown}
                </pre>
            </div>
        </div>
    )
}
