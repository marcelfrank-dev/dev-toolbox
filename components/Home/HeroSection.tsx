import Image from 'next/image'

interface HeroSectionProps {
  toolCount: number
  categoryCount: number
}

export function HeroSection({ toolCount, categoryCount }: HeroSectionProps) {
  return (
    <div className="px-6 py-12 text-center lg:px-8 relative z-10">
      <div className="flex justify-center mb-8">
        <div className="relative group">
          {/* Subtle glow effect */}
          <div className="absolute -inset-2 bg-gradient-to-r from-violet-500/20 to-emerald-500/20 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>

          <div className="relative animate-float transition-transform duration-500 group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="Tiny Dev Tools Logo"
              width={100}
              height={100}
              className="rounded-full shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-lg">
        Tiny <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-400">Dev Tools</span>
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

