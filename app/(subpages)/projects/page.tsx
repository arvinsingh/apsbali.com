import ProjectList from '@components/projects'
import { getProjects } from '@lib/projects'
import { getFeatures } from '@data/site-config'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Projects',
  description: 'Most of my projects',
  alternates: {
    canonical: 'https://apsbali.com/projects',
  },
}

const Projects = async () => {
  const features = getFeatures()

  // If projects feature is disabled, return 404
  if (!features.projects) {
    notFound()
  }

  const projects = await getProjects()
  return (
    <ProjectList showYears={false} projects={projects} seeMore={false} />
  )
}

export default Projects
