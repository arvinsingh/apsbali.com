import Outline from '@components/layout-outline'

export const metadata = {
  title: 'Blog',
  description: 'Posts and tips.',
  alternates: {
    canonical: 'https://apsbali.com/blog',
  },
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
