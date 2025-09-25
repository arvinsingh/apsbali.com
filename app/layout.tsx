import styles from './layout.module.css'
import '@styles/global.css'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider } from 'next-themes'
import { Viewport } from 'next'
import { getContentConfig, getTwitterHandle } from './data/content-config'
import { ContentProvider } from './components/providers/content-provider'

export const dynamic = 'force-static'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const contentConfig = await getContentConfig()

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        <ContentProvider content={contentConfig}>
          <ThemeProvider>
            <div className={styles.wrapper}>
              <main className={styles.main}>{children}</main>
            </div>
            <Analytics />
          </ThemeProvider>
        </ContentProvider>
        {/* {process.env.NODE_ENV === 'development' ? <VercelToolbar /> : null} */}
      </body>
    </html>
  )
}

export async function generateMetadata() {
  const contentConfig = await getContentConfig()

  return {
    metadataBase: new URL(contentConfig.personal.website.url),
    title: {
      template: `%s | ${contentConfig.personal.name.display}`,
      default: contentConfig.personal.name.display,
    },
    description: contentConfig.personal.description,
    openGraph: {
      title: contentConfig.personal.name.display,
      url: contentConfig.personal.website.url,
      siteName: `${contentConfig.personal.name.display}'s website`,
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: `${contentConfig.personal.website.url}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${contentConfig.personal.name.display}'s site`,
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
      title: contentConfig.personal.website.domain,
      card: 'summary_large_image',
      creator: getTwitterHandle(contentConfig),
    },
    icons: {
      shortcut: `${contentConfig.personal.website.url}/favicons/favicon.ico`,
    },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f5f5' },
    { media: '(prefers-color-scheme: dark)', color: '#000' },
  ],
}
