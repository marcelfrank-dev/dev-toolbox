import type { Metadata } from 'next'
import { generateBaseMetadata } from '@/lib/seo'
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
      <body className="h-screen overflow-hidden antialiased">
        <ToastProvider>
          <main className="h-full">{children}</main>
        </ToastProvider>
      </body>
    </html>
  )
}
