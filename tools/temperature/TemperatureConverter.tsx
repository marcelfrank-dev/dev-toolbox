'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function celsiusToFahrenheit(c: number): number {
  return (c * 9) / 5 + 32
}

function fahrenheitToCelsius(f: number): number {
  return ((f - 32) * 5) / 9
}

function celsiusToKelvin(c: number): number {
  return c + 273.15
}

function kelvinToCelsius(k: number): number {
  return k - 273.15
}

export default function TemperatureConverter() {
  const [celsius, setCelsius] = useState('')
  const [fahrenheit, setFahrenheit] = useState('')
  const [kelvin, setKelvin] = useState('')

  const updateFromCelsius = (c: string) => {
    setCelsius(c)
    if (c === '') {
      setFahrenheit('')
      setKelvin('')
      return
    }
    const num = parseFloat(c)
    if (!isNaN(num)) {
      setFahrenheit(celsiusToFahrenheit(num).toFixed(2))
      setKelvin(celsiusToKelvin(num).toFixed(2))
    }
  }

  const updateFromFahrenheit = (f: string) => {
    setFahrenheit(f)
    if (f === '') {
      setCelsius('')
      setKelvin('')
      return
    }
    const num = parseFloat(f)
    if (!isNaN(num)) {
      const c = fahrenheitToCelsius(num)
      setCelsius(c.toFixed(2))
      setKelvin(celsiusToKelvin(c).toFixed(2))
    }
  }

  const updateFromKelvin = (k: string) => {
    setKelvin(k)
    if (k === '') {
      setCelsius('')
      setFahrenheit('')
      return
    }
    const num = parseFloat(k)
    if (!isNaN(num)) {
      const c = kelvinToCelsius(num)
      setCelsius(c.toFixed(2))
      setFahrenheit(celsiusToFahrenheit(c).toFixed(2))
    }
  }

  const clear = () => {
    setCelsius('')
    setFahrenheit('')
    setKelvin('')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="celsius" className="text-sm font-medium text-zinc-300">
            Celsius (°C)
          </label>
          <input
            id="celsius"
            type="number"
            value={celsius}
            onChange={(e) => updateFromCelsius(e.target.value)}
            placeholder="0"
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="fahrenheit" className="text-sm font-medium text-zinc-300">
            Fahrenheit (°F)
          </label>
          <input
            id="fahrenheit"
            type="number"
            value={fahrenheit}
            onChange={(e) => updateFromFahrenheit(e.target.value)}
            placeholder="32"
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="kelvin" className="text-sm font-medium text-zinc-300">
            Kelvin (K)
          </label>
          <input
            id="kelvin"
            type="number"
            value={kelvin}
            onChange={(e) => updateFromKelvin(e.target.value)}
            placeholder="273.15"
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
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

