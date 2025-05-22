import type { Project } from './types'

const Projects: Project[] = [
	{
		title: 'CymruFluency',
		description: ' Introduced a novel dataset and method for evaluating Welsh language fluency using multimodal fusion techniques.',
		href: 'https://github.com/arvinsingh/CymruFluency',
		role: 'Lead Researcher',
		years: ['2025'],
		type: 'project',
	},
	{
		title: 'Fluency Analyzer App',
		description: 'Developed a concept web application that provides a user-friendly interface for analyzing fluency in Welsh.',
		href: '/blog/fluency-analyzer-app',
		role: 'ML Engineer',
		years: ['2025'],
		type: 'project',
	},
	{
		title: 'ELISA - Fake News Detector',
		description: 'Fake news & clickbate detection using NLP and ML techniques.',
		href: 'https://github.com/arvinsingh/ELISA',
		role: 'MLOps Engineer',
		years: ['2018', '2019'],
		type: 'project',
	},
	{
		title: 'ClusTMPay SIH\'19',
		description: 'Reduce the amount of push notifications require for e-commerce apps by using a machine learning model to predict the best time to send notifications.',
		href: 'https://github.com/arvinsingh/SIH2019-PayTM-SJ1-MachineWorks',
		role: 'Lead AI Engineer',
		years: ['2019'],
		type: 'project',
	},
	{
		title: 'Fake News Detection',
		description: 'Comparative evaluation of Machine Learning algorithms for fake news detection',
		href: 'https://github.com/arvinsingh/FND_research',
		role: 'Lead Researcher',
		years: ['2018', '2019'],
		type: 'project',
	},
]

export const getProjects = async (): Promise<Project[]> => {
	//console.log('getProjects being called with projects:', Projects)

	// check for GitHub token in production
	if (process.env.NODE_ENV === 'production' && !process.env.GITHUB_TOKEN) {
		console.warn('No GITHUB_TOKEN provided. GitHub stars will not be fetched.')
	}

	const projectsWithStars = await Promise.all(
		Projects.map(async (proj) => {
			const split = proj.href?.split('/')
			if (!split || split.length < 3) {
				return proj
			}

			// attempt to fetch GitHub stars if it's a GitHub URL and we have a token
			if (split[2] === 'github.com' && split.length >= 5) {
				try {
					const user = split[3]
					const repo = split[4]

					if (process.env.NODE_ENV === 'production' && process.env.GITHUB_TOKEN) {
						const response = await fetch(
							`https://api.github.com/repos/${user}/${repo}`,
							{
								headers: {
									Authorization: `token ${process.env.GITHUB_TOKEN}`,
								},
							}
						)

						if (response.ok) {
							const data = await response.json()
							return {
								...proj,
								stars: data.stargazers_count,
							}
						}
					}
				} catch (error) {
					console.warn('Error fetching GitHub stars:', error)
				}
			}
			return proj
		})
	)

	return projectsWithStars
}
