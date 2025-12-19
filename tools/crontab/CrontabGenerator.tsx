'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function generateCron(minute: string, hour: string, day: string, month: string, weekday: string): string {
  return `${minute} ${hour} ${day} ${month} ${weekday}`
}

export default function CrontabGenerator() {
  const [minute, setMinute] = useState('0')
  const [hour, setHour] = useState('*')
  const [day, setDay] = useState('*')
  const [month, setMonth] = useState('*')
  const [weekday, setWeekday] = useState('*')

  const cron = generateCron(minute, hour, day, month, weekday)

  const presets = [
    { name: 'Every minute', cron: '* * * * *' },
    { name: 'Every hour', cron: '0 * * * *' },
    { name: 'Daily at midnight', cron: '0 0 * * *' },
    { name: 'Daily at noon', cron: '0 12 * * *' },
    { name: 'Weekly (Monday 9 AM)', cron: '0 9 * * 1' },
    { name: 'Monthly (1st at midnight)', cron: '0 0 1 * *' },
  ]

  const applyPreset = (presetCron: string) => {
    const parts = presetCron.split(' ')
    setMinute(parts[0])
    setHour(parts[1])
    setDay(parts[2])
    setMonth(parts[3])
    setWeekday(parts[4])
  }

  const clear = () => {
    setMinute('*')
    setHour('*')
    setDay('*')
    setMonth('*')
    setWeekday('*')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-5">
        {[
          { label: 'Minute', value: minute, setter: setMinute, placeholder: '0-59 or *' },
          { label: 'Hour', value: hour, setter: setHour, placeholder: '0-23 or *' },
          { label: 'Day', value: day, setter: setDay, placeholder: '1-31 or *' },
          { label: 'Month', value: month, setter: setMonth, placeholder: '1-12 or *' },
          { label: 'Weekday', value: weekday, setter: setWeekday, placeholder: '0-7 or *' },
        ].map(({ label, value, setter, placeholder }) => (
          <div key={label} className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-300">{label}</label>
            <input
              type="text"
              value={value}
              onChange={(e) => setter(e.target.value)}
              placeholder={placeholder}
              className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            />
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <p className="mb-2 text-sm font-medium text-zinc-300">Presets:</p>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset, i) => (
            <button
              key={i}
              onClick={() => applyPreset(preset.cron)}
              className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="crontab-output" className="text-sm font-medium text-zinc-300">
            Cron Expression
          </label>
          <CopyButton text={cron} />
        </div>
        <input
          id="crontab-output"
          type="text"
          value={cron}
          readOnly
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-lg text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <button
        onClick={clear}
        className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
      >
        Clear
      </button>
    </div>
  )
}

