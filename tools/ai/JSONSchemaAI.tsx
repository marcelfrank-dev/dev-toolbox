'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

export default function JSONSchemaAI() {
    const [jsonInput, setJsonInput] = useState('')
    const [schema, setSchema] = useState('')
    const [validationInput, setValidationInput] = useState('')
    const [validationResult, setValidationResult] = useState('')

    const generateSchema = () => {
        try {
            const obj = JSON.parse(jsonInput)
            const generated = inferSchema(obj)
            setSchema(JSON.stringify(generated, null, 2))
        } catch (e) {
            setSchema('Error: Invalid JSON')
        }
    }

    const inferSchema = (obj: any): any => {
        if (obj === null) return { type: 'null' }
        if (Array.isArray(obj)) {
            return {
                type: 'array',
                items: obj.length > 0 ? inferSchema(obj[0]) : { type: 'string' },
            }
        }
        if (typeof obj === 'object') {
            const properties: any = {}
            const required: string[] = []
            for (const [key, value] of Object.entries(obj)) {
                properties[key] = inferSchema(value)
                required.push(key)
            }
            return {
                type: 'object',
                properties,
                required,
            }
        }
        return { type: typeof obj }
    }

    const validateJSON = () => {
        try {
            const data = JSON.parse(validationInput)
            const schemaObj = JSON.parse(schema)
            const errors = validateAgainstSchema(data, schemaObj)
            if (errors.length === 0) {
                setValidationResult('✅ Valid! JSON matches the schema.')
            } else {
                setValidationResult('❌ Invalid:\n' + errors.join('\n'))
            }
        } catch (e) {
            setValidationResult('Error: Invalid JSON or schema')
        }
    }

    const validateAgainstSchema = (data: any, schema: any, path = 'root'): string[] => {
        const errors: string[] = []

        if (schema.type === 'object') {
            if (typeof data !== 'object' || data === null || Array.isArray(data)) {
                errors.push(`${path}: Expected object, got ${typeof data}`)
                return errors
            }
            if (schema.required) {
                for (const key of schema.required) {
                    if (!(key in data)) {
                        errors.push(`${path}.${key}: Required property missing`)
                    }
                }
            }
            if (schema.properties) {
                for (const [key, propSchema] of Object.entries(schema.properties)) {
                    if (key in data) {
                        errors.push(...validateAgainstSchema(data[key], propSchema, `${path}.${key}`))
                    }
                }
            }
        } else if (schema.type === 'array') {
            if (!Array.isArray(data)) {
                errors.push(`${path}: Expected array, got ${typeof data}`)
                return errors
            }
            if (schema.items) {
                data.forEach((item, i) => {
                    errors.push(...validateAgainstSchema(item, schema.items, `${path}[${i}]`))
                })
            }
        } else if (schema.type !== typeof data) {
            errors.push(`${path}: Expected ${schema.type}, got ${typeof data}`)
        }

        return errors
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Schema Generation */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-zinc-200">Generate Schema</h3>
                    <textarea
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        placeholder='{"name": "John", "age": 30}'
                        className="h-48 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
                    />
                    <button
                        onClick={generateSchema}
                        className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
                    >
                        Generate Schema
                    </button>
                </div>

                {/* Schema Output */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-zinc-200">JSON Schema</h3>
                        <CopyButton text={schema} />
                    </div>
                    <textarea
                        value={schema}
                        onChange={(e) => setSchema(e.target.value)}
                        placeholder="Schema will appear here..."
                        className="h-48 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
                    />
                </div>
            </div>

            {/* Validation */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h3 className="mb-4 text-lg font-medium text-zinc-200">Validate JSON</h3>
                <div className="grid gap-4 lg:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm text-zinc-400">JSON to Validate</label>
                        <textarea
                            value={validationInput}
                            onChange={(e) => setValidationInput(e.target.value)}
                            placeholder='{"name": "Jane", "age": 25}'
                            className="h-32 w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm text-zinc-400">Validation Result</label>
                        <div className="h-32 overflow-auto rounded-lg border border-zinc-700 bg-zinc-950 p-3 font-mono text-sm text-zinc-200">
                            {validationResult || 'Click "Validate" to check'}
                        </div>
                    </div>
                </div>
                <button
                    onClick={validateJSON}
                    className="mt-4 w-full rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
                >
                    Validate
                </button>
            </div>
        </div>
    )
}
