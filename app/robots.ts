export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
      },
    ],
    sitemap: 'https://apsbali.com/sitemap.xml',
    host: 'https://apsbali.com',
  }
}
