import { SocialButton } from './social-button'
import styles from './socials.module.css'
import { GitHub, Discord, Mail, LinkedIn, FileText } from '@components/icons'
import { socialLinks } from '@lib/social-links'

const Socials = (props: Omit<React.HTMLProps<HTMLDivElement>, 'className'>) => {
  return (
    <div className={styles.socials} {...props}>
      <SocialButton
        href={socialLinks.linkedin.href}
        icon={<LinkedIn strokeWidth={2} />}
        tooltip={socialLinks.linkedin.tooltip}
      />
      <SocialButton
        href={socialLinks.github.href}
        icon={<GitHub strokeWidth={2} />}
        tooltip={socialLinks.github.tooltip}
      />
      <SocialButton
        href={socialLinks.discord.href}
        icon={<Discord strokeWidth={2} />}
        tooltip={socialLinks.discord.tooltip}
      />
      <SocialButton
        href={socialLinks.email.href}
        icon={<Mail strokeWidth={2} />}
        tooltip={socialLinks.email.tooltip}
      />
      <SocialButton
        href={"/resume"}
        icon={<FileText strokeWidth={2} />}
        tooltip={socialLinks.resume.tooltip}
      />
      {/* <ThemeSwitcher /> */}
    </div>
  )
}

export default Socials
