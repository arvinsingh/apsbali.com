import Outline from '@components/layout-outline'

export const metadata = {
  title: 'Résumé',
  description: 'Arvin Singh\'s professional résumé',
  alternates: {
    canonical: 'https://apsbali.com/resume',
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
