import { getContentConfig, getWebsiteUrl } from './data/content-config'

export default async function robots() {
  const contentConfig = await getContentConfig()
  const websiteUrl = getWebsiteUrl(contentConfig)
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
      },
    ],
    sitemap: `${websiteUrl}/sitemap.xml`,
    host: websiteUrl,
  }
}
