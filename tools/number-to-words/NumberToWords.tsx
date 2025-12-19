'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
const TEENS = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
const SCALES = ['', 'thousand', 'million', 'billion', 'trillion']

function convertHundreds(num: number): string {
  if (num === 0) return ''
  if (num < 10) return ONES[num]
  if (num < 20) return TEENS[num - 10]
  if (num < 100) {
    const tens = Math.floor(num / 10)
    const ones = num % 10
    return TENS[tens] + (ones > 0 ? '-' + ONES[ones] : '')
  }
  const hundreds = Math.floor(num / 100)
  const remainder = num % 100
  return ONES[hundreds] + ' hundred' + (remainder > 0 ? ' ' + convertHundreds(remainder) : '')
}

function numberToWords(num: number): string {
  if (num === 0) return 'zero'
  if (num < 0) return 'negative ' + numberToWords(-num)

  let words = ''
  let scaleIndex = 0

  while (num > 0) {
    const chunk = num % 1000
    if (chunk > 0) {
      const chunkWords = convertHundreds(chunk)
      const scale = SCALES[scaleIndex]
      words = chunkWords + (scale ? ' ' + scale : '') + (words ? ' ' + words : '')
    }
    num = Math.floor(num / 1000)
    scaleIndex++
  }

  return words.trim()
}

export default function NumberToWords() {
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  let output = ''
  if (input.trim()) {
    const num = parseFloat(input.trim())
    if (isNaN(num)) {
      setError('Invalid number')
      output = ''
    } else if (num > 999999999999999) {
      setError('Number too large')
      output = ''
    } else {
      setError(null)
      output = numberToWords(Math.floor(Math.abs(num)))
      if (num < 0) output = 'negative ' + output
      if (num % 1 !== 0) {
        const decimal = (num % 1).toString().slice(2)
        output += ' point ' + decimal.split('').map((d) => ONES[parseInt(d)]).join(' ')
      }
    }
  }

  const clear = () => {
    setInput('')
    setError(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="number-input" className="text-sm font-medium text-zinc-300">
            Number
          </label>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
        <input
          id="number-input"
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setError(null)
          }}
          placeholder="Enter a number (e.g., 123, 456.78, -99)"
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="words-output" className="text-sm font-medium text-zinc-300">
            Words
          </label>
          <CopyButton text={output} />
        </div>
        <textarea
          id="words-output"
          value={output}
          readOnly
          className="h-24 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>
    </div>
  )
}

