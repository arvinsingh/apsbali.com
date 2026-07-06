import { cache } from 'react'
import fs from 'fs/promises'
import path from 'path'
import { getContentPath } from './content-path'

export type ResumeEntry = {
  title: string
  organization?: string
  location?: string
  period?: string
  summary?: string
  highlights?: string[]
  tags?: string[]
  url?: string
}

export type ResumeSkillGroup = {
  category: string
  items: string[]
}

export type ResumeProject = {
  name: string
  description?: string
  url?: string
  highlights?: string[]
  tags?: string[]
}

export type ResumeLink = {
  label: string
  url: string
}

export type ResumeMetric = {
  label: string
  value: string
}

export type ResumePublication = {
  title: string
  venue?: string
  authors?: string
  year?: string
  links?: ResumeLink[]
  highlights?: string[]
}

export type ResumeContent = {
  contact?: {
    phone?: string
  }
  summary?: string
  highlights?: string[]
  metrics?: ResumeMetric[]
  skills?: ResumeSkillGroup[]
  experience?: ResumeEntry[]
  education?: ResumeEntry[]
  projects?: ResumeProject[]
  publications?: ResumePublication[]
  leadership?: ResumeEntry[]
  certifications?: ResumeEntry[]
}

export const getResumeContent = cache(async (): Promise<ResumeContent> => {
  try {
    const filePath = path.join(getContentPath(), 'resume', 'resume.json')
    const fileContents = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(fileContents) as ResumeContent
  } catch {
    return {}
  }
})
