'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

export default function NginxGenerator() {
    const [domain, setDomain] = useState('example.com')
    const [path, setPath] = useState('/app')
    const [proxyUrl, setProxyUrl] = useState('http://localhost:3000')
    const [type, setType] = useState('proxy') // proxy, spa, static

    const generateConfig = () => {
        let block = ''

        if (type === 'proxy') {
            block = `    location ${path} {
        proxy_pass ${proxyUrl};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }`
        } else if (type === 'spa') {
            block = `    location / {
        root /var/www/${domain};
        index index.html;
        try_files $uri $uri/ /index.html;
    }`
        } else if (type === 'static') {
            block = `    location /static {
        alias /var/www/${domain}/static;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }`
        }

        return `server {
    listen 80;
    server_name ${domain} www.${domain};

${block}

    error_log  /var/log/nginx/${domain}.error.log;
    access_log /var/log/nginx/${domain}.access.log;
}`
    }

    const config = generateConfig()

    return (
        <div className="grid gap-8 lg:grid-cols-2">
            {/* Controls */}
            <div className="flex flex-col gap-6">
                <div>
                    <label className="text-xs font-semibold uppercase text-zinc-500 mb-2 block">Scenario</label>
                    <div className="flex gap-2">
                        <button onClick={() => setType('proxy')} className={`px-4 py-2 rounded border text-sm ${type === 'proxy' ? 'border-emerald-500 bg-emerald-500/20' : 'border-zinc-800'}`}>Reverse Proxy</button>
                        <button onClick={() => setType('spa')} className={`px-4 py-2 rounded border text-sm ${type === 'spa' ? 'border-emerald-500 bg-emerald-500/20' : 'border-zinc-800'}`}>SPA (React/Vue)</button>
                        <button onClick={() => setType('static')} className={`px-4 py-2 rounded border text-sm ${type === 'static' ? 'border-emerald-500 bg-emerald-500/20' : 'border-zinc-800'}`}>Static Assets</button>
                    </div>
                </div>

                <div className="grid gap-4">
                    <div>
                        <label className="text-xs font-semibold uppercase text-zinc-500 mb-1 block">Domain</label>
                        <input type="text" value={domain} onChange={e => setDomain(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-sm" />
                    </div>
                    {type === 'proxy' && (
                        <>
                            <div>
                                <label className="text-xs font-semibold uppercase text-zinc-500 mb-1 block">Location Path</label>
                                <input type="text" value={path} onChange={e => setPath(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-sm" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold uppercase text-zinc-500 mb-1 block">Proxy Pass URL</label>
                                <input type="text" value={proxyUrl} onChange={e => setProxyUrl(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-sm" />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Output */}
            <div className="relative">
                <CopyButton text={config} />
                <pre className="h-full w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 font-mono text-sm text-zinc-400 overflow-auto whitespace-pre">
                    {config}
                </pre>
            </div>
        </div>
    )
}
