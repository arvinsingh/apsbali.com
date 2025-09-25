'use client'

import Tooltip from '@components/tooltip'
import { track } from '@vercel/analytics/react'
import styles from './socials.module.css'
import Link from '@components/link'

type SocialButtonProps = {
  href: string
  icon: React.ReactNode
  tooltip: string
  external?: boolean
}

export const SocialButton = ({ tooltip, href, icon, external = true }: SocialButtonProps) => {
  return (
    <Tooltip text={tooltip} direction="top">
      <Link
        href={href}
        className={styles.icon}
        external={external}
        onClick={() =>
          track('clicked social link', {
            type: tooltip.toLowerCase(),
          })
        }
      >
        {icon}
      </Link>
    </Tooltip>
  )
}
