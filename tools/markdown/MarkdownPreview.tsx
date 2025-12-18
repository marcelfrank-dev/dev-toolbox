'use client'

import { useState, useMemo } from 'react'
import { CopyButton } from '@/components/CopyButton'

export default function MarkdownPreview() {
  const [markdown, setMarkdown] = useState(`# Hello World

This is a **bold** text and this is *italic*.

## Lists

- Item 1
- Item 2
- Item 3

### Numbered List

1. First
2. Second
3. Third

## Code

Inline \`code\` and block:

\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

## Links and Images

[Visit GitHub](https://github.com)

## Blockquotes

> This is a blockquote.
> It can span multiple lines.

## Tables

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
`)

  const html = useMemo(() => {
    // Simple markdown to HTML converter
    let result = markdown

    // Escape HTML
    result = result
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

    // Code blocks (must be before other processing)
    result = result.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre class="code-block"><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`
    })

    // Inline code
    result = result.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')

    // Headers
    result = result.replace(/^### (.+)$/gm, '<h3>$1</h3>')
    result = result.replace(/^## (.+)$/gm, '<h2>$1</h2>')
    result = result.replace(/^# (.+)$/gm, '<h1>$1</h1>')

    // Bold and italic
    result = result.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    result = result.replace(/\*([^*]+)\*/g, '<em>$1</em>')

    // Links
    result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')

    // Blockquotes
    result = result.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>')
    // Merge consecutive blockquotes
    result = result.replace(/<\/blockquote>\n<blockquote>/g, '\n')

    // Unordered lists
    result = result.replace(/^- (.+)$/gm, '<li>$1</li>')
    result = result.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')

    // Ordered lists
    result = result.replace(/^\d+\. (.+)$/gm, '<li>$1</li>')

    // Tables
    result = result.replace(/\|(.+)\|/g, (match) => {
      const cells = match
        .split('|')
        .filter((c) => c.trim())
        .map((c) => c.trim())
      if (cells.every((c) => /^[-:]+$/.test(c))) {
        return '' // Skip separator row
      }
      const tag = cells.some((c) => c.includes('Header')) ? 'th' : 'td'
      return `<tr>${cells.map((c) => `<${tag}>${c}</${tag}>`).join('')}</tr>`
    })
    result = result.replace(/(<tr>.*<\/tr>\n?)+/g, '<table>$&</table>')

    // Paragraphs
    result = result
      .split('\n\n')
      .map((block) => {
        if (
          block.startsWith('<h') ||
          block.startsWith('<ul') ||
          block.startsWith('<ol') ||
          block.startsWith('<pre') ||
          block.startsWith('<blockquote') ||
          block.startsWith('<table') ||
          !block.trim()
        ) {
          return block
        }
        return `<p>${block.replace(/\n/g, '<br>')}</p>`
      })
      .join('\n')

    return result
  }, [markdown])

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editor */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-400">Markdown</label>
            <CopyButton text={markdown} label="Copy MD" />
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Enter markdown..."
            className="h-[500px] w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
          />
        </div>

        {/* Preview */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-400">Preview</label>
            <CopyButton text={html} label="Copy HTML" />
          </div>
          <div
            className="markdown-preview h-[500px] overflow-auto rounded-lg border border-zinc-700 bg-zinc-900/50 px-6 py-4"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>

      {/* Styles */}
      <style jsx global>{`
        .markdown-preview {
          color: #e4e4e7;
          line-height: 1.6;
        }
        .markdown-preview h1 {
          font-size: 2em;
          font-weight: 700;
          margin: 0.5em 0;
          border-bottom: 1px solid #3f3f46;
          padding-bottom: 0.3em;
        }
        .markdown-preview h2 {
          font-size: 1.5em;
          font-weight: 600;
          margin: 0.5em 0;
          border-bottom: 1px solid #3f3f46;
          padding-bottom: 0.3em;
        }
        .markdown-preview h3 {
          font-size: 1.25em;
          font-weight: 600;
          margin: 0.5em 0;
        }
        .markdown-preview p {
          margin: 1em 0;
        }
        .markdown-preview ul,
        .markdown-preview ol {
          padding-left: 2em;
          margin: 1em 0;
        }
        .markdown-preview li {
          margin: 0.25em 0;
        }
        .markdown-preview a {
          color: #34d399;
          text-decoration: underline;
        }
        .markdown-preview blockquote {
          border-left: 4px solid #3f3f46;
          padding-left: 1em;
          color: #a1a1aa;
          margin: 1em 0;
        }
        .markdown-preview .inline-code {
          background: #27272a;
          padding: 0.2em 0.4em;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.9em;
        }
        .markdown-preview .code-block {
          background: #18181b;
          padding: 1em;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1em 0;
        }
        .markdown-preview .code-block code {
          font-family: monospace;
          font-size: 0.9em;
        }
        .markdown-preview table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
        }
        .markdown-preview th,
        .markdown-preview td {
          border: 1px solid #3f3f46;
          padding: 0.5em 1em;
          text-align: left;
        }
        .markdown-preview th {
          background: #27272a;
          font-weight: 600;
        }
      `}</style>
    </div>
  )
}

