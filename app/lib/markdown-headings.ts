import GithubSlugger from 'github-slugger'

export type MarkdownHeading = {
  id: string
  text: string
  depth: number
}

function stripHeadingMarkup(value: string) {
  return value
    .replace(/\s+\{#[^}]+\}\s*$/, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~]/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim()
}

export function extractMarkdownHeadings(
  markdown: string,
  { minDepth = 2, maxDepth = 3 } = {},
): MarkdownHeading[] {
  const slugger = new GithubSlugger()
  let inFence = false

  return markdown.split(/\r?\n/).flatMap((line) => {
    const trimmed = line.trim()

    if (/^(```|~~~)/.test(trimmed)) {
      inFence = !inFence
      return []
    }

    if (inFence) {
      return []
    }

    const match = /^(#{1,6})\s+(.+?)\s*#*$/.exec(trimmed)
    if (!match) {
      return []
    }

    const depth = match[1].length
    if (depth < minDepth || depth > maxDepth) {
      return []
    }

    const text = stripHeadingMarkup(match[2])
    if (!text) {
      return []
    }

    return [
      {
        id: slugger.slug(text),
        text,
        depth,
      },
    ]
  })
}
