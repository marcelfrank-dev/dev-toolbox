'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, PanInfo } from 'framer-motion'
import { CopyButton } from '@/components/CopyButton'

interface Point {
    x: number
    y: number
    id: number
}

const PRESETS = {
    Pentagon: [
        { x: 50, y: 0, id: 1 },
        { x: 100, y: 38, id: 2 },
        { x: 82, y: 100, id: 3 },
        { x: 18, y: 100, id: 4 },
        { x: 0, y: 38, id: 5 },
    ],
    Hexagon: [
        { x: 50, y: 0, id: 1 },
        { x: 100, y: 25, id: 2 },
        { x: 100, y: 75, id: 3 },
        { x: 50, y: 100, id: 4 },
        { x: 0, y: 75, id: 5 },
        { x: 0, y: 25, id: 6 },
    ],
    Octagon: [
        { x: 30, y: 0, id: 1 },
        { x: 70, y: 0, id: 2 },
        { x: 100, y: 30, id: 3 },
        { x: 100, y: 70, id: 4 },
        { x: 70, y: 100, id: 5 },
        { x: 30, y: 100, id: 6 },
        { x: 0, y: 70, id: 7 },
        { x: 0, y: 30, id: 8 },
    ],
    Triangle: [
        { x: 50, y: 0, id: 1 },
        { x: 100, y: 100, id: 2 },
        { x: 0, y: 100, id: 3 },
    ],
    Message: [
        { x: 0, y: 0, id: 1 },
        { x: 100, y: 0, id: 2 },
        { x: 100, y: 75, id: 3 },
        { x: 75, y: 75, id: 4 },
        { x: 75, y: 100, id: 5 },
        { x: 50, y: 75, id: 6 },
        { x: 0, y: 75, id: 7 },
    ],
}

export default function ClipPathGenerator() {
    const [points, setPoints] = useState<Point[]>(PRESETS.Pentagon)
    const [activePreset, setActivePreset] = useState('Pentagon')
    const constraintsRef = useRef<HTMLDivElement>(null)

    // Calculate CSS string
    const polygonString = points.map(p => `${Math.round(p.x)}% ${Math.round(p.y)}%`).join(', ')
    const cssValue = `polygon(${polygonString})`
    const cssRule = `clip-path: ${cssValue};`

    const handleDrag = (id: number, info: PanInfo, constraints: DOMRect) => {
        const { width, height } = constraints

        setPoints(prev => prev.map(p => {
            if (p.id !== id) return p

            // Calculate new percentage based on drag text
            // Note: Framer Motion handles the visual drag, but we need to update state
            // We rely on onDragEnd closer to the constraints usually, but for live updates:
            // This is tricky with Framer Motion percentages.
            // Simpler approach: Use visual absolute positioning for handles, map to % state.
            return p
        }))
    }

    // Helper to update point from absolute position to percentage
    const updatePointPosition = (id: number, x: number, y: number, width: number, height: number) => {
        const newX = Math.max(0, Math.min(100, (x / width) * 100))
        const newY = Math.max(0, Math.min(100, (y / height) * 100))

        setPoints(prev => prev.map(p =>
            p.id === id ? { ...p, x: newX, y: newY } : p
        ))
    }

    return (
        <div className="flex flex-col gap-8">
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 backdrop-blur-sm">
                <label className="text-sm font-medium text-zinc-400">Preset:</label>
                <div className="flex flex-wrap gap-2">
                    {Object.keys(PRESETS).map(name => (
                        <button
                            key={name}
                            onClick={() => {
                                setPoints((PRESETS as any)[name])
                                setActivePreset(name)
                            }}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${activePreset === name
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                                }`}
                        >
                            {name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Editor Area */}
                <div className="aspect-square relative rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden shadow-2xl" ref={constraintsRef}>
                    {/* Background Grid Pattern */}
                    <div className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                            backgroundSize: '20px 20px'
                        }}
                    />

                    {/* The Clipped Element Preview */}
                    <div className="absolute inset-8 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 transition-all duration-75 ease-linear"
                        style={{ clipPath: cssValue }}>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white/90 font-bold text-2xl drop-shadow-md">Preview</span>
                        </div>
                    </div>

                    {/* Handles Overlay */}
                    <div className="absolute inset-8 pointer-events-none">
                        {points.map((p) => (
                            <Handle
                                key={p.id}
                                point={p}
                                parentRef={constraintsRef}
                                onUpdate={(x, y, w, h) => updatePointPosition(p.id, x, y, w, h)}
                            />
                        ))}
                    </div>
                </div>

                {/* Output */}
                <div className="flex flex-col gap-4">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-inner">
                        <div className="mb-2 flex items-center justify-between">
                            <label className="text-xs font-semibold uppercase tracking-wider text-emerald-500">CSS Output</label>
                            <CopyButton text={cssRule} />
                        </div>
                        <code className="block break-all font-mono text-sm text-zinc-300 bg-transparent outline-none">
                            {cssRule}
                        </code>
                    </div>

                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                        <h3 className="text-sm font-semibold text-zinc-400 mb-2">Instructions</h3>
                        <ul className="text-xs text-zinc-500 space-y-2 list-disc pl-4">
                            <li>Drag the handles to simple shape the polygon.</li>
                            <li>Select presets to start quickly.</li>
                            <li>Copy the generated CSS for your project.</li>
                            <li>Works with any background or image.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Subcomponent for dragging handle
function Handle({ point, parentRef, onUpdate }: {
    point: Point,
    parentRef: React.RefObject<HTMLDivElement | null>,
    onUpdate: (x: number, y: number, w: number, h: number) => void
}) {
    const containerSize = 400 // Approximation, effects logic if responsive, handled by dynamic calc below

    return (
        <motion.div
            drag
            dragMomentum={false}
            dragElastic={0}
            dragConstraints={parentRef}
            onDrag={(_, info) => {
                // This is complex because we need the absolute position relative to the container
                // Ideally we use a specialized library or simpler mouse events for this.
                // But let's try to infer from the parent bounds.
                if (parentRef.current) {
                    const rect = parentRef.current.getBoundingClientRect()
                    // The inset is 32px (8 * 4) standard tailwind 'inset-8'
                    const innerWidth = rect.width - 64
                    const innerHeight = rect.height - 64

                    // Current point global
                    const pX = info.point.x - rect.left - 32
                    const pY = info.point.y - rect.top - 32

                    onUpdate(pX, pY, innerWidth, innerHeight)
                }
            }}
            className="absolute w-4 h-4 -ml-2 -mt-2 bg-white rounded-full shadow-lg cursor-move pointer-events-auto border-2 border-emerald-500 z-10 hover:scale-125 transition-transform"
            style={{
                left: `${point.x}%`,
                top: `${point.y}%`
            }}
        />
    )
}
