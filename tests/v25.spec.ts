import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { messages } from '../src/i18n'

test('real sitemap and robots assets describe exactly the two crawlable canonical pages', async ({ page, request }) => {
  const sitemap = await request.get('/sitemap.xml'), robots = await request.get('/robots.txt')
  expect(sitemap.status()).toBe(200); expect(sitemap.headers()['content-type']).toContain('application/xml')
  expect(robots.status()).toBe(200); expect(robots.headers()['content-type']).toContain('text/plain')
  const xml = await sitemap.text(), text = await robots.text()
  expect(xml).toBe(await readFile('dist/sitemap.xml', 'utf8'))
  expect(xml).toBe(await readFile('public/sitemap.xml', 'utf8'))
  expect(text).toBe(await readFile('dist/robots.txt', 'utf8'))
  const parsed = await page.evaluate(source => {
    const doc = new DOMParser().parseFromString(source, 'application/xml')
    return { errors: doc.getElementsByTagName('parsererror').length, entries: [...doc.getElementsByTagNameNS('http://www.sitemaps.org/schemas/sitemap/0.9', 'url')].map(node => ({
      url: node.getElementsByTagNameNS('http://www.sitemaps.org/schemas/sitemap/0.9', 'loc')[0].textContent,
      alternates: [...node.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'link')].map(link => ({ rel: link.getAttribute('rel'), lang: link.getAttribute('hreflang'), href: link.getAttribute('href') })),
    })) }
  }, xml)
  expect(parsed.errors).toBe(0)
  expect(parsed.entries.map(entry => entry.url)).toEqual(['https://pie.pe/', 'https://pie.pe/en/'])
  for (const entry of parsed.entries) {
    expect(entry.alternates).toEqual([{ rel: 'alternate', lang: 'lv', href: 'https://pie.pe/' }, { rel: 'alternate', lang: 'en', href: 'https://pie.pe/en/' }, { rel: 'alternate', lang: 'x-default', href: 'https://pie.pe/' }])
    const response = await request.get(new URL(entry.url!).pathname)
    expect(response.status()).toBe(200); expect(response.headers()['x-robots-tag'] || '').not.toMatch(/noindex|none/i)
    expect(await response.text()).toContain(`rel="canonical" href="${entry.url}"`)
  }
  expect(text.trim().split(/\r?\n/)).toEqual(['User-agent: *', 'Allow: /', 'Sitemap: https://pie.pe/sitemap.xml'])
  expect(xml).not.toMatch(/<(?:lastmod|priority|changefreq)>/)
  expect((await request.get('/not-a-real-page')).status()).toBe(404)
})

for (const locale of ['lv', 'en'] as const) {
  const path = locale === 'lv' ? '/' : '/en/', t = messages[locale]
  test(`${locale}: useful educational copy is visible without JavaScript and agrees with the downloaded note`, async ({ browser, request }) => {
    const response = await request.get(path), html = await response.text()
    expect(html).toContain(`<html lang="${locale}"`)
    expect(html).not.toMatch(/name="robots"[^>]*content="[^"]*(?:noindex|none)/i)
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 664 } })
    try {
      const page = await context.newPage(); await page.goto(path)
      const facts = page.locator('main #fungus-facts'), paragraphs = facts.locator('.facts-context p')
      await expect(paragraphs).toHaveCount(2)
      await expect(paragraphs.first()).toHaveText(t.factsDefinition)
      await expect(paragraphs.last()).toHaveText(t.factsContext)
      for (const paragraph of await paragraphs.all()) await expect(paragraph).toBeVisible()
      await expect(facts.getByRole('heading', { name: t.factsTitle })).toBeVisible()
      await expect(facts.locator('.art-note')).toHaveText(t.artNote)
      expect(await page.locator('#forest').innerText()).not.toContain(t.factsDefinition)
      const newCopy = [t.factsDefinition, t.factsContext, t.facts[0].text].join(' ')
      const words = newCopy.match(/\p{L}+(?:[’'-]\p{L}+)*|\d+/gu)!.length
      expect(words).toBeGreaterThanOrEqual(80); expect(words).toBeLessThanOrEqual(150)
      const note = await (await request.get(`/field-note-${locale}.txt`)).text()
      expect(note).toContain(t.factsDefinition); expect(note).toContain(t.factsContext)
      for (const observation of t.observations) expect(note).toContain(observation.text)
      for (const fact of t.facts) expect(note).toContain(fact.text)
      expect(note).toBe(await readFile(`public/field-note-${locale}.txt`, 'utf8'))
    } finally { await context.close() }
  })

  test(`${locale}: one connected schema keeps stable site identity through locale and note-state changes`, async ({ page, request }) => {
    const html = await (await request.get(path)).text(), scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    expect(scripts).toHaveLength(1)
    const initial = JSON.parse(scripts[0][1]), site = initial.isPartOf, url = `https://pie.pe${path}`
    expect(initial['@context']).toBe('https://schema.org'); expect(initial['@type']).toBe('WebPage')
    expect(initial['@id']).toBe(`${url}#webpage`); expect(initial.url).toBe(url); expect(initial.inLanguage).toBe(locale)
    expect(initial.name).toBe(t.title); expect(initial.description).toBe(t.description)
    expect(site).toMatchObject({ '@type': 'WebSite', '@id': 'https://pie.pe/#website', name: 'PIE.PE', url: 'https://pie.pe/', inLanguage: ['lv', 'en'], description: messages.lv.description })
    const types: string[] = []
    const visit = (value: unknown) => { if (value && typeof value === 'object') { for (const [key, item] of Object.entries(value)) { if (key === '@type') types.push(String(item)); else visit(item) } } }
    visit(initial); expect(types.sort()).toEqual(['WebPage', 'WebSite'])
    const csp = await readFile('dist/_headers', 'utf8')
    expect(csp).toContain(`'sha256-${createHash('sha256').update(scripts[0][1]).digest('base64')}'`)
    await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto(path)
    await page.waitForFunction(() => !document.querySelector('.world')!.classList.contains('prerendered'))
    await expect(page.locator('.encounter-status')).toHaveText(t.waiting)
    await page.getByRole('button', { name: t.closer, exact: true }).click()
    await expect(page.locator('.encounter-status')).toHaveText(t.discoveredShort)
    const other = locale === 'lv' ? 'en' : 'lv'
    await page.getByRole('dialog').getByRole('link', { name: other.toUpperCase(), exact: true }).click()
    await expect(page.locator('html')).toHaveAttribute('lang', other)
    await expect(page.locator('.encounter-status')).toHaveText(messages[other].discoveredShort)
    const json = page.locator('script[type="application/ld+json"]')
    await expect(json).toHaveCount(1)
    const updated = JSON.parse((await json.textContent())!)
    expect(updated['@id']).toBe(`https://pie.pe${other === 'lv' ? '/' : '/en/'}#webpage`)
    expect(updated.inLanguage).toBe(other); expect(updated.isPartOf).toEqual(site)
    for (const selector of ['link[rel=canonical]', 'meta[property="og:title"]', 'meta[name="twitter:title"]', 'meta[name="twitter:image:alt"]']) await expect(page.locator(selector)).toHaveCount(1)
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', messages[other].title)
    await page.goBack(); await expect(page.locator('html')).toHaveAttribute('lang', locale)
    expect(JSON.parse((await json.textContent())!)['@id']).toBe(initial['@id'])
  })

  test(`${locale}: educational reading fits desktop and small phones without hiding copy or changing the hero`, async ({ page }) => {
    const errors: string[] = []; page.on('pageerror', error => errors.push(error.message))
    await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto(path + '#fungus-facts')
    await page.waitForFunction(() => !document.querySelector('.world')!.classList.contains('prerendered'))
    await page.evaluate(() => document.fonts.ready)
    for (const [width, height] of [[1512, 982], [390, 844], [390, 664], [320, 690]]) {
      await page.setViewportSize({ width, height })
      await page.locator('.facts-context').scrollIntoViewIfNeeded()
      for (const paragraph of await page.locator('.facts-context p').all()) {
        await expect(paragraph).toBeVisible()
        const bounds = await paragraph.boundingBox()
        expect(bounds!.x).toBeGreaterThanOrEqual(0); expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width)
        expect(await paragraph.evaluate(e => parseFloat(getComputedStyle(e).fontSize))).toBeGreaterThanOrEqual(16)
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    }
    await expect(page.locator('.hero-deck')).toHaveText(t.heroThought)
    await expect(page.locator('#hero-title')).toHaveAccessibleName('pie.pe')
    await page.locator('.fungus-vocabulary summary').focus(); await page.keyboard.press('Enter')
    await expect(page.locator('.vocabulary-note')).toBeVisible()
    expect(errors).toEqual([])
  })
}
