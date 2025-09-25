/**
 * Site Configuration
 *
 * This file contains static website configuration that doesn't change between different content repositories.
 * Personal data and content configuration is loaded dynamically from the content repository.
 */

export interface PersonalInfo {
  name: {
    full: string
    first: string
    display: string // For shorter displays
  }
  title: string
  description: string
  location: string
  bio: {
    short: string // For hero sections
    medium: string // For about pages
    long?: string // For detailed bio pages
  }
  email: string
  website: {
    url: string
    domain: string
  }
}

export interface SocialLink {
  name: string
  username?: string
  url: string
  icon: string
  display: boolean // Whether to show in UI
}

export interface ContentConfig {
  personal: PersonalInfo
  social: Record<string, SocialLink>
  repository: {
    url: string
    name: string
  }
  about: {
    title: string
    description: string
    content: {
      introduction: string
      purpose: string
      closing: string
      sourceCode: string
    }
  }
  resume: {
    googleDriveId: string
    filename: string
  }
}

export interface SiteConfig {
  analytics: {
    enabled: boolean
    // Add analytics IDs here when needed
  }
  features: {
    blog: boolean
    projects: boolean
    notes: boolean
    resume: boolean
  }
  build: {
    generateStaticParams: boolean
    revalidate: number
  }
}

/**
 * Static site configuration
 * This contains only website features and settings that don't change between different content repositories
 */
export const siteConfig: SiteConfig = {
  analytics: {
    enabled: false, // Enable when you add analytics
  },
  features: {
    blog: true,
    projects: true,
    notes: true,
    resume: true,
  },
  build: {
    generateStaticParams: true,
    revalidate: 3600, // Revalidate every hour
  },
}

// Project display settings
export interface ProjectSettings {
  featuredCount: number
  showYearsOnCard: boolean
}

export const projectSettings: ProjectSettings = {
  featuredCount: 6,
  showYearsOnCard: true,
}

// Blog configuration
export interface BlogSettings {
  postsPerPage: number
  featuredPostsCount: number
  categories: string[]
  defaultCategory: string
}

export const blogSettings: BlogSettings = {
  postsPerPage: 10,
  featuredPostsCount: 3,
  categories: ['technical', 'personal', 'philosophy', 'projects'],
  defaultCategory: 'personal',
}

// Notes configuration
export interface NotesSettings {
  notesPerPage: number
  typesOrder: ('snippet' | 'tip' | 'note')[]
}

export const notesSettings: NotesSettings = {
  notesPerPage: 20,
  typesOrder: ['note', 'snippet', 'tip'],
}

// Static helper functions for site config
export const getFeatures = () => siteConfig.features
export const getProjectSettings = () => projectSettings
export const getBlogSettings = () => blogSettings
export const getNotesSettings = () => notesSettings

// Helper to get enabled routes based on feature flags
export const getEnabledRoutes = () => {
  const features = siteConfig.features
  const routes = [
    { path: '/', name: 'Home', enabled: true },
    { path: '/about', name: 'About', enabled: true }, // About always enabled
    { path: '/blog', name: 'Blog', enabled: features.blog },
    { path: '/projects', name: 'Projects', enabled: features.projects },
    { path: '/notes', name: 'Notes', enabled: features.notes },
    { path: '/resume', name: 'Resume', enabled: features.resume },
  ]
  return routes.filter((route) => route.enabled)
}