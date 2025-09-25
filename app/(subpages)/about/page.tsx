import Link from '@components/link'
import {
  getContentConfig,
  getAboutConfig,
  getRepositoryConfig,
  getWebsiteUrl,
} from '../../data/content-config'

export async function generateMetadata() {
  const contentConfig = await getContentConfig()

  return {
    title: 'About',
    description: 'About this website.',
    alternates: {
      canonical: `${getWebsiteUrl(contentConfig)}/about`,
    },
  }
}

const About = async () => {
  const contentConfig = await getContentConfig()
  const aboutConfig = getAboutConfig(contentConfig)
  const repositoryConfig = getRepositoryConfig(contentConfig)

  return (
    <article>
      <p>{aboutConfig.content.introduction}</p>
      <p>{aboutConfig.content.purpose}</p>
      <p>{aboutConfig.content.closing}</p>
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
