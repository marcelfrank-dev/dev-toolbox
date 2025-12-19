'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

function xmlToJson(xml: string): string {
  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xml, 'text/xml')
    
    if (xmlDoc.documentElement.nodeName === 'parsererror') {
      return 'Invalid XML'
    }

    function parseNode(node: Element | Text): any {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim()
        return text || null
      }

      const element = node as Element
      const result: any = {}
      
      if (element.attributes.length > 0) {
        result['@attributes'] = {}
        for (let i = 0; i < element.attributes.length; i++) {
          const attr = element.attributes[i]
          result['@attributes'][attr.name] = attr.value
        }
      }

      const children: any[] = []
      for (let i = 0; i < element.childNodes.length; i++) {
        const child = element.childNodes[i]
        if (child.nodeType === Node.ELEMENT_NODE) {
          children.push(parseNode(child as Element))
        } else if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
          if (children.length === 0) {
            return child.textContent.trim()
          }
        }
      }

      if (children.length > 0) {
        const grouped: Record<string, any> = {}
        children.forEach((child) => {
          const key = Object.keys(child)[0]
          if (grouped[key]) {
            if (!Array.isArray(grouped[key])) {
              grouped[key] = [grouped[key]]
            }
            grouped[key].push(child[key])
          } else {
            Object.assign(grouped, child)
          }
        })
        Object.assign(result, grouped)
      }

      const tagName = element.tagName
      return { [tagName]: Object.keys(result).length > 0 ? result : null }
    }

    const json = parseNode(xmlDoc.documentElement)
    return JSON.stringify(json, null, 2)
  } catch (e) {
    return 'Error: ' + (e instanceof Error ? e.message : 'Unknown error')
  }
}

function jsonToXml(json: string): string {
  try {
    const obj = JSON.parse(json)
    
    function toXml(obj: any, rootName: string = 'root'): string {
      if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
        return String(obj)
      }

      if (obj === null || obj === undefined) {
        return ''
      }

      if (Array.isArray(obj)) {
        return obj.map((item) => toXml(item, rootName)).join('')
      }

      let xml = ''
      for (const key in obj) {
        if (key === '@attributes') continue
        
        const value = obj[key]
        const attrs = obj['@attributes'] || {}
        const attrStr = Object.entries(attrs)
          .map(([k, v]) => ` ${k}="${v}"`)
          .join('')

        if (Array.isArray(value)) {
          value.forEach((item) => {
            xml += `<${key}${attrStr}>${toXml(item, key)}</${key}>`
          })
        } else if (typeof value === 'object' && value !== null) {
          xml += `<${key}${attrStr}>${toXml(value, key)}</${key}>`
        } else {
          xml += `<${key}${attrStr}>${value}</${key}>`
        }
      }

      return xml
    }

    return toXml(obj)
  } catch (e) {
    return 'Error: ' + (e instanceof Error ? e.message : 'Invalid JSON')
  }
}

export default function XmlJsonConverter() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'xml-to-json' | 'json-to-xml'>('xml-to-json')

  const output = input
    ? mode === 'xml-to-json'
      ? xmlToJson(input)
      : jsonToXml(input)
    : ''

  const clear = () => setInput('')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-zinc-300">Convert:</label>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('xml-to-json')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === 'xml-to-json'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}
          >
            XML → JSON
          </button>
          <button
            onClick={() => setMode('json-to-xml')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === 'json-to-xml'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}
          >
            JSON → XML
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="xml-json-input" className="text-sm font-medium text-zinc-300">
            Input ({mode === 'xml-to-json' ? 'XML' : 'JSON'})
          </label>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
        <textarea
          id="xml-json-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'xml-to-json' ? '<root><item>value</item></root>' : '{"root": {"item": "value"}}'}
          className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="xml-json-output" className="text-sm font-medium text-zinc-300">
            Output ({mode === 'xml-to-json' ? 'JSON' : 'XML'})
          </label>
          <CopyButton text={output} />
        </div>
        <textarea
          id="xml-json-output"
          value={output}
          readOnly
          className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>
    </div>
  )
}

