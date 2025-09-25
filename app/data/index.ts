/**
 * Content Management Index
 *
 * This file serves as the main entry point for all content configuration.
 * Import content configurations from here throughout the application.
 */

export * from './site-config'

import { getPosts } from '@lib/get-posts'
import { getProjects } from '@lib/projects'
import getNotes from '@lib/get-notes'
import { getBlogSettings } from './site-config'

export interface ContentSummary {
  totalBlogPosts: number
  totalProjects: number
  totalNotes: number
  featuredContent: {
    posts: number
    projects: number
  }
}

export const getContentSummary = async (): Promise<ContentSummary> => {
  const [posts, projects, notes] = await Promise.all([
    getPosts(),
    getProjects(),
    getNotes(),
  ])

  const blogConfig = getBlogSettings()
  const featuredPosts = posts.slice(0, blogConfig.featuredPostsCount)
  const featuredProjects = projects.filter((project: any) => project.featured)

  return {
    totalBlogPosts: posts.length,
    totalProjects: projects.length,
    totalNotes: notes.length,
    featuredContent: {
      posts: featuredPosts.length,
      projects: featuredProjects.length,
    },
  }
}

export const getRecentContent = async (limit = 10) => {
  const [posts, notes] = await Promise.all([getPosts(), getNotes()])

  const postsWithType = posts.map((post: any) => ({
    ...post,
    contentType: 'blog' as const,
  }))
  const notesWithType = notes
    .slice(0, limit)
    .map((note: any) => ({ ...note, contentType: 'note' as const }))

  const allContent = [...postsWithType, ...notesWithType]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)

  return allContent
}

export const searchContent = async (query: string) => {
  const searchTerms = query.toLowerCase().split(' ')

  const [posts, projects, notes] = await Promise.all([
    getPosts(),
    getProjects(),
    getNotes(),
  ])

  const filteredPosts = posts
    .filter((post: any) =>
      searchTerms.some(
        (term) =>
          post.title.toLowerCase().includes(term) ||
          post.description.toLowerCase().includes(term) ||
          post.tags?.some((tag: any) => tag.toLowerCase().includes(term)),
      ),
    )
    .map((post: any) => ({ ...post, contentType: 'blog' as const }))

  const filteredProjects = projects
    .filter((project: any) =>
      searchTerms.some(
        (term) =>
          project.title.toLowerCase().includes(term) ||
          project.description.toLowerCase().includes(term) ||
          project.role?.toLowerCase().includes(term),
      ),
    )
    .map((project: any) => ({ ...project, contentType: 'project' as const }))

  const filteredNotes = notes
    .filter((note: any) =>
      searchTerms.some(
        (term) =>
          note.title.toLowerCase().includes(term) ||
          note.description.toLowerCase().includes(term) ||
          note.body?.toLowerCase().includes(term),
      ),
    )
    .map((note: any) => ({ ...note, contentType: 'note' as const }))

  return {
    posts: filteredPosts,
    projects: filteredProjects,
    notes: filteredNotes,
    total:
      filteredPosts.length + filteredProjects.length + filteredNotes.length,
  }
}
