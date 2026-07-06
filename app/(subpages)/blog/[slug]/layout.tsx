import React from 'react'
import getPosts from '@lib/get-posts'
import Navigation from '@components/content-footer/navigation'
import PostFooter from '@components/content-footer/post-footer'
import styles from './layout.module.css'
import { Metadata } from 'next'
import { getContentConfig, getWebsiteUrl } from '@/data/content-config'
import {
  extractMarkdownHeadings,
  type MarkdownHeading,
} from '@/lib/markdown-headings'

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export const generateMetadata = async (props: {
  params: Promise<{
    slug: string
  }>
}): Promise<Metadata> => {
  const params = await props.params
  const post = (await getPosts()).find((p) => p?.slug === params.slug)
  const contentConfig = await getContentConfig()
  return {
    title: post?.title,
    description: post?.description,
    alternates: {
      canonical: `${getWebsiteUrl(contentConfig)}/blog/${params.slug}`,
    },
  }
}

async function getData({ slug }: { slug: string }) {
  const posts = await getPosts()
  const postIndex = posts.findIndex((p) => p?.slug === slug)

  if (postIndex === -1) {
    throw new Error(
      `${slug} not found in posts. Did you forget to rename the file?`,
    )
  }

  const post = posts[postIndex]

  const { ...rest } = post

  return {
    previous: posts[postIndex + 1] || null,
    next: posts[postIndex - 1] || null,
    ...rest,
  }
}

function BlogOutline({ headings }: { headings: MarkdownHeading[] }) {
  if (!headings.length) {
    return null
  }

  const renderOutlineLinks = () => (
    <ol className={styles.outlineList}>
      {headings.map((heading) => (
        <li key={heading.id} className={styles[`depth${heading.depth}`]}>
          <a className={styles.outlineLink} href={`#${heading.id}`}>
            {heading.text}
          </a>
        </li>
      ))}
    </ol>
  )

  return (
    <>
      <nav className={styles.outlineDesktop} aria-label="Post sections">
        <p className={styles.outlineTitle}>On this page</p>
        {renderOutlineLinks()}
      </nav>
      <details className={styles.outlineMobile}>
        <summary>On this page</summary>
        <nav aria-label="Post sections">{renderOutlineLinks()}</nav>
      </details>
    </>
  )
}

export default async function PostLayout(props: {
  children: React.ReactNode
  params: Promise<{
    slug: string
  }>
}) {
  const params = await props.params

  const { children } = props

  const { previous, next, title, date, lastModified, body } =
    await getData(params)
  const headings = extractMarkdownHeadings(body)

  const lastModifiedDate = lastModified
    ? new Date(lastModified).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  return (
    <>
      <div className={styles.wrapper}>
        <span className={styles.date}>{date}</span>
        {lastModified ? (
          <span className={styles.lastModified}>
            Last modified {lastModifiedDate}
          </span>
        ) : null}
        {/* {updatedViews && <FadeIn>{updatedViews} views</FadeIn>} */}
      </div>
      <div className={styles.articleShell}>
        <article className={styles.article}>
          <h1 className={styles.title}>{title}</h1>
          {children}
        </article>
        <BlogOutline headings={headings} />
      </div>
      <PostFooter />
      <Navigation previous={previous} next={next} />
    </>
  )
}
