'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

const FIRST_NAMES = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth']
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez']
const DOMAINS = ['example.com', 'test.com', 'demo.org', 'sample.net']
const STREETS = ['Main St', 'Oak Ave', 'Park Rd', 'Elm St', 'Maple Dr']
const CITIES = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix']
const STATES = ['NY', 'CA', 'IL', 'TX', 'AZ']

function generateFakeData(type: string, count: number): string[] {
  const results: string[] = []

  for (let i = 0; i < count; i++) {
    switch (type) {
      case 'name':
        results.push(`${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`)
        break
      case 'email':
        const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)].toLowerCase()
        const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)].toLowerCase()
        const domain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)]
        results.push(`${firstName}.${lastName}@${domain}`)
        break
      case 'address':
        const streetNum = Math.floor(Math.random() * 9999) + 1
        const street = STREETS[Math.floor(Math.random() * STREETS.length)]
        const city = CITIES[Math.floor(Math.random() * CITIES.length)]
        const state = STATES[Math.floor(Math.random() * STATES.length)]
        const zip = Math.floor(Math.random() * 90000) + 10000
        results.push(`${streetNum} ${street}, ${city}, ${state} ${zip}`)
        break
      case 'phone':
        const area = Math.floor(Math.random() * 800) + 200
        const exchange = Math.floor(Math.random() * 800) + 200
        const number = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
        results.push(`(${area}) ${exchange}-${number}`)
        break
      case 'company':
        const companyNames = ['Tech Corp', 'Global Solutions', 'Digital Innovations', 'Future Systems', 'Smart Services']
        results.push(companyNames[Math.floor(Math.random() * companyNames.length)])
        break
      default:
        results.push('')
    }
  }

  return results
}

export default function FakeDataGenerator() {
  const [type, setType] = useState('name')
  const [count, setCount] = useState(10)
  const [output, setOutput] = useState('')

  const generate = () => {
    const data = generateFakeData(type, count)
    setOutput(data.join('\n'))
  }

  const clear = () => {
    setCount(10)
    setOutput('')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="fake-type" className="text-sm font-medium text-zinc-300">
            Data Type
          </label>
          <select
            id="fake-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="address">Address</option>
            <option value="phone">Phone</option>
            <option value="company">Company</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="fake-count" className="text-sm font-medium text-zinc-300">
            Count
          </label>
          <input
            id="fake-count"
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={generate}
          className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
        >
          Generate
        </button>
        <button
          onClick={clear}
          className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
        >
          Clear
        </button>
      </div>

      {output && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="fake-output" className="text-sm font-medium text-zinc-300">
              Generated Data
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            id="fake-output"
            value={output}
            readOnly
            className="h-48 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
      )}
    </div>
  )
}

