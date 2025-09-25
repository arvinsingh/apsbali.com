/**
 * Content Provider
 *
 * This React context provider makes content configuration available throughout the app.
 * It wraps the app at the root level and provides a useContent hook for components.
 */

'use client'

import { createContext, useContext } from 'react'
import { ContentConfig, SocialLink } from '../../data/site-config'

const ContentContext = createContext<ContentConfig | null>(null)

export function ContentProvider({
  children,
  content
}: {
  children: React.ReactNode
  content: ContentConfig
}) {
  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent(): ContentConfig {
  const content = useContext(ContentContext)
  if (!content) {
    throw new Error('useContent must be used within ContentProvider. Make sure your component is wrapped with ContentProvider.')
  }
  return content
}

// Helper hooks for specific content sections
export function usePersonalInfo() {
  const content = useContent()
  return content.personal
}

export function useSocialLinks(displayOnly = true) {
  const content = useContent()
  const links = content.social
  return displayOnly
    ? Object.fromEntries(
        Object.entries(links).filter(([, link]) => (link as SocialLink).display),
      )
    : links
}

export function useRepositoryConfig() {
  const content = useContent()
  return content.repository
}

export function useAboutConfig() {
  const content = useContent()
  return content.about
}

export function useResumeConfig() {
  const content = useContent()
  return content.resume
}

// Helper hook functions for dynamic values
export function useTwitterHandle() {
  const content = useContent()
  return content.social.twitter?.username ? `@${content.social.twitter.username}` : '@yourusername'
}

export function useWebsiteUrl() {
  const content = useContent()
  return content.personal.website.url
}

export function useWebsiteDomain() {
  const content = useContent()
  return content.personal.website.domain
}