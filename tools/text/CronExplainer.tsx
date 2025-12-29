'use client'

import { useState } from 'react'
import cronstrue from 'cronstrue'
import { CopyButton } from '@/components/CopyButton'

const PRESETS = [
    { name: 'Every Minute', value: '* * * * *' },
    { name: 'Every 5 Minutes', value: '*/5 * * * *' },
    { name: 'Hourly', value: '0 * * * *' },
    { name: 'Daily (Midnight)', value: '0 0 * * *' },
    { name: 'Weekly (Sunday)', value: '0 0 * * 0' },
    { name: 'Monthly (1st)', value: '0 0 1 * *' },
]

export default function CronExplainer() {
    const [cron, setCron] = useState('*/5 4 * * 1-5')

    let explanation = ''
    let nextDates: string[] = []

    try {
        if (cron.trim()) {
            explanation = cronstrue.toString(cron)
            // Calculating next dates would require another lib like 'cron-parser',
            // for now, describing it is the main value.
        }
    } catch (e) {
        explanation = 'Invalid cron expression'
    }

    return (
        <div className="max-w-3xl mx-auto flex flex-col gap-8 text-center pt-8">
            <div className="flex flex-col gap-4">
                <input
                    type="text"
                    value={cron}
                    onChange={(e) => setCron(e.target.value)}
                    className="w-full text-center text-4xl font-mono font-bold bg-transparent border-b-2 border-zinc-800 focus:border-emerald-500 outline-none py-4 text-zinc-100 placeholder-zinc-700 transition-colors"
                    placeholder="* * * * *"
                />

                <div className="h-24 flex items-center justify-center">
                    <p className="text-xl text-emerald-400 font-medium">
                        {explanation}
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
                {PRESETS.map(p => (
                    <button
                        key={p.name}
                        onClick={() => setCron(p.value)}
                        className="px-4 py-2 rounded-full border border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700 hover:border-zinc-500 text-sm font-medium transition-all"
                    >
                        {p.name}
                    </button>
                ))}
            </div>

            <div className="mt-8 p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 text-left space-y-4">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Cheat Sheet</h3>
                <div className="grid grid-cols-5 gap-4 text-center font-mono text-sm text-zinc-500">
                    <div className="flex flex-col gap-1">
                        <span className="text-zinc-300 bg-zinc-800 rounded py-1">*</span>
                        <span>Minute</span>
                        <span className="text-[10px] opacity-60">(0-59)</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-zinc-300 bg-zinc-800 rounded py-1">*</span>
                        <span>Hour</span>
                        <span className="text-[10px] opacity-60">(0-23)</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-zinc-300 bg-zinc-800 rounded py-1">*</span>
                        <span>Day (Month)</span>
                        <span className="text-[10px] opacity-60">(1-31)</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-zinc-300 bg-zinc-800 rounded py-1">*</span>
                        <span>Month</span>
                        <span className="text-[10px] opacity-60">(1-12)</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-zinc-300 bg-zinc-800 rounded py-1">*</span>
                        <span>Day (Week)</span>
                        <span className="text-[10px] opacity-60">(0-6)</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
