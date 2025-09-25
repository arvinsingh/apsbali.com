import { cache } from 'react'
import { readFiles } from './read-files'
import { Note } from './types'
import path from 'path'
import fs from 'fs'

// Helper function to check if directory exists
function directoryExists(dirPath: string): boolean {
  try {
    return fs.statSync(dirPath).isDirectory()
  } catch (err) {
    return false
  }
}

export const getNotes = cache(async () => {
  // Use path.join with process.cwd() to get absolute path
  const notesDir = path.join(process.cwd(), 'content/notes')

  // Check if directory exists and return empty array if not
  if (!directoryExists(notesDir)) {
    console.warn(`Notes directory not found at: ${notesDir}`)
    return []
  }

  const notesWithMetadata = readFiles<Note>(notesDir)

  const filtered = notesWithMetadata
    .filter((post) => post !== null)
    .sort((a, b) =>
      a && b ? new Date(b.date).getTime() - new Date(a.date).getTime() : 0,
    )

  return filtered
})

export async function getNote(slug: string) {
  const notes = await getNotes()
  return notes.find((post) => post.slug === slug)
}

export default getNotes
