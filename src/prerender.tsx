import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import App from './App'
import { localePath, messages } from './i18n'
import type { Locale } from './i18n'
import { structuredData } from './seo'
export function renderPage(locale: Locale) { return renderToString(<App initialLocale={locale} />) }
export function renderHead(locale: Locale) {
  const t = messages[locale], url = 'https://pie.pe' + localePath(locale)
  return renderToStaticMarkup(<>
    <title>{t.title}</title><meta name="description" content={t.description} />
    <link rel="canonical" href={url} />
    <link rel="alternate" hrefLang="lv" href="https://pie.pe/" /><link rel="alternate" hrefLang="en" href="https://pie.pe/en/" /><link rel="alternate" hrefLang="x-default" href="https://pie.pe/" />
    <meta property="og:type" content="website" /><meta property="og:site_name" content="PIE.PE" /><meta property="og:title" content={t.title} /><meta property="og:description" content={t.description} /><meta property="og:url" content={url} />
    <meta property="og:locale" content={locale === 'lv' ? 'lv_LV' : 'en_GB'} /><meta property="og:locale:alternate" content={locale === 'lv' ? 'en_GB' : 'lv_LV'} />
    <meta property="og:image" content="https://pie.pe/social-preview.jpg" /><meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" /><meta property="og:image:alt" content={t.wallpaperAltDesktop} />
    <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content={t.title} /><meta name="twitter:description" content={t.description} /><meta name="twitter:image" content="https://pie.pe/social-preview.jpg" /><meta name="twitter:image:alt" content={t.wallpaperAltDesktop} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(locale)).replace(/</g, '\\u003c') }} />
  </>)
}
export function renderNote(locale: Locale) {
  const t = messages[locale]
  return `PIE.PE — ${t.forest.toUpperCase()}\n${t.noteLabel} — ${t.atlas}\n\n` + t.observations.map(note => `${note.label.toUpperCase()}\n${note.text}\n${note.footnote}`).join('\n\n') + `\n\n${t.factsTitle.toUpperCase()}\n${t.factsDefinition}\n\n${t.factsContext}\n\n` + t.facts.map(fact => `${fact.title}\n${fact.text}`).join('\n\n') + `\n\n${t.artNote}\n\n${t.sources}:\nhttps://www.woodlandtrust.org.uk/blog/bracket-fungi-identification/\nhttps://archive.bio.ed.ac.uk/jdeacon/FungalBiology/bracket.htm\n\nhttps://pie.pe${localePath(locale)}\n`
}
