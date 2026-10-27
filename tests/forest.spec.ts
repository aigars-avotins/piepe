import { test, expect } from '@playwright/test'

test('actual film plays once, reveals title, ends and becomes interactive', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Skip intro' })).toBeVisible()
  const film = page.locator('video')
  await expect.poll(() => film.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(0.1)
  const metadata = await film.evaluate((v: HTMLVideoElement) => ({ duration: v.duration, width: v.videoWidth, height: v.videoHeight, muted: v.muted, inline: v.playsInline, loop: v.loop }))
  expect(metadata.duration).toBeGreaterThan(5.8)
  expect(metadata.duration).toBeLessThan(6.3)
  expect(metadata).toMatchObject({ width: 1920, height: 1080, muted: true, inline: true, loop: false })
  await expect(page.locator('.world')).toHaveAttribute('data-exit-reason', 'ended', { timeout: 11000 })
  await expect(film).toHaveCount(0)
  await page.getByRole('button', { name: 'Discover the shelf fungus' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Something is growing here.' })).toBeVisible()
  await page.getByRole('button', { name: 'Close discovery' }).click()
  await page.locator('#field-notes').scrollIntoViewIfNeeded()
  await page.getByText('Made of curiosity', { exact: true }).click()
  await expect(page.getByText('A little code. A different perspective.', { exact: false })).toBeVisible()
  await page.getByRole('button', { name: 'Return to forest' }).click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5)
  await expect(film).toHaveCount(0)
  await expect(page.locator('.world')).toHaveAttribute('data-exit-reason', 'ended')
  expect(errors).toEqual([])
})

test('skip is immediate and fungus works with keyboard and Escape', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Skip intro' }).click()
  const fungus = page.getByRole('button', { name: 'Discover the shelf fungus' })
  await expect(fungus).toBeEnabled()
  await expect(fungus).toBeFocused()
  await fungus.press('Enter')
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Close discovery' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(fungus).toBeFocused()
  await page.reload()
  await expect(page.locator('video')).toHaveCount(0)
})

test('reduced motion avoids downloading film, remains readable and has no overflow', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const films: string[] = []
  page.on('request', request => { if (request.url().endsWith('.mp4')) films.push(request.url()) })
  await page.goto('/')
  await expect(page.locator('video')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'pie.pe', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Discover the shelf fungus' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('button', { name: 'Close discovery' }).click()
  for (const id of ['forest', 'understory', 'field-notes']) {
    await page.locator('#' + id).scrollIntoViewIfNeeded()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
  await expect(page.getByRole('heading', { name: 'Room to grow.' })).toBeVisible()
  expect(films).toEqual([])
})

test('blocked autoplay falls back immediately to the interactive still', async ({ page }) => {
  await page.addInitScript(() => { HTMLMediaElement.prototype.play = () => Promise.reject(new DOMException('Blocked', 'NotAllowedError')) })
  await page.goto('/')
  await expect(page.locator('.world')).toHaveAttribute('data-exit-reason', 'autoplay-blocked')
  await expect(page.getByRole('button', { name: 'Discover the shelf fungus' })).toBeEnabled()
})

test('missing video recovers without trapping the visitor', async ({ page }) => {
  await page.route('**/media/forest-reveal.mp4', route => route.abort())
  await page.goto('/')
  await expect(page.locator('.world')).toHaveAttribute('data-intro-state', 'complete', { timeout: 6000 })
  await page.getByRole('button', { name: 'There is more here' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
})

test('pending playback and a mid-film stall both have bounded recovery', async ({ page }) => {
  await page.route('**/media/forest-reveal.mp4', () => {})
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.world')).toHaveAttribute('data-exit-reason', 'load-timeout', { timeout: 6000 })
  await expect(page.getByRole('button', { name: 'Discover the shelf fungus' })).toBeEnabled()
})

test('an actual decoding stall recovers to the still', async ({ page }) => {
  await page.goto('/')
  await expect.poll(() => page.locator('video').evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(0.25)
  await page.locator('video').evaluate((v: HTMLVideoElement) => v.pause())
  await expect(page.locator('.world')).toHaveAttribute('data-exit-reason', 'stalled', { timeout: 5000 })
})

test('missing still retains accessible text and controls', async ({ page }) => {
  await page.route('**/media/forest-final.jpg', route => route.abort())
  await page.goto('/')
  await expect(page.locator('.world')).toHaveAttribute('data-exit-reason', 'image-error')
  await expect(page.getByRole('heading', { name: 'pie.pe', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'There is more here' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
})

test('data saving preference avoids video request', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'connection', { value: { saveData: true }, configurable: true }))
  await page.goto('/')
  await expect(page.locator('video')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Discover the shelf fungus' })).toBeEnabled()
})

test('cover geometry keeps hotspot aligned to the actual fungus across viewport changes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  for (const size of [{ width: 390, height: 844 }, { width: 320, height: 690 }, { width: 844, height: 390 }, { width: 1440, height: 1000 }]) {
    await page.setViewportSize(size)
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await expect.poll(async () => page.locator('.media-plane').evaluate(e => e.getBoundingClientRect().width >= innerWidth)).toBe(true)
    const geometry = await page.evaluate(() => {
      const image = document.querySelector('.media-plane')!.getBoundingClientRect()
      const hit = document.querySelector('.fungus-hotspot')!.getBoundingClientRect()
      return { dx: Math.abs(hit.x + hit.width / 2 - (image.x + image.width * .665)), dy: Math.abs(hit.y + hit.height / 2 - (image.y + image.height * .57)), hitX: hit.x + hit.width / 2, hitY: hit.y + hit.height / 2, overflow: document.documentElement.scrollWidth > innerWidth }
    })
    expect(geometry.dx).toBeLessThan(1)
    expect(geometry.dy).toBeLessThan(1)
    expect(geometry.hitX).toBeGreaterThan(0)
    expect(geometry.hitX).toBeLessThan(size.width)
    expect(geometry.hitY).toBeLessThan(size.height)
    expect(geometry.overflow).toBe(false)
  }
})
