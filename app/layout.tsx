import type { Metadata } from 'next'
import Link from 'next/link'
import { generateBaseMetadata } from '@/lib/seo'
import { ToastProvider } from '@/components/Toast'
import { StructuredData } from '@/components/StructuredData'
import { CookieConsentBanner } from '@/components/CookieConsentBanner'
import './globals.css'

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
      </head>
      <body className="h-screen overflow-hidden antialiased">
        {adsensePublisherId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}`}
            crossOrigin="anonymous"
          />
        )}
        <ToastProvider>
          <main className="h-full">{children}</main>
          <footer className="border-t border-zinc-800 bg-zinc-950/80">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-xs text-zinc-500 sm:px-6 lg:px-8">
              <p className="hidden sm:block">
                © {new Date().getFullYear()} Dev Toolbox. All rights reserved.
              </p>
              <div className="flex flex-1 justify-end gap-4 sm:flex-none">
                <Link href="/imprint" className="hover:text-zinc-300">
                  Imprint
                </Link>
                <Link href="/privacy" className="hover:text-zinc-300">
                  Privacy
                </Link>
              </div>
            </div>
          </footer>
        </ToastProvider>
        <CookieConsentBanner />
      </body>
    </html>
  )
}
