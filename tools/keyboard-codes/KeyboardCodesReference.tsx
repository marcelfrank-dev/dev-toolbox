'use client'

import { useState, useEffect } from 'react'
import { CopyButton } from '@/components/CopyButton'

interface KeyCode {
  key: string
  code: string
  keyCode: number
  which: number
  location: number
  description: string
  category: string
}

const keyCodes: KeyCode[] = [
  // Letters
  ...Array.from({ length: 26 }, (_, i) => {
    const letter = String.fromCharCode(65 + i)
    return {
      key: letter.toLowerCase(),
      code: `Key${letter}`,
      keyCode: 65 + i,
      which: 65 + i,
      location: 0,
      description: `Letter ${letter}`,
      category: 'Letters',
    }
  }),

  // Numbers
  ...Array.from({ length: 10 }, (_, i) => ({
    key: String(i),
    code: `Digit${i}`,
    keyCode: 48 + i,
    which: 48 + i,
    location: 0,
    description: `Number ${i}`,
    category: 'Numbers',
  })),

  // Function keys
  ...Array.from({ length: 12 }, (_, i) => ({
    key: `F${i + 1}`,
    code: `F${i + 1}`,
    keyCode: 112 + i,
    which: 112 + i,
    location: 0,
    description: `Function key ${i + 1}`,
    category: 'Function Keys',
  })),

  // Special keys
  { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, location: 0, description: 'Enter/Return', category: 'Control' },
  { key: 'Escape', code: 'Escape', keyCode: 27, which: 27, location: 0, description: 'Escape', category: 'Control' },
  { key: 'Backspace', code: 'Backspace', keyCode: 8, which: 8, location: 0, description: 'Backspace', category: 'Control' },
  { key: 'Tab', code: 'Tab', keyCode: 9, which: 9, location: 0, description: 'Tab', category: 'Control' },
  { key: ' ', code: 'Space', keyCode: 32, which: 32, location: 0, description: 'Space', category: 'Control' },
  { key: 'Delete', code: 'Delete', keyCode: 46, which: 46, location: 0, description: 'Delete', category: 'Control' },
  { key: 'Insert', code: 'Insert', keyCode: 45, which: 45, location: 0, description: 'Insert', category: 'Control' },
  { key: 'Home', code: 'Home', keyCode: 36, which: 36, location: 0, description: 'Home', category: 'Navigation' },
  { key: 'End', code: 'End', keyCode: 35, which: 35, location: 0, description: 'End', category: 'Navigation' },
  { key: 'PageUp', code: 'PageUp', keyCode: 33, which: 33, location: 0, description: 'Page Up', category: 'Navigation' },
  { key: 'PageDown', code: 'PageDown', keyCode: 34, which: 34, location: 0, description: 'Page Down', category: 'Navigation' },

  // Arrow keys
  { key: 'ArrowUp', code: 'ArrowUp', keyCode: 38, which: 38, location: 0, description: 'Up Arrow', category: 'Navigation' },
  { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40, which: 40, location: 0, description: 'Down Arrow', category: 'Navigation' },
  { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37, which: 37, location: 0, description: 'Left Arrow', category: 'Navigation' },
  { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39, which: 39, location: 0, description: 'Right Arrow', category: 'Navigation' },

  // Modifier keys
  { key: 'Shift', code: 'ShiftLeft', keyCode: 16, which: 16, location: 1, description: 'Left Shift', category: 'Modifier' },
  { key: 'Shift', code: 'ShiftRight', keyCode: 16, which: 16, location: 2, description: 'Right Shift', category: 'Modifier' },
  { key: 'Control', code: 'ControlLeft', keyCode: 17, which: 17, location: 1, description: 'Left Control', category: 'Modifier' },
  { key: 'Control', code: 'ControlRight', keyCode: 17, which: 17, location: 2, description: 'Right Control', category: 'Modifier' },
  { key: 'Alt', code: 'AltLeft', keyCode: 18, which: 18, location: 1, description: 'Left Alt', category: 'Modifier' },
  { key: 'Alt', code: 'AltRight', keyCode: 18, which: 18, location: 2, description: 'Right Alt', category: 'Modifier' },
  { key: 'Meta', code: 'MetaLeft', keyCode: 91, which: 91, location: 1, description: 'Left Meta (Cmd/Win)', category: 'Modifier' },
  { key: 'Meta', code: 'MetaRight', keyCode: 92, which: 92, location: 2, description: 'Right Meta (Cmd/Win)', category: 'Modifier' },

  // Punctuation
  { key: ';', code: 'Semicolon', keyCode: 186, which: 186, location: 0, description: 'Semicolon', category: 'Punctuation' },
  { key: '=', code: 'Equal', keyCode: 187, which: 187, location: 0, description: 'Equals', category: 'Punctuation' },
  { key: ',', code: 'Comma', keyCode: 188, which: 188, location: 0, description: 'Comma', category: 'Punctuation' },
  { key: '-', code: 'Minus', keyCode: 189, which: 189, location: 0, description: 'Minus/Hyphen', category: 'Punctuation' },
  { key: '.', code: 'Period', keyCode: 190, which: 190, location: 0, description: 'Period', category: 'Punctuation' },
  { key: '/', code: 'Slash', keyCode: 191, which: 191, location: 0, description: 'Forward Slash', category: 'Punctuation' },
  { key: '`', code: 'Backquote', keyCode: 192, which: 192, location: 0, description: 'Backtick', category: 'Punctuation' },
  { key: '[', code: 'BracketLeft', keyCode: 219, which: 219, location: 0, description: 'Left Bracket', category: 'Punctuation' },
  { key: '\\', code: 'Backslash', keyCode: 220, which: 220, location: 0, description: 'Backslash', category: 'Punctuation' },
  { key: ']', code: 'BracketRight', keyCode: 221, which: 221, location: 0, description: 'Right Bracket', category: 'Punctuation' },
  { key: "'", code: 'Quote', keyCode: 222, which: 222, location: 0, description: 'Single Quote', category: 'Punctuation' },
]

const categories = [...new Set(keyCodes.map((k) => k.category))]

export default function KeyboardCodesReference() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [lastKey, setLastKey] = useState<KeyCode | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const found = keyCodes.find(
        (k) => k.code === e.code || k.keyCode === e.keyCode || k.key === e.key
      )
      if (found) {
        setLastKey({
          ...found,
          key: e.key,
          code: e.code,
          keyCode: e.keyCode,
          which: e.keyCode,
          location: e.location,
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filteredKeys = keyCodes.filter((k) => {
    if (selectedCategory !== 'All' && k.category !== selectedCategory) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        k.key.toLowerCase().includes(query) ||
        k.code.toLowerCase().includes(query) ||
        k.description.toLowerCase().includes(query) ||
        k.keyCode.toString().includes(query)
      )
    }
    return true
  })

  return (
    <div className="space-y-6">
      <div className="p-4 bg-zinc-900 border border-zinc-700 rounded-lg">
        <h3 className="text-sm font-semibold text-zinc-300 mb-2">Interactive Keyboard Test</h3>
        <p className="text-sm text-zinc-400 mb-4">
          Press any key to see its event properties. Focus this page and type!
        </p>
        {lastKey ? (
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-zinc-500">Key:</span>
                <code className="ml-2 text-zinc-300">{lastKey.key}</code>
                <CopyButton text={lastKey.key} />
              </div>
              <div>
                <span className="text-zinc-500">Code:</span>
                <code className="ml-2 text-zinc-300">{lastKey.code}</code>
                <CopyButton text={lastKey.code} />
              </div>
              <div>
                <span className="text-zinc-500">keyCode:</span>
                <code className="ml-2 text-zinc-300">{lastKey.keyCode}</code>
                <CopyButton text={lastKey.keyCode.toString()} />
              </div>
              <div>
                <span className="text-zinc-500">which:</span>
                <code className="ml-2 text-zinc-300">{lastKey.which}</code>
                <CopyButton text={lastKey.which.toString()} />
              </div>
            </div>
            <div>
              <span className="text-zinc-500">Event Listener Example:</span>
              <div className="mt-1 p-2 bg-zinc-950 rounded font-mono text-xs text-zinc-300">
                {`document.addEventListener('keydown', (e) => {
  if (e.code === '${lastKey.code}') {
    // Handle ${lastKey.description}
  }
})`}
              </div>
              <CopyButton
                text={`document.addEventListener('keydown', (e) => {\n  if (e.code === '${lastKey.code}') {\n    // Handle ${lastKey.description}\n  }\n})`}
              />
            </div>
          </div>
        ) : (
          <p className="text-sm text-zinc-500 italic">No key pressed yet...</p>
        )}
      </div>

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
            placeholder="Search by key, code, or description..."
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
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="text-sm text-zinc-400">
        Showing {filteredKeys.length} of {keyCodes.length} keys
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-zinc-700">
              <th className="text-left p-3 text-sm font-semibold text-zinc-300">Key</th>
              <th className="text-left p-3 text-sm font-semibold text-zinc-300">Code</th>
              <th className="text-left p-3 text-sm font-semibold text-zinc-300">keyCode</th>
              <th className="text-left p-3 text-sm font-semibold text-zinc-300">which</th>
              <th className="text-left p-3 text-sm font-semibold text-zinc-300">Description</th>
              <th className="text-left p-3 text-sm font-semibold text-zinc-300">Category</th>
              <th className="text-left p-3 text-sm font-semibold text-zinc-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredKeys.map((key, idx) => (
              <tr key={idx} className="border-b border-zinc-800 hover:bg-zinc-900/50">
                <td className="p-3 text-zinc-100 font-mono">{key.key || '(empty)'}</td>
                <td className="p-3 text-zinc-300 font-mono text-sm">{key.code}</td>
                <td className="p-3 text-zinc-400 font-mono text-sm">{key.keyCode}</td>
                <td className="p-3 text-zinc-400 font-mono text-sm">{key.which}</td>
                <td className="p-3 text-zinc-400">{key.description}</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded">
                    {key.category}
                  </span>
                </td>
                <td className="p-3">
                  <CopyButton text={key.code} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

