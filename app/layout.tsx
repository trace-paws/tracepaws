import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

// Fix Next.js 14 metadata configuration - separate viewport export
export const metadata = {
  title: 'TracePaws - Chain of Custody for Pet Crematoriums',
  description: 'Professional chain of custody documentation for pet crematoriums. Photo evidence, family tracking, and complete audit trails.',
  applicationName: 'TracePaws',
  keywords: ['pet crematorium', 'chain of custody', 'pet tracking', 'cremation documentation'],
  authors: [{ name: 'TracePaws' }],
  creator: 'TracePaws',
  metadataBase: new URL('https://app.tracepaws.com'),
  alternates: {
    canonical: '/',
  },
}

// Separate viewport export (Next.js 14+ requirement)
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0f766e',
  colorScheme: 'light'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning style={{ margin: 0, padding: 0, height: '100%' }}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className} style={{ margin: 0, padding: 0, height: '100%', background: '#0f766e' }}>
        <div id="root" style={{ margin: 0, padding: 0, minHeight: '100vh', background: '#0f766e' }}>
          {children}
        </div>
      </body>
    </html>
  )
}