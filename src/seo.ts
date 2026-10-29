import { localePath, messages } from './i18n'
import type { Locale } from './i18n'
export function structuredData(locale: Locale) {
  const url = `https://pie.pe${localePath(locale)}`
  return { '@context': 'https://schema.org', '@type': 'WebPage', '@id': `${url}#webpage`, name: messages[locale].title, description: messages[locale].description, url, inLanguage: locale,
    isPartOf: { '@type': 'WebSite', '@id': 'https://pie.pe/#website', name: 'PIE.PE', url: 'https://pie.pe/', description: messages.lv.description, inLanguage: ['lv', 'en'] } }
}
export function updateMetadata(locale: Locale) {
  const t = messages[locale], url = `https://pie.pe${localePath(locale)}`
  document.documentElement.lang = locale; document.title = t.title
  const values: Record<string, string> = { 'meta[name="description"]': t.description, 'meta[property="og:image:alt"]': t.wallpaperAltDesktop, 'meta[property="og:title"]': t.title, 'meta[property="og:description"]': t.description, 'meta[property="og:url"]': url, 'meta[property="og:locale"]': locale === 'lv' ? 'lv_LV' : 'en_GB', 'meta[property="og:locale:alternate"]': locale === 'lv' ? 'en_GB' : 'lv_LV', 'meta[name="twitter:image:alt"]': t.wallpaperAltDesktop, 'meta[name="twitter:title"]': t.title, 'meta[name="twitter:description"]': t.description }
  for (const [selector, value] of Object.entries(values)) document.querySelector(selector)?.setAttribute('content', value)
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', url)
  const data = document.querySelector('script[type="application/ld+json"]'); if (data) data.textContent = JSON.stringify(structuredData(locale))
}
