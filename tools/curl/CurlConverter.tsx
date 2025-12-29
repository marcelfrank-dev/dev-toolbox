'use client'

import { useState } from 'react'
// @ts-ignore - curlconverter types might be missing or incomplete in some versions
import * as curlConverter from 'curlconverter'
import { Highlight, themes, type Language } from 'prism-react-renderer'
import { CopyButton } from '@/components/CopyButton'

const LANGUAGES = [
    { id: 'javascript', name: 'JavaScript (fetch)', fn: 'toJavascript' },
    { id: 'python', name: 'Python (requests)', fn: 'toPython' },
    { id: 'go', name: 'Go', fn: 'toGo' },
    { id: 'rust', name: 'Rust', fn: 'toRust' },
    { id: 'json', name: 'JSON', fn: 'toJsonString' },
    { id: 'php', name: 'PHP', fn: 'toPhp' },
    { id: 'java', name: 'Java', fn: 'toJava' },
]

export default function CurlConverter() {
    const [input, setInput] = useState("curl 'http://en.wikipedia.org/' -H 'Accept-Encoding: gzip, deflate, sdch' -H 'Accept-Language: en-US,en;q=0.8' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' -H 'Referer: http://www.wikipedia.org/' -H 'Connection: keep-alive' --compressed")
    const [languageId, setLanguageId] = useState('javascript')
    const [error, setError] = useState<string | null>(null)

    const activeLanguage = LANGUAGES.find(l => l.id === languageId) || LANGUAGES[0]

    let output = ''
    try {
        if (input.trim()) {
            // access the function dynamically
            const converterFn = (curlConverter as any)[activeLanguage.fn]
            if (converterFn) {
                output = converterFn(input)
                if (error) setError(null)
            } else {
                output = '// Converter function not found'
            }
        }
    } catch (e) {
        // console.error(e)
        // Don't set error state immediately on every keystroke to avoid flickering, 
        // but maybe show a subtle warning. For now, just show the error in output if needed
        // or keep previous output.
        output = `// Error parsing curl command:\n// ${e instanceof Error ? e.message : String(e)}`
    }

    return (
        <div className="flex flex-col gap-8">
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 backdrop-blur-sm">
                <label className="text-sm font-medium text-zinc-400">Target Language:</label>
                <select
                    value={languageId}
                    onChange={(e) => setLanguageId(e.target.value)}
                    className="rounded-lg border border-zinc-700 bg-zinc-800 py-1.5 px-3 text-sm text-zinc-200 focus:outline-none"
                >
                    {LANGUAGES.map(l => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                </select>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Input */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Curl Command</label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="h-[500px] w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 font-mono text-xs text-zinc-300 placeholder-zinc-700 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        placeholder="curl example.com..."
                        spellCheck={false}
                    />
                </div>

                {/* Output */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between px-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Generated Code</label>
                        <CopyButton text={output} />
                    </div>
                    <div className="relative h-[500px] w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
                        <Highlight
                            theme={themes.vsDark}
                            code={output}
                            language={languageId as Language}
                        >
                            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                                <pre className="h-full w-full overflow-auto p-4 text-xs font-mono" style={{ ...style, background: 'transparent' }}>
                                    {tokens.map((line, i) => (
                                        <div key={i} {...getLineProps({ line })}>
                                            {line.map((token, key) => (
                                                <span key={key} {...getTokenProps({ token })} />
                                            ))}
                                        </div>
                                    ))}
                                </pre>
                            )}
                        </Highlight>
                    </div>
                </div>
            </div>
        </div>
    )
}
