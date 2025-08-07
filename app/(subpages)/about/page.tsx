import Link from '@components/link'
import { getAboutConfig, getRepositoryConfig } from '@data/site-config'

export const metadata = {
  title: 'About',
  description: 'About this website.',
  alternates: {
    canonical: 'https://apsbali.com/about',
  },
}

const About = () => {
  const aboutConfig = getAboutConfig()
  const repositoryConfig = getRepositoryConfig()

  return (
    <article>
      <p>
        {aboutConfig.content.introduction}
      </p>
      <p>
        {aboutConfig.content.purpose}
      </p>
      <p>
        {aboutConfig.content.closing}
      </p>
      <p>
        {aboutConfig.content.sourceCode}{' '}
        <Link external href={repositoryConfig.url}>
          GitHub
        </Link>
      </p>
    </article>
  )
}

export default About
