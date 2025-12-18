import type { Metadata } from 'next'
import { generateBaseMetadata } from '@/lib/seo'
import { Footer } from '@/components/Footer'
import { ToastProvider } from '@/components/Toast'
import { StructuredData } from '@/components/StructuredData'
import './globals.css'

export const metadata: Metadata = generateBaseMetadata()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <ToastProvider>
          <main className="flex-1">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  )
}
