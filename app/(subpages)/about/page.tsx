import Link from '@components/link'
import { githubLink } from '@lib/social-links'

export const metadata = {
  title: 'About',
  description: 'About this website.',
  alternates: {
    canonical: 'https://apsbali.com/about',
  },
}

const About = () => {
  return (
    <article>
      <p>
        Welcome to my blog. This is a simple space where I can jot down my thoughts,
        share my projects, and capture those fleeting ideas as they come.
        Here, you'll find a mix of what I'm currently working on—from detailed project notes to everyday reflections.
      </p>
      <p>
        I started this blog as a personal record of my journey,
        a place where ideas can grow without much fuss.
        I'm glad you're here to read a bit about what's on my mind,
        and I hope my posts give you some insight into my thinking process.
      </p>
      <p>
        Thank you for stopping by.
      </p>
      <p>
        You can view the source of this website on{' '}
        <Link external href={githubLink}>
          GitHub
        </Link>
        .
      </p>
    </article>
  )
}

export default About
