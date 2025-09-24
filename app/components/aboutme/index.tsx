import { getPersonalInfo } from '@data/site-config'

const AboutMe = () => {
  const personalInfo = getPersonalInfo()

  return (
    <section>
      <p>
        I&apos;m {personalInfo.name.first}, welcome to my website. :{')'}
      </p>
      <p>
        {personalInfo.bio.short}
      </p>
    </section>
  )
}

export default AboutMe
