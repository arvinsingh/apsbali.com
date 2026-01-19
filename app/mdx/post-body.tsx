import { MDXRemote } from 'next-mdx-remote/rsc'

import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
// @ts-expect-error no types
import remarkA11yEmoji from '@fec/remark-a11y-emoji'
import remarkToc from 'remark-toc'
import remarkGithubBlockquoteAlert from 'remark-github-blockquote-alert'
import { mdxComponents } from './components'
// import { FloatingTOC } from '@components/floating-toc'

export function PostBody({ children }: { children: string }) {
  return (
    <div className="relative article-wrapper">
      {/* <FloatingTOC /> */}
      <article>
        <MDXRemote
          source={children}
        options={{
          mdxOptions: {
            remarkPlugins: [
              remarkGfm,
              remarkFrontmatter,
              remarkA11yEmoji,
              remarkGithubBlockquoteAlert,
              [
                remarkToc,
                {
                  tight: true,
                  maxDepth: 5,
                },
              ],
            ],
            rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
          },
        }}
        components={mdxComponents}
      />
      </article>
    </div>
  )
}
