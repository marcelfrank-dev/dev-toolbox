'use client'

import { useState, useCallback, useEffect } from 'react'
import { CopyButton } from '@/components/CopyButton'

type Unit = 'px' | 'rem' | 'em' | '%' | 'vw' | 'vh' | 'pt' | 'pc' | 'in' | 'cm' | 'mm'

interface Config {
    baseFontSize: number
    viewportWidth: number
    viewportHeight: number
}

const DEFAULT_CONFIG: Config = {
    baseFontSize: 16,
    viewportWidth: 1920,
    viewportHeight: 1080,
}

export default function CssUnitConverter() {
    const [config, setConfig] = useState<Config>(DEFAULT_CONFIG)
    const [values, setValues] = useState<Record<Unit, string>>({
        px: '16',
        rem: '1',
        em: '1',
        '%': '100',
        vw: '0.83',
        vh: '1.48',
        pt: '12',
        pc: '1',
        in: '0.166',
        cm: '0.423',
        mm: '4.23',
    })

    const convert = useCallback(
        (value: number, from: Unit, targetConfig: Config): Record<Unit, string> => {
            // First, convert everything to px
            let pxValue = 0
            switch (from) {
                case 'px': pxValue = value; break
                case 'rem': pxValue = value * targetConfig.baseFontSize; break
                case 'em': pxValue = value * targetConfig.baseFontSize; break
                case '%': pxValue = (value / 100) * targetConfig.baseFontSize; break
                case 'vw': pxValue = (value / 100) * targetConfig.viewportWidth; break
                case 'vh': pxValue = (value / 100) * targetConfig.viewportHeight; break
                case 'pt': pxValue = value * (96 / 72); break
                case 'pc': pxValue = value * 16; break
                case 'in': pxValue = value * 96; break
                case 'cm': pxValue = value * (96 / 2.54); break
                case 'mm': pxValue = value * (96 / 25.4); break
            }

            const format = (v: number) => {
                if (isNaN(v)) return ''
                return parseFloat(v.toFixed(3)).toString()
            }

            return {
                px: format(pxValue),
                rem: format(pxValue / targetConfig.baseFontSize),
                em: format(pxValue / targetConfig.baseFontSize),
                '%': format((pxValue / targetConfig.baseFontSize) * 100),
                vw: format((pxValue / targetConfig.viewportWidth) * 100),
                vh: format((pxValue / targetConfig.viewportHeight) * 100),
                pt: format(pxValue * (72 / 96)),
                pc: format(pxValue / 16),
                in: format(pxValue / 96),
                cm: format(pxValue * (2.54 / 96)),
                mm: format(pxValue * (25.4 / 96)),
            }
        },
        []
    )

    const handleValueChange = (unit: Unit, val: string) => {
        const numValue = parseFloat(val)
        if (isNaN(numValue)) {
            setValues((prev) => ({ ...prev, [unit]: val }))
            return
        }

        const newValues = convert(numValue, unit, config)
        setValues({ ...newValues, [unit]: val }) // Keep the literal input for the changed field
    }

    const handleConfigChange = (key: keyof Config, val: string) => {
        const numValue = parseFloat(val)
        const newConfig = { ...config, [key]: isNaN(numValue) ? 0 : numValue }
        setConfig(newConfig)

        // When config changes, we recalculate based on PX value to keep it as the source of truth
        const currentPx = parseFloat(values.px) || 0
        setValues(convert(currentPx, 'px', newConfig))
    }

    const unitGroups: { title: string; units: Unit[] }[] = [
        { title: 'Font Relative', units: ['px', 'rem', 'em', '%'] },
        { title: 'Viewport Relative', units: ['vw', 'vh'] },
        { title: 'Absolute Units', units: ['pt', 'pc', 'in', 'cm', 'mm'] },
    ]

    return (
        <div className="space-y-8">
            {/* Configuration Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400 capitalize">Base Font Size (px)</label>
                    <input
                        type="number"
                        value={config.baseFontSize}
                        onChange={(e) => handleConfigChange('baseFontSize', e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400 capitalize">Viewport Width (px)</label>
                    <input
                        type="number"
                        value={config.viewportWidth}
                        onChange={(e) => handleConfigChange('viewportWidth', e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400 capitalize">Viewport Height (px)</label>
                    <input
                        type="number"
                        value={config.viewportHeight}
                        onChange={(e) => handleConfigChange('viewportHeight', e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Conversion Grid */}
            <div className="space-y-8">
                {unitGroups.map((group) => (
                    <div key={group.title} className="space-y-4">
                        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">{group.title}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {group.units.map((unit) => (
                                <div key={unit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-all group">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-emerald-500 uppercase">{unit}</span>
                                        <CopyButton text={values[unit]} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <input
                                        type="text"
                                        value={values[unit]}
                                        onChange={(e) => handleValueChange(unit, e.target.value)}
                                        className="w-full bg-transparent text-xl font-medium text-zinc-100 outline-none placeholder-zinc-700"
                                        placeholder="0"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Info Card */}
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                <p className="text-sm text-zinc-400">
                    <span className="text-emerald-500 font-semibold">Tip:</span> Changing any value will automatically re-calculate all other units based on your base settings. PX is used as the reference unit for calculations.
                </p>
            </div>
        </div>
    )
}
