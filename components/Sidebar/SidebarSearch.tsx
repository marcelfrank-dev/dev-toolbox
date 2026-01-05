'use client'

interface SidebarSearchProps {
  value: string
  onChange: (value: string) => void
  resultsCount?: number
}

export function SidebarSearch({ value, onChange, resultsCount }: SidebarSearchProps) {
  return (
    <div className="pb-3 pt-2">
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground)]/30"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search tools..."
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] py-2 pl-9 pr-8 text-sm text-[var(--foreground)] placeholder-[var(--foreground)]/30 transition-all focus:border-[var(--primary)]/50 focus:bg-[var(--card)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]/50"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[var(--foreground)]/40 hover:bg-[var(--card)] hover:text-[var(--foreground)] transition-colors"
            aria-label="Clear search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
      {value && resultsCount !== undefined && (
        <p className="mt-2 px-2 text-xs text-[var(--foreground)]/60">
          {resultsCount} tool{resultsCount !== 1 ? 's' : ''} found
        </p>
      )}
    </div>
  )
}

