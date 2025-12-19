'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

const CRON_FIELDS = ['minute', 'hour', 'day', 'month', 'weekday']

function parseCron(cron: string): string {
  const parts = cron.trim().split(/\s+/)
  if (parts.length !== 5) {
    return 'Invalid cron expression. Expected 5 fields: minute hour day month weekday'
  }

  const descriptions: string[] = []
  const fieldNames = ['Minute', 'Hour', 'Day of Month', 'Month', 'Day of Week']

  parts.forEach((part, index) => {
    const fieldName = fieldNames[index]
    let desc = ''

    if (part === '*') {
      desc = 'Every ' + (index === 0 ? 'minute' : index === 1 ? 'hour' : index === 2 ? 'day' : index === 3 ? 'month' : 'weekday')
    } else if (part.includes('/')) {
      const [range, step] = part.split('/')
      const stepNum = parseInt(step)
      if (range === '*') {
        desc = `Every ${stepNum} ${fieldName.toLowerCase()}${stepNum > 1 ? 's' : ''}`
      } else {
        desc = `Every ${stepNum} ${fieldName.toLowerCase()}${stepNum > 1 ? 's' : ''} from ${range}`
      }
    } else if (part.includes('-')) {
      const [start, end] = part.split('-')
      desc = `From ${start} to ${end} ${fieldName.toLowerCase()}`
    } else if (part.includes(',')) {
      const values = part.split(',')
      desc = `On ${values.join(', ')} ${fieldName.toLowerCase()}${values.length > 1 ? 's' : ''}`
    } else {
      desc = `On ${part} ${fieldName.toLowerCase()}`
    }

    descriptions.push(`${fieldName}: ${desc}`)
  })

  return descriptions.join('\n')
}

export default function CronExpressionParser() {
  const [cron, setCron] = useState('')
  const output = cron ? parseCron(cron) : ''

  const examples = [
    { expr: '0 * * * *', desc: 'Every hour' },
    { expr: '0 0 * * *', desc: 'Daily at midnight' },
    { expr: '*/15 * * * *', desc: 'Every 15 minutes' },
    { expr: '0 9 * * 1-5', desc: 'Weekdays at 9 AM' },
  ]

  const clear = () => setCron('')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="cron-input" className="text-sm font-medium text-zinc-300">
            Cron Expression
          </label>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
        <input
          id="cron-input"
          type="text"
          value={cron}
          onChange={(e) => setCron(e.target.value)}
          placeholder="0 * * * *"
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
        <p className="text-xs text-zinc-500">Format: minute hour day month weekday</p>
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <p className="mb-2 text-sm font-medium text-zinc-300">Examples:</p>
        <div className="flex flex-col gap-1">
          {examples.map((ex, i) => (
            <button
              key={i}
              onClick={() => setCron(ex.expr)}
              className="text-left text-xs text-zinc-400 hover:text-zinc-200"
            >
              <code className="text-emerald-400">{ex.expr}</code> - {ex.desc}
            </button>
          ))}
        </div>
      </div>

      {output && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="cron-output" className="text-sm font-medium text-zinc-300">
              Human Readable
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            id="cron-output"
            value={output}
            readOnly
            className="h-32 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
      )}
    </div>
  )
}

