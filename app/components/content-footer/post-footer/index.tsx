import Link from '@components/link'
import React from 'react'
import styles from './footer.module.css'

const PostFooter = () => {
  return (
    <>
      <hr style={{ margin: 0 }}/>
      <footer className={styles.footer}>
        <p>
          Thank you for being here. Let's connect{' '} 
          <Link external href="https://www.linkedin.com/in/arvinder-pal-singh/">
            on LinkedIn
          </Link>{' '}
          or{' '}
          follow me{' '}
          <Link external href="https://x.com/0xarv1nd3r">
            on X (Twitter)
          </Link>{' '}
          .
        </p>
      </footer>
    </>
  )
}

export default PostFooter
