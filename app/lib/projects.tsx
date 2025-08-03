import type { Project } from './types'
import fs from 'fs/promises'
import path from 'path'
import { cache } from 'react'

const loadProjectsFromFile = cache(async (): Promise<Project[]> => {
	const projectsPath = path.join(process.cwd(), 'projects', 'projects.json')
	const fileContent = await fs.readFile(projectsPath, 'utf8')
	const data = JSON.parse(fileContent)

	const projects = data.projects.map((proj: any) => ({
		...proj,
		years: proj.years.map(String), // Convert numbers to strings for consistency
		type: 'project' as const,
	}))

	// Sort by featured first, then by most recent year
	return projects.sort((a: any, b: any) => {
		// Featured projects first
		if (a.featured && !b.featured) return -1
		if (!a.featured && b.featured) return 1

		// Then by most recent year
		const aYear = Math.max(...a.years.map((y: string) => parseInt(y)))
		const bYear = Math.max(...b.years.map((y: string) => parseInt(y)))
		return bYear - aYear
	})
})

export const getProjects = async (): Promise<Project[]> => {
	const projects = await loadProjectsFromFile()

	// check for GitHub token in production
	if (process.env.NODE_ENV === 'production' && !process.env.GITHUB_TOKEN) {
		console.warn('No GITHUB_TOKEN provided. GitHub stars will not be fetched.')
	}

	const projectsWithStars = await Promise.all(
		projects.map(async (proj) => {
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
