'use client'

import { useState, useMemo } from 'react'

export default function WordCounter() {
  const [text, setText] = useState('')

  const stats = useMemo(() => {
    const trimmed = text.trim()

    // Characters
    const characters = text.length
    const charactersNoSpaces = text.replace(/\s/g, '').length

    // Words
    const words = trimmed ? trimmed.split(/\s+/).length : 0

    // Sentences (rough count based on . ! ?)
    const sentences = trimmed ? (trimmed.match(/[.!?]+/g) || []).length : 0

    // Paragraphs (separated by double newlines or more)
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length : 0

    // Lines
    const lines = trimmed ? text.split('\n').length : 0

    // Reading time (average 200 words per minute)
    const readingTimeMinutes = Math.ceil(words / 200)

    // Speaking time (average 130 words per minute)
    const speakingTimeMinutes = Math.ceil(words / 130)

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      readingTimeMinutes,
      speakingTimeMinutes,
    }
  }, [text])

  const StatCard = ({ label, value, subtext }: { label: string; value: number | string; subtext?: string }) => (
    <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4">
      <div className="text-2xl font-bold text-emerald-400">{value}</div>
      <div className="text-sm font-medium text-zinc-400">{label}</div>
      {subtext && <div className="text-xs text-zinc-500">{subtext}</div>}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">Enter or paste your text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste text here..."
          className="h-48 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Words" value={stats.words} />
        <StatCard label="Characters" value={stats.characters} subtext={`${stats.charactersNoSpaces} without spaces`} />
        <StatCard label="Sentences" value={stats.sentences} />
        <StatCard label="Paragraphs" value={stats.paragraphs} />
        <StatCard label="Lines" value={stats.lines} />
        <StatCard label="Reading Time" value={`~${stats.readingTimeMinutes} min`} subtext="@ 200 wpm" />
        <StatCard label="Speaking Time" value={`~${stats.speakingTimeMinutes} min`} subtext="@ 130 wpm" />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => setText('')}
          disabled={!text}
          className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear
        </button>
        <button
          onClick={() => setText(text.toUpperCase())}
          disabled={!text}
          className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          UPPERCASE
        </button>
        <button
          onClick={() => setText(text.toLowerCase())}
          disabled={!text}
          className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          lowercase
        </button>
      </div>
    </div>
  )
}

