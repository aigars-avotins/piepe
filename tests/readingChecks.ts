import { expect } from '@playwright/test'
import type { Page } from '@playwright/test'
import { localePath, readingPath } from '../src/i18n'
import type { Locale } from '../src/i18n'
import { readings, readingSources } from '../src/reading'
import { readFile, readdir } from 'node:fs/promises'
import { atmosphereBootstrap } from '../src/atmosphere'

export async function readingToolsEntry() {
  const files=(await readdir('dist/assets')).filter(name=>/^reading-tools-[a-f0-9]{16}\.js$/.test(name))
  expect(files).toHaveLength(1)
  return '/assets/'+files[0]
}

export async function checkReadingResources(page: Page, javaScriptEnabled: boolean) {
  const entry=await readingToolsEntry()
  const runtime=await page.evaluate(()=>performance.getEntriesByType('resource').map(e=>new URL(e.name).pathname).filter(path=>/\.(?:js|mp4|mp3|ogg)$/.test(path)))
  expect(runtime.every(path=>path===entry)).toBe(true)
  if(javaScriptEnabled){expect(runtime).toContain(entry);await expect(page.locator('[data-atmosphere-controls]')).toBeVisible()}
}

export async function checkReading(page: Page, locale: Locale, options: { cloudflareAnalytics?: boolean } = {}) {
  const t = readings[locale], url = 'https://pie.pe' + readingPath(locale)
  await expect(page.locator('html')).toHaveAttribute('lang', locale)
  await expect(page).toHaveTitle(t.title)
  await expect(page.locator('body')).toHaveAttribute('data-version', '2.5.8')
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
  await checkStaticMarkup(page, options)
  await expect(page.locator('.reading-return>a')).toHaveAttribute('href', localePath(locale))
  for (const lang of ['lv', 'en'] as const) await expect(page.locator(`.reading-languages a[lang="${lang}"]`)).toHaveAttribute('href', readingPath(lang))
}

/** Only our exact progressive module/bootstrap, plus the narrow optional CDN beacon. */
export async function checkStaticMarkup(page: Page, options: { cloudflareAnalytics?: boolean } = {}) {
  await expect(page.locator('#root, .world, video, audio')).toHaveCount(0)
  const scripts = page.locator('script:not([type="application/ld+json"])')
  const entry=await readingToolsEntry(),built=await readFile('dist'+readingPath('lv')+'index.html','utf8')
  expect(built).toContain(entry)
  // Filter rather than trust markers alone: wrong source/type/content still fails.
  const authoredBootstrap=page.locator('script[data-atmosphere-bootstrap]'),authoredModule=page.locator('script[data-reading-tools]')
  await expect(authoredBootstrap).toHaveCount(1);expect(await authoredBootstrap.textContent()).toBe(atmosphereBootstrap)
  await expect(authoredBootstrap).not.toHaveAttribute('src');expect(await authoredBootstrap.getAttribute('type')).toBeNull()
  await expect(authoredModule).toHaveCount(1);await expect(authoredModule).toHaveAttribute('type','module');await expect(authoredModule).toHaveAttribute('src',entry);expect(await authoredModule.textContent()).toBe('')
  const markup=await scripts.evaluateAll(elements=>elements.filter(e=>!e.hasAttribute('data-atmosphere-bootstrap')&&!e.hasAttribute('data-reading-tools')).map(e=>{
    const script=e as HTMLScriptElement,url=script.src?new URL(script.src):null
    return {type:script.type,source:url?.protocol==='https:'?url.origin+url.pathname:null,hasInlineContent:!!script.textContent?.trim(),hasQueryOrHash:!!(url?.search||url?.hash)}
  }))
  if(!options.cloudflareAnalytics)expect(markup).toEqual([])
  else {
    // Cloudflare may inject its analytics module at the edge. It is absent from
    // our build and blocked by the unchanged CSP. Permit only that precise
    // external resource; never permit homepage hydration or arbitrary scripts.
    expect(markup.length).toBeLessThanOrEqual(1)
    for (const script of markup) expect(script).toEqual({ type: 'module', source: expect.stringMatching(/^https:\/\/static\.cloudflareinsights\.com\/beacon\.min\.js\/v[a-f0-9]+$/), hasInlineContent: false, hasQueryOrHash: false })
  }
}
