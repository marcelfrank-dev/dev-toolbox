'use client'

import { useState, useMemo } from 'react'
import { CopyButton } from '@/components/CopyButton'

interface Redirect {
  from: string
  to: string
  type: '301' | '302' | 'permanent' | 'temp'
}

interface RewriteRule {
  pattern: string
  replacement: string
  flags: string[]
}

export default function HtaccessGenerator() {
  const [redirects, setRedirects] = useState<Redirect[]>([])
  const [rewriteRules, setRewriteRules] = useState<RewriteRule[]>([])
  const [securityHeaders, setSecurityHeaders] = useState({
    xssProtection: true,
    contentTypeOptions: true,
    frameOptions: true,
    referrerPolicy: true,
  })

  const addRedirect = () => {
    setRedirects([...redirects, { from: '', to: '', type: '301' }])
  }

  const removeRedirect = (index: number) => {
    setRedirects(redirects.filter((_, i) => i !== index))
  }

  const updateRedirect = (index: number, updates: Partial<Redirect>) => {
    setRedirects(redirects.map((r, i) => (i === index ? { ...r, ...updates } : r)))
  }

  const addRewriteRule = () => {
    setRewriteRules([...rewriteRules, { pattern: '', replacement: '', flags: ['L'] }])
  }

  const removeRewriteRule = (index: number) => {
    setRewriteRules(rewriteRules.filter((_, i) => i !== index))
  }

  const updateRewriteRule = (index: number, updates: Partial<RewriteRule>) => {
    setRewriteRules(rewriteRules.map((r, i) => (i === index ? { ...r, ...updates } : r)))
  }

  const toggleRewriteFlag = (index: number, flag: string) => {
    setRewriteRules(
      rewriteRules.map((r, i) => {
        if (i === index) {
          const flags = r.flags.includes(flag)
            ? r.flags.filter((f) => f !== flag)
            : [...r.flags, flag]
          return { ...r, flags }
        }
        return r
      })
    )
  }

  const generatedCode = useMemo(() => {
    const lines: string[] = []

    // Security Headers
    if (securityHeaders.xssProtection || securityHeaders.contentTypeOptions || securityHeaders.frameOptions || securityHeaders.referrerPolicy) {
      lines.push('# Security Headers')
      if (securityHeaders.xssProtection) {
        lines.push('Header set X-XSS-Protection "1; mode=block"')
      }
      if (securityHeaders.contentTypeOptions) {
        lines.push('Header set X-Content-Type-Options "nosniff"')
      }
      if (securityHeaders.frameOptions) {
        lines.push('Header set X-Frame-Options "SAMEORIGIN"')
      }
      if (securityHeaders.referrerPolicy) {
        lines.push('Header set Referrer-Policy "strict-origin-when-cross-origin"')
      }
      lines.push('')
    }

    // Redirects
    if (redirects.length > 0) {
      lines.push('# Redirects')
      redirects.forEach((redirect) => {
        if (redirect.from && redirect.to) {
          const type = redirect.type === '301' || redirect.type === 'permanent' ? 'permanent' : 'temp'
          lines.push(`Redirect ${type} ${redirect.from} ${redirect.to}`)
        }
      })
      lines.push('')
    }

    // Rewrite Rules
    if (rewriteRules.length > 0) {
      lines.push('# Rewrite Rules')
      lines.push('RewriteEngine On')
      rewriteRules.forEach((rule) => {
        if (rule.pattern && rule.replacement) {
          const flags = rule.flags.length > 0 ? ` [${rule.flags.join(',')}]` : ''
          lines.push(`RewriteRule ${rule.pattern} ${rule.replacement}${flags}`)
        }
      })
    }

    return lines.join('\n')
  }, [redirects, rewriteRules, securityHeaders])

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Controls */}
        <div className="space-y-6">
          {/* Security Headers */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-zinc-300">Security Headers</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={securityHeaders.xssProtection}
                  onChange={(e) => setSecurityHeaders({ ...securityHeaders, xssProtection: e.target.checked })}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                />
                <span className="text-sm text-zinc-300">X-XSS-Protection</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={securityHeaders.contentTypeOptions}
                  onChange={(e) => setSecurityHeaders({ ...securityHeaders, contentTypeOptions: e.target.checked })}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                />
                <span className="text-sm text-zinc-300">X-Content-Type-Options</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={securityHeaders.frameOptions}
                  onChange={(e) => setSecurityHeaders({ ...securityHeaders, frameOptions: e.target.checked })}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                />
                <span className="text-sm text-zinc-300">X-Frame-Options</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={securityHeaders.referrerPolicy}
                  onChange={(e) => setSecurityHeaders({ ...securityHeaders, referrerPolicy: e.target.checked })}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                />
                <span className="text-sm text-zinc-300">Referrer-Policy</span>
              </label>
            </div>
          </div>

          {/* Redirects */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-300">Redirects</h3>
              <button
                onClick={addRedirect}
                className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-700"
              >
                Add Redirect
              </button>
            </div>
            <div className="space-y-3">
              {redirects.map((redirect, idx) => (
                <div key={idx} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Redirect {idx + 1}</span>
                    <button
                      onClick={() => removeRedirect(idx)}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={redirect.from}
                      onChange={(e) => updateRedirect(idx, { from: e.target.value })}
                      placeholder="/old-path"
                      className="w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-500"
                    />
                    <input
                      type="text"
                      value={redirect.to}
                      onChange={(e) => updateRedirect(idx, { to: e.target.value })}
                      placeholder="/new-path"
                      className="w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-500"
                    />
                    <select
                      value={redirect.type}
                      onChange={(e) => updateRedirect(idx, { type: e.target.value as Redirect['type'] })}
                      className="w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-200"
                    >
                      <option value="301">301 (Permanent)</option>
                      <option value="302">302 (Temporary)</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rewrite Rules */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-300">Rewrite Rules</h3>
              <button
                onClick={addRewriteRule}
                className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-700"
              >
                Add Rule
              </button>
            </div>
            <div className="space-y-3">
              {rewriteRules.map((rule, idx) => (
                <div key={idx} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Rule {idx + 1}</span>
                    <button
                      onClick={() => removeRewriteRule(idx)}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={rule.pattern}
                      onChange={(e) => updateRewriteRule(idx, { pattern: e.target.value })}
                      placeholder="^old-url$"
                      className="w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-500"
                    />
                    <input
                      type="text"
                      value={rule.replacement}
                      onChange={(e) => updateRewriteRule(idx, { replacement: e.target.value })}
                      placeholder="/new-url"
                      className="w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-500"
                    />
                    <div className="flex flex-wrap gap-2">
                      {['L', 'R', 'NC', 'QSA'].map((flag) => (
                        <label key={flag} className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={rule.flags.includes(flag)}
                            onChange={() => toggleRewriteFlag(idx, flag)}
                            className="h-3 w-3 rounded border-zinc-700 bg-zinc-900 text-emerald-600"
                          />
                          <span className="text-xs text-zinc-400">{flag}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-300">Generated .htaccess</label>
            <CopyButton text={generatedCode} />
          </div>
          <textarea
            readOnly
            value={generatedCode}
            className="h-[600px] w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
      </div>
    </div>
  )
}

