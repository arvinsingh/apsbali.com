/**
 * Site Configuration
 *
 * This is the main configuration file that contains all personal and site-specific information.
 */

export interface PersonalInfo {
  name: {
    full: string
    first: string
    display: string // For shorter displays
  }
  title: string
  description: string
  location: string
  bio: {
    short: string // For hero sections
    medium: string // For about pages
    long?: string // For detailed bio pages
  }
  email: string
  website: {
    url: string
    domain: string
  }
}

export interface SocialLink {
  name: string
  username?: string
  url: string
  icon: string
  display: boolean // Whether to show in UI
}

export interface SiteConfig {
  personal: PersonalInfo
  social: Record<string, SocialLink>
  repository: {
    url: string
    name: string
  }
  about: {
    title: string
    description: string
    content: {
      introduction: string
      purpose: string
      closing: string
      sourceCode: string
    }
  }
  resume: {
    googleDriveId: string
    filename: string
  }
  analytics: {
    enabled: boolean
    // Add analytics IDs here when needed
  }
  features: {
    blog: boolean
    projects: boolean
    notes: boolean
    resume: boolean
  }
}

// Main configuration
export const siteConfig: SiteConfig = {
  personal: {
    name: {
      full: "Arvinder Pal Singh Bali",
      first: "Arvin",
      display: "Arvin Singh"
    },
    title: "Machine Learning Engineer & Developer",
    description: "Driven by deep learning, haunted by questions of consciousness, and - lately - consumed by GPUs and distributed learning.",
    location: "Kashmir",
    bio: {
      short: "I'm driven by deep learning, haunted by questions of consciousness, and - lately - consumed by GPUs and distributed learning.",
      medium: `Hello World! My name is Arvin, and I hail from Kashmir - a place where beauty and harsh realities coexist.
               I'm currently working as a Machine Learning Engineer, tackling challenges in fluency analysis of languages.
               Beyond the technical realm, I have many hobbies including programming, science fiction, philosophy, gaming, and writing.`,
      long: `My name is Arvin, and I hail from Kashmir - a place where beauty and harsh realities coexist.
             Growing up surrounded by the region's unyielding challenges has indelibly shaped my outlook on life and instilled in me a relentless curiosity about the world.

             I'm currently working as a Machine Learning Engineer, tackling the challenges like distributed learning and language analysis.
             Every day, my work fuels my passion for deep learning and the mysteries of consciousness, topics that leave my mind buzzing with questions and ideas.

             Beyond the technical realm, I have many hobbies that keep me grounded and inspired. I delight in programming, devour science fiction novels,
             and explore the depths of philosophy. When I'm not immersed in code or deep thought, you might find me gaming, world-building, or writing. Each
             endeavor serves as a channel for the countless thoughts swirling in my head.`
    },
    email: "arvinsingh@protonmail.com",
    website: {
      url: "https://apsbali.com",
      domain: "apsbali.com"
    }
  },
  social: {
    github: {
      name: "GitHub",
      username: "arvinsingh",
      url: "https://github.com/arvinsingh",
      icon: "github",
      display: true
    },
    linkedin: {
      name: "LinkedIn",
      username: "arvinder-pal-singh",
      url: "https://www.linkedin.com/in/arvinder-pal-singh/",
      icon: "linkedin",
      display: true
    },
    twitter: {
      name: "Twitter",
      username: "0xarv1nd3r",
      url: "https://twitter.com/0xarv1nd3r",
      icon: "twitter",
      display: true
    },
    discord: {
      name: "Discord",
      url: "https://discord.com/users/738389772871139330",
      icon: "discord",
      display: true
    },
    email: {
      name: "Email",
      url: "mailto:arvinsingh@protonmail.com",
      icon: "mail",
      display: true
    }
  },
  repository: {
    url: "https://github.com/arvinsingh/apsbali.com",
    name: "apsbali.com"
  },
  about: {
    title: "About",
    description: "About this website.",
    content: {
      introduction: "Welcome to my blog. This is a simple space where I can jot down my thoughts, share my projects, and capture those fleeting ideas as they come. Here, you'll find a mix of what I'm currently working on - from detailed project notes to everyday reflections.",
      purpose: "I started this blog as a personal record of my journey, a place where ideas can grow without much fuss. I'm glad you're here to read a bit about what's on my mind, and I hope my posts give you some insight into my thinking process.",
      closing: "Thank you for stopping by.",
      sourceCode: "Website source code: "
    }
  },
  resume: {
    googleDriveId: "1EW9feiNcfrVcYQNC-TW7hNPNSOYtBVF4",
    filename: "arvin-singh-resume.pdf"
  },
  analytics: {
    enabled: true
  },
  features: {
    blog: true,
    projects: true,
    notes: true,
    resume: true
  }
}

// Project display settings
export interface ProjectSettings {
  featuredCount: number
  showYearsOnCard: boolean
}

export const projectSettings: ProjectSettings = {
  featuredCount: 6,
  showYearsOnCard: true
}

// Blog configuration
export interface BlogSettings {
  postsPerPage: number
  featuredPostsCount: number
  categories: string[]
  defaultCategory: string
}

export const blogSettings: BlogSettings = {
  postsPerPage: 10,
  featuredPostsCount: 3,
  categories: ['technical', 'personal', 'philosophy', 'projects'],
  defaultCategory: 'personal'
}

// Notes configuration
export interface NotesSettings {
  notesPerPage: number
  typesOrder: ('snippet' | 'tip' | 'note')[]
}

export const notesSettings: NotesSettings = {
  notesPerPage: 20,
  typesOrder: ['note', 'snippet', 'tip']
}

// Helper functions to access config data
export const getPersonalInfo = () => siteConfig.personal
export const getSocialLinks = (displayOnly = true) => {
  const links = siteConfig.social
  return displayOnly
    ? Object.fromEntries(Object.entries(links).filter(([, link]) => link.display))
    : links
}
export const getRepositoryConfig = () => siteConfig.repository
export const getAboutConfig = () => siteConfig.about
export const getResumeConfig = () => siteConfig.resume
export const getFeatures = () => siteConfig.features
export const getProjectSettings = () => projectSettings
export const getBlogSettings = () => blogSettings
export const getNotesSettings = () => notesSettings

// Helper to get enabled routes based on feature flags
export const getEnabledRoutes = () => {
  const features = siteConfig.features
  const routes = [
    { path: '/', name: 'Home', enabled: true },
    { path: '/about', name: 'About', enabled: true }, // About always enabled
    { path: '/blog', name: 'Blog', enabled: features.blog },
    { path: '/projects', name: 'Projects', enabled: features.projects },
    { path: '/notes', name: 'Notes', enabled: features.notes },
    { path: '/resume', name: 'Resume', enabled: features.resume }
  ]

  return routes.filter(route => route.enabled)
}
