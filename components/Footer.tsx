import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-sm text-zinc-500">
            🔒 All tools run locally in your browser. No data is sent to any server.
          </p>
          <nav className="flex gap-6">
            <Link
              href="/privacy"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="/imprint"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
            >
              Imprint
            </Link>
            <a
              href="https://github.com/marcelfrank-dev/dev-toolbox"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
            >
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

