'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

interface StatusCode {
  code: number
  name: string
  description: string
  category: string
  color: string
}

const statusCodes: StatusCode[] = [
  // 1xx Informational
  { code: 100, name: 'Continue', description: 'The server has received the request headers', category: '1xx Informational', color: 'text-blue-400' },
  { code: 101, name: 'Switching Protocols', description: 'The requester has asked the server to switch protocols', category: '1xx Informational', color: 'text-blue-400' },
  { code: 102, name: 'Processing', description: 'The server is processing the request', category: '1xx Informational', color: 'text-blue-400' },
  
  // 2xx Success
  { code: 200, name: 'OK', description: 'The request succeeded', category: '2xx Success', color: 'text-emerald-400' },
  { code: 201, name: 'Created', description: 'The request succeeded and a new resource was created', category: '2xx Success', color: 'text-emerald-400' },
  { code: 202, name: 'Accepted', description: 'The request has been accepted for processing', category: '2xx Success', color: 'text-emerald-400' },
  { code: 204, name: 'No Content', description: 'The request succeeded but there is no content to return', category: '2xx Success', color: 'text-emerald-400' },
  { code: 206, name: 'Partial Content', description: 'The server is delivering only part of the resource', category: '2xx Success', color: 'text-emerald-400' },
  
  // 3xx Redirection
  { code: 300, name: 'Multiple Choices', description: 'The request has more than one possible response', category: '3xx Redirection', color: 'text-yellow-400' },
  { code: 301, name: 'Moved Permanently', description: 'The URL of the requested resource has been changed permanently', category: '3xx Redirection', color: 'text-yellow-400' },
  { code: 302, name: 'Found', description: 'The URL of the requested resource has been changed temporarily', category: '3xx Redirection', color: 'text-yellow-400' },
  { code: 304, name: 'Not Modified', description: 'The resource has not been modified since the last request', category: '3xx Redirection', color: 'text-yellow-400' },
  { code: 307, name: 'Temporary Redirect', description: 'The server sends this response to direct the client to get the requested resource', category: '3xx Redirection', color: 'text-yellow-400' },
  { code: 308, name: 'Permanent Redirect', description: 'The resource is now permanently located at another URL', category: '3xx Redirection', color: 'text-yellow-400' },
  
  // 4xx Client Error
  { code: 400, name: 'Bad Request', description: 'The server cannot process the request due to a client error', category: '4xx Client Error', color: 'text-orange-400' },
  { code: 401, name: 'Unauthorized', description: 'Authentication is required and has failed or has not been provided', category: '4xx Client Error', color: 'text-orange-400' },
  { code: 403, name: 'Forbidden', description: 'The client does not have access rights to the content', category: '4xx Client Error', color: 'text-orange-400' },
  { code: 404, name: 'Not Found', description: 'The server cannot find the requested resource', category: '4xx Client Error', color: 'text-orange-400' },
  { code: 405, name: 'Method Not Allowed', description: 'The request method is not supported for the requested resource', category: '4xx Client Error', color: 'text-orange-400' },
  { code: 408, name: 'Request Timeout', description: 'The server timed out waiting for the request', category: '4xx Client Error', color: 'text-orange-400' },
  { code: 409, name: 'Conflict', description: 'The request conflicts with the current state of the server', category: '4xx Client Error', color: 'text-orange-400' },
  { code: 410, name: 'Gone', description: 'The requested resource is no longer available', category: '4xx Client Error', color: 'text-orange-400' },
  { code: 413, name: 'Payload Too Large', description: 'The request entity is larger than limits defined by server', category: '4xx Client Error', color: 'text-orange-400' },
  { code: 414, name: 'URI Too Long', description: 'The URI provided was too long for the server to process', category: '4xx Client Error', color: 'text-orange-400' },
  { code: 415, name: 'Unsupported Media Type', description: 'The media format is not supported by the server', category: '4xx Client Error', color: 'text-orange-400' },
  { code: 429, name: 'Too Many Requests', description: 'The user has sent too many requests in a given time', category: '4xx Client Error', color: 'text-orange-400' },
  
  // 5xx Server Error
  { code: 500, name: 'Internal Server Error', description: 'The server encountered an unexpected condition', category: '5xx Server Error', color: 'text-rose-400' },
  { code: 501, name: 'Not Implemented', description: 'The server does not support the functionality required', category: '5xx Server Error', color: 'text-rose-400' },
  { code: 502, name: 'Bad Gateway', description: 'The server received an invalid response from an upstream server', category: '5xx Server Error', color: 'text-rose-400' },
  { code: 503, name: 'Service Unavailable', description: 'The server is not ready to handle the request', category: '5xx Server Error', color: 'text-rose-400' },
  { code: 504, name: 'Gateway Timeout', description: 'The server did not receive a timely response from an upstream server', category: '5xx Server Error', color: 'text-rose-400' },
  { code: 505, name: 'HTTP Version Not Supported', description: 'The HTTP version used in the request is not supported', category: '5xx Server Error', color: 'text-rose-400' },
]

export default function HttpStatusReference() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = [...new Set(statusCodes.map((s) => s.category))]

  const filteredCodes = statusCodes.filter((code) => {
    if (selectedCategory && code.category !== selectedCategory) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        code.code.toString().includes(query) ||
        code.name.toLowerCase().includes(query) ||
        code.description.toLowerCase().includes(query)
      )
    }
    return true
  })

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by code, name, or description..."
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-zinc-400">
        Showing {filteredCodes.length} of {statusCodes.length} status codes
      </div>

      {/* Status Codes Table */}
      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="w-full">
          <thead className="bg-zinc-900/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-300">Code</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-300">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-300">Description</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filteredCodes.map((code) => (
              <tr key={code.code} className="hover:bg-zinc-900/30">
                <td className="px-4 py-3">
                  <span className={`font-mono font-semibold ${code.color}`}>{code.code}</span>
                </td>
                <td className="px-4 py-3 font-medium text-zinc-200">{code.name}</td>
                <td className="px-4 py-3 text-sm text-zinc-400">{code.description}</td>
                <td className="px-4 py-3">
                  <CopyButton text={code.code.toString()} label="" className="!px-2" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

