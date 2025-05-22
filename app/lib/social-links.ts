/**
 * Centralized configuration for all social links used throughout the website.
 * Update links here to have them reflected everywhere they're used.
 */

export interface SocialLink {
  name: string;
  href: string;
  id?: string;
  tooltip: string;
  icon?: string; // Could be added to reference icons by name
}

export const socialLinks: Record<string, SocialLink> = {
  linkedin: {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/arvinder-pal-singh/",
    tooltip: "LinkedIn"
  },
  github: {
    name: "GitHub",
    href: "https://github.com/arvinsingh",
    tooltip: "GitHub"
  },
  discord: {
    name: "Discord",
    href: "https://discord.com/users/738389772871139330",
    tooltip: "Discord"
  },
  email: {
    name: "Email",
    href: "mailto:arvinsingh@protonmail.com",
    tooltip: "Email"
  },
  resume: {
    name: "Résumé",
    id: "1EW9feiNcfrVcYQNC-TW7hNPNSOYtBVF4",
    href: "",
    tooltip: "Résumé"
  },
  twitter: {
    name: "X (Twitter)",
    href: "https://x.com/0xarv1nd3r",
    tooltip: "Twitter"
  }
}

// Convenience exports for common social links
export const linkedinLink = socialLinks.linkedin.href;
export const githubLink = socialLinks.github.href;
export const discordLink = socialLinks.discord.href;
export const emailLink = socialLinks.email.href;
export const resumeID = socialLinks.resume.id;
export const twitterLink = socialLinks.twitter.href;
