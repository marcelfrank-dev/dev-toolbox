'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function htmlToMarkdown(html: string): string {
  let md = html

  // Headers
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
  md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
  md = md.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n')
  md = md.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n')

  // Bold and italic
  md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
  md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
  md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
  md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')

  // Links
  md = md.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)')

  // Images
  md = md.replace(/<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi, '![$2]($1)')
  md = md.replace(/<img[^>]*src=["']([^"']*)["'][^>]*>/gi, '![]($1)')

  // Code
  md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
  md = md.replace(/<pre[^>]*>(.*?)<\/pre>/gi, '```\n$1\n```')

  // Lists
  md = md.replace(/<ul[^>]*>/gi, '')
  md = md.replace(/<\/ul>/gi, '\n')
  md = md.replace(/<ol[^>]*>/gi, '')
  md = md.replace(/<\/ol>/gi, '\n')
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')

  // Paragraphs
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
  md = md.replace(/<br\s*\/?>/gi, '\n')

  // Blockquotes
  md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n')

  // Horizontal rule
  md = md.replace(/<hr\s*\/?>/gi, '---\n')

  // Remove remaining HTML tags
  md = md.replace(/<[^>]+>/g, '')
  
  // Decode HTML entities
  md = md.replace(/&nbsp;/g, ' ')
  md = md.replace(/&amp;/g, '&')
  md = md.replace(/&lt;/g, '<')
  md = md.replace(/&gt;/g, '>')
  md = md.replace(/&quot;/g, '"')
  md = md.replace(/&#39;/g, "'")

  // Clean up extra whitespace
  md = md.replace(/\n{3,}/g, '\n\n')
  md = md.trim()

  return md
}

export default function HtmlToMarkdown() {
  const [input, setInput] = useState('')
  const output = input ? htmlToMarkdown(input) : ''

  const clear = () => setInput('')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="html-md-input" className="text-sm font-medium text-zinc-300">
            HTML Input
          </label>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
        <textarea
          id="html-md-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="<h1>Title</h1><p>Paragraph with <strong>bold</strong> text.</p>"
          className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="html-md-output" className="text-sm font-medium text-zinc-300">
            Markdown Output
          </label>
          <CopyButton text={output} />
        </div>
        <textarea
          id="html-md-output"
          value={output}
          readOnly
          className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>
    </div>
  )
}

