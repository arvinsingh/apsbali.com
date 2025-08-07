import { getPersonalInfo } from '@data/site-config'

const AboutMe = () => {
  const personalInfo = getPersonalInfo()

  return (
    <section>
      <p>
        Hello World!{' '}
        Welcome to {personalInfo.name.first}&apos;s website. :{')'}
      </p>
      <p>
        {personalInfo.bio.short}
      </p>
    </section>
  )
}

export default AboutMe
