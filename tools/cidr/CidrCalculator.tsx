'use client'

import { useState, useMemo } from 'react'
import { CopyButton } from '@/components/CopyButton'

function ipToNumber(ip: string): number | null {
  const parts = ip.split('.').map(Number)
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    return null
  }
  return (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]
}

function numberToIp(num: number): string {
  return [num >>> 24, (num >>> 16) & 255, (num >>> 8) & 255, num & 255].join('.')
}

function calculateCidr(cidr: string) {
  const [ip, prefix] = cidr.split('/')
  if (!ip || !prefix) return null

  const prefixLength = parseInt(prefix)
  if (isNaN(prefixLength) || prefixLength < 0 || prefixLength > 32) return null

  const ipNumber = ipToNumber(ip)
  if (ipNumber === null) return null

  const mask = (0xffffffff << (32 - prefixLength)) >>> 0
  const networkAddress = (ipNumber & mask) >>> 0
  const broadcastAddress = (networkAddress | (~mask >>> 0)) >>> 0
  const firstHost = networkAddress + 1
  const lastHost = broadcastAddress - 1
  const totalHosts = Math.pow(2, 32 - prefixLength)
  const usableHosts = Math.max(0, totalHosts - 2)

  return {
    networkAddress: numberToIp(networkAddress),
    broadcastAddress: numberToIp(broadcastAddress),
    firstHost: numberToIp(firstHost),
    lastHost: numberToIp(lastHost),
    subnetMask: numberToIp(mask),
    prefixLength,
    totalHosts,
    usableHosts,
  }
}

export default function CidrCalculator() {
  const [cidr, setCidr] = useState('192.168.1.0/24')
  const [error, setError] = useState<string | null>(null)

  const result = useMemo(() => {
    setError(null)
    if (!cidr.trim()) {
      return null
    }

    const calculated = calculateCidr(cidr.trim())
    if (!calculated) {
      setError('Invalid CIDR notation. Use format: 192.168.1.0/24')
      return null
    }

    return calculated
  }, [cidr])

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">CIDR Notation</label>
        <input
          type="text"
          value={cidr}
          onChange={(e) => setCidr(e.target.value)}
          placeholder="192.168.1.0/24"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>

      {result && (
        <div className="space-y-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
            <h3 className="mb-4 text-sm font-semibold text-zinc-300">Network Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Network Address</span>
                  <CopyButton text={result.networkAddress} />
                </div>
                <p className="font-mono text-sm font-medium text-emerald-400">{result.networkAddress}</p>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Broadcast Address</span>
                  <CopyButton text={result.broadcastAddress} />
                </div>
                <p className="font-mono text-sm font-medium text-emerald-400">{result.broadcastAddress}</p>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Subnet Mask</span>
                  <CopyButton text={result.subnetMask} />
                </div>
                <p className="font-mono text-sm font-medium text-emerald-400">{result.subnetMask}</p>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Prefix Length</span>
                  <CopyButton text={result.prefixLength.toString()} />
                </div>
                <p className="font-mono text-sm font-medium text-emerald-400">/{result.prefixLength}</p>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">First Host</span>
                  <CopyButton text={result.firstHost} />
                </div>
                <p className="font-mono text-sm font-medium text-emerald-400">{result.firstHost}</p>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Last Host</span>
                  <CopyButton text={result.lastHost} />
                </div>
                <p className="font-mono text-sm font-medium text-emerald-400">{result.lastHost}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
            <h3 className="mb-4 text-sm font-semibold text-zinc-300">Host Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <span className="text-xs text-zinc-500">Total Hosts</span>
                <p className="mt-1 text-lg font-bold text-emerald-400">{result.totalHosts.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-xs text-zinc-500">Usable Hosts</span>
                <p className="mt-1 text-lg font-bold text-emerald-400">{result.usableHosts.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!result && !error && cidr.trim() && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-8 text-center">
          <p className="text-sm text-zinc-500">Enter a CIDR notation to calculate network information</p>
        </div>
      )}
    </div>
  )
}

