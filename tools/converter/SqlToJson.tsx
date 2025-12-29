'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'
import { Highlight, themes } from 'prism-react-renderer'

export default function SqlToJson() {
    const [input, setInput] = useState("INSERT INTO users (id, name, email, is_active) VALUES (1, 'John Doe', 'john@example.com', true);\nINSERT INTO users (id, name) VALUES (2, 'Jane');")
    const [result, setResult] = useState<any[]>([])
    const [error, setError] = useState<string | null>(null)

    const convert = () => {
        try {
            const records: any[] = []
            // Simple regex parser for demo purposes. 
            // Matches: INSERT INTO table (cols) VALUES (vals);
            // Logic: 1. Split by ';' 2. Regex match each.

            const statements = input.split(';')

            statements.forEach(stmt => {
                if (!stmt.trim()) return
                const match = stmt.match(/INSERT\s+INTO\s+(\w+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i)
                if (match) {
                    const table = match[1]
                    const cols = match[2].split(',').map(c => c.trim().replace(/['"`]/g, ''))

                    // Values parsing is tricky with commas inside strings. 
                    // Simple approach: split by comma if not inside quotes.
                    const valsStr = match[3]
                    const vals: string[] = []
                    let current = ''
                    let inQuote = false
                    for (let i = 0; i < valsStr.length; i++) {
                        const char = valsStr[i]
                        if (char === "'" || char === '"') inQuote = !inQuote
                        if (char === ',' && !inQuote) {
                            vals.push(current.trim())
                            current = ''
                        } else {
                            current += char
                        }
                    }
                    vals.push(current.trim())

                    const obj: any = { _table: table }
                    cols.forEach((col, i) => {
                        let val = vals[i]
                        // clean quotes
                        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1)
                        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
                        // simple type casting
                        if (val === 'true') obj[col] = true
                        else if (val === 'false') obj[col] = false
                        else if (val === 'null') obj[col] = null
                        else if (!isNaN(Number(val)) && val !== '') obj[col] = Number(val)
                        else obj[col] = val
                    })
                    records.push(obj)
                }
            })

            setResult(records)
            setError(null)
        } catch (e) {
            setError('Parsed failed. Ensure valid INSERT syntax.')
            setResult([])
        }
    }

    return (
        <div className="grid gap-8 lg:grid-cols-2 h-[600px]">
            <div className="flex flex-col gap-2 h-full">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">SQL Input (INSERT only)</label>
                    <button onClick={convert} className="text-xs bg-emerald-600 px-3 py-1 rounded text-white font-medium hover:bg-emerald-500">Convert</button>
                </div>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 font-mono text-xs text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/50"
                    spellCheck={false}
                />
            </div>

            <div className="flex flex-col gap-2 h-full">
                <div className="flex items-center justify-between px-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">JSON Output</label>
                    <CopyButton text={JSON.stringify(result, null, 2)} />
                </div>
                <div className="relative flex-1 w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
                    {error ? (
                        <div className="p-4 text-red-400 text-sm">{error}</div>
                    ) : (
                        <Highlight
                            theme={themes.vsDark}
                            code={JSON.stringify(result, null, 2)}
                            language="json"
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
                    )}
                </div>
            </div>
        </div>
    )
}
