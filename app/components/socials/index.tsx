import { SocialButton } from './social-button'
import styles from './socials.module.css'
import { GitHub, Discord, Mail, LinkedIn } from '@components/icons'

const Socials = (props: Omit<React.HTMLProps<HTMLDivElement>, 'className'>) => {
  return (
    <div className={styles.socials} {...props}>
      <SocialButton
        href="https://www.linkedin.com/in/arvinder-pal-singh/"
        icon={<LinkedIn strokeWidth={2} />}
        tooltip="LinkedIn"
      />
      <SocialButton
        href="https://github.com/arvinsingh"
        icon={<GitHub strokeWidth={2} />}
        tooltip="GitHub"
      />
      <SocialButton
        href="https://discord.com/users/738389772871139330"
        icon={<Discord strokeWidth={2} />}
        tooltip="Discord"
      />
      <SocialButton
        href="mailto:arvinsingh@protonmail.com"
        icon={<Mail strokeWidth={2} />}
        tooltip="Email"
      />
      {/* <ThemeSwitcher /> */}
    </div>
  )
}

export default Socials
