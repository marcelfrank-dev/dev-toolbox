'use client'

import { useState } from 'react'
import { useToast } from '@/components/Toast'

interface SecurityCheck {
    category: string
    status: 'pass' | 'warning' | 'fail' | 'info'
    message: string
    details?: string
}

interface URLAnalysis {
    protocol: string
    hostname: string
    hasHttps: boolean
    hasSuspiciousPatterns: boolean
    suspiciousReasons: string[]
}

export default function WebsiteSecurityChecker() {
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [checks, setChecks] = useState<SecurityCheck[]>([])
    const [urlAnalysis, setUrlAnalysis] = useState<URLAnalysis | null>(null)
    const { showToast } = useToast()

    const analyzeURL = (inputUrl: string): URLAnalysis | null => {
        try {
            const parsedUrl = new URL(inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`)
            const suspicious: string[] = []

            // Check for suspicious patterns
            if (parsedUrl.hostname.includes('..')) suspicious.push('Double dots in hostname')
            if (parsedUrl.hostname.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)) {
                suspicious.push('IP address instead of domain name')
            }
            if (parsedUrl.hostname.length > 50) suspicious.push('Unusually long domain name')
            if ((parsedUrl.hostname.match(/\./g) || []).length > 4) {
                suspicious.push('Excessive subdomains')
            }
            if (parsedUrl.hostname.match(/-{2,}/)) suspicious.push('Multiple consecutive hyphens')

            // Common phishing patterns
            const phishingKeywords = ['login', 'verify', 'account', 'secure', 'update', 'confirm']
            const hasPhishingKeyword = phishingKeywords.some(kw => parsedUrl.hostname.includes(kw))
            if (hasPhishingKeyword && parsedUrl.hostname.split('.').length > 3) {
                suspicious.push('Suspicious subdomain with security-related keywords')
            }

            return {
                protocol: parsedUrl.protocol,
                hostname: parsedUrl.hostname,
                hasHttps: parsedUrl.protocol === 'https:',
                hasSuspiciousPatterns: suspicious.length > 0,
                suspiciousReasons: suspicious,
            }
        } catch (e) {
            return null
        }
    }

    const runChecks = async () => {
        if (!url) return

        setLoading(true)
        const results: SecurityCheck[] = []

        // Analyze URL structure
        const analysis = analyzeURL(url)
        setUrlAnalysis(analysis)

        if (!analysis) {
            showToast('Invalid URL format', 'error')
            setLoading(false)
            return
        }

        // Check 1: HTTPS
        if (analysis.hasHttps) {
            results.push({
                category: 'Protocol',
                status: 'pass',
                message: 'Uses HTTPS',
                details: 'The website uses encrypted HTTPS connection',
            })
        } else {
            results.push({
                category: 'Protocol',
                status: 'fail',
                message: 'No HTTPS',
                details: 'The website does not use HTTPS encryption. Your data may be visible to attackers.',
            })
        }

        // Check 2: URL Structure
        if (analysis.hasSuspiciousPatterns) {
            results.push({
                category: 'URL Analysis',
                status: 'warning',
                message: 'Suspicious URL patterns detected',
                details: analysis.suspiciousReasons.join(', '),
            })
        } else {
            results.push({
                category: 'URL Analysis',
                status: 'pass',
                message: 'URL structure looks normal',
            })
        }

        // Check 3: Domain age/reputation (informational)
        results.push({
            category: 'Domain Reputation',
            status: 'info',
            message: 'Manual verification recommended',
            details: 'Use WHOIS lookup or Google Safe Browsing to check domain age and reputation',
        })

        // Check 4: Try to fetch headers (will fail for most sites due to CORS)
        try {
            const response = await fetch(analysis.protocol + '//' + analysis.hostname, {
                method: 'HEAD',
                mode: 'cors',
            })

            // Security headers check
            const headers = response.headers
            const securityHeaders = {
                'strict-transport-security': 'HSTS',
                'x-frame-options': 'Clickjacking Protection',
                'x-content-type-options': 'MIME Sniffing Protection',
                'content-security-policy': 'CSP',
                'x-xss-protection': 'XSS Protection',
            }

            Object.entries(securityHeaders).forEach(([header, name]) => {
                if (headers.get(header)) {
                    results.push({
                        category: 'Security Headers',
                        status: 'pass',
                        message: `${name} enabled`,
                        details: headers.get(header) || undefined,
                    })
                } else {
                    results.push({
                        category: 'Security Headers',
                        status: 'warning',
                        message: `${name} missing`,
                        details: `The ${name} header is not set`,
                    })
                }
            })
        } catch (e) {
            results.push({
                category: 'Security Headers',
                status: 'info',
                message: 'Unable to check headers (CORS blocked)',
                details:
                    'Most websites block cross-origin requests. Use browser DevTools (Network tab) to manually inspect security headers.',
            })
        }

        setChecks(results)
        setLoading(false)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pass':
                return 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
            case 'warning':
                return 'border-yellow-500/30 bg-yellow-950/20 text-yellow-300'
            case 'fail':
                return 'border-red-500/30 bg-red-950/20 text-red-300'
            case 'info':
                return 'border-blue-500/30 bg-blue-950/20 text-blue-300'
            default:
                return 'border-zinc-700 bg-zinc-900/50 text-zinc-300'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pass':
                return '✅'
            case 'warning':
                return '⚠️'
            case 'fail':
                return '❌'
            case 'info':
                return 'ℹ️'
            default:
                return '•'
        }
    }

    return (
        <div className="space-y-6">
            {/* Input */}
            <div className="space-y-4">
                <div>
                    <label htmlFor="url-input" className="mb-2 block text-sm font-medium text-zinc-300">
                        Website URL
                    </label>
                    <div className="flex gap-2">
                        <input
                            id="url-input"
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-sm text-zinc-200 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && runChecks()}
                        />
                        <button
                            onClick={runChecks}
                            disabled={!url || loading}
                            className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? 'Checking...' : 'Check Security'}
                        </button>
                    </div>
                </div>

                {/* Limitations Notice */}
                <div className="rounded-lg border border-yellow-500/30 bg-yellow-950/10 p-4">
                    <p className="mb-2 text-sm font-medium text-yellow-300">⚠️ Important Limitations</p>
                    <ul className="space-y-1 text-xs text-yellow-200">
                        <li>• This tool performs CLIENT-SIDE checks only (no external API calls)</li>
                        <li>• Most websites block CORS, limiting header inspection</li>
                        <li>• Cannot check SSL certificate validity or malware databases</li>
                        <li>• For comprehensive security analysis, use the external tools listed below</li>
                    </ul>
                </div>
            </div>

            {/* Results */}
            {checks.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-zinc-200">Security Analysis Results</h3>
                    <div className="space-y-2">
                        {checks.map((check, i) => (
                            <div key={i} className={`rounded-lg border p-4 ${getStatusColor(check.status)}`}>
                                <div className="mb-1 flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{getStatusIcon(check.status)}</span>
                                        <div>
                                            <div className="text-sm font-medium">{check.category}</div>
                                            <div className="text-sm">{check.message}</div>
                                        </div>
                                    </div>
                                </div>
                                {check.details && <p className="mt-2 text-xs opacity-80">{check.details}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* External Tools */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h3 className="mb-4 text-lg font-medium text-zinc-200">Recommended External Security Tools</h3>
                <div className="space-y-3">
                    <a
                        href={`https://www.securenow.dev/?url=${encodeURIComponent(url)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-lg border-2 border-emerald-500/50 bg-gradient-to-r from-emerald-950/30 to-emerald-900/20 p-4 transition-all hover:border-emerald-500/70 hover:shadow-lg hover:shadow-emerald-900/20"
                    >
                        <div className="mb-1 flex items-center gap-2">
                            <span className="text-lg">⭐</span>
                            <div className="text-sm font-bold text-emerald-300">SecureNow (Recommended)</div>
                        </div>
                        <div className="text-xs text-zinc-300">Comprehensive security analysis and vulnerability scanning</div>
                    </a>
                    <a
                        href={`https://transparencyreport.google.com/safe-browsing/search?url=${encodeURIComponent(url)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-lg border border-zinc-700 bg-zinc-800/50 p-3 transition-colors hover:bg-zinc-800"
                    >
                        <div className="mb-1 text-sm font-medium text-zinc-200">Google Safe Browsing</div>
                        <div className="text-xs text-zinc-400">Check if the site is flagged for malware or phishing</div>
                    </a>
                    <a
                        href={`https://www.ssllabs.com/ssltest/analyze.html?d=${urlAnalysis?.hostname || ''}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-lg border border-zinc-700 bg-zinc-800/50 p-3 transition-colors hover:bg-zinc-800"
                    >
                        <div className="mb-1 text-sm font-medium text-zinc-200">SSL Labs</div>
                        <div className="text-xs text-zinc-400">Comprehensive SSL/TLS certificate analysis</div>
                    </a>
                    <a
                        href={`https://securityheaders.com/?q=${encodeURIComponent(url)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-lg border border-zinc-700 bg-zinc-800/50 p-3 transition-colors hover:bg-zinc-800"
                    >
                        <div className="mb-1 text-sm font-medium text-zinc-200">Security Headers</div>
                        <div className="text-xs text-zinc-400">Analyze HTTP security headers</div>
                    </a>
                </div>
            </div>

            {/* Manual Checklist */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h3 className="mb-4 text-lg font-medium text-zinc-200">Manual Security Checklist</h3>
                <div className="space-y-2 text-sm text-zinc-300">
                    <div className="flex items-start gap-2">
                        <span className="text-emerald-400">✓</span>
                        <span>Check for padlock icon in browser address bar</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-emerald-400">✓</span>
                        <span>Verify the domain name matches the legitimate company</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-emerald-400">✓</span>
                        <span>Look for typos or unusual characters in the URL</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-emerald-400">✓</span>
                        <span>Check SSL certificate details (click padlock → Certificate)</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-emerald-400">✓</span>
                        <span>Use browser DevTools (F12 → Network) to inspect headers</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-emerald-400">✓</span>
                        <span>Search for reviews or reports about the website</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
