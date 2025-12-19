'use client'

const HTTP_METHODS = [
  { method: 'GET', description: 'Retrieve data from server', safe: true, idempotent: true, body: false },
  { method: 'POST', description: 'Submit data to server', safe: false, idempotent: false, body: true },
  { method: 'PUT', description: 'Replace entire resource', safe: false, idempotent: true, body: true },
  { method: 'PATCH', description: 'Partially update resource', safe: false, idempotent: false, body: true },
  { method: 'DELETE', description: 'Delete a resource', safe: false, idempotent: true, body: false },
  { method: 'HEAD', description: 'Get headers only (no body)', safe: true, idempotent: true, body: false },
  { method: 'OPTIONS', description: 'Get allowed methods', safe: true, idempotent: true, body: false },
  { method: 'TRACE', description: 'Echo request for debugging', safe: true, idempotent: true, body: false },
  { method: 'CONNECT', description: 'Establish tunnel', safe: false, idempotent: false, body: false },
]

export default function HttpMethodsReference() {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <p className="text-sm text-zinc-400">
          <strong className="text-zinc-300">Safe:</strong> Does not modify server state.{' '}
          <strong className="text-zinc-300">Idempotent:</strong> Multiple identical requests have same effect as single request.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="p-3 text-left text-sm font-medium text-zinc-300">Method</th>
              <th className="p-3 text-left text-sm font-medium text-zinc-300">Description</th>
              <th className="p-3 text-center text-sm font-medium text-zinc-300">Safe</th>
              <th className="p-3 text-center text-sm font-medium text-zinc-300">Idempotent</th>
              <th className="p-3 text-center text-sm font-medium text-zinc-300">Body</th>
            </tr>
          </thead>
          <tbody>
            {HTTP_METHODS.map((method) => (
              <tr key={method.method} className="border-b border-zinc-800/50">
                <td className="p-3">
                  <code className="rounded bg-emerald-600/20 px-2 py-1 text-sm font-medium text-emerald-400">
                    {method.method}
                  </code>
                </td>
                <td className="p-3 text-sm text-zinc-300">{method.description}</td>
                <td className="p-3 text-center">
                  {method.safe ? (
                    <span className="text-emerald-400">✓</span>
                  ) : (
                    <span className="text-zinc-600">—</span>
                  )}
                </td>
                <td className="p-3 text-center">
                  {method.idempotent ? (
                    <span className="text-emerald-400">✓</span>
                  ) : (
                    <span className="text-zinc-600">—</span>
                  )}
                </td>
                <td className="p-3 text-center">
                  {method.body ? (
                    <span className="text-emerald-400">✓</span>
                  ) : (
                    <span className="text-zinc-600">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

