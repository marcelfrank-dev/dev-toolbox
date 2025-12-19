'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

interface Cookie {
  name: string
  value: string
  domain?: string
  path?: string
  expires?: string
  maxAge?: string
  secure?: boolean
  httpOnly?: boolean
  sameSite?: string
}

function parseCookie(cookieString: string): Cookie | null {
  if (!cookieString.trim()) return null

  const parts = cookieString.split(';').map((p) => p.trim())
  const [nameValue, ...attributes] = parts

  const [name, value] = nameValue.split('=').map((s) => s.trim())
  if (!name) return null

  const cookie: Cookie = { name, value: value || '' }

  attributes.forEach((attr) => {
    const lower = attr.toLowerCase()
    if (lower.startsWith('domain=')) {
      cookie.domain = attr.substring(7)
    } else if (lower.startsWith('path=')) {
      cookie.path = attr.substring(5)
    } else if (lower.startsWith('expires=')) {
      cookie.expires = attr.substring(8)
    } else if (lower.startsWith('max-age=')) {
      cookie.maxAge = attr.substring(8)
    } else if (lower === 'secure') {
      cookie.secure = true
    } else if (lower === 'httponly') {
      cookie.httpOnly = true
    } else if (lower.startsWith('samesite=')) {
      cookie.sameSite = attr.substring(9)
    }
  })

  return cookie
}

function buildCookie(cookie: Cookie): string {
  let str = `${cookie.name}=${cookie.value}`
  if (cookie.domain) str += `; Domain=${cookie.domain}`
  if (cookie.path) str += `; Path=${cookie.path}`
  if (cookie.expires) str += `; Expires=${cookie.expires}`
  if (cookie.maxAge) str += `; Max-Age=${cookie.maxAge}`
  if (cookie.secure) str += '; Secure'
  if (cookie.httpOnly) str += '; HttpOnly'
  if (cookie.sameSite) str += `; SameSite=${cookie.sameSite}`
  return str
}

export default function CookieParser() {
  const [mode, setMode] = useState<'parse' | 'build'>('parse')
  const [cookieString, setCookieString] = useState('')
  const [cookie, setCookie] = useState<Cookie>({ name: '', value: '' })

  const parsed = mode === 'parse' && cookieString ? parseCookie(cookieString) : null
  const built = mode === 'build' ? buildCookie(cookie) : ''

  const clear = () => {
    setCookieString('')
    setCookie({ name: '', value: '' })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-zinc-300">Mode:</label>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('parse')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === 'parse'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}
          >
            Parse
          </button>
          <button
            onClick={() => setMode('build')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === 'build'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}
          >
            Build
          </button>
        </div>
      </div>

      {mode === 'parse' ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="cookie-input" className="text-sm font-medium text-zinc-300">
              Cookie String
            </label>
            <button
              onClick={clear}
              className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
            >
              Clear
            </button>
          </div>
          <input
            id="cookie-input"
            type="text"
            value={cookieString}
            onChange={(e) => setCookieString(e.target.value)}
            placeholder="sessionId=abc123; Path=/; HttpOnly; Secure"
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
          {parsed && (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
              <div className="flex flex-col gap-2">
                {Object.entries(parsed).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-zinc-400 capitalize">{key}:</span>
                    <code className="text-zinc-200">{String(value)}</code>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="cookie-name" className="text-sm font-medium text-zinc-300">
                Name
              </label>
              <input
                id="cookie-name"
                type="text"
                value={cookie.name}
                onChange={(e) => setCookie({ ...cookie, name: e.target.value })}
                className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="cookie-value" className="text-sm font-medium text-zinc-300">
                Value
              </label>
              <input
                id="cookie-value"
                type="text"
                value={cookie.value}
                onChange={(e) => setCookie({ ...cookie, value: e.target.value })}
                className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="cookie-domain" className="text-sm font-medium text-zinc-300">
                Domain (optional)
              </label>
              <input
                id="cookie-domain"
                type="text"
                value={cookie.domain || ''}
                onChange={(e) => setCookie({ ...cookie, domain: e.target.value || undefined })}
                className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="cookie-path" className="text-sm font-medium text-zinc-300">
                Path (optional)
              </label>
              <input
                id="cookie-path"
                type="text"
                value={cookie.path || ''}
                onChange={(e) => setCookie({ ...cookie, path: e.target.value || undefined })}
                className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={cookie.secure || false}
                onChange={(e) => setCookie({ ...cookie, secure: e.target.checked || undefined })}
                className="rounded border-zinc-700 bg-zinc-900 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
              />
              <span className="text-sm text-zinc-400">Secure</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={cookie.httpOnly || false}
                onChange={(e) => setCookie({ ...cookie, httpOnly: e.target.checked || undefined })}
                className="rounded border-zinc-700 bg-zinc-900 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
              />
              <span className="text-sm text-zinc-400">HttpOnly</span>
            </label>
          </div>
          {built && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="cookie-output" className="text-sm font-medium text-zinc-300">
                  Cookie String
                </label>
                <CopyButton text={built} />
              </div>
              <input
                id="cookie-output"
                type="text"
                value={built}
                readOnly
                className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
              />
            </div>
          )}
        </div>
      )}

      <button
        onClick={clear}
        className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
      >
        Clear
      </button>
    </div>
  )
}

