import ProjectList from '@components/projects'
import { getProjects } from '@lib/projects'

export const metadata = {
  title: 'Projects',
  description: 'Most of my projects',
  alternates: {
    canonical: 'https://apsbali.com/projects',
  },
}

const Projects = async () => {
  const projects = await getProjects()
  return (
    <ProjectList showYears={false} projects={projects} seeMore={false} />
  )
}

export default Projects
