/**
 * Social Links Configuration (Legacy Support)
 *
 * This file provides backward compatibility for existing components.
 * The main social links configuration is now in app/data/site-config.ts
 *
 * @deprecated Use getSocialLinks() from app/data/site-config.ts instead
 */

import { getSocialLinks, getResumeConfig } from '@data/site-config'

// Legacy interface for backward compatibility
export interface SocialLink {
  name: string;
  href: string;
  id?: string;
  tooltip: string;
  icon?: string;
}

// Convert new format to legacy format
const convertToLegacyFormat = (links: ReturnType<typeof getSocialLinks>): Record<string, SocialLink> => {
  const legacyLinks: Record<string, SocialLink> = {}

  Object.entries(links).forEach(([key, link]) => {
    legacyLinks[key] = {
      name: link.name,
      href: link.url,
      tooltip: link.name,
      icon: link.icon
    }
  })

  // Add resume link separately
  const resumeConfig = getResumeConfig()
  legacyLinks.resume = {
    name: "Résumé",
    id: resumeConfig.googleDriveId,
    href: "",
    tooltip: "Résumé"
  }

  return legacyLinks
}

// Export legacy-format social links for backward compatibility
export const socialLinks = convertToLegacyFormat(getSocialLinks())

// Convenience exports for common social links
export const linkedinLink = socialLinks.linkedin?.href || '';
export const githubLink = socialLinks.github?.href || '';
export const discordLink = socialLinks.discord?.href || '';
export const emailLink = socialLinks.email?.href || '';
export const resumeID = socialLinks.resume?.id || '';
export const twitterLink = socialLinks.twitter?.href || '';
