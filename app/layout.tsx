import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TracePaws - Chain of Custody for Pet Crematoriums',
  description: 'Photo-based documentation that gives families peace of mind and protects your business',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0f766e'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  )
}