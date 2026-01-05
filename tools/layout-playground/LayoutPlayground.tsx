'use client'

import { useState, useMemo } from 'react'
import { CopyButton } from '@/components/CopyButton'

type LayoutType = 'flex' | 'grid'

interface LayoutItem {
    id: number
    color: string
}

const COLORS = [
    'bg-violet-500',
    'bg-cyan-500',
    'bg-emerald-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-rose-500',
    'bg-amber-500'
]

export default function LayoutPlayground() {
    const [layoutType, setLayoutType] = useState<LayoutType>('flex')
    const [items, setItems] = useState<LayoutItem[]>([
        { id: 1, color: COLORS[0] },
        { id: 2, color: COLORS[1] },
        { id: 3, color: COLORS[2] }
    ])

    // Flexbox State
    const [flexDirection, setFlexDirection] = useState('row')
    const [justifyContent, setJustifyContent] = useState('flex-start')
    const [alignItems, setAlignItems] = useState('stretch')
    const [flexWrap, setFlexWrap] = useState('nowrap')
    const [flexGap, setFlexGap] = useState(16)

    // Grid State
    const [gridCols, setGridCols] = useState('repeat(3, 1fr)')
    const [gridRows, setGridRows] = useState('')
    const [gridGap, setGridGap] = useState(16)
    const [gridAlignItems, setGridAlignItems] = useState('stretch')
    const [gridJustifyContent, setGridJustifyContent] = useState('stretch')

    const addItem = () => {
        if (items.length < 12) {
            setItems([...items, { id: Date.now(), color: COLORS[items.length % COLORS.length] }])
        }
    }

    const removeItem = () => {
        if (items.length > 1) {
            setItems(items.slice(0, -1))
        }
    }

    const containerStyle = useMemo<React.CSSProperties>(() => {
        if (layoutType === 'flex') {
            return {
                display: 'flex',
                flexDirection: flexDirection as any,
                justifyContent: justifyContent as any,
                alignItems: alignItems as any,
                flexWrap: flexWrap as any,
                gap: `${flexGap}px`
            }
        }
        return {
            display: 'grid',
            gridTemplateColumns: gridCols,
            gridTemplateRows: gridRows || 'none',
            gap: `${gridGap}px`,
            alignItems: gridAlignItems as any,
            justifyContent: gridJustifyContent as any
        }
    }, [layoutType, flexDirection, justifyContent, alignItems, flexWrap, flexGap, gridCols, gridRows, gridGap, gridAlignItems, gridJustifyContent])

    const cssCode = useMemo(() => {
        if (layoutType === 'flex') {
            return `.container {
  display: flex;
  flex-direction: ${flexDirection};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  flex-wrap: ${flexWrap};
  gap: ${flexGap}px;
}`
        }
        return `.container {
  display: grid;
  grid-template-columns: ${gridCols};
  ${gridRows ? `grid-template-rows: ${gridRows};` : ''}
  gap: ${gridGap}px;
  justify-content: ${gridJustifyContent};
  align-items: ${gridAlignItems};
}`
    }, [layoutType, flexDirection, justifyContent, alignItems, flexWrap, flexGap, gridCols, gridRows, gridGap, gridAlignItems, gridJustifyContent])

    const tailwindCode = useMemo(() => {
        if (layoutType === 'flex') {
            const dir = flexDirection === 'row' ? 'flex-row' : 'flex-col'
            const justify = {
                'flex-start': 'justify-start',
                'flex-end': 'justify-end',
                'center': 'justify-center',
                'space-between': 'justify-between',
                'space-around': 'justify-around',
                'space-evenly': 'justify-evenly'
            }[justifyContent] || 'justify-start'

            const align = {
                'stretch': 'items-stretch',
                'flex-start': 'items-start',
                'flex-end': 'items-end',
                'center': 'items-center',
                'baseline': 'items-baseline'
            }[alignItems] || 'items-stretch'

            const wrap = flexWrap === 'nowrap' ? 'flex-nowrap' : flexWrap === 'wrap' ? 'flex-wrap' : 'flex-wrap-reverse'

            return `<div className="flex ${dir} ${justify} ${align} ${wrap} gap-[${flexGap}px]">
  {/* items */}
</div>`
        }

        // Rough conversion for grid
        const colClass = gridCols.includes('repeat(3, 1fr)') ? 'grid-cols-3' : `grid-cols-[${gridCols}]`
        return `<div className="grid ${colClass} gap-[${gridGap}px] items-${gridAlignItems} justify-${gridJustifyContent}">
  {/* items */}
</div>`
    }, [layoutType, flexDirection, justifyContent, alignItems, flexWrap, flexGap, gridCols, gridGap, gridAlignItems, gridJustifyContent])

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Controls */}
                <div className="w-full lg:w-80 flex flex-col gap-6">
                    <div className="flex gap-2 p-1 bg-zinc-900/50 rounded-xl border border-zinc-800">
                        <button
                            onClick={() => setLayoutType('flex')}
                            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${layoutType === 'flex' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
                                }`}
                        >
                            Flexbox
                        </button>
                        <button
                            onClick={() => setLayoutType('grid')}
                            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${layoutType === 'grid' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
                                }`}
                        >
                            CSS Grid
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-zinc-300">Items</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={removeItem}
                                    className="p-1 px-2 text-xs rounded border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700"
                                >
                                    -
                                </button>
                                <button
                                    onClick={addItem}
                                    className="p-1 px-2 text-xs rounded border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {layoutType === 'flex' ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-zinc-500 block mb-2">Direction</label>
                                    <select
                                        value={flexDirection}
                                        onChange={(e) => setFlexDirection(e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-sm"
                                    >
                                        <option value="row">row</option>
                                        <option value="row-reverse">row-reverse</option>
                                        <option value="column">column</option>
                                        <option value="column-reverse">column-reverse</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-zinc-500 block mb-2">Justify Content</label>
                                    <select
                                        value={justifyContent}
                                        onChange={(e) => setJustifyContent(e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-sm"
                                    >
                                        <option value="flex-start">flex-start</option>
                                        <option value="flex-end">flex-end</option>
                                        <option value="center">center</option>
                                        <option value="space-between">space-between</option>
                                        <option value="space-around">space-around</option>
                                        <option value="space-evenly">space-evenly</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-zinc-500 block mb-2">Align Items</label>
                                    <select
                                        value={alignItems}
                                        onChange={(e) => setAlignItems(e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-sm"
                                    >
                                        <option value="stretch">stretch</option>
                                        <option value="flex-start">flex-start</option>
                                        <option value="flex-end">flex-end</option>
                                        <option value="center">center</option>
                                        <option value="baseline">baseline</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-zinc-500 block mb-2">Gap: {flexGap}px</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="64"
                                        value={flexGap}
                                        onChange={(e) => setFlexGap(Number(e.target.value))}
                                        className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-violet-600"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-zinc-500 block mb-2">Columns (Template)</label>
                                    <input
                                        type="text"
                                        value={gridCols}
                                        onChange={(e) => setGridCols(e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-sm"
                                        placeholder="e.g. repeat(3, 1fr)"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-zinc-500 block mb-2">Justify Items</label>
                                    <select
                                        value={gridJustifyContent}
                                        onChange={(e) => setGridJustifyContent(e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-sm"
                                    >
                                        <option value="stretch">stretch</option>
                                        <option value="start">start</option>
                                        <option value="end">end</option>
                                        <option value="center">center</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-zinc-500 block mb-2">Align Items</label>
                                    <select
                                        value={gridAlignItems}
                                        onChange={(e) => setGridAlignItems(e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-sm"
                                    >
                                        <option value="stretch">stretch</option>
                                        <option value="start">start</option>
                                        <option value="end">end</option>
                                        <option value="center">center</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-zinc-500 block mb-2">Gap: {gridGap}px</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="64"
                                        value={gridGap}
                                        onChange={(e) => setGridGap(Number(e.target.value))}
                                        className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-violet-600"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Preview Area */}
                <div className="flex-1 space-y-6">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                        <div className="relative bg-zinc-950/80 border border-zinc-800 rounded-2xl min-h-[400px] overflow-hidden">
                            <div style={containerStyle} className="h-full w-full p-8 transition-all duration-300">
                                {items.map((item, i) => (
                                    <div
                                        key={item.id}
                                        className={`flex items-center justify-center p-4 rounded-xl text-white font-bold text-lg shadow-xl ${item.color} min-w-[60px] min-h-[60px] animate-enter`}
                                        style={{ animationDelay: `${i * 50}ms` }}
                                    >
                                        {i + 1}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-zinc-900/30 rounded-2xl border border-zinc-800 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-semibold text-zinc-400">CSS Output</h4>
                                <CopyButton text={cssCode} />
                            </div>
                            <pre className="text-xs font-mono text-violet-300 p-4 bg-black/40 rounded-xl overflow-x-auto">
                                {cssCode}
                            </pre>
                        </div>
                        <div className="bg-zinc-900/30 rounded-2xl border border-zinc-800 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-semibold text-zinc-400">Tailwind Snippet</h4>
                                <CopyButton text={tailwindCode} />
                            </div>
                            <pre className="text-xs font-mono text-cyan-300 p-4 bg-black/40 rounded-xl overflow-x-auto">
                                {tailwindCode}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
