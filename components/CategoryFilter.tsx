'use client'

interface CategoryFilterProps {
  categories: string[]
  selected: string | null
  onChange: (category: string | null) => void
}

export function CategoryFilter({ categories, selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
          selected === null
            ? 'bg-zinc-100 text-zinc-900'
            : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category === selected ? null : category)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            selected === category
              ? 'bg-zinc-100 text-zinc-900'
              : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

