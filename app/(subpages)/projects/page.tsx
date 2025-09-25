import ProjectList from '@components/projects'
import { getProjects } from '@lib/projects'
import { getContentConfig, getWebsiteUrl } from '@/data/content-config'
import { siteConfig } from '@data/site-config'
import { notFound } from 'next/navigation'

export async function generateMetadata() {
  const contentConfig = await getContentConfig()
  return {
    title: 'Projects',
    description: 'Most of my projects',
    alternates: {
      canonical: `${getWebsiteUrl(contentConfig)}/projects`,
    },
  }
}

const Projects = async () => {
  // If projects feature is disabled, return 404
  if (!siteConfig.features.projects) {
    notFound()
  }

  const projects = await getProjects()
  return <ProjectList showYears={false} projects={projects} seeMore={false} />
}

export default Projects
