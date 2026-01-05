'use client'

import { useState, useMemo } from 'react'
import { CopyButton } from '@/components/CopyButton'

type MockFormat = 'msw' | 'fetch' | 'axios'

export default function ApiMockGenerator() {
    const [inputJson, setInputJson] = useState('{\n  "id": 1,\n  "name": "Leanne Graham",\n  "username": "Bret",\n  "email": "Sincere@april.biz"\n}')
    const [format, setFormat] = useState<MockFormat>('msw')
    const [method, setMethod] = useState('GET')
    const [endpoint, setEndpoint] = useState('/api/users/1')

    const generatedCode = useMemo(() => {
        try {
            const data = JSON.parse(inputJson)
            const dataStr = JSON.stringify(data, null, 2)

            if (format === 'msw') {
                return `import { http, HttpResponse } from 'msw'

export const handlers = [
  http.${method.toLowerCase()}('${endpoint}', () => {
    return HttpResponse.json(${dataStr})
  }),
]`
            }

            if (format === 'fetch') {
                return `// Mock global fetch for testing
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(${dataStr}),
    ok: true,
    status: 200,
  })
) as jest.Mock;`
            }

            if (format === 'axios') {
                return `import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

mock.on${method.charAt(0) + method.slice(1).toLowerCase()}('${endpoint}').reply(200, ${dataStr});`
            }

            return ''
        } catch (e) {
            return '// Invalid JSON input'
        }
    }, [inputJson, format, method, endpoint])

    return (
        <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex flex-col gap-6">
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-zinc-300">API Details</h3>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-1">
                                <label className="text-xs text-zinc-500 block mb-2">Method</label>
                                <select
                                    value={method}
                                    onChange={(e) => setMethod(e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-sm focus:border-violet-500/50 focus:outline-none"
                                >
                                    <option>GET</option>
                                    <option>POST</option>
                                    <option>PUT</option>
                                    <option>PATCH</option>
                                    <option>DELETE</option>
                                </select>
                            </div>
                            <div className="col-span-3">
                                <label className="text-xs text-zinc-500 block mb-2">Endpoint</label>
                                <input
                                    type="text"
                                    value={endpoint}
                                    onChange={(e) => setEndpoint(e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-sm focus:border-violet-500/50 focus:outline-none"
                                    placeholder="/api/v1/..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-zinc-300">Sample Response (JSON)</h3>
                        <textarea
                            value={inputJson}
                            onChange={(e) => setInputJson(e.target.value)}
                            className="w-full h-80 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 font-mono text-sm focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/50 placeholder-zinc-600"
                            placeholder="Paste your JSON response here..."
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex gap-2 p-1 bg-zinc-900/50 rounded-xl border border-zinc-800">
                        {(['msw', 'fetch', 'axios'] as MockFormat[]).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFormat(f)}
                                className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${format === f ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:text-zinc-300'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 bg-zinc-900/30 rounded-2xl border border-zinc-800 p-6 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-semibold text-zinc-400">Mock Implementation</h4>
                            <CopyButton text={generatedCode} />
                        </div>
                        <pre className="flex-1 text-xs font-mono text-emerald-300 p-6 bg-black/40 rounded-xl overflow-auto whitespace-pre">
                            {generatedCode}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    )
}
