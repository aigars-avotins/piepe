import { localePath, messages } from './i18n'
import type { Locale } from './i18n'
import { contentModified, siteOrigin, siteRoute, socialImage } from './routes'
import type { RouteKey } from './routes'
import { aboutPath } from './routes'
import { siteCopy } from './siteCopy'
import { films } from './films'

// IPTC's term for media made by a trained model; schema.org carries it as digitalSourceType.
export const aiMade = 'https://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia'
export const publisher = { '@type': 'Organization', '@id': `${siteOrigin}/#publisher`, name: 'PIE.PE', url: `${siteOrigin}/`, logo: { '@type': 'ImageObject', url: `${siteOrigin}/icon-512.png`, width: 512, height: 512 } }
const website = { '@type': 'WebSite', '@id': `${siteOrigin}/#website`, name: 'PIE.PE', alternateName: 'pie.pe', url: `${siteOrigin}/`, description: messages.lv.description, inLanguage: ['lv', 'en'], publisher: { '@id': publisher['@id'] } }

/** Every page is one WebPage node, part of the same WebSite, with its own social image and dates. */
export function pageSchema(key: RouteKey, locale: Locale, name: string, description: string) {
  const route = siteRoute(key), url = siteOrigin + route.paths[locale]
  return { '@context': 'https://schema.org', '@type': 'WebPage', '@id': `${url}#webpage`, name, description, url, inLanguage: locale, datePublished: route.published, dateModified: route.modified,
    primaryImageOfPage: { '@type': 'ImageObject', url: siteOrigin + socialImage(key, locale), width: 1200, height: 630 }, isPartOf: website }
}
/** The written piece on a reading page: its own words carry their own modification date. */
export function articleSchema(key: RouteKey, locale: Locale, headline: string, description: string) {
  const route = siteRoute(key), url = siteOrigin + route.paths[locale]
  return { '@type': 'Article', '@id': `${url}#article`, headline, description, inLanguage: locale, datePublished: route.published, dateModified: contentModified(key),
    image: siteOrigin + socialImage(key, locale), author: { '@id': publisher['@id'] }, publisher, mainEntityOfPage: { '@id': `${url}#webpage` } }
}
export function structuredData(locale: Locale) {
  const t = messages[locale], about = siteCopy[locale].about.films
  return { ...pageSchema('home', locale, t.title, t.description),
    video: films.map((film, index) => ({ '@type': 'VideoObject', name: `PIE.PE — ${about.items[index].name}`, description: about.items[index].text, inLanguage: locale,
      contentUrl: siteOrigin + film.file, thumbnailUrl: siteOrigin + film.still, uploadDate: film.uploaded, duration: `PT${film.seconds}S`, digitalSourceType: aiMade,
      creator: { '@id': publisher['@id'] }, subjectOf: { '@type': 'WebPage', '@id': siteOrigin + aboutPath(locale) + '#webpage' } })) }
}
export function updateMetadata(locale: Locale) {
  const t = messages[locale], url = `https://pie.pe${localePath(locale)}`, image = siteOrigin + socialImage('home', locale)
  document.documentElement.lang = locale; document.title = t.title
  const values: Record<string, string> = { 'meta[name="description"]': t.description, 'meta[property="og:image"]': image, 'meta[name="twitter:image"]': image, 'meta[property="og:image:alt"]': t.wallpaperAltDesktop, 'meta[property="og:title"]': t.title, 'meta[property="og:description"]': t.description, 'meta[property="og:url"]': url, 'meta[property="og:locale"]': locale === 'lv' ? 'lv_LV' : 'en_GB', 'meta[property="og:locale:alternate"]': locale === 'lv' ? 'en_GB' : 'lv_LV', 'meta[name="twitter:image:alt"]': t.wallpaperAltDesktop, 'meta[name="twitter:title"]': t.title, 'meta[name="twitter:description"]': t.description }
  for (const [selector, value] of Object.entries(values)) document.querySelector(selector)?.setAttribute('content', value)
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', url)
  const data = document.querySelector('script[type="application/ld+json"]'); if (data) data.textContent = JSON.stringify(structuredData(locale))
}
