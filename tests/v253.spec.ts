import { test, expect } from '@playwright/test'
import { messages } from '../src/i18n'
import { nativeDiagnostics } from './nativeDiagnostics'
nativeDiagnostics()

for (const locale of ['lv', 'en'] as const) {
  for (const mode of ['first', 'return', 'reduced', 'save-data'] as const) test(`${locale}: early image priority follows the ${mode} visitor's painted pose`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference' })
    await page.addInitScript(mode => {
      if (mode === 'return') sessionStorage.setItem('piepe-entered', '1')
      if (mode === 'save-data') Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true } })
    }, mode)
    // Inspect the actual server paint before hydration, without delaying any images.
    let hydrate!: () => void
    const gate = new Promise<void>(resolve => { hydrate = resolve })
    page.once('close', () => hydrate())
    await page.route('**/assets/*.js', async route => { await gate; if (!page.isClosed()) await route.continue() })
    await page.goto(locale === 'lv' ? '/' : '/en/', { waitUntil: 'commit' })
    const pose = mode === 'first' ? 'poster' : 'final'
    const priority = page.locator('head link[rel=preload][as=image][fetchpriority=high]')
    await expect(priority).toHaveCount(1)
    await expect(priority).toHaveAttribute('href', `/media/forest-${pose}.jpg?v=2.3`)
    await expect(page.locator('.environment')).toHaveCSS('position', 'fixed')
    const source = await page.locator('.forest-still').evaluate(e => {
      const image = e as HTMLImageElement, css = getComputedStyle(e).content
      return css.startsWith('url(') ? css : image.currentSrc || image.src
    })
    expect(source).toContain(`forest-${pose}.jpg`)
    hydrate()
    await expect(page.locator('.world')).not.toHaveClass(/prerendered/)
    if (mode !== 'first') await expect(page.locator('video')).toHaveCount(0)
  })

  test(`${locale}: keyboard journey has a visible fungus marker, native modal focus and accessible scene controls`, async ({ page }, info) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(locale === 'lv' ? '/' : '/en/')
    const t = messages[locale]
    await page.keyboard.press('Tab')
    await expect(page.locator('.skip-content')).toBeFocused()
    // Reach the irregular hit target through normal keyboard order.
    let steps = 0
    while (!await page.locator('.fungus-hit').evaluate(e => e === document.activeElement) && steps++ < 18) await page.keyboard.press('Tab')
    await expect(page.locator('.fungus-hit')).toBeFocused()
    const marker = page.locator('.fungus-annotation .annotation-cross')
    expect(await page.locator('.fungus-hit').evaluate(e => e.matches(':focus-visible'))).toBe(true)
    await expect(marker).toHaveCSS('outline-style', 'solid')
    expect(await marker.evaluate(e => parseFloat(getComputedStyle(e).outlineWidth))).toBeGreaterThanOrEqual(2)
    await info.attach('keyboard-fungus-focus', { body: await page.screenshot({ scale: 'css' }), contentType: 'image/png' })
    await page.keyboard.press('Enter')
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(page.getByRole('button', { name: t.closeDiscovery })).toBeFocused()
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab')
      // Native dialog traversal may enter browser chrome at the end of the tab order.
      // It must never focus an interactive element in the inert background.
      const focus = await dialog.evaluate(e => ({ within: e.contains(document.activeElement), chrome: document.activeElement === document.body && !document.hasFocus() }))
      expect(focus.within || focus.chrome).toBe(true)
    }
    const first = page.getByRole('tab', { name: new RegExp(t.observations[0].label) })
    await first.focus(); await page.keyboard.press('End')
    await expect(page.getByRole('tab', { name: new RegExp(t.observations[2].label) })).toBeFocused()
    const download = page.waitForEvent('download')
    await page.getByRole('link', { name: t.keepNote, exact: false }).press('Enter')
    expect((await download).suggestedFilename()).toBe(`piepe-field-note-001-${locale}.txt`)
    await page.keyboard.press('Escape'); await expect(dialog).not.toBeVisible()
    await expect(page.locator('.fungus-hit')).toBeFocused()
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await expect(page.locator('.world')).not.toHaveClass(/static-preference/)
    for (const selector of ['.site-header a[lang=en]', '.sound-control', '#understory .cinema-pause', '#return .cinema-pause', '#return .line-link', '.wallpaper-choices a[download]']) {
      const control = page.locator(selector).first()
      await control.focus()
      await expect(control).toBeFocused()
      expect(await control.evaluate(e => e.matches(':focus-visible'))).toBe(true)
      await expect(control).toHaveCSS('outline-style', 'solid')
    }
  })
}

for (const [clip, anchor] of [['understory', 'understory'], ['breathing', 'return']] as const) test(`${clip}: decoded frame can reach a compositor that withholds transparent video callbacks`, async ({ page }, info) => {
  await page.addInitScript(() => {
    sessionStorage.setItem('piepe-entered', '1')
    const request = HTMLVideoElement.prototype.requestVideoFrameCallback
    HTMLVideoElement.prototype.requestVideoFrameCallback = function (callback) {
      return request.call(this, (now, metadata) => {
        const present = () => {
          if (!this.isConnected) return
          const opacity = (element: Element | null): number => element ? Number(getComputedStyle(element).opacity) * opacity(element.parentElement) : 1
          if (opacity(this) < .99) { requestAnimationFrame(present); return }
          const witnesses = (window as unknown as { stagedFilms?: unknown[] })
          witnesses.stagedFilms ||= []
          witnesses.stagedFilms.push({ source: this.currentSrc, time: metadata.mediaTime, ready: this.readyState, opacity: getComputedStyle(this).opacity })
          callback(now, metadata)
        }
        present()
      })
    }
  })
  // An unavailable poster must not keep a decoded film's ancestor transparent.
  let release!: () => void
  const poster = new Promise<void>(resolve => { release = resolve })
  page.once('close', () => release())
  await page.route(`**/media/forest-${clip}${clip === 'understory' ? '' : '-poster'}.jpg*`, async route => { await poster; if (!page.isClosed()) await route.continue().catch(error => { if (!String(error).includes('Route is already handled')) throw error }) })
  await page.goto('/en/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.world')).not.toHaveClass(/prerendered/)
  await page.locator('#' + anchor).evaluate(e => e.scrollIntoView({ block: 'start', behavior: 'instant' }))
  const layer = page.locator(`[data-clip=${clip}]`)
  await expect(layer).toHaveAttribute('data-clip-ready', 'true')
  const moving = await layer.locator('video').evaluate((video: HTMLVideoElement) => new Promise<{ time: number; pixel: number }[]>(resolve => {
    const samples: { time: number; pixel: number }[] = [], canvas = document.createElement('canvas')
    canvas.width = 32; canvas.height = 18
    const context = canvas.getContext('2d')!
    const frame: VideoFrameRequestCallback = (_, metadata) => {
      context.drawImage(video, 0, 0, 32, 18)
      const pixels = context.getImageData(0, 0, 32, 18).data
      let hash = 2166136261
      for (let i = 0; i < pixels.length; i += 4) hash = Math.imul(hash ^ pixels[i], 16777619)
      samples.push({ time: metadata.mediaTime, pixel: hash >>> 0 })
      if (samples.length === 3) resolve(samples)
      else setTimeout(() => video.requestVideoFrameCallback(frame), 250)
    }
    video.requestVideoFrameCallback(frame)
  }))
  expect(new Set(moving.map(s => s.pixel)).size).toBe(3)
  expect(moving[2].time).toBeGreaterThan(moving[0].time)
  expect(await layer.getAttribute('data-still-ready')).toBe('false')
  release(); await page.unrouteAll({ behavior: 'wait' })
  await info.attach('staged-and-presented-film', { body: JSON.stringify({ moving, witnesses: await page.evaluate(() => (window as unknown as { stagedFilms: unknown[] }).stagedFilms) }), contentType: 'application/json' })
})
