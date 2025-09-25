'use client'

import { usePersonalInfo } from '../providers/content-provider'

const AboutMe = () => {
  const personalInfo = usePersonalInfo()

  return (
    <section>
      <p>
        I&apos;m {personalInfo.name.first}, welcome to my website. :{')'}
      </p>
      <p>{personalInfo.bio.short}</p>
    </section>
  )
}

export default AboutMe
