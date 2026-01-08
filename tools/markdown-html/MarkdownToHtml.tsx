'use client'

import { useState, useCallback } from 'react'
import { marked } from 'marked'
import { CopyButton } from '@/components/CopyButton'
import { useToast } from '@/components/Toast'

// Configure marked for GFM (GitHub Flavored Markdown) with tables
marked.setOptions({
  gfm: true,
  breaks: true,
})

export default function MarkdownToHtml() {
  const { showToast } = useToast()
  const [markdown, setMarkdown] = useState('')
  const [html, setHtml] = useState('')

  const convert = useCallback(() => {
    if (!markdown.trim()) {
      setHtml('')
      return
    }

    try {
      const result = marked.parse(markdown) as string
      setHtml(result)
      showToast('Markdown converted successfully!', 'success')
    } catch (error) {
      showToast('Error converting Markdown', 'error')
    }
  }, [markdown, showToast])

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">Markdown</label>
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          onBlur={convert}
          placeholder="# Heading

**Bold** and *italic* text

| Column 1 | Column 2 |
|----------|----------|
| Cell 1   | Cell 2   |

[Link](https://example.com)"
          className="h-64 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
        />
      </div>

      {/* Convert Button */}
      <button
        onClick={convert}
        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
      >
        Convert to HTML
      </button>

      {/* Output */}
      {html && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-400">HTML</label>
            <CopyButton text={html} />
          </div>
          <textarea
            value={html}
            readOnly
            className="h-64 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
          />
          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-zinc-400">Preview</label>
            <div
              className="markdown-preview min-h-32 rounded-lg border border-zinc-800 bg-white p-4 text-zinc-900"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      )}

      <style jsx global>{`
        .markdown-preview h1 { font-size: 2em; font-weight: bold; margin: 0.5em 0; }
        .markdown-preview h2 { font-size: 1.5em; font-weight: bold; margin: 0.5em 0; }
        .markdown-preview h3 { font-size: 1.17em; font-weight: bold; margin: 0.5em 0; }
        .markdown-preview p { margin: 1em 0; line-height: 1.6; }
        .markdown-preview ul, .markdown-preview ol { padding-left: 2em; margin: 1em 0; }
        .markdown-preview ul { list-style-type: disc; }
        .markdown-preview ol { list-style-type: decimal; }
        .markdown-preview li { margin: 0.25em 0; }
        .markdown-preview code { 
          background: #f1f5f9; 
          padding: 0.2em 0.4em; 
          border-radius: 3px; 
          font-family: monospace;
          font-size: 0.9em;
        }
        .markdown-preview pre { 
          background: #f1f5f9; 
          padding: 1em; 
          border-radius: 6px; 
          overflow-x: auto; 
          margin: 1em 0;
        }
        .markdown-preview pre code { background: none; padding: 0; }
        .markdown-preview blockquote {
          border-left: 4px solid #3b82f6;
          margin: 1em 0;
          padding-left: 1em;
          color: #4b5563;
        }
        .markdown-preview table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
        }
        .markdown-preview th, .markdown-preview td {
          border: 1px solid #e2e8f0;
          padding: 0.5em 1em;
          text-align: left;
        }
        .markdown-preview th {
          background: #f8fafc;
          font-weight: 600;
        }
        .markdown-preview a { color: #3b82f6; text-decoration: underline; }
        .markdown-preview hr { border: none; border-top: 2px solid #e2e8f0; margin: 2em 0; }
      `}</style>
    </div>
  )
}
