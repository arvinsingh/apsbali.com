import { getFeatures } from '@data/site-config'
import { notFound } from 'next/navigation'
import ResumePage from './resume-client'

export default function ResumeWrapper() {
  const features = getFeatures()

  // If resume feature is disabled, return 404
  if (!features.resume) {
    notFound()
  }

  return <ResumePage />
}
