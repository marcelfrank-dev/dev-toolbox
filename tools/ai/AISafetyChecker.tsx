'use client'

import { useState } from 'react'

interface SafetyCheck {
    type: string
    severity: 'low' | 'medium' | 'high'
    message: string
}

export default function AISafetyChecker() {
    const [text, setText] = useState('')
    const [checks, setChecks] = useState<SafetyCheck[]>([])

    const runChecks = () => {
        const results: SafetyCheck[] = []

        // Prompt injection patterns
        const injectionPatterns = [
            /ignore (previous|all) instructions?/i,
            /disregard (previous|all) instructions?/i,
            /forget (everything|all)/i,
            /new instructions?:/i,
            /system:?\s*you are/i,
        ]

        injectionPatterns.forEach((pattern) => {
            if (pattern.test(text)) {
                results.push({
                    type: 'Prompt Injection',
                    severity: 'high',
                    message: `Potential prompt injection detected: "${text.match(pattern)?.[0]}"`,
                })
            }
        })

        // PII detection
        const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
        const phonePattern = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g
        const ssnPattern = /\b\d{3}-\d{2}-\d{4}\b/g

        const emails = text.match(emailPattern)
        const phones = text.match(phonePattern)
        const ssns = text.match(ssnPattern)

        if (emails) {
            results.push({
                type: 'PII - Email',
                severity: 'medium',
                message: `Found ${emails.length} email address(es)`,
            })
        }

        if (phones) {
            results.push({
                type: 'PII - Phone',
                severity: 'medium',
                message: `Found ${phones.length} phone number(s)`,
            })
        }

        if (ssns) {
            results.push({
                type: 'PII - SSN',
                severity: 'high',
                message: `Found ${ssns.length} Social Security Number(s)`,
            })
        }

        // Sensitive keywords
        const sensitiveKeywords = ['password', 'api key', 'secret', 'token', 'private key']
        sensitiveKeywords.forEach((keyword) => {
            if (text.toLowerCase().includes(keyword)) {
                results.push({
                    type: 'Sensitive Data',
                    severity: 'high',
                    message: `Contains sensitive keyword: "${keyword}"`,
                })
            }
        })

        // Jailbreak attempts
        const jailbreakPatterns = [
            /pretend (you are|to be)/i,
            /roleplay as/i,
            /act as if/i,
            /simulate/i,
        ]

        jailbreakPatterns.forEach((pattern) => {
            if (pattern.test(text)) {
                results.push({
                    type: 'Jailbreak Attempt',
                    severity: 'medium',
                    message: `Potential jailbreak pattern: "${text.match(pattern)?.[0]}"`,
                })
            }
        })

        setChecks(results)
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high':
                return 'border-red-500/30 bg-red-950/20 text-red-300'
            case 'medium':
                return 'border-yellow-500/30 bg-yellow-950/20 text-yellow-300'
            case 'low':
                return 'border-blue-500/30 bg-blue-950/20 text-blue-300'
            default:
                return 'border-zinc-700 bg-zinc-900/50 text-zinc-300'
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Input */}
                <div className="space-y-4">
                    <label htmlFor="safety-input" className="block text-sm font-medium text-zinc-300">
                        Text to Analyze
                    </label>
                    <textarea
                        id="safety-input"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Paste your prompt or response here..."
                        className="h-96 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
                    />
                    <button
                        onClick={runChecks}
                        disabled={!text}
                        className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Run Safety Checks
                    </button>
                </div>

                {/* Results */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-zinc-300">
                        Safety Report {checks.length > 0 && `(${checks.length} issues)`}
                    </h3>
                    <div className="space-y-3">
                        {checks.length === 0 ? (
                            <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-4 text-center">
                                <p className="text-sm text-emerald-300">
                                    {text ? 'Click "Run Safety Checks" to analyze' : 'No issues detected'}
                                </p>
                            </div>
                        ) : (
                            checks.map((check, i) => (
                                <div key={i} className={`rounded-lg border p-4 ${getSeverityColor(check.severity)}`}>
                                    <div className="mb-1 flex items-center justify-between">
                                        <span className="text-sm font-medium">{check.type}</span>
                                        <span className="rounded bg-black/20 px-2 py-0.5 text-xs uppercase">
                                            {check.severity}
                                        </span>
                                    </div>
                                    <p className="text-xs opacity-90">{check.message}</p>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="rounded-lg border border-blue-500/20 bg-blue-950/10 p-3">
                        <p className="mb-2 text-xs font-medium text-blue-300">Privacy Recommendations:</p>
                        <ul className="space-y-1 text-xs text-blue-200">
                            <li>• Remove PII before sharing with AI</li>
                            <li>• Avoid including passwords or API keys</li>
                            <li>• Be cautious with sensitive business data</li>
                            <li>• Review AI responses for leaked information</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
