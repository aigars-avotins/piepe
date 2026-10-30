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
      const samples: { phase?: string; progress: number; width: number; height: number }[] = []
      const audit = { delayed: false, samples }
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
            audit.delayed = true
          }
          return Reflect.set(target, key, value, target)
        },
      }) })
      const sample = () => {
        if (photo.closest('dialog')!.open) {
          const r = photo.getBoundingClientRect()
          samples.push({ phase: data.cameraPhase, progress: Number(data.cameraProgress || 0), width: r.width, height: r.height })
        }
        if (!audit.delayed || photo.closest('dialog')!.classList.contains('photo-moving')) requestAnimationFrame(sample)
      }
      requestAnimationFrame(sample)
    })
    await page.getByRole('button', { name: 'Look closer at the fungus', exact: true }).click()
    await expect(page.getByRole('heading', { name: /A small shelf/ })).toBeVisible()
    const audit = await page.evaluate(() => (window as unknown as { photoClockAudit: { delayed: boolean; samples: { phase?: string; progress: number; width: number; height: number }[] } }).photoClockAudit)
    expect(audit.delayed).toBe(true)
    const moving = audit.samples.filter(s => s.phase === 'moving' && s.progress > 0)
    await info.attach('delayed-preparation-first-motion', { body: JSON.stringify(audit), contentType: 'application/json' })
    expect(moving.length).toBeGreaterThan(10)
    // A preparation delay must not skip directly to the middle of the shot.
    expect(width >= 700 ? moving[0].width / width : moving[0].height / height).toBeGreaterThan(.94)
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 2000 })
    await expect(page.getByRole('button', { name: 'Look closer at the fungus', exact: true })).toBeFocused()
  })
})
