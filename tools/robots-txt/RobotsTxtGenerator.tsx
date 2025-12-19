'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

interface Rule {
  userAgent: string
  allow: string[]
  disallow: string[]
  crawlDelay?: string
}

export default function RobotsTxtGenerator() {
  const [rules, setRules] = useState<Rule[]>([{ userAgent: '*', allow: [], disallow: [''] }])
  const [sitemap, setSitemap] = useState('')

  const addRule = () => {
    setRules([...rules, { userAgent: '*', allow: [], disallow: [''] }])
  }

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index))
  }

  const updateRule = (index: number, field: keyof Rule, value: any) => {
    const newRules = [...rules]
    newRules[index] = { ...newRules[index], [field]: value }
    setRules(newRules)
  }

  const addPath = (index: number, type: 'allow' | 'disallow', path: string) => {
    const newRules = [...rules]
    if (type === 'allow') {
      newRules[index].allow = [...newRules[index].allow, path]
    } else {
      newRules[index].disallow = [...newRules[index].disallow, path]
    }
    setRules(newRules)
  }

  const removePath = (index: number, type: 'allow' | 'disallow', pathIndex: number) => {
    const newRules = [...rules]
    if (type === 'allow') {
      newRules[index].allow = newRules[index].allow.filter((_, i) => i !== pathIndex)
    } else {
      newRules[index].disallow = newRules[index].disallow.filter((_, i) => i !== pathIndex)
    }
    setRules(newRules)
  }

  const generateRobotsTxt = () => {
    let robots = ''
    rules.forEach((rule) => {
      robots += `User-agent: ${rule.userAgent}\n`
      rule.allow.forEach((path) => {
        if (path) robots += `Allow: ${path}\n`
      })
      rule.disallow.forEach((path) => {
        if (path) robots += `Disallow: ${path}\n`
      })
      if (rule.crawlDelay) robots += `Crawl-delay: ${rule.crawlDelay}\n`
      robots += '\n'
    })
    if (sitemap) robots += `Sitemap: ${sitemap}\n`
    return robots.trim()
  }

  const output = generateRobotsTxt()

  const clear = () => {
    setRules([{ userAgent: '*', allow: [], disallow: [''] }])
    setSitemap('')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {rules.map((rule, ruleIndex) => (
          <div key={ruleIndex} className="flex flex-col gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300">Rule {ruleIndex + 1}</h3>
              <button
                onClick={() => removeRule(ruleIndex)}
                className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
              >
                Remove
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-xs text-zinc-400">User-agent</label>
                <input
                  type="text"
                  value={rule.userAgent}
                  onChange={(e) => updateRule(ruleIndex, 'userAgent', e.target.value)}
                  placeholder="*"
                  className="rounded-lg border border-zinc-700 bg-zinc-900 p-2 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-zinc-400">Crawl-delay (optional)</label>
                <input
                  type="text"
                  value={rule.crawlDelay || ''}
                  onChange={(e) => updateRule(ruleIndex, 'crawlDelay', e.target.value || undefined)}
                  placeholder="10"
                  className="rounded-lg border border-zinc-700 bg-zinc-900 p-2 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
                />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-xs text-zinc-400">Disallow paths</label>
                <div className="flex flex-col gap-1">
                  {rule.disallow.map((path, pathIndex) => (
                    <div key={pathIndex} className="flex gap-1">
                      <input
                        type="text"
                        value={path}
                        onChange={(e) => {
                          const newDisallow = [...rule.disallow]
                          newDisallow[pathIndex] = e.target.value
                          updateRule(ruleIndex, 'disallow', newDisallow)
                        }}
                        placeholder="/admin"
                        className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 p-2 font-mono text-xs text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
                      />
                      <button
                        onClick={() => removePath(ruleIndex, 'disallow', pathIndex)}
                        className="rounded-lg bg-zinc-800 px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addPath(ruleIndex, 'disallow', '')}
                    className="rounded-lg bg-zinc-800 px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-700"
                  >
                    + Add Disallow
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-zinc-400">Allow paths</label>
                <div className="flex flex-col gap-1">
                  {rule.allow.map((path, pathIndex) => (
                    <div key={pathIndex} className="flex gap-1">
                      <input
                        type="text"
                        value={path}
                        onChange={(e) => {
                          const newAllow = [...rule.allow]
                          newAllow[pathIndex] = e.target.value
                          updateRule(ruleIndex, 'allow', newAllow)
                        }}
                        placeholder="/public"
                        className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 p-2 font-mono text-xs text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
                      />
                      <button
                        onClick={() => removePath(ruleIndex, 'allow', pathIndex)}
                        className="rounded-lg bg-zinc-800 px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addPath(ruleIndex, 'allow', '')}
                    className="rounded-lg bg-zinc-800 px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-700"
                  >
                    + Add Allow
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={addRule}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
        >
          Add Rule
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="robots-sitemap" className="text-sm font-medium text-zinc-300">
          Sitemap URL (optional)
        </label>
        <input
          id="robots-sitemap"
          type="url"
          value={sitemap}
          onChange={(e) => setSitemap(e.target.value)}
          placeholder="https://example.com/sitemap.xml"
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      {output && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="robots-output" className="text-sm font-medium text-zinc-300">
              Generated robots.txt
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            id="robots-output"
            value={output}
            readOnly
            className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
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

