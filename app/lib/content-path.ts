import path from 'path'

export const getContentPath = () => {
  return path.join(process.cwd(), 'content')
}
