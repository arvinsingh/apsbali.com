/**
 * Repository Configuration
 *
 * This file provides typed helpers around `repo.config.json`, which holds
 * repository-specific settings to update when forking the project.
 *
 * Update `repo.config.json` to match your repository setup:
 * 1. Change the repository URLs to point to your repositories
 * 2. Update the content submodule path if different
 * 3. Set your GitHub username/organization
 */

import repoConfigJson from './repo.config.json'

export interface RepoConfig {
  // Main website repository (this repo)
  website: {
    owner: string
    name: string
    url: string
    branch: string
  }

  // Content repository (submodule)
  content: {
    owner: string
    name: string
    url: string
    branch: string
    submodulePath: string
  }
}

export const repoConfig: RepoConfig = repoConfigJson

export const getContentFileUrl = (filePath: string): string => {
  return `https://raw.githubusercontent.com/${repoConfig.content.owner}/${repoConfig.content.name}/${repoConfig.content.branch}/${filePath}`
}

export const getWebsiteFileUrl = (filePath: string): string => {
  return `https://raw.githubusercontent.com/${repoConfig.website.owner}/${repoConfig.website.name}/${repoConfig.website.branch}/${filePath}`
}

export const getContentRepoUrl = (): string => {
  return repoConfig.content.url
}

export const getWebsiteRepoUrl = (): string => {
  return repoConfig.website.url
}
