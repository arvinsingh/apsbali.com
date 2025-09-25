import Outline from '@components/layout-outline'
import { getContentConfig, getWebsiteUrl } from '@/data/content-config'

export async function generateMetadata() {
  const contentConfig = await getContentConfig()
  return {
    title: 'Blog',
    description: 'Posts and tips.',
    alternates: {
      canonical: `${getWebsiteUrl(contentConfig)}/blog`,
    },
  }
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Outline type="layout" name="Blog">
      <article>{children}</article>
    </Outline>
  )
}
