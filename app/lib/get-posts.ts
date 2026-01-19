import matter from 'gray-matter'
import path from 'path'
import type { Post } from './types'
import fs from 'fs/promises'
import { cache } from 'react'
import { getContentPath } from './content-path'
//import { unstable_cache } from 'next/cache'

const thirdPartyPosts: Post[] = []
//  {
//    title: 'Post Title Here', // Replace with the actual title
//    description: 'Brief description of the post here.', // Replace with the actual description
//    body: '', // Leave empty or add the full content if needed
//    date: '2025-04-01T10:00:00.000Z', //'YYYY-MM-DDTHH:mm:ss.sssZ', // ISO format date
//    slug: '', // Add slug for the post (optional)
//    tags: [], // Add tags as an array of strings, e.g., ['Tag1', 'Tag2']
//    lastModified: 0, // Timestamp for the last modification (optional)
//    isThirdParty: true, // Keep true if it's a third-party post
//    href: 'https://example.com', // Replace with the actual link
//    type: 'post', // Specify the type of content
//  },
// Add more posts below using the same structure
//]

export const getPosts = cache(async (includeThirdPartyPosts?: boolean) => {
  const contentPath = getContentPath()
  const postsDir = path.join(contentPath, 'posts')
  const posts = await fs.readdir(postsDir)

  const postsWithMetadata = await Promise.all(
    posts
      .filter(
        (file) => path.extname(file) === '.md' || path.extname(file) === '.mdx',
      )
      .map(async (file) => {
        const filePath = path.join(postsDir, file)
        const postContent = await fs.readFile(filePath, 'utf8')
        const { data, content } = matter(postContent)

        if (data.published === false) {
          return null
        }

        return { ...data, body: content, type: 'post' } as Post
      }),
  )

  const postsWithMetadataAndThirdPartyPosts = [
    ...postsWithMetadata,
    ...(includeThirdPartyPosts ? thirdPartyPosts : []),
  ]

  const filtered = postsWithMetadataAndThirdPartyPosts
    .filter((post) => post !== null)
    .sort((a, b) =>
      a && b ? new Date(b.date).getTime() - new Date(a.date).getTime() : 0,
    ) as Post[]

  return filtered
})

export async function getPost(slug: string) {
  const posts = await getPosts()
  return posts.find((post) => post.slug === slug)
}

export default getPosts
