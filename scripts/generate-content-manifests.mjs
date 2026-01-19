#!/usr/bin/env node

import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const OUTPUT_DIR = path.join(process.cwd(), 'app', 'data', 'generated')
const PUBLIC_DIR = path.join(process.cwd(), 'public')
const PUBLIC_CONTENT_DIR = path.join(PUBLIC_DIR, 'content')

function getContentPath() {
  return path.join(process.cwd(), 'content')
}

const CONTENT_DIR = getContentPath()
const CONTENT_PUBLIC_DIR = path.join(CONTENT_DIR, 'public')

async function ensureOutputDir() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true })
}

async function readMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
}

function buildSlug(fileName, frontMatterSlug) {
  if (frontMatterSlug && typeof frontMatterSlug === 'string') {
    return frontMatterSlug.trim()
  }

  return fileName.replace(/\.(md|mdx)$/i, '')
}

async function generateManifest(subdirectory) {
  const directory = path.join(CONTENT_DIR, subdirectory)
  let files = []

  try {
    files = await readMarkdownFiles(directory)
  } catch (error) {
    console.warn(`Skipping ${subdirectory}: unable to read directory`, error)
    return {}
  }

  const manifestEntries = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(directory, file)
      const fileContent = await fs.readFile(filePath, 'utf-8')
      const { data } = matter(fileContent)

      if (data.published === false) {
        return null
      }

      const slug = buildSlug(file, data.slug)
      const title = typeof data.title === 'string' ? data.title : slug
      const date = typeof data.date === 'string' ? data.date : undefined
      const description =
        typeof data.description === 'string' ? data.description : undefined

      return [slug, {
        slug,
        title,
        date,
        description,
        type: subdirectory === 'posts' ? 'post' : 'note',
      }]
    }),
  )

  return Object.fromEntries(manifestEntries.filter(Boolean))
}

async function writeManifestFile(name, manifest) {
  const outputPath = path.join(OUTPUT_DIR, name)
  const fileContents = `${JSON.stringify(manifest, null, 2)}\n`
  await fs.writeFile(outputPath, fileContents, 'utf-8')
}

async function writeContentConfigSnapshot() {
  const configPath = path.join(CONTENT_DIR, 'config.json')
  const outputPath = path.join(OUTPUT_DIR, 'content-config.json')

  try {
    const fileContents = await fs.readFile(configPath, 'utf-8')
    // Validate JSON before writing so we surface malformed content early.
    const parsed = JSON.parse(fileContents)
    await fs.writeFile(outputPath, `${JSON.stringify(parsed, null, 2)}\n`, 'utf-8')
    return true
  } catch (error) {
    console.warn('Unable to snapshot content config:', error)
    return false
  }
}

async function syncPublicAssets() {
  try {
    const entries = await fs.readdir(CONTENT_PUBLIC_DIR, { withFileTypes: true })

    if (!entries.length) {
      console.warn('No assets found in content/public; skipping asset sync.')
      return { mirroredRoot: 0, mirroredContent: 0 }
    }

    const mirrorEntry = async (entry) => {
      const sourcePath = path.join(CONTENT_PUBLIC_DIR, entry.name)

      const targets = [
        path.join(PUBLIC_DIR, entry.name),
        path.join(PUBLIC_CONTENT_DIR, entry.name),
      ]

      for (const target of targets) {
        await fs.rm(target, { recursive: true, force: true })
        await fs.mkdir(path.dirname(target), { recursive: true })
        await fs.cp(sourcePath, target, { recursive: true })
      }
    }

    await fs.mkdir(PUBLIC_DIR, { recursive: true })
    await fs.rm(PUBLIC_CONTENT_DIR, { recursive: true, force: true })
    await fs.mkdir(PUBLIC_CONTENT_DIR, { recursive: true })

    await Promise.all(entries.map((entry) => mirrorEntry(entry)))

    return {
      mirroredRoot: entries.length,
      mirroredContent: entries.length,
    }
  } catch (error) {
    console.warn('Unable to sync content assets into public directory:', error)
    return { mirroredRoot: 0, mirroredContent: 0 }
  }
}

async function main() {
  await ensureOutputDir()

  const [postManifest, notesManifest] = await Promise.all([
    generateManifest('posts'),
    generateManifest('notes'),
  ])

  const configSnapshot = await writeContentConfigSnapshot()
  const assetSync = await syncPublicAssets()

  await Promise.all([
    writeManifestFile('posts-manifest.json', postManifest),
    writeManifestFile('notes-manifest.json', notesManifest),
  ])

  console.log(
    `Generated manifests: posts (${Object.keys(postManifest).length}) | notes (${Object.keys(notesManifest).length}) | config snapshot ${configSnapshot ? 'updated' : 'skipped'} | assets mirrored ${assetSync.mirroredRoot}`,
  )
}

main().catch((error) => {
  console.error('Failed to generate content manifests:', error)
  process.exitCode = 1
})
