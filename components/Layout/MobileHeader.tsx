import { Logo } from '../Icons/Logo'
import { ThemeToggle } from '../Theme/ThemeToggle'

interface MobileHeaderProps {
    onMenuClick: () => void
    appName: string
}

export function MobileHeader({ onMenuClick, appName }: MobileHeaderProps) {
    return (
        <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-[var(--border)] bg-[var(--card)] backdrop-blur-xl lg:hidden">
            <div className="flex h-full items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onMenuClick}
                        className="rounded-lg p-2 text-[var(--foreground)]/70 transition-colors hover:bg-[var(--foreground)]/10 hover:text-[var(--foreground)]"
                        aria-label="Toggle menu"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                    <div className="flex items-center gap-2">
                        <Logo size={28} />
                        <h1 className="text-lg font-bold text-[var(--foreground)]">
                            {appName}
                        </h1>
                    </div>
                </div>
                <ThemeToggle size="md" />
            </div>
        </header>
    )
}
