'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function parseUserAgent(ua: string): Record<string, string> {
  const result: Record<string, string> = {
    'User Agent': ua,
  }

  // Browser detection
  if (ua.includes('Chrome') && !ua.includes('Edg') && !ua.includes('OPR')) {
    result.Browser = 'Chrome'
    const match = ua.match(/Chrome\/(\d+)/)
    if (match) result['Browser Version'] = match[1]
  } else if (ua.includes('Firefox')) {
    result.Browser = 'Firefox'
    const match = ua.match(/Firefox\/(\d+)/)
    if (match) result['Browser Version'] = match[1]
  } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
    result.Browser = 'Safari'
    const match = ua.match(/Version\/(\d+)/)
    if (match) result['Browser Version'] = match[1]
  } else if (ua.includes('Edg')) {
    result.Browser = 'Edge'
    const match = ua.match(/Edg\/(\d+)/)
    if (match) result['Browser Version'] = match[1]
  } else if (ua.includes('OPR')) {
    result.Browser = 'Opera'
    const match = ua.match(/OPR\/(\d+)/)
    if (match) result['Browser Version'] = match[1]
  }

  // OS detection
  if (ua.includes('Windows')) {
    result.OS = 'Windows'
    if (ua.includes('Windows NT 10.0')) result['OS Version'] = '10/11'
    else if (ua.includes('Windows NT 6.3')) result['OS Version'] = '8.1'
    else if (ua.includes('Windows NT 6.2')) result['OS Version'] = '8'
    else if (ua.includes('Windows NT 6.1')) result['OS Version'] = '7'
  } else if (ua.includes('Mac OS X')) {
    result.OS = 'macOS'
    const match = ua.match(/Mac OS X (\d+[._]\d+)/)
    if (match) result['OS Version'] = match[1].replace('_', '.')
  } else if (ua.includes('Linux')) {
    result.OS = 'Linux'
  } else if (ua.includes('Android')) {
    result.OS = 'Android'
    const match = ua.match(/Android (\d+[.\d]*)/)
    if (match) result['OS Version'] = match[1]
  } else if (ua.includes('iPhone') || ua.includes('iPad')) {
    result.OS = 'iOS'
    const match = ua.match(/OS (\d+[._]\d+)/)
    if (match) result['OS Version'] = match[1].replace('_', '.')
  }

  // Device type
  if (ua.includes('Mobile')) {
    result['Device Type'] = 'Mobile'
  } else if (ua.includes('Tablet')) {
    result['Device Type'] = 'Tablet'
  } else {
    result['Device Type'] = 'Desktop'
  }

  return result
}

export default function UserAgentParser() {
  const [input, setInput] = useState('')
  const parsed = input ? parseUserAgent(input) : null

  const clear = () => setInput('')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="ua-input" className="text-sm font-medium text-zinc-300">
            User Agent String
          </label>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
        <textarea
          id="ua-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36..."
          className="h-24 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
        <button
          onClick={() => setInput(navigator.userAgent)}
          className="self-start rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
        >
          Use My User Agent
        </button>
      </div>

      {parsed && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-300">Parsed Information</span>
            <CopyButton text={JSON.stringify(parsed, null, 2)} />
          </div>
          <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900/50">
            <table className="w-full border-collapse">
              <tbody>
                {Object.entries(parsed).map(([key, value], i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="p-3 text-sm font-medium text-zinc-400">{key}</td>
                    <td className="p-3">
                      <code className="text-sm text-zinc-200">{value}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

