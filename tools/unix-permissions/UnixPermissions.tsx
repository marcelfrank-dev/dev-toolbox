'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function calculateChmod(owner: boolean[], group: boolean[], other: boolean[]): string {
  const toOctal = (bits: boolean[]) => bits.reduce((acc, bit, i) => acc + (bit ? [4, 2, 1][i] : 0), 0)
  return `${toOctal(owner)}${toOctal(group)}${toOctal(other)}`
}

function parseChmod(chmod: string): { owner: boolean[]; group: boolean[]; other: boolean[] } | null {
  if (!/^[0-7]{3}$/.test(chmod)) return null
  const toBits = (octal: string) => {
    const num = parseInt(octal)
    return [num & 4, num & 2, num & 1].map((n) => n > 0)
  }
  return {
    owner: toBits(chmod[0]),
    group: toBits(chmod[1]),
    other: toBits(chmod[2]),
  }
}

export default function UnixPermissions() {
  const [owner, setOwner] = useState([true, true, true])
  const [group, setGroup] = useState([true, false, true])
  const [other, setOther] = useState([false, false, true])
  const [chmodInput, setChmodInput] = useState('')

  const chmod = calculateChmod(owner, group, other)

  const updateFromChmod = (value: string) => {
    setChmodInput(value)
    const parsed = parseChmod(value)
    if (parsed) {
      setOwner(parsed.owner)
      setGroup(parsed.group)
      setOther(parsed.other)
    }
  }

  const toggleBit = (setter: (bits: boolean[]) => void, bits: boolean[], index: number) => {
    const newBits = [...bits]
    newBits[index] = !newBits[index]
    setter(newBits)
  }

  const clear = () => {
    setOwner([false, false, false])
    setGroup([false, false, false])
    setOther([false, false, false])
    setChmodInput('')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="chmod-input" className="text-sm font-medium text-zinc-300">
          Chmod Value (e.g., 755)
        </label>
        <input
          id="chmod-input"
          type="text"
          value={chmodInput}
          onChange={(e) => updateFromChmod(e.target.value)}
          placeholder="755"
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
        {chmodInput && !parseChmod(chmodInput) && (
          <p className="text-sm text-red-400">Invalid chmod format. Use 3 digits (0-7).</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { name: 'Owner', bits: owner, setter: setOwner },
          { name: 'Group', bits: group, setter: setGroup },
          { name: 'Other', bits: other, setter: setOther },
        ].map(({ name, bits, setter }) => (
          <div key={name} className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
            <span className="text-sm font-medium text-zinc-300">{name}</span>
            <div className="flex gap-2">
              {['Read', 'Write', 'Execute'].map((label, i) => (
                <label key={label} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={bits[i]}
                    onChange={() => toggleBit(setter, bits, i)}
                    className="rounded border-zinc-700 bg-zinc-900 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <span className="text-xs text-zinc-400">{label[0]}</span>
                </label>
              ))}
            </div>
            <code className="text-sm text-zinc-200">{bits.map((b, i) => (b ? ['r', 'w', 'x'][i] : '-')).join('')}</code>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="chmod-output" className="text-sm font-medium text-zinc-300">
            Chmod Value
          </label>
          <CopyButton text={chmod} />
        </div>
        <input
          id="chmod-output"
          type="text"
          value={chmod}
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

