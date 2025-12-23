'use client'

import { useState, useEffect, useMemo } from 'react'
import { CopyButton } from '@/components/CopyButton'

interface CommonRatio {
  width: number
  height: number
  label: string
}

const COMMON_RATIOS: CommonRatio[] = [
  { width: 1920, height: 1080, label: '1920 x 1080 (HD TV, iPhone 6 plus)' },
  { width: 1280, height: 720, label: '1280 x 720 (HD)' },
  { width: 3840, height: 2160, label: '3840 x 2160 (4K UHD)' },
  { width: 1024, height: 768, label: '1024 x 768 (iPad)' },
  { width: 1080, height: 1080, label: '1080 x 1080 (Instagram Square)' },
  { width: 1080, height: 1920, label: '1080 x 1920 (Instagram Stories)' },
  { width: 2560, height: 1080, label: '2560 x 1080 (Ultrawide)' },
  { width: 3000, height: 2000, label: '3000 x 2000 (3:2 Photography)' },
]

// Calculate GCD (Greatest Common Divisor)
function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a))
  b = Math.abs(Math.round(b))
  while (b !== 0) {
    const temp = b
    b = a % b
    a = temp
  }
  return a
}

// Simplify ratio
function simplifyRatio(width: number, height: number): { w: number; h: number } {
  if (width === 0 || height === 0) return { w: 0, h: 0 }
  const divisor = gcd(width, height)
  return {
    w: Math.round(width / divisor),
    h: Math.round(height / divisor),
  }
}

export default function AspectRatioCalculator() {
  const [w1, setW1] = useState<string>('660')
  const [h1, setH1] = useState<string>('360')
  const [w2, setW2] = useState<string>('')
  const [h2, setH2] = useState<string>('')
  const [roundResults, setRoundResults] = useState(true)
  const [showSampleImage, setShowSampleImage] = useState(false)
  const [selectedRatio, setSelectedRatio] = useState<string>('')

  // Calculate aspect ratio from W1 and H1
  const aspectRatio = useMemo(() => {
    const width = parseFloat(w1)
    const height = parseFloat(h1)
    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      return null
    }
    return simplifyRatio(width, height)
  }, [w1, h1])

  const decimalRatio = useMemo(() => {
    const width = parseFloat(w1)
    const height = parseFloat(h1)
    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      return null
    }
    return width / height
  }, [w1, h1])

  // Track which field was last edited to prevent calculation loops
  const [lastEdited, setLastEdited] = useState<'w2' | 'h2' | null>(null)

  // Auto-calculate W2 or H2 when one is entered
  useEffect(() => {
    const width1 = parseFloat(w1)
    const height1 = parseFloat(h1)
    const width2 = parseFloat(w2)
    const height2 = parseFloat(h2)

    if (isNaN(width1) || isNaN(height1) || width1 <= 0 || height1 <= 0) {
      return
    }

    // Only calculate if one field has a value and the other is empty
    const hasW2 = !isNaN(width2) && width2 > 0
    const hasH2 = !isNaN(height2) && height2 > 0

    // If W2 is entered and H2 is empty, calculate H2
    if (hasW2 && !hasH2 && lastEdited === 'w2') {
      let newHeight = (height1 / width1) * width2
      if (roundResults) {
        newHeight = Math.round(newHeight)
      }
      setH2(newHeight.toString())
    }
    // If H2 is entered and W2 is empty, calculate W2
    else if (hasH2 && !hasW2 && lastEdited === 'h2') {
      let newWidth = (width1 / height1) * height2
      if (roundResults) {
        newWidth = Math.round(newWidth)
      }
      setW2(newWidth.toString())
    }
  }, [w1, h1, w2, h2, roundResults, lastEdited])

  const handleCommonRatioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSelectedRatio(value)
    if (value) {
      const ratio = COMMON_RATIOS.find((r) => r.label === value)
      if (ratio) {
        setW1(ratio.width.toString())
        setH1(ratio.height.toString())
      }
    }
  }

  const clear = () => {
    setW1('660')
    setH1('360')
    setW2('')
    setH2('')
    setSelectedRatio('')
    setLastEdited(null)
  }

  const aspectRatioText = aspectRatio ? `${aspectRatio.w} : ${aspectRatio.h}` : '—'
  const dimensionsText = w2 && h2 ? `${w2}x${h2}` : ''
  const cssText = aspectRatio ? `aspect-ratio: ${aspectRatio.w}/${aspectRatio.h}` : ''

  return (
    <div className="flex flex-col gap-4">
      {/* Original Dimensions */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-300">Original Dimensions</label>
        <div className="flex gap-2">
          <div className="flex-1">
            <label htmlFor="w1" className="mb-1 block text-xs text-zinc-400">
              W₁ (Width)
            </label>
            <input
              id="w1"
              type="number"
              value={w1}
              onChange={(e) => setW1(e.target.value)}
              placeholder="Width"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="h1" className="mb-1 block text-xs text-zinc-400">
              H₁ (Height)
            </label>
            <input
              id="h1"
              type="number"
              value={h1}
              onChange={(e) => setH1(e.target.value)}
              placeholder="Height"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            />
          </div>
        </div>
      </div>

      {/* Visual Separator */}
      <div className="flex items-center justify-center py-2">
        <div className="text-2xl text-zinc-600">=</div>
      </div>

      {/* New Dimensions */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-300">New Dimensions</label>
        <div className="flex gap-2">
          <div className="flex-1">
            <label htmlFor="w2" className="mb-1 block text-xs text-zinc-400">
              W₂ (Width)
            </label>
            <input
              id="w2"
              type="number"
              value={w2}
              onChange={(e) => {
                setW2(e.target.value)
                setLastEdited('w2')
              }}
              placeholder="Width"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="h2" className="mb-1 block text-xs text-zinc-400">
              H₂ (Height)
            </label>
            <input
              id="h2"
              type="number"
              value={h2}
              onChange={(e) => {
                setH2(e.target.value)
                setLastEdited('h2')
              }}
              placeholder="Height"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
            />
          </div>
        </div>
      </div>

      {/* Common Ratios */}
      <div className="flex flex-col gap-2">
        <label htmlFor="common-ratios" className="text-sm font-medium text-zinc-300">
          Common ratios
        </label>
        <select
          id="common-ratios"
          value={selectedRatio}
          onChange={handleCommonRatioChange}
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        >
          <option value="">Select a common ratio...</option>
          {COMMON_RATIOS.map((ratio) => (
            <option key={ratio.label} value={ratio.label}>
              {ratio.label}
            </option>
          ))}
        </select>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={roundResults}
            onChange={(e) => setRoundResults(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
          />
          <span className="text-sm text-zinc-300">Round results to the nearest whole number</span>
        </label>
      </div>

      {/* Aspect Ratio Result */}
      {aspectRatio && (
        <div className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-300">Aspect Ratio</label>
            <CopyButton text={aspectRatioText} />
          </div>
          <div className="text-2xl font-semibold text-zinc-100">{aspectRatioText}</div>
          {decimalRatio && (
            <div className="text-sm text-zinc-400">
              Decimal: {decimalRatio.toFixed(6)}
              {decimalRatio.toString().length > 8 && '...'}
            </div>
          )}
          {cssText && (
            <div className="mt-2 flex items-center justify-between rounded border border-zinc-800 bg-zinc-950 p-2">
              <code className="text-xs text-zinc-300">{cssText}</code>
              <CopyButton text={cssText} />
            </div>
          )}
        </div>
      )}

      {/* Dimensions Result */}
      {dimensionsText && (
        <div className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-300">Calculated Dimensions</label>
            <CopyButton text={dimensionsText} />
          </div>
          <div className="text-lg font-semibold text-zinc-100">{dimensionsText}</div>
        </div>
      )}

      {/* Visual Preview */}
      {aspectRatio && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-zinc-300">Preview</label>
          <div className="flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
            <div
              className="flex items-center justify-center border-2 border-dashed border-zinc-600 bg-zinc-950/50"
              style={{
                width: '100%',
                maxWidth: '400px',
                aspectRatio: `${aspectRatio.w} / ${aspectRatio.h}`,
                position: 'relative',
              }}
            >
              {showSampleImage && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-500/20 to-blue-500/20"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)',
                  }}
                >
                  <span className="text-xs text-zinc-500">Sample</span>
                </div>
              )}
              {!showSampleImage && (
                <span className="text-xs text-zinc-500">{aspectRatioText}</span>
              )}
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showSampleImage}
              onChange={(e) => setShowSampleImage(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
            />
            <span className="text-sm text-zinc-300">Show sample image</span>
          </label>
        </div>
      )}

      {/* Clear Button */}
      <button
        onClick={clear}
        className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
      >
        Clear
      </button>

      {/* Info Box */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4 text-sm text-zinc-500">
        <p className="mb-2 font-medium text-zinc-400">How it works:</p>
        <ol className="ml-4 list-decimal space-y-1">
          <li>Enter the original width (W₁) and height (H₁) on the left.</li>
          <li>Enter either a new width (W₂) or new height (H₂) to calculate the remaining value.</li>
          <li>Change any of the values at any time, or use the Clear button to reset.</li>
        </ol>
        <p className="mt-3 font-medium text-zinc-400">Formula:</p>
        <p className="mt-1 font-mono text-xs">
          (H₁ / W₁) × W₂ = H₂
        </p>
        <p className="mt-2 text-xs">
          Example: (1200 / 1600) × 400 = 300
        </p>
      </div>
    </div>
  )
}

