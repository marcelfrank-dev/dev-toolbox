'use client'

import { useState, useMemo } from 'react'
import { CopyButton } from '@/components/CopyButton'

interface MimeType {
  mimeType: string
  extensions: string[]
  description: string
  category: string
}

const mimeTypes: MimeType[] = [
  // Application
  { mimeType: 'application/json', extensions: ['json'], description: 'JSON data', category: 'application' },
  { mimeType: 'application/javascript', extensions: ['js', 'mjs'], description: 'JavaScript', category: 'application' },
  { mimeType: 'application/xml', extensions: ['xml'], description: 'XML data', category: 'application' },
  { mimeType: 'application/pdf', extensions: ['pdf'], description: 'PDF document', category: 'application' },
  { mimeType: 'application/zip', extensions: ['zip'], description: 'ZIP archive', category: 'application' },
  { mimeType: 'application/gzip', extensions: ['gz'], description: 'Gzip archive', category: 'application' },
  { mimeType: 'application/x-tar', extensions: ['tar'], description: 'TAR archive', category: 'application' },
  { mimeType: 'application/x-7z-compressed', extensions: ['7z'], description: '7z archive', category: 'application' },
  { mimeType: 'application/x-rar-compressed', extensions: ['rar'], description: 'RAR archive', category: 'application' },
  { mimeType: 'application/octet-stream', extensions: ['bin', 'exe'], description: 'Binary data', category: 'application' },
  { mimeType: 'application/x-www-form-urlencoded', extensions: [], description: 'Form URL encoded', category: 'application' },
  { mimeType: 'application/x-shockwave-flash', extensions: ['swf'], description: 'Flash', category: 'application' },
  { mimeType: 'application/vnd.ms-excel', extensions: ['xls'], description: 'Excel (old)', category: 'application' },
  { mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', extensions: ['xlsx'], description: 'Excel', category: 'application' },
  { mimeType: 'application/vnd.ms-powerpoint', extensions: ['ppt'], description: 'PowerPoint (old)', category: 'application' },
  { mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', extensions: ['pptx'], description: 'PowerPoint', category: 'application' },
  { mimeType: 'application/vnd.ms-word', extensions: ['doc'], description: 'Word (old)', category: 'application' },
  { mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', extensions: ['docx'], description: 'Word', category: 'application' },

  // Text
  { mimeType: 'text/plain', extensions: ['txt'], description: 'Plain text', category: 'text' },
  { mimeType: 'text/html', extensions: ['html', 'htm'], description: 'HTML', category: 'text' },
  { mimeType: 'text/css', extensions: ['css'], description: 'CSS', category: 'text' },
  { mimeType: 'text/javascript', extensions: ['js'], description: 'JavaScript (legacy)', category: 'text' },
  { mimeType: 'text/csv', extensions: ['csv'], description: 'CSV', category: 'text' },
  { mimeType: 'text/xml', extensions: ['xml'], description: 'XML (text)', category: 'text' },
  { mimeType: 'text/markdown', extensions: ['md', 'markdown'], description: 'Markdown', category: 'text' },
  { mimeType: 'text/yaml', extensions: ['yaml', 'yml'], description: 'YAML', category: 'text' },
  { mimeType: 'text/calendar', extensions: ['ics'], description: 'iCalendar', category: 'text' },
  { mimeType: 'text/vcard', extensions: ['vcf'], description: 'vCard', category: 'text' },

  // Image
  { mimeType: 'image/jpeg', extensions: ['jpg', 'jpeg'], description: 'JPEG image', category: 'image' },
  { mimeType: 'image/png', extensions: ['png'], description: 'PNG image', category: 'image' },
  { mimeType: 'image/gif', extensions: ['gif'], description: 'GIF image', category: 'image' },
  { mimeType: 'image/webp', extensions: ['webp'], description: 'WebP image', category: 'image' },
  { mimeType: 'image/svg+xml', extensions: ['svg'], description: 'SVG image', category: 'image' },
  { mimeType: 'image/bmp', extensions: ['bmp'], description: 'BMP image', category: 'image' },
  { mimeType: 'image/tiff', extensions: ['tiff', 'tif'], description: 'TIFF image', category: 'image' },
  { mimeType: 'image/x-icon', extensions: ['ico'], description: 'Icon', category: 'image' },
  { mimeType: 'image/vnd.microsoft.icon', extensions: ['ico'], description: 'Icon (MS)', category: 'image' },

  // Audio
  { mimeType: 'audio/mpeg', extensions: ['mp3'], description: 'MP3 audio', category: 'audio' },
  { mimeType: 'audio/ogg', extensions: ['ogg'], description: 'OGG audio', category: 'audio' },
  { mimeType: 'audio/wav', extensions: ['wav'], description: 'WAV audio', category: 'audio' },
  { mimeType: 'audio/webm', extensions: ['weba'], description: 'WebM audio', category: 'audio' },
  { mimeType: 'audio/aac', extensions: ['aac'], description: 'AAC audio', category: 'audio' },
  { mimeType: 'audio/flac', extensions: ['flac'], description: 'FLAC audio', category: 'audio' },
  { mimeType: 'audio/midi', extensions: ['mid', 'midi'], description: 'MIDI', category: 'audio' },

  // Video
  { mimeType: 'video/mp4', extensions: ['mp4'], description: 'MP4 video', category: 'video' },
  { mimeType: 'video/mpeg', extensions: ['mpeg', 'mpg'], description: 'MPEG video', category: 'video' },
  { mimeType: 'video/ogg', extensions: ['ogv'], description: 'OGG video', category: 'video' },
  { mimeType: 'video/webm', extensions: ['webm'], description: 'WebM video', category: 'video' },
  { mimeType: 'video/quicktime', extensions: ['mov'], description: 'QuickTime', category: 'video' },
  { mimeType: 'video/x-msvideo', extensions: ['avi'], description: 'AVI', category: 'video' },
  { mimeType: 'video/x-matroska', extensions: ['mkv'], description: 'Matroska', category: 'video' },

  // Font
  { mimeType: 'font/woff', extensions: ['woff'], description: 'WOFF font', category: 'font' },
  { mimeType: 'font/woff2', extensions: ['woff2'], description: 'WOFF2 font', category: 'font' },
  { mimeType: 'font/ttf', extensions: ['ttf'], description: 'TrueType font', category: 'font' },
  { mimeType: 'font/otf', extensions: ['otf'], description: 'OpenType font', category: 'font' },
  { mimeType: 'font/eot', extensions: ['eot'], description: 'Embedded OpenType', category: 'font' },
]

const categories = [...new Set(mimeTypes.map((m) => m.category))]

export default function MimeTypesReference() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const filteredTypes = useMemo(() => {
    let filtered = mimeTypes

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((m) => m.category === selectedCategory)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (m) =>
          m.mimeType.toLowerCase().includes(query) ||
          m.description.toLowerCase().includes(query) ||
          m.extensions.some((ext) => ext.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [searchQuery, selectedCategory])

  return (
    <div className="space-y-6">
      <div className="p-4 bg-zinc-900 border border-zinc-700 rounded-lg">
        <h3 className="text-sm font-semibold text-zinc-300 mb-2">Usage Example</h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-zinc-500">HTTP Header:</span>
            <code className="ml-2 text-zinc-300">Content-Type: application/json</code>
            <CopyButton text="Content-Type: application/json" />
          </div>
          <div>
            <span className="text-zinc-500">HTML:</span>
            <code className="ml-2 text-zinc-300">{'<link rel="stylesheet" href="style.css" type="text/css">'}</code>
            <CopyButton text='<link rel="stylesheet" href="style.css" type="text/css">' />
          </div>
        </div>
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
            placeholder="Search by MIME type, extension, or description..."
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
        Showing {filteredTypes.length} of {mimeTypes.length} MIME types
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTypes.map((type, idx) => (
          <div
            key={idx}
            className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <code className="text-sm font-semibold text-zinc-100">{type.mimeType}</code>
                  <CopyButton text={type.mimeType} />
                </div>
                <p className="text-sm text-zinc-400">{type.description}</p>
              </div>
              <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded shrink-0">
                {type.category}
              </span>
            </div>
            {type.extensions.length > 0 && (
              <div className="mt-3">
                <span className="text-xs text-zinc-500">Extensions:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {type.extensions.map((ext, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded font-mono"
                    >
                      .{ext}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

