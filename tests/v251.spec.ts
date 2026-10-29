import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

// Record actual browser compositing as well as paint-by-paint state. The original
// cinema cadence/pixel tests remain separate and unchanged.
test.use({ video: 'on' })
test.beforeEach(async ({ page }) => { await page.bringToFront() })

async function heroLayers(page: Page) {
  return page.evaluate(() => {
    const state = (name: string) => {
      const e = document.querySelector<HTMLElement>('.' + name)!, css = getComputedStyle(e)
      let contribution = 1
      for (let n: Element | null = e; n; n = n.parentElement) {
        const s = getComputedStyle(n)
        contribution *= s.visibility === 'hidden' || s.display === 'none' ? 0 : Number(s.opacity)
      }
      return { contribution, opacity: Number(css.opacity), transform: css.transform }
    }
    return { scroll: scrollY, base: state('base-camera'), foreground: state('foreground-camera'), macro: state('understory-cinema'), wide: state('wide-environment'), dawn: state('dawn-light') }
  })
}
async function singleForest(page: Page) {
  await expect.poll(() => heroLayers(page), { timeout: 4000 }).toMatchObject({ scroll: 0, base: { opacity: 1 }, foreground: { contribution: 0 }, macro: { contribution: 0 }, wide: { contribution: 0 }, dawn: { contribution: 0 } })
  const transform = await page.locator('.base-camera').evaluate(e => new DOMMatrix(getComputedStyle(e).transform).toFloat64Array().join(','))
  expect(transform).toBe('1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1')
}
async function nativeEnd(page: Page, browserName: string, bottom: boolean) {
  for (let i = 0; i < 80; i++) {
    const remaining = await page.evaluate(d => d ? document.documentElement.scrollHeight - innerHeight - scrollY : scrollY, bottom)
    if (remaining < 1) return
    if (browserName === 'webkit' && page.viewportSize()!.width < 700) {
      // Playwright does not support a wheel on mobile WebKit. This is native
      // keyboard scrolling, not a claim of physical iPhone/touch validation.
      await page.keyboard.press(bottom ? 'PageDown' : 'PageUp')
    } else await page.mouse.wheel(0, (bottom ? 1 : -1) * Math.min(remaining, page.viewportSize()!.height * .9))
    await page.waitForTimeout(45)
  }
  throw Error('Native input did not reach the document boundary')
}

for (const [width, height] of [[1512, 982], [390, 664]]) test.describe(`2.5.1 cold ${width}x${height}`, () => {
  test.use({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: width < 700, hasTouch: width < 700 })
  for (const locale of ['lv', 'en']) test(`${locale}: opening poster owns every paint through hydration, delayed decoding and Replay`, async ({ page, browserName }, info) => {
    test.setTimeout(45000)
    await page.addInitScript(() => {
      const audit: { time: number; source: string; videoTime?: number; ready?: number }[] = []
      ;(window as unknown as { introPaints: typeof audit }).introPaints = audit
      const paint = () => {
        const image = document.querySelector<HTMLImageElement>('.is-intro .forest-still')
        const video = document.querySelector<HTMLVideoElement>('.forest-film')
        if (image) {
          const replacement = getComputedStyle(image).content
          audit.push({ time: performance.now(), source: replacement.startsWith('url(') ? replacement : image.currentSrc || image.src, videoTime: video?.currentTime, ready: video?.readyState })
        }
        requestAnimationFrame(paint)
      }
      requestAnimationFrame(paint)
    })
    let hydrate!: () => void, decode!: () => void
    const hydration = new Promise<void>(resolve => { hydrate = resolve }), decoding = new Promise<void>(resolve => { decode = resolve })
    page.once('close', () => { hydrate(); decode() })
    await page.route('**/assets/*.js', async route => { await hydration; if (!page.isClosed()) await route.continue() })
    await page.route('**/media/forest-reveal.mp4*', async route => { await decoding; if (!page.isClosed()) await route.continue() })
    await page.goto(locale === 'lv' ? '/' : '/en/', { waitUntil: 'commit' })
    await page.locator('.forest-still').evaluate((image: HTMLImageElement) => image.decode())
    await expect(page.locator('.world')).toHaveClass(/prerendered/)
    // WebKit's screenshot waits for document.fonts.ready, which waits for the
    // deliberately held module. Its first paint is retained in the browser video
    // and per-paint audit; take the still screenshot after releasing the gates.
    if (browserName !== 'webkit') await info.attach('server-first-opening', { body: await page.screenshot(), contentType: 'image/png' })
    hydrate()
    await expect(page.locator('.world')).not.toHaveClass(/prerendered/)
    await expect(page.locator('.forest-film')).toHaveCount(1)
    // Hold the real response across many paints, rather than sampling only at 1s.
    await page.waitForTimeout(900)
    const paints = await page.evaluate(() => (window as unknown as { introPaints: { source: string }[] }).introPaints)
    expect(paints.length).toBeGreaterThan(10)
    expect(paints.every(p => p.source.includes('/media/forest-poster.jpg'))).toBe(true)
    await info.attach('first-paint-to-hydration', { body: JSON.stringify(paints), contentType: 'application/json' })
    // Release before encoding another screenshot: encoding must not consume the
    // real load watchdog budget. The held interval above is audited every paint.
    const presentation = page.locator('.forest-film').evaluate((video: HTMLVideoElement) => new Promise<{ time: number; count: number }>(resolve => {
      let count = 0
      const frame: VideoFrameRequestCallback = (_, metadata) => { if (++count >= 3) resolve({ time: metadata.mediaTime, count }); else video.requestVideoFrameCallback(frame) }
      video.requestVideoFrameCallback(frame)
    }))
    decode()
    const presented = await presentation
    expect(presented.time).toBeGreaterThan(0)
    await info.attach('hydrated-opening-handoff', { body: await page.screenshot(), contentType: 'image/png' })
    await expect(page.locator('.world')).toHaveAttribute('data-exit-reason', 'ended', { timeout: 12000 })
    await expect(page.locator('.forest-still')).toHaveAttribute('src', /forest-final.jpg/)
    // Cached return skips the intro; Replay must nevertheless stage the opening.
    await page.reload()
    await expect(page.locator('.world')).toHaveAttribute('data-exit-reason', 'preference-or-return')
    await page.locator('.replay-intro').click()
    await expect(page.locator('.forest-still')).toHaveAttribute('src', /forest-poster.jpg/)
    await page.locator('.skip-intro').click()
    await expect(page.locator('.world')).toHaveAttribute('data-exit-reason', 'skipped')
    await expect(page.locator('.forest-still')).toHaveAttribute('src', /forest-final.jpg/)
    await page.evaluate(() => sessionStorage.clear())
    await page.reload() // Routing disables cache: a new, empty-session first visit.
    await expect(page.locator('.forest-still')).toHaveAttribute('src', /forest-poster.jpg/)
    await page.locator('.skip-intro').click()
    await singleForest(page)
  })
})

for (const [width, height] of [[1512, 982], [1440, 900], [390, 844], [390, 664]]) test.describe(`2.5.1 reverse ${width}x${height}`, () => {
  test.use({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: width < 700, hasTouch: width < 700 })
  for (const locale of ['lv', 'en']) test(`${locale}: bottom to top stays a single forest after refresh and three native returns`, async ({ page, browserName }, info) => {
    test.setTimeout(120000)
    await page.addInitScript(() => sessionStorage.setItem('piepe-entered', '1'))
    await page.goto(locale === 'lv' ? '/' : '/en/')
    await expect(page.locator('.world')).not.toHaveClass(/prerendered/)
    await page.evaluate(() => document.fonts.ready)
    await singleForest(page)
    await info.attach('reference-hero', { body: await page.screenshot(), contentType: 'image/png' })
    for (let visit = 0; visit < 3; visit++) {
      await nativeEnd(page, browserName, true)
      await expect(page.locator('.wide-environment')).toHaveCSS('opacity', '1')
      // The failing production-equivalent case: refresh while the ending is
      // visible, including same-breakpoint viewport changes (Safari toolbar).
      await page.setViewportSize({ width: width - (visit % 2 ? 0 : 1), height: height + (visit % 2 ? 0 : 16) })
      await page.waitForTimeout(500)
      await nativeEnd(page, browserName, false)
      await singleForest(page)
      await info.attach(`single-forest-return-${visit}`, { body: JSON.stringify(await heroLayers(page)), contentType: 'application/json' })
    }
    await info.attach('after-three-returns', { body: await page.screenshot(), contentType: 'image/png' })
    // Fast reverse across both cinema entrances; the footer action, direct
    // fragment, history, locale layout refresh and responsive rebuilds agree.
    await page.locator('#understory').evaluate(e => e.scrollIntoView({ behavior: 'instant' }))
    await page.locator('#encounter').evaluate(e => e.scrollIntoView({ behavior: 'instant' }))
    await page.locator('#return').evaluate(e => e.scrollIntoView({ behavior: 'instant' }))
    await page.waitForTimeout(600)
    await page.locator('#return button').filter({ hasText: /Return to forest|Atgriezties mežā/ }).click()
    await singleForest(page)
    await page.goto((locale === 'lv' ? '/' : '/en/') + '#return')
    await expect(page.locator('.wide-environment')).toHaveCSS('opacity', '1')
    await page.reload()
    await expect(page.locator('.world')).not.toHaveClass(/prerendered/)
    await page.evaluate(() => (document.querySelector('.brand') as HTMLElement).click())
    await singleForest(page)
    const other = locale === 'lv' ? 'en' : 'lv'
    await page.locator(`.site-header a[lang=${other}]`).click()
    await singleForest(page)
    await page.goBack(); await singleForest(page)
    await page.goForward(); await singleForest(page)
    await page.goto((locale === 'lv' ? '/' : '/en/') + '#forest'); await singleForest(page)
    await page.setViewportSize({ width: height, height: width })
    await singleForest(page)
    const hotspot = page.locator('.fungus-hit')
    await hotspot.focus(); await expect(hotspot).toBeFocused()
    await expect(hotspot).toBeEnabled()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })
})
