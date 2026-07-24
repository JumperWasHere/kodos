import type { Metadata, Viewport } from 'next'
import { Nunito, Fredoka } from 'next/font/google'
import Providers from './providers'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})

const fredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-fredoka',
  display: 'swap',
  weight: '400',
})

export const metadata: Metadata = {
  title: {
    default: 'KidOS – Learn, Play, Grow!',
    template: '%s | KidOS',
  },
  description:
    'KidOS is the ultimate educational platform for Malaysian children aged 3-12. Learn Mathematics, English, Science, Bahasa Malaysia, Mandarin and more through fun games and interactive lessons!',
  keywords: [
    'educational platform',
    'kids learning',
    'Malaysian education',
    'online learning',
    'primary school',
    'math games',
    'English learning',
    'Bahasa Malaysia',
    'interactive lessons',
    'gamified learning',
  ],
  authors: [{ name: 'KidOS Team', url: 'https://kidos.my' }],
  creator: 'KidOS',
  publisher: 'KidOS Sdn Bhd',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_MY',
    url: '/',
    siteName: 'KidOS',
    title: 'KidOS – Learn, Play, Grow!',
    description: 'The ultimate educational platform for Malaysian children aged 3-12.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'KidOS' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KidOS – Learn, Play, Grow!',
    description: 'The ultimate educational platform for Malaysian children.',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'KidOS',
  },
  formatDetection: { telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#7C3AED' },
    { media: '(prefers-color-scheme: dark)', color: '#1e1b4b' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunito.variable} ${fredoka.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="min-h-screen bg-background antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
