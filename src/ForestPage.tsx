import SiteLink from './SiteLink'
import { releaseVersion, releaseMilestone } from './release'
import { renderToStaticMarkup } from 'react-dom/server'
import { localePath, messages, readingPath } from './i18n'
import type { Locale } from './i18n'
import { aiMade, articleSchema, pageSchema, publisher } from './seo'
import { DocumentHead } from './documentHead'
import { AttentionLight, SiteFooter, SiteMenu } from './SiteChrome'
import { aboutPath } from './routes'
import type { RouteKey } from './routes'
import { collectionCopy, fieldNote, forestSources } from './forestKnowledge'
import type { ForestSource } from './forestKnowledge'
import { fieldNotesPath, forestPath, forestPages, noteNumbers, notePath, wallpapersPath } from './forestPaths'
import type { ForestPage } from './forestPaths'
import Arrow from './Arrow'
import { renderTimeCapsule } from './ReadingExperiences'
import { wallpaperDesigns, wallpaperAsset, wallpaperLabels } from './wallpapers'

const origin = 'https://pie.pe'
const routeKey = (page: ForestPage): RouteKey => page.kind === 'note' ? `note-${page.number}` : page.kind === 'wallpapers' ? 'wallpapers' : 'notes'
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
  const base = pageSchema(routeKey(page), locale, meta.title, meta.description)
  const licence = { license: origin + aboutPath(locale) + '#wallpapers', acquireLicensePage: url, creditText: 'PIE.PE', copyrightNotice: 'PIE.PE', creator: { '@id': publisher['@id'] }, digitalSourceType: aiMade }
  if (page.kind === 'index') return { ...base, '@type': 'CollectionPage', mainEntity: { '@type': 'ItemList', itemListElement: noteNumbers.map((number, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'WebPage', '@id': origin + notePath(locale, number) + '#webpage', url: origin + notePath(locale, number), name: fieldNote(locale, number).heading } })) } }
  if (page.kind === 'wallpapers') return { ...base, image: [
    { '@type': 'ImageObject', contentUrl: origin + wallpaperFiles.desktop5k, thumbnailUrl: origin + '/wallpapers/previews/desktop.webp', width: 5120, height: 2880, encodingFormat: 'image/jpeg', caption: t.desktopCaption, ...licence },
    { '@type': 'ImageObject', contentUrl: origin + wallpaperFiles.phone, thumbnailUrl: origin + '/wallpapers/previews/mobile.webp', width: 1440, height: 3120, encodingFormat: 'image/jpeg', caption: t.phoneCaption, ...licence },
    ...wallpaperDesigns.flatMap(design=>(['desktop','mobile'] as const).map(device=>{
      const asset=wallpaperAsset(design.id,device)
      return {'@type':'ImageObject',name:design.title[locale],caption:device==='desktop'?design.desktopAlt[locale]:design.mobileAlt[locale],contentUrl:origin+asset.url,thumbnailUrl:origin+asset.preview,width:asset.width,height:asset.height,encodingFormat:'image/jpeg',...licence,isBasedOn:{'@type':'ImageObject',contentUrl:origin+asset.original,width:asset.originalWidth,height:asset.originalHeight,encodingFormat:'image/png'}}
    })),
  ] }
  return { ...base, mainEntity: articleSchema(routeKey(page), locale, meta.heading, meta.description), about: { '@type': 'Thing', name: meta.heading }, breadcrumb: { '@type': 'BreadcrumbList', '@id': url+'#breadcrumb', itemListElement: [
    { '@type': 'ListItem', position: 1, name: t.allNotes, item: origin+fieldNotesPath(locale) },
    { '@type': 'ListItem', position: 2, name: `${t.noteLabel} ${page.number}`, item: url },
  ] } }
}

const scientificNames = /\b(Inonotus obliquus|Fomitopsis betulina|Piptoporus betulinus|Laetiporus sulphureus|Fomes fomentarius|Fomitopsis pinicola|Ganoderma applanatum|Ganoderma lucidum|Ganoderma lingzhi)\b/g
function scientific(text: string) {
  return text.split(scientificNames).map((part, i) => i % 2 ? <i key={i} lang="la">{part}</i> : part)
}
function renderContent(locale: Locale, page: ForestPage) {
  const t = collectionCopy[locale], meta = forestMetadata(locale, page)
  const links = <nav className="knowledge-links" aria-label={t.related}>{page.kind !== 'index' && <SiteLink href={fieldNotesPath(locale)}>{t.allNotes}</SiteLink>}<SiteLink href={readingPath(locale)}>{t.guide}</SiteLink>{page.kind !== 'wallpapers' && <SiteLink href={wallpapersPath(locale)}>{t.wallpapers}</SiteLink>}</nav>
  if (page.kind === 'wallpapers') return <>
    <header className="knowledge-intro"><p className="reading-label">PIE.PE</p><h1>{meta.heading}</h1><p className="reading-lead">{meta.lead}</p></header>
    <div className="knowledge-gallery">
      <article><img src="/wallpapers/previews/desktop.webp" alt={t.desktopAlt} width="800" height="450" fetchPriority="high" /><h2>{messages[locale].desktop}</h2><p>{t.desktopCaption}</p><div className="knowledge-downloads"><SiteLink href={wallpaperFiles.desktop5k} download>{messages[locale].download5k} <span>5120 × 2880 · JPG</span></SiteLink><SiteLink href={wallpaperFiles.desktop4k} download>{messages[locale].download4k} <span>3840 × 2160 · JPG</span></SiteLink></div></article>
      <article><img className="knowledge-phone" src="/wallpapers/previews/mobile.webp" alt={t.phoneAlt} width="369" height="800" loading="lazy" decoding="async" /><h2>{messages[locale].phone}</h2><p>{t.phoneCaption}</p><div className="knowledge-downloads"><SiteLink href={wallpaperFiles.phone} download>{messages[locale].downloadPhone} <span>1440 × 3120 · JPG</span></SiteLink></div></article>
    </div>
    {wallpaperDesigns.map(design=><section key={design.id} id={design.id} className="wallpaper-design" aria-labelledby={`${design.id}-title`}>
      <h2 id={`${design.id}-title`}>{design.title[locale]}</h2><p className="wallpaper-design-lead">{design.description[locale]}</p>
      <div className="knowledge-gallery">{(['desktop','mobile'] as const).map(device=>{
        const asset=wallpaperAsset(design.id,device),phone=device==='mobile'
        return <article key={device}><img className={phone?'knowledge-phone':undefined} src={asset.preview} width={asset.previewWidth} height={asset.previewHeight} alt={phone?design.mobileAlt[locale]:design.desktopAlt[locale]} loading="lazy" decoding="async" />
          <h3>{phone?messages[locale].phone:messages[locale].desktop}</h3><div className="knowledge-downloads"><SiteLink href={asset.url} download>{phone?messages[locale].downloadPhone:messages[locale].download5k}<span>{asset.width} × {asset.height} · JPG</span></SiteLink></div>
          <SiteLink className="wallpaper-original" href={asset.original} download>{wallpaperLabels[locale].original}<span>{asset.originalWidth} × {asset.originalHeight}</span></SiteLink>
        </article>
      })}</div>
    </section>)}
    <aside className="reading-art-note"><p>{t.artDisclosure}</p><p>{t.resolutionNote}</p></aside>
    <section className="reading-section"><h2>{t.saveHeading}</h2><p>{t.saveText}</p></section>{links}
  </>
  if (page.kind === 'index') return <>
    <header className="knowledge-intro"><p className="reading-label">PIE.PE</p><h1>{meta.heading}</h1><p className="reading-lead">{meta.lead}</p></header>
    <ol className="knowledge-index">{noteNumbers.map(number => { const note = fieldNote(locale, number); return <li key={number}><article><SiteLink href={notePath(locale, number)}><span className="reading-label">{number}</span><h2>{note.heading}</h2><p>{note.motif}</p><span aria-hidden="true" className="knowledge-card-arrow"><Arrow /></span></SiteLink></article></li> })}</ol>
    {links}
  </>
  const note = fieldNote(locale, page.number), sourceIds = [...new Set(note.sections.flatMap(section => section.sources || []))]
  const citations = (sources: ForestSource[] = []) => sources.length > 0 && <span className="reading-citations">{sources.map(id => <SiteLink key={id} href={`#source-${id}`} aria-label={`${t.sources}: ${forestSources[id].name}`}>[{sourceIds.indexOf(id) + 1}]</SiteLink>)}</span>
  return <>
    <nav className="knowledge-trail" aria-label={t.allNotes}><SiteLink href={fieldNotesPath(locale)}>{t.allNotes}</SiteLink><span aria-current="page">/ {t.noteLabel} {page.number}</span></nav>
    <article>
      <header className="reading-intro"><p className="reading-label">{t.noteLabel} {page.number}</p><h1>{meta.heading}</h1><p className="knowledge-motif">{note.motif}</p><p className="reading-lead">{scientific(note.lead)}</p></header>
      {page.number==='005'&&renderTimeCapsule(locale)}
      {note.sections.map((section, i) => <section className="reading-section knowledge-note-section" key={i} aria-labelledby={`observation-${i}`}>
        {section.label && <p className="reading-label">0{i + 1} / {section.label}</p>}<h2 id={`observation-${i}`}>{scientific(section.heading)}</h2>
        {section.paragraphs.map(p => <p key={p}>{scientific(p)}</p>)}{section.footnote && <p className="knowledge-footnote">{section.footnote}</p>}{citations(section.sources)}
      </section>)}
      <aside className="knowledge-care"><p className="reading-label">{t.observation}</p><p>{note.care}</p></aside>
      {page.number === '001' ? <section className="reading-sources"><h2>{t.sources}</h2><p>{t.originalContext}</p><SiteLink className="knowledge-original" href={`/field-note-${locale}.txt`} download>{t.original} <Arrow /></SiteLink><p><SiteLink href={readingPath(locale)}>{t.guide}</SiteLink></p></section> : <section className="reading-sources" aria-labelledby="source-title"><h2 id="source-title">{t.sources}</h2><ol>{sourceIds.map(id => <li id={`source-${id}`} key={id} tabIndex={-1}><SiteLink href={forestSources[id].url}>{forestSources[id].name}</SiteLink></li>)}</ol></section>}
      <aside className="reading-art-note"><p>{t.cinemaDisclosure}</p></aside>
    </article>
    <nav className="knowledge-related" aria-labelledby="related-title"><h2 id="related-title">{t.related}</h2><ul>{note.related.map(number => <li key={number}><SiteLink href={notePath(locale, number)}><span>{number}</span>{fieldNote(locale, number).heading} <span aria-hidden="true"><Arrow /></span></SiteLink></li>)}</ul></nav>
    {links}
  </>
}

export function renderForestDocuments(locale: Locale, stylesheets: string[], fonts: string[], client?: string, experienceStyle?: string) {
  return forestPages.map(page => ({ path: forestPath(locale, page), html: renderForestDocument(locale, page, page.kind==='note'&&page.number==='005'&&experienceStyle?[...stylesheets,experienceStyle]:stylesheets, fonts,client) }))
}
export function renderForestDocument(locale: Locale, page: ForestPage, stylesheets: string[], fonts: string[], client?: string) {
  const t = collectionCopy[locale], meta = forestMetadata(locale, page), section = page.kind === 'wallpapers' ? 'wallpapers' : 'notes'
  return '<!doctype html>\n' + renderToStaticMarkup(<html lang={locale} className="reading-document">
    <DocumentHead route={routeKey(page)} locale={locale} title={meta.title} description={meta.description} type={page.kind === 'note' ? 'article' : 'website'} imageAlt={page.kind === 'note' ? meta.heading : t.desktopAlt} schema={forestSchema(locale, page)} stylesheets={stylesheets} fonts={fonts} client={client} />
  <body className="reading-page knowledge-page" data-version={releaseVersion} data-milestone={releaseMilestone} data-page={page.kind}>
    <AttentionLight />
    <SiteLink className="skip-content" href="#reading"><span data-nosnippet="">{messages[locale].skipContent}</span></SiteLink>
    <header className="reading-header"><SiteLink className="brand" href={localePath(locale)} aria-label={messages[locale].homeLabel}><img src="/brand-mark.svg" alt="" width="40" height="40" /><img className="brand-wordmark" src="/brand-wordmark.svg" alt="pie.pe" width="64" height="34" /></SiteLink><nav className="reading-languages" aria-label={messages[locale].language}>{(['lv', 'en'] as const).map(lang => <SiteLink key={lang} lang={lang} hrefLang={lang} href={forestPath(lang, page)} aria-current={lang === locale ? 'page' : undefined}><span data-nosnippet="">{lang.toUpperCase()}</span></SiteLink>)}</nav></header>
    <main id="reading" tabIndex={-1} className={`reading-main ${page.kind === 'note' ? '' : 'knowledge-wide'}`}>{renderContent(locale, page)}<footer className="reading-return"><SiteLink href={localePath(locale)}>{t.forest} <Arrow /></SiteLink></footer></main>
    <SiteFooter locale={locale} current={section} />
    <SiteMenu locale={locale} current={section} alternate={{ lv: forestPath('lv', page), en: forestPath('en', page) }} />
  </body></html>)
}
