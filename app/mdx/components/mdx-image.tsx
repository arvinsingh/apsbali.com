import NextImage from 'next/image'
import { getContentConfig, getWebsiteUrl } from '@/data/content-config'

export default async function MDXImage({ src, alt }: { src: string; alt: string }) {
  let widthFromSrc, heightFromSrc
  const contentConfig = await getContentConfig()
  const url = new URL(src, getWebsiteUrl(contentConfig))
  const widthParam = url.searchParams.get('w') || url.searchParams.get('width')
  const heightParam =
    url.searchParams.get('h') || url.searchParams.get('height')
  if (widthParam) {
    widthFromSrc = parseInt(widthParam)
  }
  if (heightParam) {
    heightFromSrc = parseInt(heightParam)
  }

  const imageProps = {
    src,
    alt,
    // tweak these to your liking
    height: heightFromSrc || 450,
    width: widthFromSrc || 550,
  }

  return <NextImage {...imageProps} />
}
