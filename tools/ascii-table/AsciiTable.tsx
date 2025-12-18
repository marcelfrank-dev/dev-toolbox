'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

interface AsciiChar {
  decimal: number
  hex: string
  octal: string
  binary: string
  char: string
  name: string
  category: 'control' | 'printable'
}

const generateAsciiTable = (): AsciiChar[] => {
  const chars: AsciiChar[] = []
  const controlNames: Record<number, string> = {
    0: 'NUL (Null)',
    1: 'SOH (Start of Heading)',
    2: 'STX (Start of Text)',
    3: 'ETX (End of Text)',
    4: 'EOT (End of Transmission)',
    5: 'ENQ (Enquiry)',
    6: 'ACK (Acknowledge)',
    7: 'BEL (Bell)',
    8: 'BS (Backspace)',
    9: 'TAB (Horizontal Tab)',
    10: 'LF (Line Feed)',
    11: 'VT (Vertical Tab)',
    12: 'FF (Form Feed)',
    13: 'CR (Carriage Return)',
    14: 'SO (Shift Out)',
    15: 'SI (Shift In)',
    16: 'DLE (Data Link Escape)',
    17: 'DC1 (Device Control 1)',
    18: 'DC2 (Device Control 2)',
    19: 'DC3 (Device Control 3)',
    20: 'DC4 (Device Control 4)',
    21: 'NAK (Negative Acknowledge)',
    22: 'SYN (Synchronous Idle)',
    23: 'ETB (End of Transmission Block)',
    24: 'CAN (Cancel)',
    25: 'EM (End of Medium)',
    26: 'SUB (Substitute)',
    27: 'ESC (Escape)',
    28: 'FS (File Separator)',
    29: 'GS (Group Separator)',
    30: 'RS (Record Separator)',
    31: 'US (Unit Separator)',
    127: 'DEL (Delete)',
  }

  for (let i = 0; i < 128; i++) {
    const char = String.fromCharCode(i)
    const isControl = i < 32 || i === 127
    chars.push({
      decimal: i,
      hex: i.toString(16).toUpperCase().padStart(2, '0'),
      octal: i.toString(8).padStart(3, '0'),
      binary: i.toString(2).padStart(8, '0'),
      char: isControl ? '' : char,
      name: controlNames[i] || (isControl ? `Control Character` : char),
      category: isControl ? 'control' : 'printable',
    })
  }
  return chars
}

const asciiTable = generateAsciiTable()

export default function AsciiTable() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<'all' | 'control' | 'printable'>('all')

  const filteredChars = asciiTable.filter((char) => {
    if (filterCategory !== 'all' && char.category !== filterCategory) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        char.decimal.toString().includes(query) ||
        char.hex.toLowerCase().includes(query) ||
        char.name.toLowerCase().includes(query) ||
        char.char.toLowerCase().includes(query)
      )
    }
    return true
  })

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by decimal, hex, name, or character..."
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'control', 'printable'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
                filterCategory === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-zinc-400">
        Showing {filteredChars.length} of {asciiTable.length} characters
      </div>

      {/* ASCII Table */}
      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900/50">
            <tr>
              <th className="px-3 py-2 text-left font-semibold text-zinc-300">Dec</th>
              <th className="px-3 py-2 text-left font-semibold text-zinc-300">Hex</th>
              <th className="px-3 py-2 text-left font-semibold text-zinc-300">Oct</th>
              <th className="px-3 py-2 text-left font-semibold text-zinc-300">Binary</th>
              <th className="px-3 py-2 text-left font-semibold text-zinc-300">Char</th>
              <th className="px-3 py-2 text-left font-semibold text-zinc-300">Name</th>
              <th className="px-3 py-2 text-left font-semibold text-zinc-300">Copy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filteredChars.map((char) => (
              <tr key={char.decimal} className="hover:bg-zinc-900/30">
                <td className="px-3 py-2 font-mono text-zinc-300">{char.decimal}</td>
                <td className="px-3 py-2 font-mono text-emerald-400">0x{char.hex}</td>
                <td className="px-3 py-2 font-mono text-zinc-400">{char.octal}</td>
                <td className="px-3 py-2 font-mono text-xs text-zinc-500">{char.binary}</td>
                <td className="px-3 py-2 font-mono text-lg">
                  {char.char || <span className="text-zinc-600">—</span>}
                </td>
                <td className="px-3 py-2 text-zinc-400">{char.name}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-1">
                    <CopyButton text={char.char || String.fromCharCode(char.decimal)} label="" className="!px-2" />
                    <CopyButton text={char.decimal.toString()} label="" className="!px-2" />
                    <CopyButton text={char.hex} label="" className="!px-2" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

