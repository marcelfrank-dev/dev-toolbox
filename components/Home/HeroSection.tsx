'use client'

interface HeroSectionProps {
  toolCount: number
  categoryCount: number
}

export function HeroSection({ toolCount, categoryCount }: HeroSectionProps) {
  return (
    <div className="px-6 py-12 text-center lg:px-8 relative z-10">
      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-lg">
        Dev <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-400">Toolbox</span>
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
        A collection of free, fast developer tools that run entirely in your browser.
        No data ever leaves your machine.
      </p>
      <div className="mt-10 flex items-center justify-center gap-8 text-sm text-zinc-400">
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold text-violet-400">{toolCount}</span>
          <span className="mt-1 font-medium">Tools</span>
        </div>
        <div className="w-px h-10 bg-white/10" />
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold text-cyan-400">{categoryCount}</span>
          <span className="mt-1 font-medium">Categories</span>
        </div>
      </div>
    </div>
  )
}

