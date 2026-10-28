import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'
import { messages } from '../src/i18n'

test.beforeEach(async({page})=>{await page.bringToFront()})

async function wheelTo(page: Page, id: string, fraction: number) {
  const destination = await page.locator('#' + id).evaluate((e, f) => Math.min(document.documentElement.scrollHeight - innerHeight, e.getBoundingClientRect().top + scrollY + innerHeight * f), fraction)
  const h = page.viewportSize()!.height
  for (let i = 0; i < 120; i++) {
    const delta = destination - await page.evaluate(() => scrollY)
    // Native phone keyboard scrolling advances in coarse steps. Arrival is a broad
    // cinematic region, not a pixel-perfect stop; coverage is verified separately.
    if (Math.abs(delta) < (page.viewportSize()!.width < 700 ? h * .12 : 35)) return
    if (page.context().browser()?.browserType().name() === 'webkit' && page.viewportSize()!.width < 700) {
      // Playwright cannot send a wheel to mobile WebKit. Exercise its native
      // keyboard scrolling; separate Chromium recordings use actual touch input.
      await page.keyboard.press(Math.abs(delta) > h * .75 ? delta > 0 ? 'PageDown' : 'PageUp' : delta > 0 ? 'ArrowDown' : 'ArrowUp', { delay: 80 })
    } else await page.mouse.wheel(0, Math.max(-h * .4, Math.min(h * .4, delta)))
    await page.waitForTimeout(100)
  }
  throw Error('Native wheel input did not reach the scene')
}

async function movingPicture(page: Page, name: 'understory' | 'breathing') {
  const layer = page.locator(`[data-clip="${name}"]`)
  await expect(layer).toHaveAttribute('data-clip-ready', 'true', { timeout: 10000 })
  // Decode readiness can precede the scroll entrance. Sample the actual visible
  // scene after its existing camera scrub settles, rather than reading back a
  // hidden/intermediate composited surface and measuring the readback stall.
  await expect.poll(() => layer.locator('video').evaluate(video => {
    let opacity = 1
    for (let element: Element | null = video; element; element = element.parentElement) opacity *= Number(getComputedStyle(element).opacity)
    return opacity
  })).toBeGreaterThan(.98)
  return layer.locator('video').evaluate(async (video: HTMLVideoElement) => {
    let opacity = 1
    for (let e: Element | null = video; e; e = e.parentElement) opacity *= Number(getComputedStyle(e).opacity)
    const r = video.getBoundingClientRect(), scale = Math.max(r.width / video.videoWidth, r.height / video.videoHeight)
    const position = getComputedStyle(video).objectPosition.split(' ').map(parseFloat)
    const sw = r.width / scale, sh = r.height / scale, sx = (video.videoWidth - sw) * position[0] / 100, sy = (video.videoHeight - sh) * position[1] / 100
    const canvas = document.createElement('canvas'); canvas.width = 128; canvas.height = 72
    const ctx = canvas.getContext('2d')!
    const frames: { time: number; hash?: number; presented: number }[] = []
    let sampledAt = -Infinity
    const started = performance.now()
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(Error('No advancing presented video frames: '+JSON.stringify({src:video.currentSrc,time:video.currentTime,paused:video.paused,ended:video.ended,ready:video.readyState,connected:video.isConnected,reason:video.parentElement?.dataset.clipReason,cycles:video.parentElement?.dataset.clipCycles,totalFrames:video.getVideoPlaybackQuality().totalVideoFrames,sampled:frames.length}))), 2500)
      const frame: VideoFrameRequestCallback = (_, metadata) => {
        // Read pixels at separated presented frames, rather than forcing a GPU→CPU
        // conversion on every callback and stalling the renderer being measured.
        let hash: number | undefined
        if (performance.now() - sampledAt >= 250) {
          sampledAt = performance.now(); ctx.drawImage(video, sx, sy, sw, sh, 0, 0, 128, 72)
          const pixels = ctx.getImageData(0, 0, 128, 72).data; hash = 2166136261
          for (let i = 0; i < pixels.length; i++) if (i % 4 !== 3) hash = Math.imul(hash ^ pixels[i], 16777619)
          hash >>>= 0
        }
        frames.push({ time: metadata.mediaTime, hash, presented: metadata.presentedFrames })
        if (performance.now() - started < 750 || frames.length < 6 || frames.filter(frame => frame.hash !== undefined).length < 3 || video.paused || video.ended) video.requestVideoFrameCallback(frame)
        else { clearTimeout(timeout); resolve() }
      }
      video.requestVideoFrameCallback(frame)
    })
    opacity = 1
    for (let e: Element | null = video; e; e = e.parentElement) opacity *= Number(getComputedStyle(e).opacity)
    return { frames, duration: video.duration, opacity, ready: video.readyState, paused: video.paused, rect: { x: r.x, y: r.y, w: r.width, h: r.height }, viewport: { w: innerWidth, h: innerHeight }, held: video.parentElement!.dataset.loopHold }
  })
}

const distinctFrames = (frames: { hash?: number }[]) => new Set(frames.flatMap(frame => frame.hash === undefined ? [] : [frame.hash])).size

test('native keyboard advance interrupts the fresh intro, and direct anchors do not start a competing film', async ({ page }) => {
  test.setTimeout(45000)
  await page.goto('/en/')
  await expect(page.locator('video.forest-film')).toHaveCount(1)
  await page.keyboard.press('PageDown')
  await expect(page.locator('.world')).toHaveAttribute('data-exit-reason', 'scroll-forward')
  await expect(page.locator('video.forest-film')).toHaveCount(0)
  await page.goto('/en/#understory')
  expect((await movingPicture(page, 'understory')).paused).toBe(false)
  await page.evaluate(() => sessionStorage.clear())
  await page.goto('/#return')
  await expect(page.locator('.world')).toHaveAttribute('data-exit-reason', 'anchor-navigation')
  await expect(page.locator('video.forest-film')).toHaveCount(0)
  expect((await movingPicture(page, 'breathing')).paused).toBe(false)
  const beforeWheel = await page.evaluate(() => scrollY)
  await page.keyboard.press('PageDown')
  await expect.poll(() => page.evaluate(y => scrollY - y, beforeWheel)).toBeGreaterThan(450)
  await page.reload()
  await page.evaluate(() => document.fonts.ready)
  // Safari can reload a fragment at its start rather than the old offset within the
  // sticky plateau. Preserve that native behavior and require the same visible scene.
  const reloaded = await movingPicture(page, 'breathing'); expect(reloaded.paused).toBe(false); expect(reloaded.opacity).toBeGreaterThan(.98)
  await page.goBack(); expect((await movingPicture(page, 'understory')).paused).toBe(false)
  await page.goForward(); expect((await movingPicture(page, 'breathing')).paused).toBe(false)
})

test('expanded facts, locale changes, explicit pause and a failed environmental decode keep native navigation usable', async ({ page }) => {
  test.setTimeout(40000)
  await page.addInitScript(() => sessionStorage.setItem('piepe-entered', '1'))
  await page.goto('/en/#fungus-facts')
  await page.locator('.fungus-vocabulary summary').click()
  await expect(page.locator('.fungus-vocabulary')).toHaveAttribute('open', '')
  await page.getByRole('link', { name: 'LV', exact: true }).first().click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'lv')
  await wheelTo(page, 'return', .65)
  expect((await movingPicture(page, 'breathing')).opacity).toBeGreaterThan(.98)
  const position = await page.evaluate(() => scrollY)
  await page.locator('#return .cinema-pause').click()
  await expect(page.locator('[data-clip=breathing] video')).toHaveCount(0)
  expect(Math.abs(await page.evaluate(() => scrollY) - position)).toBeLessThan(5)
  await page.locator('#return .cinema-pause').click()
  expect((await movingPicture(page, 'breathing')).paused).toBe(false)
  await page.keyboard.press('Escape')
  await expect(page.locator('[data-clip=breathing] video')).toHaveCount(0)
  await page.locator('#return .cinema-pause').click()
  await wheelTo(page, 'wallpapers', 0)
  await page.route('**/media/forest-understory.mp4*', route => route.abort())
  await wheelTo(page, 'understory', .65)
  await expect(page.locator('[data-clip=understory]')).toHaveAttribute('data-clip-state', 'error')
  await page.unroute('**/media/forest-understory.mp4*')
  await page.locator('#understory .cinema-pause').click()
  expect((await movingPicture(page, 'understory')).paused).toBe(false)
  await page.locator('#understory .line-link').click()
  await expect.poll(() => page.evaluate(() => Math.abs(document.getElementById('encounter')!.getBoundingClientRect().top - parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)))).toBeLessThan(5)
})

for (const [width, height] of [[1512, 982], [390, 664]]) test.describe(`${width}x${height} repeatable cinema`, () => {
  test.use({ viewport: { width, height }, deviceScaleFactor: width > 700 ? 2 : 3, isMobile: width < 700, hasTouch: width < 700, ...(width >= 700 ? { userAgent: undefined } : {}) })
  for (const locale of ['lv', 'en'] as const) test(`${locale}: visible moving frames across broad plateaus, three revisits, loops and reload`, async ({ page }, testInfo) => {
    test.setTimeout(120000)
    await page.addInitScript(() => {
      sessionStorage.setItem('piepe-entered', '1')
      // An existing 2.2 session must not suppress the new repeatable environmental films.
      sessionStorage.setItem('piepe-understory', '1'); sessionStorage.setItem('piepe-breathing', '1')
      const state = { maxPlaying: 0 }; (window as unknown as { cinemaQA: typeof state }).cinemaQA = state
      setInterval(() => { state.maxPlaying = Math.max(state.maxPlaying, [...document.querySelectorAll('video')].filter(v => !v.paused && !v.ended).length) }, 30)
    })
    await page.goto(locale === 'lv' ? '/' : '/en/'); await page.evaluate(() => document.fonts.ready)
    const evidence: unknown[] = []
    for (const [name, id, exit] of [['understory', 'understory', 'encounter'], ['breathing', 'return', 'wallpapers']] as const) {
      await wheelTo(page, id, .3)
      for (const fraction of [.3, .85, 1.4]) {
        await wheelTo(page, id, fraction)
        console.log('Visible cinema probe', id, fraction)
        const result = await movingPicture(page, name); evidence.push({ name, fraction, ...result })
        expect(result.paused).toBe(false); expect(result.ready).toBeGreaterThanOrEqual(2); expect(result.opacity).toBeGreaterThan(.98)
        expect(result.rect.w).toBeGreaterThanOrEqual(result.viewport.w - 2); expect(result.rect.h).toBeGreaterThanOrEqual(result.viewport.h - 2)
        expect(result.frames.length).toBeGreaterThan(3); expect(distinctFrames(result.frames)).toBeGreaterThan(2)
        expect(result.frames.slice(1).reduce((elapsed, frame, i) => elapsed + Math.max(0, frame.time - result.frames[i].time), 0)).toBeGreaterThan(.3)
        const box = await page.locator(`#${id} .cinema-content`).boundingBox(); expect(Math.abs(box!.y)).toBeLessThan(2)
      }
      const layer = page.locator(`[data-clip="${name}"]`)
      await expect.poll(() => layer.getAttribute('data-clip-cycles').then(Number), { timeout: 9000 }).toBeGreaterThanOrEqual(1)
      await expect(layer).toHaveAttribute('data-loop-hold', 'false')
      const loop = await movingPicture(page, name); evidence.push({ name, loop: true, ...loop }); expect(loop.paused).toBe(false); expect(distinctFrames(loop.frames)).toBeGreaterThan(2)
      for (let visit = 1; visit <= 3; visit++) {
        await wheelTo(page, exit, .3); await expect(layer.locator('video')).toHaveCount(0)
        await wheelTo(page, id, .65)
        const result = await movingPicture(page, name); evidence.push({ name, visit, ...result }); expect(result.paused).toBe(false); expect(result.opacity).toBeGreaterThan(.98); expect(distinctFrames(result.frames)).toBeGreaterThan(2)
      }
    }
    await page.reload(); await expect(page.locator('video.forest-film')).toHaveCount(0)
    // A zero video count also holds in server HTML. Prove restored, hydrated playback
    // before navigating again, rather than racing a reload's native restoration.
    const reloaded = await movingPicture(page, 'breathing'); expect(reloaded.paused).toBe(false)
    await page.goto((locale === 'lv' ? '/' : '/en/') + '#understory')
    const restored = await movingPicture(page, 'understory'); expect(restored.paused).toBe(false)
    await testInfo.attach('visible-film-frames-and-revisits', { body: JSON.stringify(evidence), contentType: 'application/json' })
    expect(await page.evaluate(() => (window as unknown as { cinemaQA: { maxPlaying: number } }).cinemaQA.maxPlaying)).toBeLessThanOrEqual(1)
  })
  for (const locale of ['lv', 'en'] as const) test(`${locale}: the photograph settles once and preserves observation/return transitions`, async ({ page }, testInfo) => {
    test.setTimeout(50000)
    await page.addInitScript(() => sessionStorage.setItem('piepe-entered', '1'))
    await page.goto(locale === 'lv' ? '/' : '/en/'); const t = messages[locale]
    for (let visit = 0; visit < 2; visit++) {
      await page.getByRole('button', { name: t.closer, exact: true }).click()
      await expect(page.getByRole('heading', { name: t.observations[0].title.split('\n')[0], exact: false })).toBeVisible({ timeout: 12000 })
      const samples = await page.locator('.specimen-photo img').evaluate(async (img: HTMLImageElement) => {
        const result = [], start = performance.now()
        while (performance.now() - start < 1600) {
          const r = img.getBoundingClientRect(), css = getComputedStyle(img), pos = css.objectPosition.split(' ').map(parseFloat), scale = Math.max(r.width / img.naturalWidth, r.height / img.naturalHeight)
          result.push({ time: performance.now() - start, position: css.objectPosition, x: r.x + (r.width - img.naturalWidth * scale) * pos[0] / 100, y: r.y + (r.height - img.naturalHeight * scale) * pos[1] / 100, scale })
          await new Promise(requestAnimationFrame)
        }
        return result
      })
      await testInfo.attach(`stable-final-crop-${visit}`, { body: JSON.stringify(samples), contentType: 'application/json' })
      const first = samples[0]
      for (const sample of samples) { expect(Math.abs(sample.x - first.x)).toBeLessThan(.5); expect(Math.abs(sample.y - first.y)).toBeLessThan(.5); expect(sample.position).toBe(first.position) }
      await page.getByRole('tab', { name: new RegExp(t.observations[0].label) }).press('ArrowRight'); await expect(page.getByRole('tab', { name: new RegExp(t.observations[1].label) })).toHaveAttribute('aria-selected', 'true')
      await page.getByRole('tab', { name: new RegExp(t.observations[1].label) }).press('ArrowRight'); await expect(page.getByRole('tab', { name: new RegExp(t.observations[2].label) })).toHaveAttribute('aria-selected', 'true')
      // Return to the same observation before closing so both visits exercise the same camera endpoint.
      await page.getByRole('tab', { name: new RegExp(t.observations[2].label) }).press('Home')
      await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).not.toBeVisible(); await expect(page.getByRole('button', { name: t.closer, exact: true })).toBeFocused()
    }
  })
})
