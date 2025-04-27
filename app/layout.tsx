import styles from './layout.module.css'
import '@styles/global.css'
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider } from 'next-themes'
import { Viewport } from 'next'

export const dynamic = 'force-static'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <ThemeProvider>
          <div className={styles.wrapper}>
            <main className={styles.main}>{children}</main>
          </div>
          <Analytics />
        </ThemeProvider>
        {/* {process.env.NODE_ENV === 'development' ? <VercelToolbar /> : null} */}
      </body>
    </html>
  )
}

export const metadata = {
  metadataBase: new URL('https://apsbali.com'),
  title: {
    template: '%s | Arvin Singh',
    default: 'Arvin Singh',
  },
  description: 'A website by Arvin Singh.',
  openGraph: {
    title: 'Arvin Singh',
    url: 'https://apsbali.com',
    siteName: "Arvin Singh's website",
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `https://apsbali.com/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Arvin Singh's site",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  twitter: {
    title: 'apsbali.com',
    card: 'summary_large_image',
    creator: '@0xarv1nd3r',
  },
  icons: {
    shortcut: 'https://apsbali.com/favicons/favicon.ico',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f5f5' },
    { media: '(prefers-color-scheme: dark)', color: '#000' },
  ],
}