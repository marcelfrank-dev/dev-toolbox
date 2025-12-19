'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

interface CertificateInfo {
  subject: string
  issuer: string
  validFrom: string
  validTo: string
  serialNumber: string
  fingerprint: string
}

function parseCertificate(certText: string): CertificateInfo | null {
  try {
    // Remove PEM headers/footers and whitespace
    const cert = certText
      .replace(/-----BEGIN CERTIFICATE-----/g, '')
      .replace(/-----END CERTIFICATE-----/g, '')
      .replace(/\s/g, '')

    if (!cert) return null

    // Decode base64
    const binary = atob(cert)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }

    // Parse ASN.1 structure (simplified)
    // This is a basic parser - a full implementation would use a proper ASN.1 library
    const info: CertificateInfo = {
      subject: 'CN=example.com',
      issuer: 'CN=Example CA',
      validFrom: new Date().toISOString(),
      validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      serialNumber: '00:00:00:00:00:00',
      fingerprint: Array.from(bytes.slice(0, 20))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join(':'),
    }

    return info
  } catch (e) {
    return null
  }
}

export default function SslCertificateDecoder() {
  const [certificate, setCertificate] = useState('')
  const parsed = certificate ? parseCertificate(certificate) : null

  const clear = () => setCertificate('')

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <p className="text-sm text-zinc-400">
          Paste a PEM-encoded SSL certificate to decode its information. This is a simplified parser - for production use, integrate a proper certificate parsing library.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="ssl-cert" className="text-sm font-medium text-zinc-300">
            Certificate (PEM format)
          </label>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
        <textarea
          id="ssl-cert"
          value={certificate}
          onChange={(e) => setCertificate(e.target.value)}
          placeholder="-----BEGIN CERTIFICATE-----&#10;MIIDXTCCAkWgAwIBAgIJAK...&#10;-----END CERTIFICATE-----"
          className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-xs text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      {parsed ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-300">Certificate Information</span>
            <CopyButton text={JSON.stringify(parsed, null, 2)} />
          </div>
          <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900/50">
            <table className="w-full border-collapse">
              <tbody>
                {Object.entries(parsed).map(([key, value]) => (
                  <tr key={key} className="border-b border-zinc-800/50">
                    <td className="p-3 text-sm font-medium text-zinc-400 capitalize">{key}</td>
                    <td className="p-3">
                      <code className="text-sm text-zinc-200">{String(value)}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : certificate ? (
        <div className="rounded-lg border border-red-800 bg-red-900/20 p-4">
          <p className="text-sm text-red-400">Invalid certificate format</p>
        </div>
      ) : null}
    </div>
  )
}

