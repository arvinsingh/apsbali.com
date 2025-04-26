import Link from '@components/link'
import React from 'react'
import styles from './footer.module.css'

const PostFooter = () => {
  return (
    <>
      <hr style={{ margin: 0 }}/>
      <footer className={styles.footer}>
        <p>
          Thank you for being here. Follow me{' '}
          <Link external href="https://x/0xarv1nd3r">
            on X (Twitter)
          </Link>{' '}
          or subscribe to my
          <Link href="/feed.xml"> RSS feed</Link>.
        </p>
      </footer>
    </>
  )
}

export default PostFooter
