import { localePath, readingPath } from './i18n'
import type { Locale } from './i18n'
import { fieldNotesPath, noteNumbers, notePath, wallpapersPath } from './forestPaths'
import type { NoteNumber } from './forestPaths'
import { releaseDate } from './release'

/** The one route table: pages, sitemap, social images and structured data are all generated from it. */
export type RouteKey = 'home' | 'guide' | 'wallpapers' | 'notes' | `note-${NoteNumber}` | 'about'
export type SiteRoute = { key: RouteKey; paths: Record<Locale, string>; published: string; modified: string }
export const aboutPath = (locale: Locale) => locale === 'lv' ? '/par-pie-pe/' : '/en/about/'
const pair = (path: (locale: Locale) => string) => ({ lv: path('lv'), en: path('en') })
// Dates are the repository's own history: first publication of each page and the last change to
// its content. A release that changes every page (3.3: navigation, footer, metadata) moves `modified`.
const content: Record<RouteKey, [published: string, contentModified: string]> = {
  home: ['2026-10-27', '2026-11-16'], guide: ['2026-11-06', '2026-11-13'], wallpapers: ['2026-11-06', '2026-11-14'], notes: ['2026-11-06', '2026-11-14'],
  'note-001': ['2026-11-06', '2026-11-06'], 'note-002': ['2026-11-06', '2026-11-06'], 'note-003': ['2026-11-06', '2026-11-06'],
  'note-004': ['2026-11-06', '2026-11-06'], 'note-005': ['2026-11-06', '2026-11-13'], 'note-006': ['2026-11-06', '2026-11-06'],
  about: [releaseDate, releaseDate],
}
const route = (key: RouteKey, paths: Record<Locale, string>): SiteRoute => ({ key, paths, published: content[key][0], modified: releaseDate > content[key][1] ? releaseDate : content[key][1] })
export const siteRoutes: SiteRoute[] = [
  route('home', pair(localePath)), route('guide', pair(readingPath)), route('wallpapers', pair(wallpapersPath)), route('notes', pair(fieldNotesPath)),
  ...noteNumbers.map(number => route(`note-${number}`, pair(locale => notePath(locale, number)))),
  route('about', pair(aboutPath)),
]
export const siteRoute = (key: RouteKey) => siteRoutes.find(item => item.key === key)!
/** When the page's own words last changed (Article dateModified), as distinct from the sitemap's lastmod. */
export const contentModified = (key: RouteKey) => content[key][1]
export const socialImage = (key: RouteKey, locale: Locale) => `/og/${key}-${locale}.jpg`
export const siteOrigin = 'https://pie.pe'

export function renderSitemap() {
  const urls = siteRoutes.flatMap(item => (['lv', 'en'] as const).map(locale => `  <url><loc>${siteOrigin}${item.paths[locale]}</loc><lastmod>${item.modified}</lastmod>` +
    `<xhtml:link rel="alternate" hreflang="lv" href="${siteOrigin}${item.paths.lv}"/><xhtml:link rel="alternate" hreflang="en" href="${siteOrigin}${item.paths.en}"/><xhtml:link rel="alternate" hreflang="x-default" href="${siteOrigin}${item.paths.lv}"/></url>`))
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`
}
