import Link from '@components/link'
import React from 'react'
import styles from './footer.module.css'
import { getContentConfig, getSocialLinks } from '@/data/content-config'

const PostFooter = async () => {
  const contentConfig = await getContentConfig()
  const socialLinks = getSocialLinks(contentConfig)

  const linkedinLink = socialLinks.linkedin?.url || ''
  const twitterLink = socialLinks.twitter?.url || ''

  return (
    <>
      <hr style={{ margin: 0 }} />
      <footer className={styles.footer}>
        <p>
          Thank you for being here. Let&apos;s connect{' '}
          <Link external href={linkedinLink}>
            on LinkedIn
          </Link>{' '}
          or follow me{' '}
          <Link external href={twitterLink}>
            on X (Twitter)
          </Link>{' '}
          .
        </p>
      </footer>
    </>
  )
}

export default PostFooter
