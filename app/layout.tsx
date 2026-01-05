import type { Metadata } from 'next'
import Link from 'next/link'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { generateBaseMetadata } from '@/lib/seo'
import { ToastProvider } from '@/components/Toast'
import { ThemeProvider } from '@/components/Theme/ThemeProvider'
import { StructuredData } from '@/components/StructuredData'
import { CookieConsentBanner } from '@/components/CookieConsentBanner'
import { ErrorSuppressor } from '@/components/ErrorSuppressor'
import { FeedbackButton } from '@/components/Feedback/FeedbackButton'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' })

export const metadata: Metadata = generateBaseMetadata()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const adsensePublisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID

  return (
    <html lang="en">
      <head>
        <StructuredData />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (!theme) {
                    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    theme = prefersDark ? 'dark' : 'light';
                  }
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(theme);
                } catch (e) {}
              })();
            `,
          }}
        />
        {adsensePublisherId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} h-screen overflow-hidden antialiased bg-background text-foreground`}>
        <ThemeProvider>
          <ToastProvider>
            <main className="h-full">{children}</main>
            <footer className="border-t border-[var(--border)] bg-[var(--card)]">
              <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-xs text-[var(--foreground)]/60 sm:px-6 lg:px-8">
                <p className="hidden sm:block">
                  © {new Date().getFullYear()} Tiny Dev Tools. All rights reserved.
                </p>
                <div className="flex flex-1 justify-end gap-4 sm:flex-none">
                  <Link href="/imprint" className="hover:text-[var(--foreground)] transition-colors">
                    Imprint
                  </Link>
                  <Link href="/privacy" className="hover:text-[var(--foreground)] transition-colors">
                    Privacy
                  </Link>
                </div>
              </div>
            </footer>
            <FeedbackButton />
          </ToastProvider>
          <CookieConsentBanner />
          <ErrorSuppressor />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
