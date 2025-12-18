'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

interface RegexPattern {
  category: string
  pattern: string
  description: string
  example: string
}

const regexPatterns: RegexPattern[] = [
  {
    category: 'Anchors',
    pattern: '^',
    description: 'Start of string',
    example: '^hello matches "hello world" but not "say hello"',
  },
  {
    category: 'Anchors',
    pattern: '$',
    description: 'End of string',
    example: 'world$ matches "hello world" but not "world peace"',
  },
  {
    category: 'Anchors',
    pattern: '\\b',
    description: 'Word boundary',
    example: '\\bcat\\b matches "cat" but not "category"',
  },
  {
    category: 'Character Classes',
    pattern: '.',
    description: 'Any character except newline',
    example: 'a.c matches "abc", "a1c", "a-c"',
  },
  {
    category: 'Character Classes',
    pattern: '\\d',
    description: 'Digit (0-9)',
    example: '\\d+ matches "123", "456"',
  },
  {
    category: 'Character Classes',
    pattern: '\\w',
    description: 'Word character (a-z, A-Z, 0-9, _)',
    example: '\\w+ matches "hello", "test123"',
  },
  {
    category: 'Character Classes',
    pattern: '\\s',
    description: 'Whitespace',
    example: 'hello\\s+world matches "hello world"',
  },
  {
    category: 'Character Classes',
    pattern: '[abc]',
    description: 'Any of a, b, or c',
    example: '[aeiou] matches any vowel',
  },
  {
    category: 'Character Classes',
    pattern: '[^abc]',
    description: 'Not a, b, or c',
    example: '[^0-9] matches any non-digit',
  },
  {
    category: 'Quantifiers',
    pattern: '*',
    description: 'Zero or more',
    example: 'a* matches "", "a", "aa", "aaa"',
  },
  {
    category: 'Quantifiers',
    pattern: '+',
    description: 'One or more',
    example: 'a+ matches "a", "aa", "aaa"',
  },
  {
    category: 'Quantifiers',
    pattern: '?',
    description: 'Zero or one',
    example: 'colou?r matches "color" and "colour"',
  },
  {
    category: 'Quantifiers',
    pattern: '{n}',
    description: 'Exactly n times',
    example: '\\d{3} matches exactly 3 digits',
  },
  {
    category: 'Quantifiers',
    pattern: '{n,m}',
    description: 'Between n and m times',
    example: '\\d{2,4} matches 2 to 4 digits',
  },
  {
    category: 'Groups',
    pattern: '(abc)',
    description: 'Capture group',
    example: '(\\d{3}) captures three digits',
  },
  {
    category: 'Groups',
    pattern: '(?:abc)',
    description: 'Non-capturing group',
    example: '(?:abc)+ matches "abcabc" without capturing',
  },
  {
    category: 'Groups',
    pattern: '(?<name>abc)',
    description: 'Named capture group',
    example: '(?<year>\\d{4}) captures year with name',
  },
  {
    category: 'Alternation',
    pattern: 'a|b',
    description: 'a or b',
    example: 'cat|dog matches "cat" or "dog"',
  },
  {
    category: 'Lookahead',
    pattern: '(?=abc)',
    description: 'Positive lookahead',
    example: 'foo(?=bar) matches "foo" only if followed by "bar"',
  },
  {
    category: 'Lookahead',
    pattern: '(?!abc)',
    description: 'Negative lookahead',
    example: 'foo(?!bar) matches "foo" not followed by "bar"',
  },
  {
    category: 'Common Patterns',
    pattern: '^[\\w\\.-]+@[\\w\\.-]+\\.[a-zA-Z]{2,}$',
    description: 'Email address',
    example: 'Matches valid email formats',
  },
  {
    category: 'Common Patterns',
    pattern: '^https?:\\/\\/[\\w\\-\\.]+(?:\\:[0-9]+)?(?:\\/[^\\s]*)?$',
    description: 'URL',
    example: 'Matches http:// or https:// URLs',
  },
  {
    category: 'Common Patterns',
    pattern: '^\\+?[1-9]\\d{1,14}$',
    description: 'Phone number (E.164)',
    example: 'Matches international phone numbers',
  },
  {
    category: 'Common Patterns',
    pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
    description: 'Hex color code',
    example: 'Matches #fff, #ffffff',
  },
]

export default function RegexCheatSheet() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = [...new Set(regexPatterns.map((p) => p.category))]

  const filteredPatterns = regexPatterns.filter((pattern) => {
    if (selectedCategory && pattern.category !== selectedCategory) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        pattern.pattern.toLowerCase().includes(query) ||
        pattern.description.toLowerCase().includes(query) ||
        pattern.example.toLowerCase().includes(query)
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
            placeholder="Search patterns..."
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Patterns List */}
      <div className="space-y-4">
        {filteredPatterns.map((pattern, index) => (
          <div
            key={index}
            className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 hover:bg-zinc-900"
          >
            <div className="mb-2 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-400">
                    {pattern.category}
                  </span>
                </div>
                <code className="block rounded bg-zinc-950 px-3 py-2 font-mono text-sm text-emerald-400">
                  {pattern.pattern}
                </code>
                <p className="mt-2 text-sm text-zinc-400">{pattern.description}</p>
                <p className="mt-1 text-xs text-zinc-500">{pattern.example}</p>
              </div>
              <CopyButton text={pattern.pattern} label="" className="!px-2 shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

