'use client'

import { SocialButton } from './social-button'
import styles from './socials.module.css'
import { GitHub, Discord, Mail, LinkedIn, FileText } from '@components/icons'
import { siteConfig } from '@data/site-config'
import { useSocialLinks, useContent } from '../providers/content-provider'

const Socials = (props: Omit<React.HTMLProps<HTMLDivElement>, 'className'>) => {
  const socialLinks = useSocialLinks(true)
  const content = useContent()
  const resumeConfig = content.resume

  // Convert to legacy format for existing component structure
  const convertedLinks = {
    linkedin: {
      href: socialLinks.linkedin?.url || '#',
      tooltip: `LinkedIn`,
    },
    github: {
      href: socialLinks.github?.url || '#',
      tooltip: `GitHub`,
    },
    discord: {
      href: socialLinks.discord?.url || '#',
      tooltip: `Discord`,
    },
    email: {
      href: socialLinks.email?.url || '#',
      tooltip: `Email - ${socialLinks.email?.url}`,
    },
    resume: {
      href: siteConfig.features.resume ? '/resume' : '#',
      tooltip: 'Resume',
    },
  }

  return (
    <div className={styles.socials} {...props}>
      <SocialButton
        href={convertedLinks.linkedin.href}
        icon={<LinkedIn />}
        tooltip={convertedLinks.linkedin.tooltip}
      />
      <SocialButton
        href={convertedLinks.github.href}
        icon={<GitHub />}
        tooltip={convertedLinks.github.tooltip}
      />
      <SocialButton
        href={convertedLinks.discord.href}
        icon={<Discord />}
        tooltip={convertedLinks.discord.tooltip}
      />
      <SocialButton
        href={convertedLinks.email.href}
        icon={<Mail />}
        tooltip={convertedLinks.email.tooltip}
      />
      {siteConfig.features.resume && (
        <SocialButton
          href={convertedLinks.resume.href}
          icon={<FileText />}
          external={convertedLinks.resume.href.startsWith('http')}
          tooltip={convertedLinks.resume.tooltip}
        />
      )}
      {/* <ThemeSwitcher /> */}
    </div>
  )
}

export default Socials
