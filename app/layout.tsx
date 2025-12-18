import type { Metadata } from 'next'
import { generateBaseMetadata } from '@/lib/seo'
import { Footer } from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = generateBaseMetadata()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
