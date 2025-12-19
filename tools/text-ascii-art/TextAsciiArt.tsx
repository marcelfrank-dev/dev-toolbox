'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

// Simple ASCII art generator using basic characters
function textToAscii(text: string, style: 'simple' | 'block' | 'outline'): string {
  const upper = text.toUpperCase()
  const chars: Record<string, Record<string, string[]>> = {
    simple: {
      A: [' ███ ', '█   █', '█████', '█   █', '█   █'],
      B: ['████ ', '█   █', '████ ', '█   █', '████ '],
      C: [' ███ ', '█   █', '█    ', '█   █', ' ███ '],
      D: ['████ ', '█   █', '█   █', '█   █', '████ '],
      E: ['█████', '█    ', '████ ', '█    ', '█████'],
      F: ['█████', '█    ', '████ ', '█    ', '█    '],
      G: [' ███ ', '█    ', '█  ██', '█   █', ' ███ '],
      H: ['█   █', '█   █', '█████', '█   █', '█   █'],
      I: ['█████', '  █  ', '  █  ', '  █  ', '█████'],
      J: ['█████', '    █', '    █', '█   █', ' ███ '],
      K: ['█   █', '█  █ ', '███  ', '█  █ ', '█   █'],
      L: ['█    ', '█    ', '█    ', '█    ', '█████'],
      M: ['█   █', '██ ██', '█ █ █', '█   █', '█   █'],
      N: ['█   █', '██  █', '█ █ █', '█  ██', '█   █'],
      O: [' ███ ', '█   █', '█   █', '█   █', ' ███ '],
      P: ['████ ', '█   █', '████ ', '█    ', '█    '],
      Q: [' ███ ', '█   █', '█   █', '█  █ ', ' ████'],
      R: ['████ ', '█   █', '████ ', '█  █ ', '█   █'],
      S: [' ███ ', '█    ', ' ███ ', '    █', ' ███ '],
      T: ['█████', '  █  ', '  █  ', '  █  ', '  █  '],
      U: ['█   █', '█   █', '█   █', '█   █', ' ███ '],
      V: ['█   █', '█   █', '█   █', ' █ █ ', '  █  '],
      W: ['█   █', '█   █', '█ █ █', '██ ██', '█   █'],
      X: ['█   █', ' █ █ ', '  █  ', ' █ █ ', '█   █'],
      Y: ['█   █', ' █ █ ', '  █  ', '  █  ', '  █  '],
      Z: ['█████', '   █ ', '  █  ', ' █   ', '█████'],
      ' ': ['     ', '     ', '     ', '     ', '     '],
      '0': [' ███ ', '█  ██', '█ █ █', '██  █', ' ███ '],
      '1': ['  █  ', ' ██  ', '  █  ', '  █  ', '█████'],
      '2': [' ███ ', '    █', ' ███ ', '█    ', '█████'],
      '3': [' ███ ', '    █', ' ███ ', '    █', ' ███ '],
      '4': ['█   █', '█   █', '█████', '    █', '    █'],
      '5': ['█████', '█    ', '████ ', '    █', '████ '],
      '6': [' ███ ', '█    ', '████ ', '█   █', ' ███ '],
      '7': ['█████', '    █', '   █ ', '  █  ', '  █  '],
      '8': [' ███ ', '█   █', ' ███ ', '█   █', ' ███ '],
      '9': [' ███ ', '█   █', ' ████', '    █', ' ███ '],
    },
  }

  const charMap = chars[style] || chars.simple
  const lines: string[] = ['', '', '', '', '']

  for (const char of upper) {
    const charLines = charMap[char] || charMap[' ']
    for (let i = 0; i < 5; i++) {
      lines[i] += charLines[i] + ' '
    }
  }

  return lines.join('\n').trim()
}

export default function TextAsciiArt() {
  const [input, setInput] = useState('')
  const [style, setStyle] = useState<'simple' | 'block' | 'outline'>('simple')

  const output = input ? textToAscii(input, style) : ''

  const clear = () => setInput('')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="ascii-input" className="text-sm font-medium text-zinc-300">
            Input Text
          </label>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
        <input
          id="ascii-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to convert to ASCII art..."
          maxLength={20}
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
        <p className="text-xs text-zinc-500">Limited to 20 characters for best results</p>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-zinc-300">Style:</label>
        <div className="flex gap-2">
          <button
            onClick={() => setStyle('simple')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              style === 'simple'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}
          >
            Simple
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="ascii-output" className="text-sm font-medium text-zinc-300">
            ASCII Art
          </label>
          <CopyButton text={output} />
        </div>
        <textarea
          id="ascii-output"
          value={output}
          readOnly
          className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-xs text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          style={{ fontFamily: 'monospace', lineHeight: '1.2' }}
        />
      </div>
    </div>
  )
}

