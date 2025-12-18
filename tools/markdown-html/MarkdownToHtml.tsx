'use client'

import { useState, useCallback } from 'react'
import { CopyButton } from '@/components/CopyButton'
import { useToast } from '@/components/Toast'

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
      let result = markdown

      // Headers
      result = result.replace(/^### (.*$)/gim, '<h3>$1</h3>')
      result = result.replace(/^## (.*$)/gim, '<h2>$1</h2>')
      result = result.replace(/^# (.*$)/gim, '<h1>$1</h1>')

      // Bold
      result = result.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      result = result.replace(/__(.*?)__/gim, '<strong>$1</strong>')

      // Italic
      result = result.replace(/\*(.*?)\*/gim, '<em>$1</em>')
      result = result.replace(/_(.*?)_/gim, '<em>$1</em>')

      // Links
      result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')

      // Images
      result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" />')

      // Code blocks
      result = result.replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')

      // Inline code
      result = result.replace(/`([^`]+)`/gim, '<code>$1</code>')

      // Line breaks
      result = result.replace(/\n\n/gim, '</p><p>')
      result = result.replace(/\n/gim, '<br />')

      // Lists
      result = result.replace(/^\* (.*$)/gim, '<li>$1</li>')
      result = result.replace(/^- (.*$)/gim, '<li>$1</li>')
      result = result.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')

      // Wrap in paragraph if not already wrapped
      if (!result.startsWith('<')) {
        result = '<p>' + result + '</p>'
      }

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
          placeholder="# Heading\n\n**Bold** and *italic* text\n\n[Link](https://example.com)"
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
              className="min-h-32 rounded-lg border border-zinc-800 bg-white p-4 text-zinc-900"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

