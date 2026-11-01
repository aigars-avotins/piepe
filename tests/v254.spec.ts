import { test, expect } from '@playwright/test'
import type { Page, TestInfo } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { messages } from '../src/i18n'
import { nativeDiagnostics } from './nativeDiagnostics'
nativeDiagnostics()

const viewports = [[390, 844], [430, 932], [800, 900], [1024, 768], [1440, 900]] as const
async function enter(page: Page, locale: 'lv' | 'en', baseline = false) {
  // Route CSS in both controls so baseline and candidate share disabled browser caching.
  const css = baseline ? await readFile(new URL('./fixtures/v254-baseline.css', import.meta.url), 'utf8') : undefined
  await page.route('**/assets/*.css', route => css === undefined ? route.continue() : route.fulfill({ contentType: 'text/css', body: css }))
  await page.addInitScript(() => sessionStorage.setItem('piepe-entered', '1'))
  await page.goto(locale === 'lv' ? '/' : '/en/')
  await expect(page.locator('.world')).not.toHaveClass(/prerendered/)
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator('.hero-deck')).toHaveCSS('opacity', '1')
}
async function readable(page: Page, selectors: string[], minimum: number) {
  const samples = await page.evaluate(selectors => selectors.flatMap(selector => [...document.querySelectorAll(selector)].flatMap(element => {
    const box = element.getBoundingClientRect(), css = getComputedStyle(element)
    if (!box.width || !box.height || css.visibility === 'hidden') return []
    return [{ selector, font: parseFloat(css.fontSize), x: box.x, right: box.right, top: box.top, bottom: box.bottom }]
  })), selectors)
  expect(samples.length).toBeGreaterThan(0)
  for (const sample of samples) expect(sample.font, sample.selector).toBeGreaterThanOrEqual(minimum)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  return samples
}
for (const [width, height] of viewports) test.describe(`2.5.4 readability ${width}x${height}`, () => {
  test.use({ viewport: { width, height }, screen: { width, height }, deviceScaleFactor: 1, isMobile: width <= 1024, hasTouch: width <= 1024, userAgent: undefined })
  for (const locale of ['lv', 'en'] as const) test(`${locale}: body and secondary copy remain readable across the journey and field note`, async ({ page }, info) => {
    test.setTimeout(30000)
    await enter(page, locale)
    const evidence: unknown[] = []
    const header = await readable(page, ['.site-header .language-switch a', '.replay-intro'], 14)
    for (const box of header) { expect(box.x).toBeGreaterThanOrEqual(0); expect(box.right).toBeLessThanOrEqual(width + 1) }
    await expect(page.locator('.fungus-annotation')).toHaveCSS('opacity', '1')
    const invitation = await page.locator('.fungus-annotation>span:last-child').boundingBox()
    expect(invitation!.x).toBeGreaterThanOrEqual(0); expect(invitation!.x + invitation!.width).toBeLessThanOrEqual(width + 1)
    for (const id of ['understory', 'encounter', 'fungus-facts', 'return', 'wallpapers']) {
      await page.locator('#' + id).evaluate(e => e.scrollIntoView({ block: 'start', behavior: 'instant' }))
      const body = id === 'wallpapers' ? [] : await readable(page, [`#${id} .chapter-body`, `#${id} .return-thought`, `#${id} .fact-observations p`, `#${id} .facts-context p`], 16)
      const labels = await readable(page, [`#${id} .label`, `#${id} .line-link`, `#${id} .resolution-link`], 14)
      evidence.push({ id, body, labels })
    }
    await page.locator('#encounter').evaluate(e => e.scrollIntoView({ block: 'start', behavior: 'instant' }))
    await page.locator('.encounter-copy .line-link').click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.locator('.observation-panel')).toHaveCSS('opacity', '1')
    evidence.push(await readable(page, ['#discovery-description'], 16))
    evidence.push(await readable(page, ['.observation-footnote', '.observation-tabs button', '.discovery-kicker', '.observation-count', '.close-discovery'], 14))
    const close = await page.locator('.close-discovery').boundingBox()
    expect(close!.x + close!.width).toBeLessThanOrEqual(width + 1)
    expect(close!.y).toBeGreaterThanOrEqual(0)
    await info.attach('field-note-readable', { body: await page.screenshot({ scale: 'css' }), contentType: 'image/png' })
    await page.getByRole('tab', { name: new RegExp(messages[locale].observations[0].label) }).press('End')
    const download = page.waitForEvent('download')
    await page.getByRole('link', { name: messages[locale].keepNote, exact: false }).click()
    expect((await download).suggestedFilename()).toBe(`piepe-field-note-001-${locale}.txt`)
    await page.locator('.close-discovery').click()
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 2000 })
    await expect(page.locator('.encounter-copy .line-link')).toBeFocused()
    await info.attach('computed-readable-type', { body: JSON.stringify({ width, height, locale, evidence }), contentType: 'application/json' })
  })
})

async function moving(page: Page, name: string, info: TestInfo) {
  const layer = page.locator(`[data-clip=${name}]`), video = layer.locator('video')
  await expect(layer).toHaveAttribute('data-clip-ready', 'true', { timeout: 10000 })
  await expect.poll(() => video.evaluate(v => {
    let opacity = 1
    for (let e: Element | null = v; e; e = e.parentElement) opacity *= Number(getComputedStyle(e).opacity)
    return opacity
  })).toBeGreaterThan(.98)
  const frames = await video.evaluate(v => new Promise<number[]>((resolve, reject) => {
    const values: number[] = [], start = performance.now()
    let request = 0
    const timeout = setTimeout(() => { v.cancelVideoFrameCallback(request); reject(Error('Fewer than six advancing presented film frames within2500ms')) }, 2500)
    const frame: VideoFrameRequestCallback = (_, metadata) => {
      values.push(metadata.mediaTime)
      if (values.length >= 6 && performance.now() - start >= 750) { clearTimeout(timeout); resolve(values) }
      else request = v.requestVideoFrameCallback(frame)
    }
    request = v.requestVideoFrameCallback(frame)
  }))
  expect(new Set(frames).size).toBeGreaterThanOrEqual(6)
  const hashes: string[] = []
  const size = page.viewportSize()!
  // Cadence above is measured before any screenshot/pixel copy. The image region
  // samples actual rendered movie pixels, away from the static caption/controls.
  for (let i = 0; i < 3; i++) {
    await video.evaluate(v => new Promise<void>((resolve, reject) => { const start = v.currentTime; let request = 0, done = false; const timer = setTimeout(() => { done = true; v.cancelVideoFrameCallback(request); reject(Error('No advancing sample within2500ms')) }, 2500); const frame = () => { if (done) return; if (Math.abs(v.currentTime - start) > .2) { done = true; clearTimeout(timer); resolve() } else request = v.requestVideoFrameCallback(frame) }; request = v.requestVideoFrameCallback(frame) }))
    const image = await page.screenshot({ clip: { x: size.width * .15, y: size.height * .20, width: size.width * .7, height: size.height * .22 }, scale: 'css' })
    hashes.push(createHash('sha256').update(image).digest('hex'))
  }
  expect(new Set(hashes).size).toBe(3)
  await expect(video).toHaveCSS('filter', 'none')
  const rect = await video.boundingBox()
  expect(rect!.width).toBeGreaterThanOrEqual(size.width - 1)
  expect(rect!.height).toBeGreaterThanOrEqual(size.height - 1)
  await info.attach(`actual-moving-${name}`, { body: JSON.stringify({ frames, hashes, rect, viewport: size, dpr: await page.evaluate(() => devicePixelRatio) }), contentType: 'application/json' })
}
for (const [width, height, locale] of [[390, 844, 'en'], [800, 900, 'lv'], [1512, 982, 'en']] as const) test.describe(`2.5.4 cinema comparison ${width}x${height}`, () => {
  test.use({ viewport: { width, height }, screen: { width, height }, deviceScaleFactor: 2, isMobile: width < 1100, hasTouch: width < 1100, userAgent: undefined })
  for (const baseline of (width === 800 ? [false, true] : [true, false])) test(`${baseline ? 'before253' : 'candidate254'}: ${locale} actual moving frames, repeated visits and discovery`, async ({ page }, info) => {
    test.setTimeout(65000)
    await enter(page, locale, baseline)
    await page.getByRole('button', { name: messages[locale].closer, exact: true }).click()
    await expect(page.getByRole('heading', { name: messages[locale].observations[0].title.split('\n')[0], exact: false })).toBeVisible({ timeout: 14000 })
    await page.locator('.close-discovery').click()
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 2000 })
    for (let visit = 0; visit < 2; visit++) for (const [id, clip] of [['understory', 'understory'], ['return', 'breathing']]) {
      await page.locator('#' + id).evaluate(e => scrollTo({ top: e.getBoundingClientRect().top + scrollY + Math.min((e.offsetHeight - innerHeight) * .35, innerHeight * .65), behavior: 'instant' }))
      await moving(page, clip, info)
    }
    await page.getByRole('button', { name: messages[locale].returnForest, exact: true }).click()
    await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(5)
    await expect(page.locator('video.forest-film')).toHaveCount(0)
  })
})
for (const preference of ['reduced', 'save-data'] as const) for (const locale of ['lv', 'en'] as const) test(`2.5.4 static ${preference} ${locale}: brighter fallbacks preserve preference and note access`, async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 900 })
  if (preference === 'reduced') await page.emulateMedia({ reducedMotion: 'reduce' })
  else await page.addInitScript(() => Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true } }))
  await enter(page, locale)
  await expect(page.locator('.world')).toHaveClass(/static-preference/)
  await page.locator('#understory').evaluate(e => e.scrollIntoView({ block: 'start', behavior: 'instant' }))
  await expect(page.locator('video')).toHaveCount(0)
  await readable(page, ['.chapter-body', '.return-thought'], 16)
  await page.locator('#encounter').evaluate(e => e.scrollIntoView({ block: 'start', behavior: 'instant' }))
  await page.locator('.encounter-copy .line-link').click()
  await expect(page.locator('#discovery-description')).toBeVisible()
  await expect(page.locator('video')).toHaveCount(0)
})


test.describe('2.5.4 folding and landscape', () => {
  test.use({ viewport: { width: 430, height: 932 }, screen: undefined, deviceScaleFactor: 1, isMobile: true, hasTouch: true, userAgent: undefined })
  test('caption and note controls stay onstage through representative touch viewport changes', async ({ page }, info) => {
    test.setTimeout(30000)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await enter(page, 'en')
    const evidence = []
    for (const [width, height] of [[430, 932], [800, 900], [1024, 768], [844, 390], [430, 932]]) {
      await page.setViewportSize({ width, height })
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
      await expect(page.locator('.world')).toHaveAttribute('data-scene', 'forest', { timeout: 2000 })
      await expect.poll(() => page.locator('.fungus-annotation>span:last-child').evaluate(e => { const r = e.getBoundingClientRect(); return r.x >= 0 && r.right <= innerWidth + 1 && r.y >= 0 && r.bottom <= innerHeight + 1 }), { timeout: 2000 }).toBe(true)
      await expect(page.locator('.fungus-annotation')).toHaveCSS('opacity', '1')
      const caption = await page.locator('.fungus-annotation>span:last-child').boundingBox()
      expect(caption!.x).toBeGreaterThanOrEqual(0); expect(caption!.x + caption!.width).toBeLessThanOrEqual(width + 1)
      expect(caption!.y).toBeGreaterThanOrEqual(0); expect(caption!.y + caption!.height).toBeLessThanOrEqual(height + 1)
      await page.locator('#understory').evaluate(e => e.scrollIntoView({ block: 'start', behavior: 'instant' }))
      await readable(page, ['#understory .chapter-body'], 16)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      await expect(page.locator('video')).toHaveCount(0)
      await page.locator('#encounter').evaluate(e => e.scrollIntoView({ block: 'start', behavior: 'instant' }))
      await expect(page.locator('.world')).toHaveAttribute('data-scene', 'encounter', { timeout: 2000 })
      if (width >= 700 && height > 520) {
        const overlap = await page.evaluate(() => {
          const status = document.querySelector('.encounter-status')!.getBoundingClientRect(), audio = document.querySelector('.world>.sound-control')!.getBoundingClientRect()
          return status.x < audio.right && status.right > audio.x && status.y < audio.bottom && status.bottom > audio.y
        })
        expect(overlap, 'A scene caption must not be hidden by the audio control at its reading anchor').toBe(false)
      }
      await page.locator('.encounter-copy .line-link').click()
      await expect(page.locator('#discovery-description')).toBeVisible()
      const close = await page.locator('.close-discovery').boundingBox()
      expect(close!.y).toBeGreaterThanOrEqual(0); expect(close!.y + close!.height).toBeLessThanOrEqual(height)
      await page.locator('.close-discovery').click(); await expect(page.getByRole('dialog')).not.toBeVisible()
      evidence.push({ width, height, caption, close, cssViewport: await page.evaluate(() => ({ width: innerWidth, height: innerHeight, dpr: devicePixelRatio })) })
    }
    await info.attach('touch-resize-layout', { body: JSON.stringify(evidence), contentType: 'application/json' })
  })
})
