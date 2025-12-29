'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

export default function GlassmorphismGenerator() {
    const [blur, setBlur] = useState(16)
    const [transparency, setTransparency] = useState(0.6)
    const [saturation, setSaturation] = useState(180)
    const [borderRadius, setBorderRadius] = useState(12)
    const [color, setColor] = useState('255, 255, 255')

    const background = `rgba(${color}, ${transparency})`
    const boxShadow = `0 4px 30px rgba(0, 0, 0, 0.1)`
    const backdropFilter = `blur(${blur}px) saturate(${saturation}%)`
    const border = `1px solid rgba(${color}, 0.3)`

    const css = `background: ${background};
border-radius: ${borderRadius}px;
box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border: 1px solid rgba(${color}, 0.3);`

    return (
        <div className="flex flex-col gap-8">
            {/* Controls */}
            <div className="grid gap-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-4">

                <div className="flex flex-col gap-2">
                    <label className="flex justify-between text-xs font-medium uppercase text-zinc-400">
                        Blur <span>{blur}px</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="40"
                        value={blur}
                        onChange={(e) => setBlur(Number(e.target.value))}
                        className="accent-emerald-500"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="flex justify-between text-xs font-medium uppercase text-zinc-400">
                        Transparency <span>{Math.round(transparency * 100)}%</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={transparency}
                        onChange={(e) => setTransparency(Number(e.target.value))}
                        className="accent-emerald-500"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="flex justify-between text-xs font-medium uppercase text-zinc-400">
                        Saturation <span>{saturation}%</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="200"
                        value={saturation}
                        onChange={(e) => setSaturation(Number(e.target.value))}
                        className="accent-emerald-500"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="flex justify-between text-xs font-medium uppercase text-zinc-400">
                        Radius <span>{borderRadius}px</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={borderRadius}
                        onChange={(e) => setBorderRadius(Number(e.target.value))}
                        className="accent-emerald-500"
                    />
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Preview */}
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-cover bg-center shadow-2xl flex items-center justify-center p-8"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop")',
                    }}>

                    {/* Moving items to show effect better */}
                    <div className="absolute top-10 left-10 w-24 h-24 bg-rose-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-32 h-32 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '1s' }}></div>

                    <div
                        className="relative z-10 w-full max-w-sm p-8 text-white min-h-[200px] flex flex-col justify-center"
                        style={{
                            background,
                            boxShadow,
                            backdropFilter,
                            WebkitBackdropFilter: backdropFilter,
                            borderRadius: `${borderRadius}px`,
                            border,
                        }}
                    >
                        <h3 className="text-xl font-bold mb-2 drop-shadow-md">Glassmorphism</h3>
                        <p className="opacity-80 text-sm leading-relaxed drop-shadow-sm">
                            This is how your element will look. The backdrop-filter property creates the blur effect behind the element.
                        </p>
                    </div>
                </div>

                {/* Output */}
                <div className="flex flex-col gap-4">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-inner h-full">
                        <div className="mb-4 flex items-center justify-between">
                            <label className="text-xs font-semibold uppercase tracking-wider text-emerald-500">CSS Output</label>
                            <CopyButton text={css} />
                        </div>
                        <pre className="font-mono text-sm text-zinc-300 overflow-x-auto whitespace-pre-wrap">
                            {css}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    )
}
