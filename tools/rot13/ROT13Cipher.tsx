'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function rot13(text: string): string {
  return text
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0)
      if (code >= 65 && code <= 90) {
        // A-Z
        return String.fromCharCode(((code - 65 + 13) % 26) + 65)
      }
      if (code >= 97 && code <= 122) {
        // a-z
        return String.fromCharCode(((code - 97 + 13) % 26) + 97)
      }
      return char
    })
    .join('')
}

export default function ROT13Cipher() {
  const [input, setInput] = useState('')
  const output = rot13(input)

  const clear = () => setInput('')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="rot13-input" className="text-sm font-medium text-zinc-300">
            Input Text
          </label>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
        <textarea
          id="rot13-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to encode/decode with ROT13..."
          className="h-32 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <p className="text-sm text-zinc-400">
          ROT13 is a simple letter substitution cipher that replaces each letter with the letter 13 positions after it in the alphabet. Encoding and decoding use the same function.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="rot13-output" className="text-sm font-medium text-zinc-300">
            ROT13 Output
          </label>
          <CopyButton text={output} />
        </div>
        <textarea
          id="rot13-output"
          value={output}
          readOnly
          className="h-32 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>
    </div>
  )
}

