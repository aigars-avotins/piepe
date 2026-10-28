import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'
import { messages } from '../src/i18n'

async function wheelTo(page: Page, id: string, fraction: number) {
  const destination = await page.locator('#' + id).evaluate((e, f) => Math.min(document.documentElement.scrollHeight - innerHeight, e.getBoundingClientRect().top + scrollY + innerHeight * f), fraction)
  const h = page.viewportSize()!.height
  for (let i = 0; i < 120; i++) {
    const delta = destination - await page.evaluate(() => scrollY)
    if (Math.abs(delta) < 35) return
    await page.mouse.wheel(0, Math.max(-h * .4, Math.min(h * .4, delta)))
    await page.waitForTimeout(100)
  }
  throw Error('Native wheel input did not reach the scene')
}

async function movingPicture(page: Page, name: 'understory' | 'breathing') {
  const layer = page.locator(`[data-clip="${name}"]`)
  await expect(layer).toHaveAttribute('data-clip-ready', 'true', { timeout: 10000 })
  return layer.locator('video').evaluate(async (video: HTMLVideoElement) => {
    let opacity = 1
    for (let e: Element | null = video; e; e = e.parentElement) opacity *= Number(getComputedStyle(e).opacity)
    const r = video.getBoundingClientRect(), scale = Math.max(r.width / video.videoWidth, r.height / video.videoHeight)
    const position = getComputedStyle(video).objectPosition.split(' ').map(parseFloat)
    const sw = r.width / scale, sh = r.height / scale, sx = (video.videoWidth - sw) * position[0] / 100, sy = (video.videoHeight - sh) * position[1] / 100
    const canvas = document.createElement('canvas'); canvas.width = 64; canvas.height = 36
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!
    const frames: { time: number; hash: number; presented: number }[] = []
    const started = performance.now()
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(Error('No advancing presented video frames: '+JSON.stringify({src:video.currentSrc,time:video.currentTime,paused:video.paused,ended:video.ended,ready:video.readyState,connected:video.isConnected,reason:video.parentElement?.dataset.clipReason,cycles:video.parentElement?.dataset.clipCycles,totalFrames:video.getVideoPlaybackQuality().totalVideoFrames,sampled:frames.length}))), 2500)
      const frame: VideoFrameRequestCallback = (_, metadata) => {
        ctx.drawImage(video, sx, sy, sw, sh, 0, 0, 64, 36)
        const pixels = ctx.getImageData(0, 0, 64, 36).data; let hash = 2166136261
        for (let i = 0; i < pixels.length; i += 4) hash = Math.imul(hash ^ pixels[i], 16777619)
        frames.push({ time: metadata.mediaTime, hash: hash >>> 0, presented: metadata.presentedFrames })
        if (performance.now() - started < 750) video.requestVideoFrameCallback(frame)
        else { clearTimeout(timeout); resolve() }
      }
      video.requestVideoFrameCallback(frame)
    })
    return { frames, duration: video.duration, opacity, ready: video.readyState, paused: video.paused, rect: { x: r.x, y: r.y, w: r.width, h: r.height }, viewport: { w: innerWidth, h: innerHeight }, held: video.parentElement!.dataset.loopHold }
  })
}

for (const [width, height] of [[1512, 982], [390, 664]]) test.describe(`${width}x${height} repeatable cinema`, () => {
  test.use({ viewport: { width, height }, deviceScaleFactor: width > 700 ? 2 : 3, isMobile: width < 700, hasTouch: width < 700 })
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
        expect(result.frames.length).toBeGreaterThan(3); expect(new Set(result.frames.map(f => f.hash)).size).toBeGreaterThan(2)
        expect(result.frames.slice(1).reduce((elapsed, frame, i) => elapsed + Math.max(0, frame.time - result.frames[i].time), 0)).toBeGreaterThan(.3)
        const box = await page.locator(`#${id} .cinema-content`).boundingBox(); expect(Math.abs(box!.y)).toBeLessThan(2)
      }
      const layer = page.locator(`[data-clip="${name}"]`)
      await expect.poll(() => layer.getAttribute('data-clip-cycles').then(Number), { timeout: 9000 }).toBeGreaterThanOrEqual(1)
      await expect(layer).toHaveAttribute('data-loop-hold', 'false')
      const loop = await movingPicture(page, name); evidence.push({ name, loop: true, ...loop }); expect(loop.paused).toBe(false); expect(new Set(loop.frames.map(f => f.hash)).size).toBeGreaterThan(2)
      for (let visit = 1; visit <= 3; visit++) {
        await wheelTo(page, exit, .3); await expect(layer.locator('video')).toHaveCount(0)
        await wheelTo(page, id, .65)
        const result = await movingPicture(page, name); evidence.push({ name, visit, ...result }); expect(result.paused).toBe(false); expect(result.opacity).toBeGreaterThan(.98); expect(new Set(result.frames.map(f => f.hash)).size).toBeGreaterThan(2)
      }
    }
    await page.reload(); await expect(page.locator('video.forest-film')).toHaveCount(0)
    await page.goto((locale === 'lv' ? '/' : '/en/') + '#understory')
    const restored = await movingPicture(page, 'understory'); expect(restored.paused).toBe(false)
    await testInfo.attach('visible-film-frames-and-revisits', { body: JSON.stringify(evidence), contentType: 'application/json' })
    expect(await page.evaluate(() => (window as unknown as { cinemaQA: { maxPlaying: number } }).cinemaQA.maxPlaying)).toBeLessThanOrEqual(1)
  })
  for (const locale of ['lv', 'en'] as const) test(`${locale}: the photograph settles once and preserves observation/return transitions`, async ({ page }, testInfo) => {
    test.setTimeout(35000)
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
