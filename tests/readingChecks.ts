import { expect } from '@playwright/test'
import type { Page } from '@playwright/test'
import { localePath, readingPath } from '../src/i18n'
import type { Locale } from '../src/i18n'
import { readings, readingSources } from '../src/reading'

export async function checkReading(page: Page, locale: Locale) {
  const t = readings[locale], url = 'https://pie.pe' + readingPath(locale)
  await expect(page.locator('html')).toHaveAttribute('lang', locale)
  await expect(page).toHaveTitle(t.title)
  await expect(page.locator('body')).toHaveAttribute('data-version', '2.5.6')
  await expect(page.locator('h1')).toHaveCount(1)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(t.heading)
  await expect(page.locator('.reading-lead')).toContainText(t.lead)
  await expect(page.locator('.reading-lead')).toBeVisible()
  await expect(page.locator('.reading-section')).toHaveCount(6)
  for (const section of t.sections) {
    await expect(page.getByRole('heading', { name: section.heading, exact: true })).toHaveCount(1)
    for (const paragraph of section.paragraphs) await expect(page.locator('.reading-main')).toContainText(paragraph)
  }
  await expect(page.locator('.reading-art-note')).toHaveText(t.artNote)
  await expect(page.locator('.reading-sources li')).toHaveCount(3)
  for (const source of readingSources) await expect(page.locator(`#source-${source.id} a`)).toHaveAttribute('href', source.url)
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', t.description)
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', url)
  await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(3)
  for (const [lang, path] of [['lv', readingPath('lv')], ['en', readingPath('en')], ['x-default', readingPath('lv')]]) await expect(page.locator(`link[hreflang="${lang}"]`)).toHaveAttribute('href', 'https://pie.pe' + path)
  for (const [property, value] of Object.entries({ 'og:title': t.title, 'og:description': t.description, 'og:url': url, 'og:image:alt': t.imageAlt, 'og:locale': locale === 'lv' ? 'lv_LV' : 'en_GB' })) await expect(page.locator(`meta[property="${property}"]`)).toHaveAttribute('content', value)
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', t.title)
  await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', t.description)
  await expect(page.locator('meta[name="twitter:image:alt"]')).toHaveAttribute('content', t.imageAlt)
  const script = page.locator('script[type="application/ld+json"]')
  await expect(script).toHaveCount(1)
  const data = JSON.parse((await script.textContent())!)
  expect(data).toMatchObject({ '@context': 'https://schema.org', '@type': 'WebPage', '@id': url + '#webpage', url, name: t.title, description: t.description, inLanguage: locale, about: { '@type': 'Thing', name: t.topic }, isPartOf: { '@type': 'WebSite', '@id': 'https://pie.pe/#website', url: 'https://pie.pe/', name: 'PIE.PE' } })
  expect(JSON.stringify(data)).not.toMatch(/FAQPage|Organization|Person|AggregateRating|VideoObject|datePublished|reviewedBy/)
  await expect(page.locator('#root, .world, video, audio, script:not([type="application/ld+json"])')).toHaveCount(0)
  await expect(page.locator('.reading-return>a')).toHaveAttribute('href', localePath(locale))
  for (const lang of ['lv', 'en'] as const) await expect(page.locator(`.reading-languages a[lang="${lang}"]`)).toHaveAttribute('href', readingPath(lang))
}
