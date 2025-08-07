import styles from './layout.module.css'
import '@styles/global.css'
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider } from 'next-themes'
import { Viewport } from 'next'
import { getPersonalInfo } from '@data/site-config'

export const dynamic = 'force-static'

const personalInfo = getPersonalInfo()

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
  metadataBase: new URL(personalInfo.website.url),
  title: {
    template: `%s | ${personalInfo.name.display}`,
    default: personalInfo.name.display,
  },
  description: personalInfo.description,
  openGraph: {
    title: personalInfo.name.display,
    url: personalInfo.website.url,
    siteName: `${personalInfo.name.display}'s website`,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${personalInfo.website.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `${personalInfo.name.display}'s site`,
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
    title: personalInfo.website.domain,
    card: 'summary_large_image',
    creator: '@0xarv1nd3r', // This could also be moved to config
  },
  icons: {
    shortcut: `${personalInfo.website.url}/favicons/favicon.ico`,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f5f5' },
    { media: '(prefers-color-scheme: dark)', color: '#000' },
  ],
}