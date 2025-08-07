import Outline from '@components/layout-outline'
import { getPersonalInfo } from '@data/site-config'

const personalInfo = getPersonalInfo()

export const metadata = {
  title: 'Résumé',
  description: `${personalInfo.name.display}'s professional résumé`,
  alternates: {
    canonical: `${personalInfo.website.url}/resume`,
  },
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
