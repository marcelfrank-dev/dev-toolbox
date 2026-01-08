'use client'

import { useState, useMemo } from 'react'
import { CopyButton } from '@/components/CopyButton'

interface DateRange {
    id: number
    startDate: string
    endDate: string
    useExactDate: boolean
}

interface Duration {
    years: number
    months: number
    days: number
}

function calculateDuration(startStr: string, endStr: string, useExactDate: boolean): Duration {
    if (!startStr || !endStr) {
        return { years: 0, months: 0, days: 0 }
    }

    let start: Date
    let end: Date

    if (useExactDate) {
        start = new Date(startStr)
        end = new Date(endStr)
    } else {
        // Month + Year mode: use first day of start month, last day of end month
        const [startYear, startMonth] = startStr.split('-').map(Number)
        const [endYear, endMonth] = endStr.split('-').map(Number)
        start = new Date(startYear, startMonth - 1, 1)
        end = new Date(endYear, endMonth, 0) // Last day of end month
    }

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
        return { years: 0, months: 0, days: 0 }
    }

    let years = end.getFullYear() - start.getFullYear()
    let months = end.getMonth() - start.getMonth()
    let days = end.getDate() - start.getDate()

    if (days < 0) {
        months--
        const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0)
        days += prevMonth.getDate()
    }

    if (months < 0) {
        years--
        months += 12
    }

    return { years, months, days }
}

function addDurations(durations: Duration[]): Duration {
    let totalDays = 0

    for (const d of durations) {
        // Convert to approximate days for summing
        totalDays += d.years * 365 + d.months * 30 + d.days
    }

    const years = Math.floor(totalDays / 365)
    totalDays %= 365
    const months = Math.floor(totalDays / 30)
    const days = totalDays % 30

    return { years, months, days }
}

function formatDuration(d: Duration): string {
    const parts: string[] = []
    if (d.years > 0) parts.push(`${d.years} year${d.years !== 1 ? 's' : ''}`)
    if (d.months > 0) parts.push(`${d.months} month${d.months !== 1 ? 's' : ''}`)
    if (d.days > 0) parts.push(`${d.days} day${d.days !== 1 ? 's' : ''}`)
    return parts.length > 0 ? parts.join(', ') : '0 days'
}

export default function DateDurationCalculator() {
    const [ranges, setRanges] = useState<DateRange[]>([
        { id: 1, startDate: '', endDate: '', useExactDate: true },
    ])
    const [nextId, setNextId] = useState(2)

    const addRange = () => {
        setRanges([...ranges, { id: nextId, startDate: '', endDate: '', useExactDate: true }])
        setNextId(nextId + 1)
    }

    const removeRange = (id: number) => {
        if (ranges.length > 1) {
            setRanges(ranges.filter((r) => r.id !== id))
        }
    }

    const updateRange = (id: number, field: keyof DateRange, value: string | boolean) => {
        setRanges(
            ranges.map((r) => {
                if (r.id === id) {
                    const updated = { ...r, [field]: value }
                    // Reset dates when switching mode
                    if (field === 'useExactDate') {
                        updated.startDate = ''
                        updated.endDate = ''
                    }
                    return updated
                }
                return r
            })
        )
    }

    const durations = useMemo(() => {
        return ranges.map((r) => ({
            id: r.id,
            duration: calculateDuration(r.startDate, r.endDate, r.useExactDate),
        }))
    }, [ranges])

    const totalDuration = useMemo(() => {
        return addDurations(durations.map((d) => d.duration))
    }, [durations])

    const resultsText = useMemo(() => {
        const lines = durations.map((d, i) => `Period ${i + 1}: ${formatDuration(d.duration)}`)
        lines.push(`\nTotal: ${formatDuration(totalDuration)}`)
        return lines.join('\n')
    }, [durations, totalDuration])

    const clear = () => {
        setRanges([{ id: nextId, startDate: '', endDate: '', useExactDate: true }])
        setNextId(nextId + 1)
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
                {ranges.map((range, index) => {
                    const rangeDuration = durations.find((d) => d.id === range.id)?.duration
                    return (
                        <div
                            key={range.id}
                            className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-4"
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <span className="text-sm font-medium text-zinc-300">
                                    Period {index + 1}
                                </span>
                                <div className="flex items-center gap-3">
                                    <label className="flex items-center gap-2 text-xs text-zinc-400">
                                        <input
                                            type="checkbox"
                                            checked={range.useExactDate}
                                            onChange={(e) => updateRange(range.id, 'useExactDate', e.target.checked)}
                                            className="h-4 w-4 rounded border-zinc-600 bg-zinc-700 text-emerald-500 focus:ring-emerald-500/20"
                                        />
                                        Exact date
                                    </label>
                                    {ranges.length > 1 && (
                                        <button
                                            onClick={() => removeRange(range.id)}
                                            className="text-zinc-500 transition-colors hover:text-red-400"
                                            title="Remove period"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-medium text-zinc-400">Start Date</label>
                                    <input
                                        type={range.useExactDate ? 'date' : 'month'}
                                        value={range.startDate}
                                        onChange={(e) => updateRange(range.id, 'startDate', e.target.value)}
                                        className="rounded-lg border border-zinc-700 bg-zinc-900 p-2.5 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-medium text-zinc-400">End Date</label>
                                    <input
                                        type={range.useExactDate ? 'date' : 'month'}
                                        value={range.endDate}
                                        onChange={(e) => updateRange(range.id, 'endDate', e.target.value)}
                                        className="rounded-lg border border-zinc-700 bg-zinc-900 p-2.5 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                    />
                                </div>
                            </div>

                            {rangeDuration && (range.startDate || range.endDate) && (
                                <div className="mt-3 rounded-lg bg-zinc-900/50 p-2.5 text-center">
                                    <span className="text-sm text-zinc-400">Duration: </span>
                                    <span className="font-medium text-emerald-400">
                                        {formatDuration(rangeDuration)}
                                    </span>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            <button
                onClick={addRange}
                className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-600 bg-zinc-800/30 px-4 py-3 text-sm font-medium text-zinc-400 transition-colors hover:border-emerald-500/50 hover:bg-zinc-800/50 hover:text-emerald-400"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                    />
                </svg>
                Add Period
            </button>

            {ranges.some((r) => r.startDate && r.endDate) && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-semibold text-emerald-400">Total Experience</span>
                        <CopyButton text={resultsText} />
                    </div>
                    <div className="text-2xl font-bold text-white">
                        {formatDuration(totalDuration)}
                    </div>
                    {ranges.length > 1 && (
                        <div className="mt-3 border-t border-zinc-700 pt-3">
                            <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                                Breakdown
                            </span>
                            {durations.map((d, i) => (
                                <div key={d.id} className="flex justify-between py-1 text-sm">
                                    <span className="text-zinc-400">Period {i + 1}</span>
                                    <span className="text-zinc-300">{formatDuration(d.duration)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <button
                onClick={clear}
                className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
            >
                Clear All
            </button>
        </div>
    )
}
