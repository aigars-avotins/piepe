import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

test.use({ video: 'on' })
test.beforeEach(async ({ page }) => { await page.bringToFront() })

async function geometry(page: Page) {
  return page.evaluate(() => {
    const box = (selector: string) => document.querySelector(selector)!.getBoundingClientRect()
    const under = box('#understory'), content = box('#understory .cinema-content')
    const headline = box('#encounter-title'), link = box('#encounter .encounter-copy .line-link')
    const copy = box('#understory .bark-copy'), h = innerHeight
    // The readable plateau starts with Understory aligned to the viewport.
    // Count 48px of the next heading, and the whole note target plus 20px clearance.
    return { h, start: under.top + scrollY, height: under.height, sticky: content.height,
      headlineDistance: headline.top - under.top - h + 48,
      noteDistance: link.bottom - under.top - h + 20,
      copyTop: copy.top, copyBottom: copy.bottom,
      breathingHeight: box('#return').height,
      overflow: document.documentElement.scrollWidth > innerWidth }
  })
}

for (const [width, height] of [[1512, 982], [1440, 900], [390, 844], [390, 664], [320, 690]]) test.describe(`2.5.2 geometry ${width}x${height}`, () => {
  test.use({ viewport: { width, height }, isMobile: width < 700, hasTouch: width < 700, deviceScaleFactor: 1 })
  for (const locale of ['lv', 'en']) test(`${locale}: short Understory budget preserves full bleed, copy and static overrides`, async ({ page }, info) => {
    await page.addInitScript(() => sessionStorage.setItem('piepe-entered', '1'))
    await page.goto((locale === 'lv' ? '/' : '/en/') + '#understory')
    await page.evaluate(() => document.fonts.ready)
    await expect(page.locator('.world')).not.toHaveClass(/prerendered/)
    await expect(page.locator('[data-clip=understory]')).toHaveAttribute('data-clip-ready', 'true')
    const g = await geometry(page), mobile = width < 700
    expect(g.height / g.h).toBeCloseTo(mobile ? 1.7 : 1.6, 2)
    expect(g.headlineDistance / g.h).toBeLessThan(mobile ? 1.7 : 1.2)
    expect(g.noteDistance / g.h).toBeLessThan(mobile ? 2 : 1.6)
    expect(g.sticky).toBeCloseTo(g.h, 0)
    expect(g.copyTop).toBeGreaterThan(90)
    expect(g.copyBottom).toBeLessThan(g.h)
    expect(g.breathingHeight / g.h).toBeCloseTo(mobile ? 3 : 2.8, 2)
    expect(g.overflow).toBe(false)
    const film = await page.locator('[data-clip=understory] video').evaluate(v => {
      const r = v.getBoundingClientRect()
      return { cover: getComputedStyle(v).objectFit, width: r.width, height: r.height }
    })
    expect(film.cover).toBe('cover'); expect(film.width).toBeGreaterThanOrEqual(width); expect(film.height).toBeGreaterThanOrEqual(height)
    await info.attach('understory-scroll-budget', { body: JSON.stringify(g), contentType: 'application/json' })
    await info.attach('full-screen-understory', { body: await page.screenshot({ scale: 'css' }), contentType: 'image/png' })
    if (width === 390 && height === 844) {
      // Exercise layout/ScrollTrigger refresh with a changed visible phone height.
      // This does not emulate the physical Safari browser toolbar itself.
      await page.setViewportSize({ width, height: 664 })
      await expect.poll(async () => { const r = await geometry(page); return r.height / r.h }).toBeCloseTo(1.7, 2)
      await expect(page.locator('[data-clip=understory]')).toHaveAttribute('data-clip-ready', 'true')
      expect(await page.locator('[data-clip=understory] video').evaluate(v => v.getBoundingClientRect().height)).toBeGreaterThanOrEqual(664)
    }
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(page.locator('.world')).toHaveClass(/static-preference/)
    const still = await geometry(page)
    expect(still.height / still.h).toBeCloseTo(1, 2)
    expect(await page.locator('#understory .cinema-content').evaluate(e => getComputedStyle(e).position)).toBe('relative')
    await expect(page.locator('video')).toHaveCount(0)
  })
})

async function nativeStep(page: Page, browserName: string, forward = true) {
  if (browserName === 'webkit' && page.viewportSize()!.width < 700) {
    // Mobile WebKit cannot receive Playwright wheel input; native keyboard here,
    // separate Chromium captures use actual CDP touch/move/inertial scrolling.
    await page.keyboard.press(forward ? 'PageDown' : 'PageUp')
  } else await page.mouse.wheel(0, (forward ? 1 : -1) * page.viewportSize()!.height * .35)
  await page.waitForTimeout(140)
}

async function advance(page: Page, browserName: string) {
  const from = await page.evaluate(() => scrollY)
  let inputs = 0
  for (; inputs < 10; inputs++) {
    if (await page.locator('#encounter .encounter-copy .line-link').evaluate(e => e.getBoundingClientRect().bottom <= innerHeight - 20)) break
    await nativeStep(page, browserName)
  }
  expect(inputs).toBeGreaterThan(0); expect(inputs).toBeLessThan(9)
  expect(await page.evaluate(() => scrollY) - from).toBeLessThan(page.viewportSize()!.height * 2.6)
  const note = page.locator('#encounter .encounter-copy .line-link')
  await expect(note).toBeInViewport({ ratio: 1 })
  const target = await note.evaluate(e => {
    const r = e.getBoundingClientRect()
    return e.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2))
  })
  expect(target).toBe(true)
  await expect(page.locator('[data-clip=understory] video')).toHaveCount(0)
  const prevented = await page.evaluate(() => (window as unknown as { preventedInputs: boolean[] }).preventedInputs)
  expect(prevented.some(Boolean)).toBe(false)
  expect(await page.locator('body').evaluate(e => getComputedStyle(e).overflow)).not.toBe('hidden')
  return { inputs, from, to: await page.evaluate(() => scrollY), prevented }
}

async function settledAnchor(page: Page, id: string) {
  await expect.poll(() => page.locator('#' + id).evaluate(e => Math.abs(e.getBoundingClientRect().top - parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)))).toBeLessThan(3)
  // History traversal during a native smooth scroll can replace its saved offset.
  // Wait for observed stillness, not merely the first frame inside a broad region.
  await page.evaluate(async () => {
    let previous = scrollY, still = 0
    while (still < 5) {
      await new Promise(requestAnimationFrame)
      still = Math.abs(scrollY - previous) < .5 ? still + 1 : 0
      previous = scrollY
    }
  })
}

for (const [width, height, locale] of [[1512, 982, 'lv'], [390, 664, 'en']] as const) test.describe(`2.5.2 native journey ${width}x${height}`, () => {
  test.use({ viewport: { width, height }, isMobile: width < 700, hasTouch: width < 700, deviceScaleFactor: 1 })
  test('wheel/keyboard leaves immediately while playing, paused or looping; anchors and history work', async ({ page, browserName }, info) => {
    test.setTimeout(65000)
    await page.addInitScript(() => {
      sessionStorage.setItem('piepe-entered', '1')
      const inputs: boolean[] = []
      ;(window as unknown as { preventedInputs: boolean[] }).preventedInputs = inputs
      for (const name of ['wheel', 'touchmove', 'keydown']) window.addEventListener(name, e => inputs.push(e.defaultPrevented), { passive: true })
    })
    // Distinct document URLs reset explicit pause/error state between scenarios;
    // navigating to the same fragment would retain the mounted React page.
    const visit = (state: string) => page.goto((locale === 'lv' ? '/' : '/en/') + '?scroll-case=' + state + '#understory', { waitUntil: 'domcontentloaded' })
    const evidence: unknown[] = []
    await visit('playing'); await page.evaluate(() => document.fonts.ready)
    const layer = page.locator('[data-clip=understory]'), video = layer.locator('video')
    await expect(layer).toHaveAttribute('data-clip-ready', 'true')
    const frames = await video.evaluate((v: HTMLVideoElement) => new Promise<number[]>(resolve => {
      const times: number[] = []
      const frame: VideoFrameRequestCallback = (_, m) => { times.push(m.mediaTime); if (times.length === 3) resolve(times); else v.requestVideoFrameCallback(frame) }
      v.requestVideoFrameCallback(frame)
    }))
    expect(frames[2]).toBeGreaterThan(frames[0]); expect(frames[2]).toBeLessThan(6)
    evidence.push({ state: 'playing', frames, ...await advance(page, browserName) })
    // A native reverse visit must create another decoder and advance again.
    for (let i = 0; i < 10 && await page.evaluate(() => scrollY > document.getElementById('understory')!.offsetTop + innerHeight * .3); i++) await nativeStep(page, browserName, false)
    await expect(layer).toHaveAttribute('data-clip-ready', 'true')
    await expect.poll(() => layer.getAttribute('data-clip-cycles').then(Number), { timeout: 10000 }).toBeGreaterThanOrEqual(1)
    await expect(layer).toHaveAttribute('data-loop-hold', 'false')
    evidence.push({ state: 'looped', ...await advance(page, browserName) })
    await visit('paused'); await expect(layer).toHaveAttribute('data-clip-ready', 'true')
    await page.keyboard.press('Escape')
    await expect(page.locator('.world')).toHaveClass(/motion-off/)
    evidence.push({ state: 'paused', ...await advance(page, browserName) })
    await visit('anchor'); await expect(layer).toHaveAttribute('data-clip-ready', 'true')
    await page.locator('#understory .line-link').click()
    await settledAnchor(page, 'encounter')
    await page.goBack()
    await settledAnchor(page, 'understory')
    await expect(video).toHaveCount(1); await expect(layer).toHaveAttribute('data-clip-ready', 'true')
    await page.goForward()
    await settledAnchor(page, 'encounter')
    await expect(video).toHaveCount(0)
    expect(await page.evaluate(() => (window as unknown as { preventedInputs: boolean[] }).preventedInputs.some(Boolean))).toBe(false)
    await info.attach('native-scroll-independent-of-movie-state', { body: JSON.stringify(evidence), contentType: 'application/json' })
  })
  // Fresh contexts prevent the browser's decoded-media cache from bypassing the
  // deliberately blocked request, so these are actual network/decode conditions.
  for (const state of ['buffering', 'error']) test(`native scrolling leaves a genuinely ${state} film`, async ({ page, browserName }, info) => {
    test.setTimeout(25000)
    await page.addInitScript(() => {
      sessionStorage.setItem('piepe-entered', '1')
      const inputs: boolean[] = []
      ;(window as unknown as { preventedInputs: boolean[] }).preventedInputs = inputs
      for (const name of ['wheel', 'touchmove', 'keydown']) window.addEventListener(name, e => inputs.push(e.defaultPrevented), { passive: true })
    })
    let release!: () => void, requests = 0
    const gate = new Promise<void>(resolve => { release = resolve })
    page.once('close', () => release())
    await page.route('**/media/forest-understory.mp4*', async route => {
      requests++
      if (state === 'error') { await route.abort(); return }
      await gate
      // Offstage cleanup cancels the decoder before this response is released.
      if (!page.isClosed()) await route.continue().catch(error => { if (!String(error).includes('Route is already handled')) throw error })
    })
    await page.goto((locale === 'lv' ? '/' : '/en/') + '#understory', { waitUntil: 'domcontentloaded' })
    await expect.poll(() => requests).toBeGreaterThan(0)
    await expect(page.locator('[data-clip=understory]')).toHaveAttribute('data-clip-state', state === 'error' ? 'error' : 'preparing')
    const result = await advance(page, browserName)
    release(); await page.unrouteAll({ behavior: 'wait' })
    await info.attach('unavailable-film-native-scroll', { body: JSON.stringify({ state, requests, ...result }), contentType: 'application/json' })
  })
})
