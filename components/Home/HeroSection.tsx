import Image from 'next/image'
import { Logo } from '../Icons/Logo'

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
            <Logo size={100} />
          </div>
        </div>
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl drop-shadow-lg">
        Tiny <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-400">Dev Tools</span>
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--foreground)]/80">
        A collection of free, fast developer tools that run entirely in your browser.
        No data ever leaves your machine.
      </p>

      <div className="mt-10 flex justify-center">
        <a
          href="https://www.producthunt.com/products/tiny-dev-tools?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-tiny-dev-tools"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-90 transition-opacity"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1058697&theme=light&t=1767626611605"
            alt="Tiny Dev Tools - 170+ Privacy-First Developer Tools. Runs in your browser. | Product Hunt"
            width="250"
            height="54"
          />
        </a>
      </div>

      <div className="mt-10 flex items-center justify-center gap-8 text-sm text-[var(--foreground)]/60">
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold text-[var(--primary)]">{toolCount}</span>
          <span className="mt-1 font-medium">Tools</span>
        </div>
        <div className="w-px h-10 bg-[var(--border)]" />
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold text-[var(--secondary)]">{categoryCount}</span>
          <span className="mt-1 font-medium">Categories</span>
        </div>
      </div>
    </div>
  )
}

