/* global document, window */
// Review screenshots for the 3.3 audit: node scripts/capture-v330.mjs <out-dir> [filter]
// Needs the QA server (node scripts/preview-worker.mjs) on 127.0.0.1:4173. Evidence only.
import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

const out = process.argv[2] || 'test-results/v330', filter = process.argv[3] || ''
const base = process.env.TEST_URL || 'http://127.0.0.1:4173'
const viewports = [[390, 844], [768, 1024], [1440, 900], [2560, 1080]].filter(([width]) => !process.env.WIDTHS || process.env.WIDTHS.split(',').includes(String(width)))
const locales = (process.env.LOCALES || 'lv,en').split(',')
const paths = {
  lv: { home: '/', guide: '/kas-ir-piepe/', notes: '/meza-piezimes/', note: '/meza-piezimes/003-serpiepe/', wallpapers: '/meza-foni/', colophon: '/par-pie-pe/' },
  en: { home: '/en/', guide: '/en/what-is-a-bracket-fungus/', notes: '/en/field-notes/', note: '/en/field-notes/003-chicken-of-the-woods/', wallpapers: '/en/forest-wallpapers/', colophon: '/en/about/' },
}
await mkdir(out, { recursive: true })
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_HEADLESS_SHELL ? undefined : 'chrome' })
const shot = async (page, name) => { if (!filter || name.includes(filter)) await page.screenshot({ path: `${out}/${name}.jpg`, type: 'jpeg', quality: 72, scale: 'css' }) }
for (const [width, height] of viewports) for (const locale of locales) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, hasTouch: width < 800, isMobile: width < 500 })
  const page = await context.newPage(), tag = `${locale}-${width}`
  const visit = async (path, settle = 900) => { const response = await page.goto(base + path, { waitUntil: 'load' }); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(settle); return response }
  const section = async id => { await page.evaluate(value => document.getElementById(value)?.scrollIntoView({ behavior: 'instant', block: 'start' }), id); await page.waitForTimeout(1600) }
  try {
    await visit(paths[locale].home, 300)
    await page.waitForTimeout(1200); await shot(page, `${tag}-home-0-first-second`)
    await page.waitForSelector('.world[data-intro-state="complete"]', { timeout: 15000 }).catch(() => {})
    await page.waitForTimeout(1800); await shot(page, `${tag}-home-1-hero`)
    if (locale === 'lv' || width === 390 || width === 1440) {
      for (const [index, id] of ['understory', 'encounter', 'fungus-facts', 'return', 'wallpapers'].entries()) { await section(id); await shot(page, `${tag}-home-${index + 2}-${id}`) }
      await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' })); await page.waitForTimeout(1200); await shot(page, `${tag}-home-7-footer`)
      await section('encounter')
      const entry = page.locator('[data-portal-entry]')
      if (await entry.count()) { await entry.click().catch(() => {}); await page.waitForTimeout(2600); await shot(page, `${tag}-home-8-portal`); await page.keyboard.press('Escape'); await page.waitForTimeout(600) }
    }
    for (const key of ['guide', 'notes', 'note', 'wallpapers', 'colophon']) {
      const response = await visit(paths[locale][key])
      if (key === 'colophon' && response?.status() === 404) continue
      await shot(page, `${tag}-${key}-top`)
      if (key === 'guide') { await section('surface-atlas'); await shot(page, `${tag}-guide-atlas`) }
      if (key === 'note' || key === 'guide') { await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' })); await page.waitForTimeout(500); await shot(page, `${tag}-${key}-end`) }
    }
    if (locale === 'lv') { await visit('/this-trail-does-not-exist/'); await shot(page, `${tag}-404`) }
    const menu = page.locator('details[data-site-menu]>summary').first()
    if (await menu.count()) { await menu.click(); await page.waitForTimeout(500); await shot(page, `${tag}-menu-open`) }
  } catch (error) { console.error(tag, String(error).split('\n')[0]) }
  await context.close()
}
await browser.close()
console.log('Captured review screenshots in', out)
