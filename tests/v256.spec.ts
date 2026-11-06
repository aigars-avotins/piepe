import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { localePath, readingPath, messages } from '../src/i18n'
import { readings } from '../src/reading'
import { checkReading } from './readingChecks'

for (const locale of ['lv', 'en'] as const) for (const javaScriptEnabled of [false, true]) test(`2.5.6 ${locale} JS=${javaScriptEnabled}: real text-first HTML, stable article routing and responsive reading`, async ({ browser, request }, info) => {
  const response = await request.get(readingPath(locale)), html = await response.text()
  expect(response.status()).toBe(200); expect(response.headers()['content-type']).toContain('text/html')
  expect(response.headers()['x-robots-tag'] || '').not.toMatch(/noindex|none/i)
  expect(html).toContain(readings[locale].lead)
  expect(html).not.toMatch(/noindex|nosnippet|data-nosnippet|max-snippet\s*:\s*0/)
  const context = await browser.newContext({ javaScriptEnabled, viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
  try {
    const page = await context.newPage(), errors: string[] = []; page.on('pageerror', e => errors.push(e.message))
    await page.goto(readingPath(locale)); await checkReading(page, locale)
    for (const [width, height] of [[390, 844], [800, 900], [1440, 900]]) {
      await page.setViewportSize({ width, height }); await page.evaluate(() => document.fonts.ready)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      for (const box of await page.locator('h1, .reading-section p, .reading-lead, .reading-languages').evaluateAll(elements => elements.map(e => { const r = e.getBoundingClientRect(); return { x: r.x, right: r.right } }))) { expect(box.x).toBeGreaterThanOrEqual(0); expect(box.right).toBeLessThanOrEqual(width + 1) }
      expect(await page.locator('.reading-section p').first().evaluate(e => parseFloat(getComputedStyle(e).fontSize))).toBeGreaterThanOrEqual(17)
      if (javaScriptEnabled) await info.attach(`${locale}-reading-${width}`, { body: await page.screenshot({ fullPage: true, scale: 'css' }), contentType: 'image/png' })
    }
    // Waiting for stable fonts/geometry above gives any accidental homepage bootstrap
    // an opportunity to run; the route, title and full article must still be intact.
    await checkReading(page, locale)
    expect(await page.evaluate(() => performance.getEntriesByType('resource').map(e => new URL(e.name).pathname).filter(path => /\.js$|\.mp4$|\.mp3$|\.ogg$/.test(path)))).toEqual([])
    const ids = await page.locator('a[href^="#"]').evaluateAll(links => links.map(e => (e as HTMLAnchorElement).hash.slice(1)))
    for (const id of ids) await expect(page.locator(`[id="${id}"]`)).toHaveCount(1)
    const other = locale === 'lv' ? 'en' : 'lv'
    await page.locator(`.reading-languages a[lang="${other}"]`).click()
    await expect(page).toHaveURL(new RegExp(readingPath(other) + '$')); await checkReading(page, other)
    await page.goBack(); await checkReading(page, locale)
    expect(errors).toEqual([])
  } finally { await context.close() }
})

for (const locale of ['lv', 'en'] as const) test(`2.5.6 ${locale}: homepage links to its real article and returns without losing session semantics`, async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('piepe-entered', '1'))
  await page.goto(localePath(locale))
  await expect(page.locator('.world')).not.toHaveClass(/prerendered/)
  const link = page.getByRole('link', { name: messages[locale].readGuide, exact: true })
  await expect(link).toHaveAttribute('href', readingPath(locale)); await link.click(); await checkReading(page, locale)
  await page.locator('.reading-return>a').click()
  await expect(page).toHaveURL(new RegExp(localePath(locale) + '$'))
  await expect(page.locator('.world')).not.toHaveClass(/prerendered/)
  await expect(page.locator('h1')).toHaveAccessibleName('pie.pe')
  await expect(page.locator('video.forest-film')).toHaveCount(0)
  await page.getByRole('button', { name: messages[locale].replayLabel, exact: true }).click()
  await expect(page.locator('video.forest-film')).toHaveCount(1)
  await page.getByRole('button', { name: messages[locale].skipIntro, exact: true }).click()
  await expect(page.locator('video.forest-film')).toHaveCount(0)
  await expect(page.getByRole('button', { name: messages[locale].closer, exact: true })).toBeFocused()
})

test('2.5.6 static documents have matching CSP hashes and do not ship article prose in the cinema bundle', async ({ request }) => {
  const headers = await readFile('dist/_headers', 'utf8')
  const scriptPolicy = /script-src ([^;]+)/.exec(headers)![1]
  expect(scriptPolicy).not.toMatch(/unsafe-inline|unsafe-eval/)
  for (const path of ['/', '/en/', readingPath('lv'), readingPath('en')]) {
    const response = await request.get(path), html = await response.text()
    expect(response.status()).toBe(200)
    const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    expect(scripts).toHaveLength(1)
    expect(scriptPolicy).toContain(`'sha256-${createHash('sha256').update(scripts[0][1]).digest('base64')}'`)
  }
  const home = await (await request.get('/')).text(), entry = /src="(\/assets\/[^"]+\.js)"/.exec(home)![1]
  const bundle = await readFile('dist' + entry, 'utf8')
  for (const locale of ['lv', 'en'] as const) expect(bundle).not.toContain(readings[locale].lead)
  for (const path of ['/missing-article/', '/kas-ir-piepe/no-such-page/', '/en/what-is-a-bracket-fungus/missing/']) expect((await request.get(path)).status()).toBe(404)
})
