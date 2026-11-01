import { test, expect } from '@playwright/test'
import { nativeDiagnostics } from './nativeDiagnostics'
nativeDiagnostics()

for (const [width, height] of [[1512, 982], [390, 664]]) test.describe(`photo clock ${width}x${height}`, () => {
  test.use({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: width < 700, hasTouch: width < 700, ...(width >= 700 ? { userAgent: undefined, screen: { width, height } } : {}) })
  test('late preparation preserves the beginning of the camera trajectory', async ({ page }, info) => {
    test.setTimeout(30000)
    await page.addInitScript(() => {
      sessionStorage.setItem('piepe-entered', '1')
      sessionStorage.setItem('piepe-awakening', '1')
    })
    await page.goto('/en/')
    await expect(page.locator('.world')).not.toHaveClass(/prerendered/)
    await page.evaluate(() => document.fonts.ready)
    await page.locator('.specimen-photo').evaluate((photo: HTMLElement) => {
      const samples: { at: number; phase?: string; progress: number; width: number; height: number }[] = []
      const audit = { delayed: false, startedAt: 0, samples }
      ;(window as unknown as { photoClockAudit: typeof audit }).photoClockAudit = audit
      const data = photo.dataset
      // Model a congested native preparation callback before the motion starts.
      // Forward every dataset operation unchanged except this one CPU delay.
      Object.defineProperty(photo, 'dataset', { configurable: true, value: new Proxy(data, {
        get: (target, key) => Reflect.get(target, key, target),
        set: (target, key, value) => {
          if (key === 'cameraPhase' && value === 'moving' && !audit.delayed) {
            const start = performance.now()
            while (performance.now() - start < 250) { /* deterministic preparation work */ }
            audit.delayed = true; audit.startedAt = performance.now()
          }
          return Reflect.set(target, key, value, target)
        },
      }) })
      const sample = () => {
        if (photo.closest('dialog')!.open) {
          const r = photo.getBoundingClientRect()
          samples.push({ at: performance.now(), phase: data.cameraPhase, progress: Number(data.cameraProgress || 0), width: r.width, height: r.height })
        }
        if (!audit.delayed || photo.closest('dialog')!.classList.contains('photo-moving')) requestAnimationFrame(sample)
      }
      requestAnimationFrame(sample)
    })
    await page.getByRole('button', { name: 'Look closer at the fungus', exact: true }).click()
    await expect(page.getByRole('heading', { name: /A small shelf/ })).toBeVisible()
    const audit = await page.evaluate(() => (window as unknown as { photoClockAudit: { delayed: boolean; startedAt: number; samples: { at: number; phase?: string; progress: number; width: number; height: number }[] } }).photoClockAudit)
    expect(audit.delayed).toBe(true)
    const moving = audit.samples.filter(s => s.phase === 'moving' && s.progress > 0)
    const target = (await page.locator('.specimen-photo').boundingBox())!
    await info.attach('delayed-preparation-first-motion', { body: JSON.stringify({ ...audit, target }), contentType: 'application/json' })
    expect(moving.length).toBeGreaterThan(10)
    // The first positive rAF observation may be several frames into the shot in
    // native WebKit. Keep the full-aperture bound on the actual zero-progress
    // paint, then register every moving rectangle against elapsed time. This
    // still rejects preparation time leaking into the one-second power2.out shot.
    const start = audit.samples.find(s => s.progress === 0)!
    expect(width >= 700 ? start.width / width : start.height / height).toBeGreaterThan(.94)
    const from = width >= 700 ? width : height, to = width >= 700 ? target.width : target.height
    for (const sample of moving) {
      const progress = (from - (width >= 700 ? sample.width : sample.height)) / (from - to)
      const trajectoryMs = 1000 * (1 - Math.cbrt(Math.max(0, 1 - progress)))
      // One 60Hz frame accounts for clock quantization, not preparation delay.
      expect(trajectoryMs - (sample.at - audit.startedAt)).toBeLessThan(1000 / 60)
    }
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 2000 })
    await expect(page.getByRole('button', { name: 'Look closer at the fungus', exact: true })).toBeFocused()
  })
})
