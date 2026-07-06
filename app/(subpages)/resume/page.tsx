import fs from 'fs/promises'
import path from 'path'
import type { ReactNode } from 'react'
import { getFeatures } from '@data/site-config'
import {
  getContentConfig,
  getPersonalInfo,
  getResumeConfig,
  getSocialLinks,
} from '@/data/content-config'
import { getContentPath } from '@/lib/content-path'
import {
  getResumeContent,
  type ResumeEntry,
  type ResumeLink,
  type ResumePublication,
} from '@/lib/get-resume'
import { notFound } from 'next/navigation'
import styles from './resume.module.css'

async function hasLocalResume(filename: string) {
  try {
    await fs.access(path.join(getContentPath(), 'public', 'resume', filename))
    return true
  } catch {
    return false
  }
}

function ResumeSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className={styles.section}>
      <h2>{title}</h2>
      {children}
    </section>
  )
}

function EntryList({ entries }: { entries: ResumeEntry[] }) {
  if (!entries.length) {
    return null
  }

  return (
    <div className={styles.entryList}>
      {entries.map((entry) => (
        <div
          key={`${entry.title}-${entry.organization || entry.period || ''}`}
          className={styles.entry}
        >
          <div className={styles.entryHeader}>
            <div>
              <h3>
                {entry.url ? (
                  <a href={entry.url} target="_blank" rel="noopener noreferrer">
                    {entry.title}
                  </a>
                ) : (
                  entry.title
                )}
              </h3>
              {entry.organization ? <p>{entry.organization}</p> : null}
            </div>
            <div className={styles.entryMeta}>
              {entry.period ? <span>{entry.period}</span> : null}
              {entry.location ? <span>{entry.location}</span> : null}
            </div>
          </div>
          {entry.summary ? (
            <p className={styles.entrySummary}>{entry.summary}</p>
          ) : null}
          {entry.highlights?.length ? (
            <ul className={styles.bulletList}>
              {entry.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          ) : null}
          {entry.tags?.length ? (
            <div className={styles.tags}>
              {entry.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}

function LinkList({ links }: { links: ResumeLink[] }) {
  if (!links.length) {
    return null
  }

  return (
    <div className={styles.inlineLinks}>
      {links.map((link) => (
        <a
          key={link.url}
          href={link.url}
          target={link.url.startsWith('mailto:') ? undefined : '_blank'}
          rel={
            link.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'
          }
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}

function PublicationList({
  publications,
}: {
  publications: ResumePublication[]
}) {
  if (!publications.length) {
    return null
  }

  return (
    <div className={styles.entryList}>
      {publications.map((publication) => (
        <div key={publication.title} className={styles.entry}>
          <div className={styles.entryHeader}>
            <div>
              <h3>{publication.title}</h3>
              {publication.authors || publication.venue ? (
                <p>
                  {[publication.authors, publication.venue]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              ) : null}
            </div>
            {publication.year ? (
              <div className={styles.entryMeta}>
                <span>{publication.year}</span>
              </div>
            ) : null}
          </div>
          {publication.highlights?.length ? (
            <ul className={styles.bulletList}>
              {publication.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          ) : null}
          <LinkList links={publication.links || []} />
        </div>
      ))}
    </div>
  )
}

export default async function ResumePage() {
  const features = getFeatures()

  // If resume feature is disabled, return 404
  if (!features.resume) {
    notFound()
  }

  const contentConfig = await getContentConfig()
  const resumeContent = await getResumeContent()
  const personalInfo = getPersonalInfo(contentConfig)
  const resumeConfig = getResumeConfig(contentConfig)
  const socialLinks = Object.values(getSocialLinks(contentConfig))
  const filename = path.basename(resumeConfig.filename || 'resume.pdf')
  const pdfUrl = `/resume/${encodeURIComponent(filename)}`
  const pdfExists = await hasLocalResume(filename)
  const phone = resumeContent.contact?.phone
  const highlights = resumeContent.highlights?.length
    ? resumeContent.highlights
    : resumeConfig.highlights?.length
      ? resumeConfig.highlights
      : [
          'Machine learning systems',
          'Distributed training',
          'Language and fluency analysis',
        ]
  const summary =
    resumeContent.summary || resumeConfig.summary || personalInfo.bio.short
  const skillGroups = resumeContent.skills || []
  const experience = resumeContent.experience || []
  const education = resumeContent.education || []
  const publications = resumeContent.publications || []
  const leadership = resumeContent.leadership || []
  const certifications = resumeContent.certifications || []
  const metrics = resumeContent.metrics || []
  const professionalLinks = socialLinks
    .filter((link) => ['github', 'linkedin'].includes(link.icon))
    .map((link) => ({
      label: link.name,
      url: link.url,
    }))

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <p className={styles.kicker}>Résumé</p>
          <div className={styles.actions}>
            <a
              className={styles.primaryAction}
              href={`mailto:${personalInfo.email}`}
            >
              Contact
            </a>
            {pdfExists ? (
              <>
                <a className={styles.secondaryAction} href={pdfUrl} download>
                  Download PDF
                </a>
                <a
                  className={styles.secondaryAction}
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open PDF
                </a>
              </>
            ) : null}
          </div>
        </div>

        <div className={styles.identity}>
          <div>
            <h1>{personalInfo.name.full}</h1>
            <p className={styles.role}>{personalInfo.title}</p>
          </div>
          <p className={styles.summary}>{summary}</p>
        </div>

        <dl className={styles.contactBar}>
          <div>
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
            </dd>
          </div>
          {phone ? (
            <div>
              <dt>Phone</dt>
              <dd>
                <a href={`tel:${phone.replace(/[^\d+]/g, '')}`}>{phone}</a>
              </dd>
            </div>
          ) : null}
          <div>
            <dt>Web</dt>
            <dd>
              <a
                href={personalInfo.website.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {personalInfo.website.domain}
              </a>
            </dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{personalInfo.location}</dd>
          </div>
        </dl>

        {highlights.length ? (
          <ul className={styles.highlights}>
            {highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        ) : null}

        {metrics.length ? (
          <dl className={styles.metrics}>
            {metrics.map((metric) => (
              <div key={metric.label}>
                <dt>{metric.value}</dt>
                <dd>{metric.label}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </header>

      <div className={styles.resumeLayout}>
        <main className={styles.mainColumn}>
          {experience.length ? (
            <ResumeSection title="Experience">
              <EntryList entries={experience} />
            </ResumeSection>
          ) : null}

          {publications.length ? (
            <ResumeSection title="Publications">
              <PublicationList publications={publications} />
            </ResumeSection>
          ) : null}
        </main>

        <aside className={styles.sideColumn} aria-label="Resume details">
          {skillGroups.length ? (
            <ResumeSection title="Skills">
              <div className={styles.skillGroups}>
                {skillGroups.map((group) => (
                  <div key={group.category} className={styles.skillGroup}>
                    <h3>{group.category}</h3>
                    <div className={styles.tags}>
                      {group.items.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ResumeSection>
          ) : null}

          {education.length ? (
            <ResumeSection title="Education">
              <EntryList entries={education} />
            </ResumeSection>
          ) : null}

          {leadership.length ? (
            <ResumeSection title="Leadership">
              <EntryList entries={leadership} />
            </ResumeSection>
          ) : null}

          {professionalLinks.length ? (
            <ResumeSection title="Links">
              <LinkList links={professionalLinks} />
            </ResumeSection>
          ) : null}

          {certifications.length ? (
            <ResumeSection title="Certifications">
              <EntryList entries={certifications} />
            </ResumeSection>
          ) : null}

          {pdfExists ? (
            <ResumeSection title="PDF">
              <object
                data={`${pdfUrl}#view=FitH`}
                type="application/pdf"
                className={styles.pdfFrame}
              >
                <div className={styles.emptyState}>
                  <p>
                    The PDF could not be displayed by this browser. Use the open
                    or download action above.
                  </p>
                </div>
              </object>
            </ResumeSection>
          ) : null}
        </aside>
      </div>
    </section>
  )
}
