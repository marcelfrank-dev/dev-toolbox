'use client'

import { useState } from 'react'
import { jsonToZod } from 'json-to-zod'
import { Highlight, themes, type Language } from 'prism-react-renderer'
import { CopyButton } from '@/components/CopyButton'

export default function JsonToZod() {
    const [input, setInput] = useState('{\n  "name": "John Doe",\n  "age": 30,\n  "email": "john@example.com",\n  "isAdmin": false,\n  "roles": ["user", "editor"]\n}')
    const [error, setError] = useState<string | null>(null)

    let output = ''
    try {
        if (input.trim()) {
            const parsed = JSON.parse(input)
            output = jsonToZod(parsed)
            if (error) setError(null)
        }
    } catch (e) {
        output = '// Invalid JSON'
    }

    return (
        <div className="grid gap-8 lg:grid-cols-2 h-[600px]">
            {/* Input */}
            <div className="flex flex-col gap-2 h-full">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">JSON Input</label>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 font-mono text-sm text-zinc-300 placeholder-zinc-700 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    spellCheck={false}
                />
            </div>

            {/* Output */}
            <div className="flex flex-col gap-2 h-full">
                <div className="flex items-center justify-between px-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Zod Schema</label>
                    <CopyButton text={output} />
                </div>
                <div className="relative flex-1 w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
                    <Highlight
                        theme={themes.vsDark}
                        code={output}
                        language="typescript"
                    >
                        {({ className, style, tokens, getLineProps, getTokenProps }) => (
                            <pre className="h-full w-full overflow-auto p-4 text-sm font-mono" style={{ ...style, background: 'transparent' }}>
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
    )
}
