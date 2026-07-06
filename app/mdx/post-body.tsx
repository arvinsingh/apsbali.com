import { MDXRemote } from 'next-mdx-remote/rsc'

import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMath from 'remark-math'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
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
      <MDXRemote
        source={children}
        options={{
          parseFrontmatter: true,
          blockJS: false,
          mdxOptions: {
            remarkPlugins: [
              remarkGfm,
              remarkFrontmatter,
              remarkMath,
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
            rehypePlugins: [rehypeKatex, rehypeSlug, rehypeAutolinkHeadings],
          },
        }}
        components={mdxComponents}
      />
    </div>
  )
}
