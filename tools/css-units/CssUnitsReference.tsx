'use client'

import { useState, useMemo } from 'react'
import { CopyButton } from '@/components/CopyButton'

interface CssUnit {
  unit: string
  name: string
  description: string
  example: string
  relativeTo: string
  category: 'absolute' | 'relative' | 'viewport' | 'font' | 'angle' | 'time' | 'frequency' | 'resolution'
}

const cssUnits: CssUnit[] = [
  // Absolute length units
  {
    unit: 'px',
    name: 'Pixels',
    description: '1/96th of 1 inch. Most common unit for screen display.',
    example: '16px',
    relativeTo: 'Screen resolution',
    category: 'absolute',
  },
  {
    unit: 'pt',
    name: 'Points',
    description: '1/72nd of 1 inch. Commonly used in print media.',
    example: '12pt',
    relativeTo: '1 inch',
    category: 'absolute',
  },
  {
    unit: 'pc',
    name: 'Picas',
    description: '12 points (1/6th of 1 inch). Used in typography.',
    example: '1pc',
    relativeTo: '12pt',
    category: 'absolute',
  },
  {
    unit: 'in',
    name: 'Inches',
    description: '1 inch = 96px = 2.54cm. Physical measurement unit.',
    example: '1in',
    relativeTo: 'Physical size',
    category: 'absolute',
  },
  {
    unit: 'cm',
    name: 'Centimeters',
    description: '1cm = 37.8px. Physical measurement unit.',
    example: '2.54cm',
    relativeTo: 'Physical size',
    category: 'absolute',
  },
  {
    unit: 'mm',
    name: 'Millimeters',
    description: '1mm = 3.78px. Physical measurement unit.',
    example: '10mm',
    relativeTo: 'Physical size',
    category: 'absolute',
  },

  // Relative length units
  {
    unit: 'em',
    name: 'Em',
    description: 'Relative to the font-size of the element (2em means 2 times the size of the current font).',
    example: '1.5em',
    relativeTo: 'Parent font-size',
    category: 'font',
  },
  {
    unit: 'rem',
    name: 'Root Em',
    description: 'Relative to the font-size of the root element (html).',
    example: '1.2rem',
    relativeTo: 'Root font-size',
    category: 'font',
  },
  {
    unit: 'ex',
    name: 'Ex',
    description: 'Relative to the x-height of the current font (rarely used).',
    example: '1ex',
    relativeTo: 'Font x-height',
    category: 'font',
  },
  {
    unit: 'ch',
    name: 'Character',
    description: 'Relative to the width of the "0" (zero) character.',
    example: '40ch',
    relativeTo: 'Zero character width',
    category: 'font',
  },

  // Viewport units
  {
    unit: 'vw',
    name: 'Viewport Width',
    description: '1vw = 1% of viewport width. Responsive unit.',
    example: '50vw',
    relativeTo: 'Viewport width',
    category: 'viewport',
  },
  {
    unit: 'vh',
    name: 'Viewport Height',
    description: '1vh = 1% of viewport height. Responsive unit.',
    example: '100vh',
    relativeTo: 'Viewport height',
    category: 'viewport',
  },
  {
    unit: 'vmin',
    name: 'Viewport Minimum',
    description: '1vmin = 1% of viewport\'s smaller dimension (width or height).',
    example: '10vmin',
    relativeTo: 'Smaller viewport dimension',
    category: 'viewport',
  },
  {
    unit: 'vmax',
    name: 'Viewport Maximum',
    description: '1vmax = 1% of viewport\'s larger dimension (width or height).',
    example: '10vmax',
    relativeTo: 'Larger viewport dimension',
    category: 'viewport',
  },

  // Percentage
  {
    unit: '%',
    name: 'Percentage',
    description: 'Relative to the parent element\'s corresponding property.',
    example: '50%',
    relativeTo: 'Parent element',
    category: 'relative',
  },

  // Angle units
  {
    unit: 'deg',
    name: 'Degrees',
    description: 'Degrees. Full circle = 360deg.',
    example: '45deg',
    relativeTo: 'Full circle (360deg)',
    category: 'angle',
  },
  {
    unit: 'rad',
    name: 'Radians',
    description: 'Radians. Full circle = 2π rad ≈ 6.2832rad.',
    example: '1.57rad',
    relativeTo: 'Full circle (2π)',
    category: 'angle',
  },
  {
    unit: 'grad',
    name: 'Gradians',
    description: 'Gradians. Full circle = 400grad.',
    example: '100grad',
    relativeTo: 'Full circle (400grad)',
    category: 'angle',
  },
  {
    unit: 'turn',
    name: 'Turns',
    description: 'Turns. Full circle = 1turn.',
    example: '0.5turn',
    relativeTo: 'Full circle (1turn)',
    category: 'angle',
  },

  // Time units
  {
    unit: 's',
    name: 'Seconds',
    description: 'Seconds. Used in animations and transitions.',
    example: '2s',
    relativeTo: 'Time',
    category: 'time',
  },
  {
    unit: 'ms',
    name: 'Milliseconds',
    description: 'Milliseconds. 1000ms = 1s.',
    example: '500ms',
    relativeTo: 'Time',
    category: 'time',
  },

  // Frequency units
  {
    unit: 'Hz',
    name: 'Hertz',
    description: 'Hertz. Frequency unit (rarely used in CSS).',
    example: '440Hz',
    relativeTo: 'Frequency',
    category: 'frequency',
  },
  {
    unit: 'kHz',
    name: 'Kilohertz',
    description: 'Kilohertz. 1000Hz = 1kHz.',
    example: '1kHz',
    relativeTo: 'Frequency',
    category: 'frequency',
  },

  // Resolution units
  {
    unit: 'dpi',
    name: 'Dots Per Inch',
    description: 'Dots per inch. Used in @media queries for resolution.',
    example: '300dpi',
    relativeTo: 'Screen resolution',
    category: 'resolution',
  },
  {
    unit: 'dpcm',
    name: 'Dots Per Centimeter',
    description: 'Dots per centimeter. 1dpcm ≈ 2.54dpi.',
    example: '118dpcm',
    relativeTo: 'Screen resolution',
    category: 'resolution',
  },
  {
    unit: 'dppx',
    name: 'Dots Per Pixel',
    description: 'Dots per px unit. 1dppx = 96dpi.',
    example: '2dppx',
    relativeTo: 'Screen resolution',
    category: 'resolution',
  },
]

const categories = [...new Set(cssUnits.map((u) => u.category))]

export default function CssUnitsReference() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const filteredUnits = useMemo(() => {
    let filtered = cssUnits

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((u) => u.category === selectedCategory)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (u) =>
          u.unit.toLowerCase().includes(query) ||
          u.name.toLowerCase().includes(query) ||
          u.description.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [searchQuery, selectedCategory])

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-zinc-300 mb-2">
            Search
          </label>
          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by unit, name, or description..."
            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-zinc-300 mb-2">
            Category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="text-sm text-zinc-400">
        Showing {filteredUnits.length} of {cssUnits.length} units
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredUnits.map((unit, idx) => (
          <div
            key={idx}
            className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <code className="text-lg font-bold text-zinc-100">{unit.unit}</code>
                  <CopyButton text={unit.unit} />
                </div>
                <h3 className="text-sm font-semibold text-zinc-300">{unit.name}</h3>
              </div>
              <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded">
                {unit.category}
              </span>
            </div>
            <p className="text-sm text-zinc-400 mb-2">{unit.description}</p>
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-zinc-500">Example:</span>
                <code className="text-zinc-300">{unit.example}</code>
                <CopyButton text={unit.example} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-500">Relative to:</span>
                <span className="text-zinc-400">{unit.relativeTo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

