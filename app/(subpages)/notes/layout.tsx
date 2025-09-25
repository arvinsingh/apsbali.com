import Outline from '@components/layout-outline'
import { getContentConfig, getWebsiteUrl } from '@/data/content-config'

export async function generateMetadata() {
  const contentConfig = await getContentConfig()
  return {
    title: 'Dev Notes',
    description: 'Snippets, learnings, and short form thoughts.',
    alternates: {
      canonical: `${getWebsiteUrl(contentConfig)}/notes`,
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
