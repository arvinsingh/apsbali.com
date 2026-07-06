import { getContentConfig, getWebsiteUrl } from './data/content-config'

export default async function robots() {
  const contentConfig = await getContentConfig()
  const websiteUrl = getWebsiteUrl(contentConfig)

  return {
    rules: [
      {
        userAgent: 'ia_archiver',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'ClaudeBot',
        disallow: '/',
      },
      {
        userAgent: 'Google-Extended',
        disallow: '/',
      },
      {
        userAgent: 'Applebot-Extended',
        disallow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        disallow: '/',
      },
      {
        userAgent: 'Meta-ExternalAgent',
        disallow: '/',
      },
      {
        userAgent: 'meta-externalagent',
        disallow: '/',
      },
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${websiteUrl}/sitemap.xml`,
    host: websiteUrl,
  }
}
