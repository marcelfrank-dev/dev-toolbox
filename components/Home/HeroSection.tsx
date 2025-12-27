'use client'

interface HeroSectionProps {
  toolCount: number
  categoryCount: number
}

export function HeroSection({ toolCount, categoryCount }: HeroSectionProps) {
  return (
    <div className="px-6 py-12 text-center lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl lg:text-6xl">
        Dev Toolbox
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
        A collection of free, fast developer tools that run entirely in your browser.
        No data ever leaves your machine.
      </p>
      <div className="mt-10 flex items-center justify-center gap-8 text-sm text-zinc-500">
        <div>
          <span className="text-2xl font-bold text-emerald-400">{toolCount}</span>
          <span className="ml-2">Tools</span>
        </div>
        <div>
          <span className="text-2xl font-bold text-emerald-400">{categoryCount}</span>
          <span className="ml-2">Categories</span>
        </div>
      </div>
    </div>
  )
}

