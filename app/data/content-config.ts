/**
 * Content Configuration Loader
 *
 * This file provides server-side content loading from the content repository.
 * It loads personal data, social links, and other dynamic content that changes between different content repositories.
 */

import { cache } from 'react'
import { ContentConfig } from './site-config'

const FALLBACK_CONTENT_CONFIG: ContentConfig = {
  personal: {
    name: {
      full: 'Your Name',
      first: 'Your',
      display: 'Your Name',
    },
    title: 'Developer',
    description: 'A developer who builds things.',
    location: 'Earth',
    bio: {
      short: 'A developer who builds things.',
      medium: 'Hello! I am a developer who builds things.',
    },
    email: 'your.email@example.com',
    website: {
      url: 'https://your-domain.com',
      domain: 'your-domain.com',
    },
  },
  social: {
    github: {
      name: 'GitHub',
      username: 'yourusername',
      url: 'https://github.com/yourusername',
      icon: 'github',
      display: true,
    },
  },
  repository: {
    url: 'https://github.com/yourusername/your-repo',
    name: 'your-repo',
  },
  about: {
    title: 'About',
    description: 'About this website.',
    content: {
      introduction: 'Welcome to my website.',
      purpose: 'This is where I share my thoughts.',
      closing: 'Thank you for visiting.',
      sourceCode: 'Website source code: ',
    },
  },
  resume: {
    googleDriveId: '',
    filename: 'resume.pdf',
  },
}

const loadConfigFromFilesystem = cache(async (): Promise<ContentConfig | null> => {
  try {
    const [fs, pathModule, { getContentPath }] = await Promise.all([
      import('fs/promises'),
      import('path'),
      import('@/lib/content-path'),
    ])

    const contentPath = getContentPath()
    const configPath = pathModule.join(contentPath, 'config.json')
    const fileContents = await fs.readFile(configPath, 'utf-8')
    return JSON.parse(fileContents) as ContentConfig
  } catch (error) {
    console.warn('Unable to read content config from filesystem:', error)
    return null
  }
})

const loadConfigFromRemote = cache(async (): Promise<ContentConfig | null> => {
  try {
    const { getContentFileUrl } = await import('../../repo.config')
    const remoteUrl = process.env.CONTENT_CONFIG_URL || getContentFileUrl('config.json')
    const response = await fetch(remoteUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch config: ${response.status} ${response.statusText}`)
    }

    const config = (await response.json()) as ContentConfig
    return config
  } catch (error) {
    console.warn('Unable to fetch content config from remote source:', error)
    return null
  }
})

const loadContentConfig = cache(async (): Promise<ContentConfig> => {
  const fileConfig = await loadConfigFromFilesystem()
  if (fileConfig) {
    return fileConfig
  }

  const remoteConfig = await loadConfigFromRemote()
  if (remoteConfig) {
    return remoteConfig
  }

  if (process.env.NODE_ENV !== 'production') {
    console.warn('Falling back to default content configuration.')
  }

  return structuredClone(FALLBACK_CONTENT_CONFIG)
})

/**
 * Load content configuration from the content repository
 * This function can only be used on the server side (not in client components)
 */
export async function getContentConfig(): Promise<ContentConfig> {
  if (typeof window !== 'undefined') {
    throw new Error('getContentConfig can only be called on the server side')
  }

  return loadContentConfig()
}

/**
 * Server-side helper functions that work with ContentConfig
 */

export function getTwitterHandle(config: ContentConfig): string {
  return config.social.twitter?.username ? `@${config.social.twitter.username}` : '@yourusername'
}

export function getWebsiteUrl(config: ContentConfig): string {
  return config.personal.website.url
}

export function getWebsiteDomain(config: ContentConfig): string {
  return config.personal.website.domain
}

export function getSocialLinks(config: ContentConfig, displayOnly = true) {
  const links = config.social
  return displayOnly
    ? Object.fromEntries(
        Object.entries(links).filter(([, link]) => link.display),
      )
    : links
}

export function getPersonalInfo(config: ContentConfig) {
  return config.personal
}

export function getRepositoryConfig(config: ContentConfig) {
  return config.repository
}

export function getAboutConfig(config: ContentConfig) {
  return config.about
}

export function getResumeConfig(config: ContentConfig) {
  return config.resume
}