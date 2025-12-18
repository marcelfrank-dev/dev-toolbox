'use client'

import { useState, useCallback, useEffect } from 'react'
import { CopyButton } from '@/components/CopyButton'

interface ColorValues {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
  hsv: { h: number; s: number; v: number }
}

export default function ColorConverter() {
  const [color, setColor] = useState<ColorValues>({
    hex: '#10b981',
    rgb: { r: 16, g: 185, b: 129 },
    hsl: { h: 160, s: 84, l: 39 },
    hsv: { h: 160, s: 91, v: 73 },
  })
  const [input, setInput] = useState('#10b981')

  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null
  }

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
  }

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6
          break
        case g:
          h = ((b - r) / d + 2) / 6
          break
        case b:
          h = ((r - g) / d + 4) / 6
          break
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    }
  }

  const rgbToHsv = (r: number, g: number, b: number): { h: number; s: number; v: number } => {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    const v = max
    const d = max - min
    const s = max === 0 ? 0 : d / max

    if (max !== min) {
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6
          break
        case g:
          h = ((b - r) / d + 2) / 6
          break
        case b:
          h = ((r - g) / d + 4) / 6
          break
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(v * 100),
    }
  }

  const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    h /= 360
    s /= 100
    l /= 100

    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    }
  }

  const parseColor = useCallback((value: string): ColorValues | null => {
    // Try HEX
    let rgb = hexToRgb(value)
    if (rgb) {
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
      return { hex, rgb, hsl, hsv }
    }

    // Try RGB
    const rgbMatch = value.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i)
    if (rgbMatch) {
      rgb = {
        r: Math.min(255, parseInt(rgbMatch[1])),
        g: Math.min(255, parseInt(rgbMatch[2])),
        b: Math.min(255, parseInt(rgbMatch[3])),
      }
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
      return { hex, rgb, hsl, hsv }
    }

    // Try HSL
    const hslMatch = value.match(/hsl\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)/i)
    if (hslMatch) {
      const hsl = {
        h: parseInt(hslMatch[1]) % 360,
        s: Math.min(100, parseInt(hslMatch[2])),
        l: Math.min(100, parseInt(hslMatch[3])),
      }
      rgb = hslToRgb(hsl.h, hsl.s, hsl.l)
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
      return { hex, rgb, hsl, hsv }
    }

    return null
  }, [])

  useEffect(() => {
    const parsed = parseColor(input)
    if (parsed) {
      setColor(parsed)
    }
  }, [input, parseColor])

  const formats = [
    { label: 'HEX', value: color.hex },
    { label: 'RGB', value: `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})` },
    { label: 'HSL', value: `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)` },
    { label: 'HSV', value: `hsv(${color.hsv.h}, ${color.hsv.s}%, ${color.hsv.v}%)` },
  ]

  return (
    <div className="space-y-6">
      {/* Color Picker and Input */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">Pick Color</label>
          <input
            type="color"
            value={color.hex}
            onChange={(e) => setInput(e.target.value)}
            className="h-12 w-24 cursor-pointer rounded-lg border border-zinc-700 bg-zinc-800"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="mb-2 block text-sm font-medium text-zinc-400">Enter Color</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="#10b981, rgb(16, 185, 129), hsl(160, 84%, 39%)"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Color Preview */}
      <div
        className="h-24 w-full rounded-lg border border-zinc-700"
        style={{ backgroundColor: color.hex }}
      />

      {/* Color Values */}
      <div className="grid gap-4 sm:grid-cols-2">
        {formats.map(({ label, value }) => (
          <div key={label} className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-400">{label}</span>
              <CopyButton text={value} label="" className="!px-2" />
            </div>
            <code className="text-sm text-emerald-400">{value}</code>
          </div>
        ))}
      </div>

      {/* RGB Sliders */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-zinc-400">Adjust RGB</h3>
        {(['r', 'g', 'b'] as const).map((channel) => (
          <div key={channel} className="flex items-center gap-4">
            <span className="w-4 text-sm font-medium text-zinc-400 uppercase">{channel}</span>
            <input
              type="range"
              min={0}
              max={255}
              value={color.rgb[channel]}
              onChange={(e) => {
                const newRgb = { ...color.rgb, [channel]: parseInt(e.target.value) }
                setInput(`rgb(${newRgb.r}, ${newRgb.g}, ${newRgb.b})`)
              }}
              className="flex-1 accent-emerald-500"
            />
            <span className="w-8 text-right text-sm text-zinc-500">{color.rgb[channel]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

