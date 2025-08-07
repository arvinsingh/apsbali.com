import { getPersonalInfo } from '@data/site-config'

type Props = {
  title: string
  description: string
  image?: string
  hidden?: boolean
  date?: string
  lastModified?: string
  author?: string
  path: `/${string}`
}

export function getMetadata({
  title,
  description,
  image,
  hidden,
  date,
  lastModified,
  author,
  path,
}: Props) {
  const personalInfo = getPersonalInfo()
  const defaultAuthor = personalInfo.name.display
  const finalAuthor = author || defaultAuthor

  const domain =
    process.env.NODE_ENV === 'production'
      ? personalInfo.website.url
      : process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : 'http://localhost:3000'

  return (
    <>
      {title.indexOf(personalInfo.name.display) > -1 ? (
        <title>{title}</title>
      ) : (
        <title>{`${title} - ${finalAuthor}`}</title>
      )}
      <meta name="og:title" content={title} />

      {/* Description */}
      <meta name="description" content={description} />
      <meta name="og:description" content={description} />

      {/* Image */}
      <meta name="twitter:image" content={`${domain}${image}`} />
      <meta name="og:image" content={`${domain}${image}`} />

      {/* URL */}
      <meta name="og:url" content={`${domain}${path}`} />

      {/* General */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@0xarv1nd3r" /> {/* This could be moved to config */}
      <meta property="og:site_name" content={`${personalInfo.name.first}'s site`} />
      <meta name="apple-mobile-web-app-title" content={personalInfo.name.first} />
      <meta name="author" content={finalAuthor} />
      <meta property="og:type" content="website" />
      <meta charSet="utf-8" />
      <meta property="og:locale" content="en" />

      {/* Favicons */}
      <link rel="manifest" href="/favicons/manifest.json" />
      <meta name="theme-color" content="#000000" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/favicons/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/svg+xml"
        href="/favicons/favicon-32x32.png"
        key="dynamic-favicon"
      />

      {date && <meta name="date" content={date} />}
      {lastModified && <meta name="last-modified" content={lastModified} />}
      {hidden && <meta name="robots" content="noindex" />}
    </>
  )
}
