'use client'

import { useState } from 'react'

export default function IbanValidator() {
    const [iban, setIban] = useState('')
    const [result, setResult] = useState<{ valid: boolean, country?: string, bank?: string, account?: string } | null>(null)

    const validate = (str: string) => {
        // Remove spaces
        const clean = str.replace(/\s/g, '').toUpperCase()
        if (!clean) {
            setResult(null)
            return
        }

        // Move first 4 chars to end
        const rearranged = clean.slice(4) + clean.slice(0, 4)

        // Replace letters with numbers (A=10, Z=35)
        let expanded = ''
        for (let i = 0; i < rearranged.length; i++) {
            const code = rearranged.charCodeAt(i)
            if (code >= 65 && code <= 90) {
                expanded += (code - 55).toString()
            } else {
                expanded += rearranged[i]
            }
        }

        // Modulo 97 (using BigInt due to size)
        let valid = false
        try {
            const remainder = BigInt(expanded) % BigInt(97)
            valid = remainder === BigInt(1)
        } catch (e) {
            valid = false
        }

        // Simple extraction logic (varies by country, assuming standard layout for viz)
        setResult({
            valid,
            country: clean.slice(0, 2),
            bank: clean.slice(4, 8),
            account: clean.slice(8) // Rough approximation for display
        })
    }

    return (
        <div className="max-w-2xl mx-auto flex flex-col gap-8 pt-8">
            <div className="space-y-2">
                <label className="text-zinc-400 text-sm font-medium">IBAN Number</label>
                <input
                    type="text"
                    value={iban}
                    onChange={e => { setIban(e.target.value); validate(e.target.value) }}
                    className="w-full text-center text-2xl font-mono p-4 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-indigo-500 outline-none transition-colors uppercase"
                    placeholder="DE89 ..."
                />
            </div>

            {result && (
                <div className={`p-6 rounded-xl border ${result.valid ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                    <div className="flex items-center gap-4 mb-6">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${result.valid ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                            {result.valid ? '✓' : '✕'}
                        </div>
                        <div>
                            <h3 className={`text-lg font-bold ${result.valid ? 'text-emerald-400' : 'text-red-400'}`}>
                                {result.valid ? 'Valid IBAN' : 'Invalid IBAN'}
                            </h3>
                            <p className="text-sm text-zinc-400">
                                {result.valid ? 'Checksum is correct.' : 'Checksum verification failed.'}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-3 bg-zinc-950/50 rounded-lg border border-zinc-800">
                            <div className="text-xs text-zinc-500 uppercase mb-1">Country</div>
                            <div className="text-xl font-mono text-zinc-200">{result.country}</div>
                        </div>
                        <div className="p-3 bg-zinc-950/50 rounded-lg border border-zinc-800">
                            <div className="text-xs text-zinc-500 uppercase mb-1">Bank Code</div>
                            <div className="text-xl font-mono text-zinc-200 truncate">{result.bank}</div>
                        </div>
                        <div className="p-3 bg-zinc-950/50 rounded-lg border border-zinc-800">
                            <div className="text-xs text-zinc-500 uppercase mb-1">Account</div>
                            <div className="text-xl font-mono text-zinc-200 truncate">{result.account}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
