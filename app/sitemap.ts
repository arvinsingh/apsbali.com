import getNotes from '@lib/get-notes'
import getPosts from './lib/get-posts'
import { getFeatures } from '@data/site-config'

export default async function sitemap() {
  const features = getFeatures()
  const [posts, notes] = await Promise.all([
    features.blog ? getPosts() : [],
    features.notes ? getNotes() : []
  ])

  const blogs = posts
    .map((post) => ({
      url: `https://apsbali.com/blog/${post.slug}`,
      lastModified: post.lastModified
        ? new Date(post.lastModified).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    }))
    .concat(
      notes.map((note) => ({
        url: `https://apsbali.com/notes/${note.slug}`,
        // @ts-expect-error
        lastModified: note.lastModified
          ? // @ts-expect-error
            new Date(note.lastModified).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
      })),
    )

  // Only include routes for enabled features
  const enabledRoutes = [''] // Always include home page
  if (features.projects) enabledRoutes.push('/projects')
  // Add other conditional routes as needed
  enabledRoutes.push('/about') // About page doesn't have a feature flag

  const routes = enabledRoutes.map(
    (route) => ({
      url: `https://apsbali.com${route}`,
      lastModified: new Date().toISOString().split('T')[0],
    }),
  )

  return [...routes, ...blogs]
}
