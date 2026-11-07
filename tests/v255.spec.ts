import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'
import { messages } from '../src/i18n'
import type { Locale } from '../src/i18n'

async function head(page: Page, locale: Locale) {
  const t = messages[locale], url = `https://pie.pe${locale === 'lv' ? '/' : '/en/'}`
  await expect(page.locator('html')).toHaveAttribute('lang', locale)
  await expect(page).toHaveTitle(t.title)
  for (const [selector, content] of Object.entries({
    'meta[name="description"]': t.description,
    'meta[property="og:title"]': t.title, 'meta[property="og:description"]': t.description,
    'meta[property="og:url"]': url, 'meta[property="og:locale"]': locale === 'lv' ? 'lv_LV' : 'en_GB',
    'meta[property="og:locale:alternate"]': locale === 'lv' ? 'en_GB' : 'lv_LV',
    'meta[property="og:image"]': 'https://pie.pe/social-preview.jpg', 'meta[property="og:image:alt"]': t.wallpaperAltDesktop,
    'meta[name="twitter:title"]': t.title, 'meta[name="twitter:description"]': t.description,
    'meta[name="twitter:image"]': 'https://pie.pe/social-preview.jpg', 'meta[name="twitter:image:alt"]': t.wallpaperAltDesktop,
  })) {
    await expect(page.locator(selector)).toHaveCount(1)
    await expect(page.locator(selector)).toHaveAttribute('content', content)
  }
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', url)
  await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(3)
  for (const [lang, href] of Object.entries({ lv: 'https://pie.pe/', en: 'https://pie.pe/en/', 'x-default': 'https://pie.pe/' })) {
    await expect(page.locator(`link[hreflang="${lang}"]`)).toHaveAttribute('href', href)
  }
  const script = page.locator('script[type="application/ld+json"]')
  await expect(script).toHaveCount(1)
  const schema = JSON.parse((await script.textContent())!)
  expect(schema).toMatchObject({ '@context': 'https://schema.org', '@type': 'WebPage', '@id': `${url}#webpage`, url, inLanguage: locale, name: t.title, description: t.description })
  expect(schema.isPartOf).toMatchObject({ '@type': 'WebSite', '@id': 'https://pie.pe/#website', url: 'https://pie.pe/', name: 'PIE.PE', inLanguage: ['lv', 'en'], description: messages.lv.description })
}

for (const locale of ['lv', 'en'] as const) {
  const path = locale === 'lv' ? '/' : '/en/', t = messages[locale]
  test(`2.5.5 ${locale}: initial HTML exposes search intent, factual copy and crawlable images without hydration`, async ({ browser, request }) => {
    const response = await request.get(path), raw = await response.text()
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('text/html')
    expect(response.headers()['x-robots-tag'] || '').not.toMatch(/noindex|none/i)
    expect(raw).not.toMatch(/name="robots"[^>]*content="[^"]*(?:noindex|none)/i)
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } })
    try {
      const page = await context.newPage(); await page.goto(path)
      await head(page, locale)
      await expect(page.locator('.world')).toHaveClass(/prerendered/)
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('h1')).toHaveAccessibleName('pie.pe')
      await expect(page.getByRole('heading', { name: t.factsTitle, exact: true })).toBeVisible()
      await expect(page.locator('.facts-context p').first()).toHaveText(t.factsDefinition)
      const topic = locale === 'lv' ? /kas ir piepe/i : /what is a bracket fungus/i
      expect(t.title).toMatch(topic)
      expect(t.description).toMatch(locale === 'lv' ? /piepes uz kokiem.*sēņotni/ : /bracket fungi.*shelf fungi.*mycelium/)
      if (locale === 'en') await expect(page.locator('.facts-context')).toContainText('also called a shelf fungus')
      for (const [lang, href] of [['LV', '/'], ['EN', '/en/']]) await expect(page.locator('.site-header').getByRole('link', { name: lang, exact: true })).toHaveAttribute('href', href)
      const images = page.locator('.wallpaper-choices img')
      await expect(images).toHaveCount(2)
      for (const [index, alt] of [t.wallpaperAltDesktop, t.wallpaperAltPhone].entries()) {
        await expect(images.nth(index)).toHaveAttribute('alt', alt)
        await expect(images.nth(index)).toHaveAttribute('src', /^\/wallpapers\/previews\/.+\.webp/)
        expect(Number(await images.nth(index).getAttribute('width'))).toBeGreaterThan(0)
        expect(Number(await images.nth(index).getAttribute('height'))).toBeGreaterThan(0)
        await expect(images.nth(index)).toHaveAttribute('loading', 'lazy')
      }
      expect((await request.get('/social-preview.jpg')).status()).toBe(200)
      const note = await (await request.get(`/field-note-${locale}.txt`)).text()
      expect(note).toContain(t.factsDefinition)
    } finally { await context.close() }
  })

  test(`2.5.5 ${locale}: sharing metadata stays localized through note collection, locale change and browser history`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto(path)
    await expect(page.locator('.world')).not.toHaveClass(/prerendered/)
    await head(page, locale)
    await page.getByRole('button', { name: t.closer, exact: true }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByRole('tab', { name: new RegExp(t.observations[0].label) }).press('End')
    const download = page.waitForEvent('download')
    await page.getByRole('link', { name: t.keepNote, exact: false }).click()
    expect((await download).suggestedFilename()).toBe(`piepe-field-note-001-${locale}.txt`)
    await expect(page.getByRole('dialog').getByRole('status')).toContainText(t.collected)
    const other: Locale = locale === 'lv' ? 'en' : 'lv'
    await page.getByRole('dialog').getByRole('link', { name: other.toUpperCase(), exact: true }).click()
    await head(page, other)
    await expect(page.locator('.encounter-status')).toHaveText(messages[other].collectedShort)
    await page.goBack(); await head(page, locale)
    await page.getByRole('button', { name: t.closeDiscovery }).click()
    await expect(page.getByRole('dialog')).not.toBeVisible()
    await expect(page.getByRole('button', { name: t.closer, exact: true })).toBeFocused()
  })
}
