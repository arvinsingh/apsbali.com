/**
 * Site Configuration
 *
 * This file contains website-specific configuration and loads personal data from the content repository.
 */

import fs from 'fs'
import path from 'path'

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

export interface SiteConfig extends ContentConfig {
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
}

// Load content configuration from content repository at build time
const loadContentConfig = (): ContentConfig => {
  try {
    const configPath = path.join(process.cwd(), 'content', 'config.json')
    const configContent = fs.readFileSync(configPath, 'utf8')
    return JSON.parse(configContent)
  } catch (error) {
    console.error('Failed to load content configuration:', error)
    // Fallback configuration - this should be updated when content repo is set up
    return {
      personal: {
        name: { full: "Placeholder", first: "Placeholder", display: "Placeholder" },
        title: "Placeholder",
        description: "Placeholder",
        location: "Placeholder",
        bio: { short: "Placeholder", medium: "Placeholder" },
        email: "placeholder@example.com",
        website: { url: "https://example.com", domain: "example.com" }
      },
      social: {},
      repository: { url: "https://github.com/example/example", name: "example" },
      about: {
        title: "About",
        description: "About",
        content: { introduction: "", purpose: "", closing: "", sourceCode: "" }
      },
      resume: { googleDriveId: "", filename: "" }
    }
  }
}

// Load content config at module load time
const contentConfig = loadContentConfig()

// Merge content config with website-specific config
export const siteConfig: SiteConfig = {
  ...contentConfig,
  analytics: {
    enabled: true
  },
  features: {
    blog: true,
    projects: true,
    notes: true,
    resume: true
  }
}

// Project display settings
export interface ProjectSettings {
  featuredCount: number
  showYearsOnCard: boolean
}

export const projectSettings: ProjectSettings = {
  featuredCount: 6,
  showYearsOnCard: true
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
  defaultCategory: 'personal'
}

// Notes configuration
export interface NotesSettings {
  notesPerPage: number
  typesOrder: ('snippet' | 'tip' | 'note')[]
}

export const notesSettings: NotesSettings = {
  notesPerPage: 20,
  typesOrder: ['note', 'snippet', 'tip']
}

// Helper functions to access config data
export const getPersonalInfo = () => siteConfig.personal
export const getSocialLinks = (displayOnly = true) => {
  const links = siteConfig.social
  return displayOnly
    ? Object.fromEntries(Object.entries(links).filter(([, link]) => link.display))
    : links
}
export const getRepositoryConfig = () => siteConfig.repository
export const getAboutConfig = () => siteConfig.about
export const getResumeConfig = () => siteConfig.resume
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
    { path: '/resume', name: 'Resume', enabled: features.resume }
  ]

  return routes.filter(route => route.enabled)
}
