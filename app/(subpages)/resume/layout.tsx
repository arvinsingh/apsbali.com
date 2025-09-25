import Outline from '@components/layout-outline'
import { getContentConfig, getPersonalInfo } from '@/data/content-config'

export async function generateMetadata() {
  const contentConfig = await getContentConfig()
  const personalInfo = getPersonalInfo(contentConfig)
  return {
    title: 'Résumé',
    description: `${personalInfo.name.display}'s professional résumé`,
    alternates: {
      canonical: `${personalInfo.website.url}/resume`,
    },
  }
}

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Outline type="layout" name="Résumé">
      {children}
    </Outline>
  )
}
