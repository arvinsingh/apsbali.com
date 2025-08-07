import { PostListRSC } from '@components/posts-list/rsc'
import { getFeatures } from '@data/site-config'
import { notFound } from 'next/navigation'

const Blog = async () => {
  const features = getFeatures()

  // If blog feature is disabled, return 404
  if (!features.blog) {
    notFound()
  }

  return (
    <PostListRSC paginate={true} />
  )
}

export default Blog
