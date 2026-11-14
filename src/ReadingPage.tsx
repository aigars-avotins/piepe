import SiteLink from './SiteLink'
import { releaseVersion, releaseMilestone } from './release'
import { renderToStaticMarkup } from 'react-dom/server'
import { Fragment } from 'react'
import { localePath, messages, readingPath } from './i18n'
import type { Locale } from './i18n'
import { structuredData } from './seo'
import { readings, readingSources } from './reading'
import { renderAtlas, renderXray } from './ReadingExperiences'
import { fieldNotesPath, wallpapersPath, forestNavigation } from './forestPaths'

export function readingSchema(locale: Locale) {
  const t = readings[locale], url = 'https://pie.pe' + readingPath(locale)
  return { ...structuredData(locale), '@id': `${url}#webpage`, name: t.title, description: t.description, url, about: { '@type': 'Thing', name: t.topic } }
}

export function renderReadingDocument(locale: Locale, stylesheets: string[], fonts: string[], client?: string) {
  const t = readings[locale], url = 'https://pie.pe' + readingPath(locale)
  const citations = (ids: typeof readingSources[number]['id'][]) => <span className="reading-citations">{ids.map(id => {
    const index = readingSources.findIndex(source => source.id === id)
    return <SiteLink key={id} href={`#source-${id}`} aria-label={`${t.sourceHeading}: ${readingSources[index].name}`}>[{index + 1}]</SiteLink>
  })}</span>
  return '<!doctype html>\n' + renderToStaticMarkup(<html lang={locale} className="reading-document">
    <head>
      <meta charSet="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />

      <meta name="theme-color" content="#0B1712" /><title>{t.title}</title><meta name="description" content={t.description} />
      <link rel="canonical" href={url} />
      <link rel="alternate" hrefLang="lv" href={'https://pie.pe' + readingPath('lv')} /><link rel="alternate" hrefLang="en" href={'https://pie.pe' + readingPath('en')} /><link rel="alternate" hrefLang="x-default" href={'https://pie.pe' + readingPath('lv')} />
      <meta property="og:type" content="article" /><meta property="og:site_name" content="PIE.PE" /><meta property="og:title" content={t.title} /><meta property="og:description" content={t.description} /><meta property="og:url" content={url} />
      <meta property="og:locale" content={locale === 'lv' ? 'lv_LV' : 'en_GB'} /><meta property="og:locale:alternate" content={locale === 'lv' ? 'en_GB' : 'lv_LV'} />
      <meta property="og:image" content="https://pie.pe/social-preview.jpg" /><meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" /><meta property="og:image:alt" content={t.imageAlt} />
      <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content={t.title} /><meta name="twitter:description" content={t.description} /><meta name="twitter:image" content="https://pie.pe/social-preview.jpg" /><meta name="twitter:image:alt" content={t.imageAlt} />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="16x16 32x32 48x48" /><link rel="icon" type="image/svg+xml" href="/favicon.svg" /><link rel="apple-touch-icon" href="/apple-touch-icon.png" /><link rel="manifest" href="/site.webmanifest" />
      {stylesheets.map(href => <link key={href} rel="stylesheet" href={href} />)}
      {fonts.map(href => <link key={href} rel="preload" as="font" type="font/woff2" crossOrigin="anonymous" href={href} />)}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(readingSchema(locale)).replace(/</g, '\\u003c') }} />
      {client&&<script type="module" src={client} data-reading-tools="" />}
    </head>
    <body className="reading-page" data-version={releaseVersion} data-milestone={releaseMilestone}>
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
        <nav className="reading-next" aria-label={locale==='lv'?'Turpini lasīt':'Keep reading'}><SiteLink href={fieldNotesPath(locale)}>{forestNavigation[locale].notes}</SiteLink><SiteLink href={wallpapersPath(locale)}>{forestNavigation[locale].wallpapers}</SiteLink></nav>
        <footer className="reading-return"><p>{t.returnThought}</p><SiteLink href={localePath(locale)}>{t.returnLabel}<span aria-hidden="true"> ↗</span></SiteLink></footer>
      </main>
    </body>
  </html>)
}
