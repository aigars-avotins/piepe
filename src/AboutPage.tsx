import SiteLink from './SiteLink'
import { renderToStaticMarkup } from 'react-dom/server'
import { localePath, messages } from './i18n'
import type { Locale } from './i18n'
import { releaseVersion, releaseMilestone } from './release'
import { aboutPath, siteOrigin } from './routes'
import { articleSchema, pageSchema } from './seo'
import { colophonPeople, siteCopy } from './siteCopy'
import { DocumentHead } from './documentHead'
import { AttentionLight, SiteFooter, SiteMenu } from './SiteChrome'
import { films } from './films'
import Arrow from './Arrow'

export function aboutSchema(locale: Locale) {
  const t = siteCopy[locale].about
  return { ...pageSchema('about', locale, t.title, t.description), '@type': 'AboutPage', mainEntity: articleSchema('about', locale, t.heading, t.description) }
}

/** Concept, process, a text equivalent of the films, tools and the honest statement about the imagery. */
export function renderAboutDocument(locale: Locale, stylesheets: string[], fonts: string[], client?: string) {
  const t = siteCopy[locale].about, people = colophonPeople.filter(person => person.name)
  return '<!doctype html>\n' + renderToStaticMarkup(<html lang={locale} className="reading-document">
    <DocumentHead route="about" locale={locale} title={t.title} description={t.description} type="article" imageAlt={t.imageAlt} schema={aboutSchema(locale)} stylesheets={stylesheets} fonts={fonts} client={client} />
    <body className="reading-page about-page" data-version={releaseVersion} data-milestone={releaseMilestone} data-page="about">
      <AttentionLight />
      <SiteLink className="skip-content" href="#reading"><span data-nosnippet="">{messages[locale].skipContent}</span></SiteLink>
      <header className="reading-header">
        <SiteLink className="brand" href={localePath(locale)} aria-label={messages[locale].homeLabel}><img src="/brand-mark.svg" alt="" width="40" height="40" /><img className="brand-wordmark" src="/brand-wordmark.svg" alt="pie.pe" width="64" height="34" /></SiteLink>
        <nav className="reading-languages" aria-label={messages[locale].language}>{(['lv', 'en'] as const).map(lang => <SiteLink key={lang} lang={lang} hrefLang={lang} href={aboutPath(lang)} aria-current={lang === locale ? 'page' : undefined}><span data-nosnippet="">{lang.toUpperCase()}</span></SiteLink>)}</nav>
      </header>
      <main id="reading" className="reading-main" tabIndex={-1}>
        <article>
          <header className="reading-intro"><p className="reading-label">{t.label}</p><h1>{t.heading}</h1><p className="reading-lead">{t.lead}</p></header>
          {t.sections.slice(0, 2).map(section => <section key={section.id} className="reading-section" aria-labelledby={section.id}><h2 id={section.id}>{section.heading}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</section>)}
          <section className="reading-section about-films" aria-labelledby={t.films.id}><h2 id={t.films.id}>{t.films.heading}</h2><p>{t.films.intro}</p>
            <ol>{t.films.items.map((film, index) => <li key={film.name}><span className="reading-label">{String(index + 1).padStart(2, '0')} · {Math.round(films[index].seconds)} s</span><h3>{film.name}</h3><p>{film.text}</p></li>)}</ol>
            <p>{t.films.outro}</p></section>
          {t.sections.slice(2).map(section => <section key={section.id} className="reading-section" aria-labelledby={section.id}><h2 id={section.id}>{section.heading}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</section>)}
          <section className="reading-section about-made" aria-labelledby={t.made.id}><h2 id={t.made.id}>{t.made.heading}</h2><dl>{t.made.items.map(item => <div key={item.term}><dt>{item.term}</dt><dd>{item.text}</dd></div>)}</dl></section>
          {people.length > 0 && <section className="reading-section about-made" aria-labelledby="credits"><h2 id="credits">{t.people.heading}</h2><dl>{people.map(person => <div key={person.name}><dt>{person.role[locale]}</dt><dd>{person.href ? <SiteLink href={person.href}>{person.name}</SiteLink> : person.name}</dd></div>)}</dl></section>}
        </article>
        <footer className="reading-return"><p>{t.returnThought}</p><SiteLink href={localePath(locale)}>{t.returnLabel} <Arrow /></SiteLink></footer>
      </main>
      <SiteFooter locale={locale} current="about" />
      <SiteMenu locale={locale} current="about" alternate={{ lv: aboutPath('lv'), en: aboutPath('en') }} />
    </body>
  </html>)
}
export const aboutUrl = (locale: Locale) => siteOrigin + aboutPath(locale)
