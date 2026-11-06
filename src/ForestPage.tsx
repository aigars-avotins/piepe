import { renderToStaticMarkup } from 'react-dom/server'
import { localePath, messages, readingPath } from './i18n'
import type { Locale } from './i18n'
import { structuredData } from './seo'
import { collectionCopy, fieldNote, forestSources } from './forestKnowledge'
import type { ForestSource } from './forestKnowledge'
import { fieldNotesPath, forestPath, forestPages, noteNumbers, notePath, wallpapersPath } from './forestPaths'
import type { ForestPage } from './forestPaths'
import Arrow from './Arrow'

const origin = 'https://pie.pe'
const wallpaperFiles = {
  desktop5k: '/wallpapers/piepe-forest-desktop-5120x2880.jpg',
  desktop4k: '/wallpapers/piepe-forest-desktop-3840x2160.jpg',
  phone: '/wallpapers/piepe-forest-mobile-1440x3120.jpg',
}
export function forestMetadata(locale: Locale, page: ForestPage) {
  const t = collectionCopy[locale]
  if (page.kind === 'note') return fieldNote(locale, page.number)
  return page.kind === 'wallpapers'
    ? { title: t.wallpapersTitle, description: t.wallpapersDescription, heading: t.wallpapersHeading, lead: t.wallpapersLead }
    : { title: t.indexTitle, description: t.indexDescription, heading: t.indexHeading, lead: t.indexLead }
}
export function forestSchema(locale: Locale, page: ForestPage) {
  const t = collectionCopy[locale], meta = forestMetadata(locale, page), url = origin + forestPath(locale, page)
  const base = { ...structuredData(locale), '@id': url + '#webpage', name: meta.title, description: meta.description, url }
  if (page.kind === 'index') return { ...base, '@type': 'CollectionPage', mainEntity: { '@type': 'ItemList', itemListElement: noteNumbers.map((number, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'WebPage', '@id': origin + notePath(locale, number) + '#webpage', url: origin + notePath(locale, number), name: fieldNote(locale, number).heading } })) } }
  if (page.kind === 'wallpapers') return { ...base, image: [
    { '@type': 'ImageObject', contentUrl: origin + wallpaperFiles.desktop5k, thumbnailUrl: origin + '/wallpapers/previews/desktop.webp', width: 5120, height: 2880, encodingFormat: 'image/jpeg', caption: t.desktopCaption },
    { '@type': 'ImageObject', contentUrl: origin + wallpaperFiles.phone, thumbnailUrl: origin + '/wallpapers/previews/mobile.webp', width: 1440, height: 3120, encodingFormat: 'image/jpeg', caption: t.phoneCaption },
  ] }
  return { ...base, about: { '@type': 'Thing', name: meta.heading } }
}

const scientificNames = /\b(Inonotus obliquus|Fomitopsis betulina|Piptoporus betulinus|Laetiporus sulphureus|Fomes fomentarius|Fomitopsis pinicola|Ganoderma applanatum|Ganoderma lucidum|Ganoderma lingzhi)\b/g
function scientific(text: string) {
  return text.split(scientificNames).map((part, i) => i % 2 ? <i key={i} lang="la">{part}</i> : part)
}
function renderContent(locale: Locale, page: ForestPage) {
  const t = collectionCopy[locale], meta = forestMetadata(locale, page)
  const links = <nav className="knowledge-links" aria-label={t.related}>{page.kind !== 'index' && <a href={fieldNotesPath(locale)}>{t.allNotes}</a>}<a href={readingPath(locale)}>{t.guide}</a>{page.kind !== 'wallpapers' && <a href={wallpapersPath(locale)}>{t.wallpapers}</a>}</nav>
  if (page.kind === 'wallpapers') return <>
    <header className="knowledge-intro"><p className="reading-label">PIE.PE</p><h1>{meta.heading}</h1><p className="reading-lead">{meta.lead}</p></header>
    <div className="knowledge-gallery">
      <article><img src="/wallpapers/previews/desktop.webp" alt={t.desktopAlt} width="800" height="450" fetchPriority="high" /><h2>{messages[locale].desktop}</h2><p>{t.desktopCaption}</p><div className="knowledge-downloads"><a href={wallpaperFiles.desktop5k} download>{messages[locale].download5k} <span>5120 × 2880 · JPG</span></a><a href={wallpaperFiles.desktop4k} download>{messages[locale].download4k} <span>3840 × 2160 · JPG</span></a></div></article>
      <article><img className="knowledge-phone" src="/wallpapers/previews/mobile.webp" alt={t.phoneAlt} width="369" height="800" loading="lazy" decoding="async" /><h2>{messages[locale].phone}</h2><p>{t.phoneCaption}</p><div className="knowledge-downloads"><a href={wallpaperFiles.phone} download>{messages[locale].downloadPhone} <span>1440 × 3120 · JPG</span></a></div></article>
    </div>
    <aside className="reading-art-note"><p>{t.artDisclosure}</p><p>{t.resolutionNote}</p></aside>
    <section className="reading-section"><h2>{t.saveHeading}</h2><p>{t.saveText}</p></section>{links}
  </>
  if (page.kind === 'index') return <>
    <header className="knowledge-intro"><p className="reading-label">PIE.PE</p><h1>{meta.heading}</h1><p className="reading-lead">{meta.lead}</p></header>
    <ol className="knowledge-index">{noteNumbers.map(number => { const note = fieldNote(locale, number); return <li key={number}><article><a href={notePath(locale, number)}><span className="reading-label">{number}</span><h2>{note.heading}</h2><p>{note.motif}</p><span aria-hidden="true" className="knowledge-card-arrow"><Arrow /></span></a></article></li> })}</ol>
    {links}
  </>
  const note = fieldNote(locale, page.number), sourceIds = [...new Set(note.sections.flatMap(section => section.sources || []))]
  const citations = (sources: ForestSource[] = []) => sources.length > 0 && <span className="reading-citations">{sources.map(id => <a key={id} href={`#source-${id}`} aria-label={`${t.sources}: ${forestSources[id].name}`}>[{sourceIds.indexOf(id) + 1}]</a>)}</span>
  return <>
    <nav className="knowledge-trail" aria-label={t.allNotes}><a href={fieldNotesPath(locale)}>{t.allNotes}</a><span aria-hidden="true">/ {page.number}</span></nav>
    <article>
      <header className="reading-intro"><p className="reading-label">{t.noteLabel} {page.number}</p><h1>{meta.heading}</h1><p className="knowledge-motif">{note.motif}</p><p className="reading-lead">{scientific(note.lead)}</p></header>
      {note.sections.map((section, i) => <section className="reading-section knowledge-note-section" key={i} aria-labelledby={`observation-${i}`}>
        {section.label && <p className="reading-label">0{i + 1} / {section.label}</p>}<h2 id={`observation-${i}`}>{scientific(section.heading)}</h2>
        {section.paragraphs.map(p => <p key={p}>{scientific(p)}</p>)}{section.footnote && <p className="knowledge-footnote">{section.footnote}</p>}{citations(section.sources)}
      </section>)}
      <aside className="knowledge-care"><p className="reading-label">{t.observation}</p><p>{note.care}</p></aside>
      {page.number === '001' ? <section className="reading-sources"><h2>{t.sources}</h2><p>{t.originalContext}</p><a className="knowledge-original" href={`/field-note-${locale}.txt`} download>{t.original} <Arrow /></a><p><a href={readingPath(locale)}>{t.guide}</a></p></section> : <section className="reading-sources" aria-labelledby="source-title"><h2 id="source-title">{t.sources}</h2><ol>{sourceIds.map(id => <li id={`source-${id}`} key={id}><a href={forestSources[id].url}>{forestSources[id].name}</a></li>)}</ol></section>}
      <aside className="reading-art-note"><p>{t.cinemaDisclosure}</p></aside>
    </article>
    <nav className="knowledge-related" aria-labelledby="related-title"><h2 id="related-title">{t.related}</h2><ul>{note.related.map(number => <li key={number}><a href={notePath(locale, number)}><span>{number}</span>{fieldNote(locale, number).heading} <span aria-hidden="true"><Arrow /></span></a></li>)}</ul></nav>
    {links}
  </>
}

export function renderForestDocuments(locale: Locale, stylesheets: string[], fonts: string[]) {
  return forestPages.map(page => ({ path: forestPath(locale, page), html: renderForestDocument(locale, page, stylesheets, fonts) }))
}
export function renderForestDocument(locale: Locale, page: ForestPage, stylesheets: string[], fonts: string[]) {
  const t = collectionCopy[locale], meta = forestMetadata(locale, page), url = origin + forestPath(locale, page)
  return '<!doctype html>\n' + renderToStaticMarkup(<html lang={locale} className="reading-document"><head>
    <meta charSet="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" /><meta name="theme-color" content="#0B1712" />
    <title>{meta.title}</title><meta name="description" content={meta.description} /><link rel="canonical" href={url} />
    <link rel="alternate" hrefLang="lv" href={origin + forestPath('lv', page)} /><link rel="alternate" hrefLang="en" href={origin + forestPath('en', page)} /><link rel="alternate" hrefLang="x-default" href={origin + forestPath('lv', page)} />
    <meta property="og:type" content={page.kind === 'note' ? 'article' : 'website'} /><meta property="og:site_name" content="PIE.PE" /><meta property="og:title" content={meta.title} /><meta property="og:description" content={meta.description} /><meta property="og:url" content={url} />
    <meta property="og:locale" content={locale === 'lv' ? 'lv_LV' : 'en_GB'} /><meta property="og:locale:alternate" content={locale === 'lv' ? 'en_GB' : 'lv_LV'} />
    <meta property="og:image" content={origin + '/social-preview.jpg'} /><meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" /><meta property="og:image:alt" content={t.desktopAlt} />
    <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content={meta.title} /><meta name="twitter:description" content={meta.description} /><meta name="twitter:image" content={origin + '/social-preview.jpg'} /><meta name="twitter:image:alt" content={t.desktopAlt} />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="16x16 32x32 48x48" /><link rel="icon" type="image/svg+xml" href="/favicon.svg" /><link rel="apple-touch-icon" href="/apple-touch-icon.png" /><link rel="manifest" href="/site.webmanifest" />
    {stylesheets.map(href => <link key={href} rel="stylesheet" href={href} />)}{fonts.map(href => <link key={href} rel="preload" as="font" type="font/woff2" crossOrigin="anonymous" href={href} />)}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(forestSchema(locale, page)).replace(/</g, '\\u003c') }} />
  </head><body className="reading-page knowledge-page" data-version="2.5.7" data-page={page.kind}>
    <a className="skip-content" href="#reading"><span data-nosnippet="">{messages[locale].skipContent}</span></a>
    <header className="reading-header"><a className="brand" href={localePath(locale)} aria-label={messages[locale].homeLabel}><img src="/brand-mark.svg" alt="" width="40" height="40" /><img className="brand-wordmark" src="/brand-wordmark.svg" alt="pie.pe" width="64" height="34" /></a><nav className="reading-languages" aria-label={messages[locale].language}>{(['lv', 'en'] as const).map(lang => <a key={lang} lang={lang} hrefLang={lang} href={forestPath(lang, page)} aria-current={lang === locale ? 'page' : undefined}><span data-nosnippet="">{lang.toUpperCase()}</span></a>)}</nav></header>
    <main id="reading" tabIndex={-1} className={`reading-main ${page.kind === 'note' ? '' : 'knowledge-wide'}`}>{renderContent(locale, page)}<footer className="reading-return"><a href={localePath(locale)}>{t.forest} <Arrow /></a></footer></main>
  </body></html>)
}
