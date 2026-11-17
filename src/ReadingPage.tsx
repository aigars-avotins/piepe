import SiteLink from './SiteLink'
import { releaseVersion, releaseMilestone } from './release'
import { renderToStaticMarkup } from 'react-dom/server'
import { Fragment } from 'react'
import { localePath, messages, readingPath } from './i18n'
import type { Locale } from './i18n'
import { articleSchema, pageSchema } from './seo'
import { DocumentHead } from './documentHead'
import { AttentionLight, SiteFooter, SiteMenu } from './SiteChrome'
import { siteCopy } from './siteCopy'
import { readings, readingSources } from './reading'
import { renderAtlas, renderXray } from './ReadingExperiences'
import { fieldNotesPath, wallpapersPath, forestNavigation } from './forestPaths'

export function readingSchema(locale: Locale) {
  const t = readings[locale], url = 'https://pie.pe' + readingPath(locale)
  return { ...pageSchema('guide', locale, t.title, t.description), '@id': `${url}#webpage`, url, about: { '@type': 'Thing', name: t.topic }, mainEntity: articleSchema('guide', locale, t.heading, t.description) }
}

export function renderReadingDocument(locale: Locale, stylesheets: string[], fonts: string[], client?: string) {
  const t = readings[locale]
  const citations = (ids: typeof readingSources[number]['id'][]) => <span className="reading-citations">{ids.map(id => {
    const index = readingSources.findIndex(source => source.id === id)
    return <SiteLink key={id} href={`#source-${id}`} aria-label={`${t.sourceHeading}: ${readingSources[index].name}`}>[{index + 1}]</SiteLink>
  })}</span>
  return '<!doctype html>\n' + renderToStaticMarkup(<html lang={locale} className="reading-document">
    <DocumentHead route="guide" locale={locale} title={t.title} description={t.description} type="article" imageAlt={t.imageAlt} schema={readingSchema(locale)} stylesheets={stylesheets} fonts={fonts} client={client} />
    <body className="reading-page" data-version={releaseVersion} data-milestone={releaseMilestone}>
      <AttentionLight />
      <SiteLink className="skip-content" href="#reading">{messages[locale].skipContent}</SiteLink>
      <header className="reading-header">
        <SiteLink className="brand" href={localePath(locale)} aria-label={messages[locale].homeLabel}><img src="/brand-mark.svg" alt="" width="40" height="40" /><img className="brand-wordmark" src="/brand-wordmark.svg" alt="pie.pe" width="64" height="34" /></SiteLink>
        <nav className="reading-languages" aria-label={messages[locale].language}>{(['lv', 'en'] as const).map(lang => <SiteLink key={lang} lang={lang} hrefLang={lang} href={readingPath(lang)} aria-current={lang === locale ? 'page' : undefined}>{lang.toUpperCase()}</SiteLink>)}</nav>
      </header>
      <main id="reading" className="reading-main" tabIndex={-1}>
        <article>
          <header className="reading-intro"><p className="reading-label">{t.label}</p><h1>{t.heading}</h1><p className="reading-lead">{t.lead} {citations(['anbg', 'woodland'])}</p></header>
          {t.sections.map((section,index) => <Fragment key={section.id}><section className="reading-section" aria-labelledby={section.id}><h2 id={section.id}>{section.heading}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}{citations(section.sources)}</section>{index===0&&renderXray(locale)}{index===2&&renderAtlas(locale)}</Fragment>)}
          <section className="reading-section" aria-labelledby="notice"><h2 id="notice">{t.noticeHeading}</h2><ul>{t.observations.map(observation => <li key={observation}>{observation}</li>)}</ul><p>{t.identification} {citations(['woodland', 'ucipm'])}</p></section>
          <aside className="reading-art-note"><p>{t.artNote}</p></aside>
          <section className="reading-sources" aria-labelledby="sources"><h2 id="sources">{t.sourceHeading}</h2><p>{t.sourceNote}</p><ol>{readingSources.map(source => <li key={source.id} id={`source-${source.id}`} tabIndex={-1}><SiteLink href={source.url}>{source.name} — {source.title}</SiteLink></li>)}</ol></section>
        </article>
        <nav className="reading-next" aria-label={siteCopy[locale].status.keepReading}><SiteLink href={fieldNotesPath(locale)}>{forestNavigation[locale].notes}</SiteLink><SiteLink href={wallpapersPath(locale)}>{forestNavigation[locale].wallpapers}</SiteLink></nav>
        <footer className="reading-return"><p>{t.returnThought}</p><SiteLink href={localePath(locale)}>{t.returnLabel}<span aria-hidden="true"> ↗</span></SiteLink></footer>
      </main>
      <SiteFooter locale={locale} current="guide" />
      <SiteMenu locale={locale} current="guide" alternate={{ lv: readingPath('lv'), en: readingPath('en') }} />
    </body>
  </html>)
}
