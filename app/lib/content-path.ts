import path from 'path'
import fs from 'fs'

export const getContentPath = () => {
  // In development, if local sibling repo exists, use it
  if (process.env.NODE_ENV !== 'production') {
      const localContent = path.resolve(process.cwd(), '../apsbali-content')
      try {
          if (fs.existsSync(localContent)) {
              return localContent
          }
      } catch (e) {
          // ignore error
      }
  }

  return path.join(process.cwd(), 'content')
}
