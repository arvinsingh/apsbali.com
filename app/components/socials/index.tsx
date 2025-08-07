import { SocialButton } from './social-button'
import styles from './socials.module.css'
import { GitHub, Discord, Mail, LinkedIn, FileText } from '@components/icons'
import { socialLinks } from '@lib/social-links'
import { getFeatures } from '@data/site-config'

const Socials = (props: Omit<React.HTMLProps<HTMLDivElement>, 'className'>) => {
  const features = getFeatures()

  return (
    <div className={styles.socials} {...props}>
      <SocialButton
        href={socialLinks.linkedin.href}
        icon={<LinkedIn />}
        tooltip={socialLinks.linkedin.tooltip}
      />
      <SocialButton
        href={socialLinks.github.href}
        icon={<GitHub />}
        tooltip={socialLinks.github.tooltip}
      />
      <SocialButton
        href={socialLinks.discord.href}
        icon={<Discord />}
        tooltip={socialLinks.discord.tooltip}
      />
      <SocialButton
        href={socialLinks.email.href}
        icon={<Mail />}
        tooltip={socialLinks.email.tooltip}
      />
      {features.resume && (
        <SocialButton
          href={"/resume"}
          icon={<FileText />}
          tooltip={socialLinks.resume.tooltip}
        />
      )}
      {/* <ThemeSwitcher /> */}
    </div>
  )
}

export default Socials
